const debug = require('debug')('publishers/s3/push-file')
const fs = require('fs')
const path = require('path')
const AWS = require('ibm-cos-sdk')
const needle = require('needle')

const secrets = process.env.COS_SECRETS
  ? JSON.parse(Buffer.from(process.env.COS_SECRETS, 'base64').toString())
  : require('./secrets-cos.json')

const version = process.argv[2]

const Bucket = process.env.S3_BUCKET || `kui-${version}`

const files = process.argv.slice(3)

/**
 * Upload one binary to the given bucket
 *
 */
const putObject = (cos, Bucket) => filepath =>
  new Promise((resolve, reject) => {
    debug('putObject', Bucket, filepath)

    const filename = path.basename(filepath)
    const Key = filename

    const ContentType = filename.endsWith('.html')
      ? 'text/html; charset=UTF-8'
      : filename.endsWith('.css')
      ? 'text/css'
      : filename.endsWith('.ico')
      ? 'image/vnd.microsoft.icon'
      : filename.endsWith('.png')
      ? 'image/png'
      : filename.endsWith('.jpg')
      ? 'image/jpeg'
      : filename.endsWith('.svg')
      ? 'image/svg+xml'
      : filename.endsWith('.js') || filename.endsWith('.js.gz') || filename.endsWith('.js.br')
      ? 'application/javascript'
      : 'text/plain'

    debug('ContentType', ContentType)

    fs.readFile(filepath, (err, Body) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.error(`WARNING: Not uploading ${Key}, as the file was not found`)
          resolve(Key)
        } else {
          reject(err)
        }
      } else {
        cos
          .putObject({
            Bucket,
            Key,
            ACL: 'public-read',
            ContentType,
            Body
          })
          .promise()
          .then(() => resolve(Key))
          .catch(reject)
      }
    })
  })

debug('requesting endpoints', secrets.endpoints)

needle('get', secrets.endpoints, { json: true })
  .then(endpoints => endpoints.body)
  .then(endpoints => ({
    endpoint: endpoints['service-endpoints']['cross-region'].us.public['us-geo'],

    ibmAuthEndpoint: `https://${endpoints['identity-endpoints']['iam-token']}/oidc/token`,
    apiKeyId: secrets.apikey,
    serviceInstanceId: secrets.resource_instance_id

    // accessKeyId: secrets.cos_hmac_keys.access_key_id,
    // secretAccessKey: secrets.cos_hmac_keys.secret_access_key
  }))

  .then(config => {
    if (!config.endpoint.startsWith('https://')) {
      config.endpoint = `https://${config.endpoint}`
    }
    debug('endpoint', config.endpoint)
    return config
  })

  .then(config => {
    const cos = new AWS.S3(config)
    debug('cos initialized')
    debug('creating bucket', Bucket)

    return cos
      .createBucket({
        Bucket,
        CreateBucketConfiguration: {
          LocationConstraint: 'us-standard'
        }
      })
      .promise()
      .catch(err => {
        if (err.code === 'BucketAlreadyExists' && process.env.EXIST_OK) {
          // when debugging, it is helpful to set EXIST_OK,
          // to reuse an existing bucket; for production
          // use, do not use this code path!
          // make sure it's public
          // debug('bucket already exists')
          // return makePublic(cos, Bucket)
        } else {
          debug('error making bucket', err)
          throw err
        }
      })
      .then(() => Promise.all(files.map(putObject(cos, Bucket))))
  })

  .then(() => {
    console.log('ok')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
