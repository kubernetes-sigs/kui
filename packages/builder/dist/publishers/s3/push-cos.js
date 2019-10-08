const debug = require('debug')('publishers/s3/push-cos')
const fs = require('fs')
const path = require('path')
const AWS = require('ibm-cos-sdk')
const needle = require('needle')

const secrets = process.env.COS_SECRETS
  ? JSON.parse(Buffer.from(process.env.COS_SECRETS, 'base64').toString())
  : require('./secrets-cos.json')

const {
  theme: { productName }
} = require('../../../../../node_modules/@kui-shell/settings/config.json')

const kuiBaseName = 'Kui-base'

const version = process.argv[2]

const Bucket = process.env.S3_BUCKET || `kui-${version}`

const buildHome = process.env.BUILDDIR || path.join(__dirname, '../../builds')

const platformBuilds = [
  `${productName}-linux-x64.deb`,
  `${productName}-linux-x64.zip`,
  `${productName}-win32-x64.zip`,
  `${productName}.dmg`,
  `${productName}-darwin-x64.tar.bz2`,
  `${kuiBaseName}-linux-x64.deb`,
  `${kuiBaseName}-linux-x64.zip`,
  `${kuiBaseName}-win32-x64.zip`,
  `${kuiBaseName}.dmg`,
  `${kuiBaseName}-darwin-x64.tar.bz2`,
  `${productName}-headless.zip`,
  `${productName}-headless.tar.bz2`
]

/**
 * Set the acl for the given bucket to public-read
 *
 */
/* const makePublic = (cos, Bucket) => new Promise((resolve, reject) => {
  debug('make bucket public', Bucket)

  cos.getBucketAcl({ Bucket }, (err, data) => {
    if (err) {
      debug('error fetching acl')
      reject(err)
    } else {
      debug('got acl', data)

      cos.putBucketAcl({ Bucket, ACL: 'public-read' }, (err, data) => {
        if (err) {
          debug('error making public')
          reject(err)
        } else {
          debug('successfully made public')
          resolve()
        }
      })
    }
  })
}) */

/**
 * Upload one binary to the given bucket
 *
 */
const putObject = (cos, Bucket) => Key =>
  new Promise((resolve, reject) => {
    debug('putObject', Bucket, Key)

    const filepath = path.join(buildHome, Key)

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

    return (
      cos
        .createBucket({
          Bucket,
          CreateBucketConfiguration: {
            LocationConstraint: 'us-standard'
          }
        })
        .promise()
        // .then(() => makePublic(cos, Bucket)) // new bucket created. set ACL
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
        .then(() => Promise.all(platformBuilds.map(putObject(cos, Bucket))))

        .then(([linuxDeb, linux, win32, darwin, darwinTGZ, headless, headlessTGZ]) => {
          debug('uploads done')

          if (!process.env.NO_CONFIG_UPDATE) {
            const base = `${config.endpoint}/${Bucket}`
            const configPath = path.join(__dirname, '../prebuilt/config.json')

            debug('reading prebuilt config file', configPath)
            const prebuiltConfig = require(configPath)

            // we might not have built this particular file
            const maybe = file => (file ? `${base}/${encodeURIComponent(linuxDeb)}` : 'not uploaded')

            debug('updating prebuilt config file')
            prebuiltConfig.latest = version
            prebuiltConfig.files[version] = {
              linuxDeb: maybe(linuxDeb),
              linux: maybe(linux),
              win32: maybe(win32),
              darwin: maybe(darwin),
              darwinTGZ: maybe(darwinTGZ),
              headless: maybe(headless),
              headlessTGZ: maybe(headlessTGZ)
            }

            debug('writing prebuilt config file')
            fs.writeFileSync(configPath, JSON.stringify(prebuiltConfig, undefined, 4))
          }
        })
    )
  })

  .then(() => {
    console.log('ok')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
