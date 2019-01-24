#!/usr/bin/env node

const debug = require('debug')('packagers/webpack/publish')

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const AWS = require('ibm-cos-sdk')
const needle = require('needle')
const secrets = process.env.COS_SECRETS ? JSON.parse(process.env.COS_SECRETS) : require('../publishers/s3/secrets-cos.json')

const colors = require('colors/safe')

const version = process.argv[2] || 'dev'
const Bucket = `kui-web-${version}`

/** promise version of glob */
const globp = (dir, patternSuffix, dirWildcard = false) => new Promise((resolve, reject) => {
  const pattern = `${dir}${dirWildcard ? '*/' : ''}${patternSuffix}`

  glob(pattern, (err, files) => {
    if (err) {
      reject(err)
    } else {
      resolve(files.map(filepath => ({
        filepath,
        targetName: filepath.replace(new RegExp(`^${dir}${dirWildcard ? '[^/]+/' : ''}`), '')
      })))
    }
  })
})

/** flatten array of arrays */
const flatten = arrays => [].concat.apply([], arrays)

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
 * Clean the given bucket
 *
 */
const cleanBucket = async (cos, Bucket) => {
  try {
    debug('listing objects in bucket', Bucket)
    const list = await cos.listObjects({ Bucket }).promise()

    debug('deleting objects in bucket', list.Contents)
    await Promise.all(list.Contents.map(({ Key }) => cos.deleteObject({ Bucket, Key }).promise()))

    // debug('deleting bucket', Bucket)
    // await cos.deleteBucket({ Bucket }).promise()
  } catch (err) {
    if (err.statusCode === 404) {
      debug('bucket does not exist, and that is ok', Bucket)
    } else {
      throw err
    }
  }
}

/**
 * Set the necessary CORS attributes for the given bucket
 *
 */
const putBucketCors = async (cos, Bucket) => {
  await cos.putBucketCors({
    Bucket,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: [ '*' ],
          AllowedMethods: [ 'GET', 'DELETE', 'POST', 'PUT', 'HEAD' ],
          AllowedOrigins: [ '*' ]
        }
      ]
    }
  }).promise()

  debug('put CORS succeeded, now fetching CORS to validate')

  const cors = await cos.getBucketCors({ Bucket }).promise()
  debug('bucket CORS', JSON.stringify(cors, undefined, 4))
}

/**
 * Upload one binary to the given bucket
 *
 */
const putObject = (cos, Bucket) => ({ filepath, targetName }) => new Promise((resolve, reject) => {
  const filename = path.basename(filepath)

  const ContentType = filename.endsWith('.html') ? 'text/html; charset=UTF-8'
    : filename.endsWith('.css') ? 'text/css'
      : filename.endsWith('.ico') ? 'image/vnd.microsoft.icon'
        : filename.endsWith('.png') ? 'image/png'
          : filename.endsWith('.jpg') ? 'image/jpeg'
            : filename.endsWith('.svg') ? 'image/svg+xml'
              : filename.endsWith('.js') || filename.endsWith('.js.gz') || filename.endsWith('.js.br') ? 'application/javascript'
                : 'text/plain'

  const Key = (targetName || filename).replace(/\.(gz|br)$/, '')

  // debug('putObject filepath', filepath)
  // debug('putObject filename', filename)
  // debug('putObject targetName', targetName)

  fs.readFile(filepath, (err, Body) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error(`WARNING: Not uploading ${Key}, as the file was not found`)
        resolve(Key)
      } else {
        reject(err)
      }
    } else {
      const object = {
        Bucket,
        Key,
        ACL: 'public-read',
        ContentType,
        Body
      }

      if (filename.endsWith('.gz')) {
        object.ContentEncoding = 'gzip'
      } else if (filename.endsWith('.br')) {
        object.ContentEncoding = 'br'
      }

      debug('putObject', Bucket, Key, ContentType, object.ContentEncoding || 'plain')

      cos.putObject(object).promise()
        .then(() => resolve(Key))
        .catch(reject)
    }
  })
})

/**
 * Create our bucket
 *
 */
const createBucket = async (cos, Bucket) => {
  try {
    await cos.createBucket({
      Bucket,
      CreateBucketConfiguration: {
        LocationConstraint: 'us-standard'
      }
    }).promise()
  } catch (err) {
    if (err.code === 'BucketAlreadyExists' && process.env.EXIST_OK) {
      // debug('createBucket: bucket already exists', err)

      // make sure it's public
      // return makePublic(cos, Bucket)
    } else {
      debug('createBucket: error', err)
      throw err
    }
  }
}

//
// main: assemble the assets, then upload them
//
debug('assembling assets')
const main = async () => {
  try {
    debug('requesting endpoints', secrets.endpoints)
    const endpoints = (await needle('get', secrets.endpoints, { json: true })).body

    const config = {
      endpoint: endpoints['service-endpoints']['cross-region'].us.public['us-geo'],

      ibmAuthEndpoint: `https://${endpoints['identity-endpoints']['iam-token']}/oidc/token`,
      apiKeyId: secrets.apikey,
      serviceInstanceId: secrets.resource_instance_id

      // accessKeyId: secrets.cos_hmac_keys.access_key_id,
      // secretAccessKey: secrets.cos_hmac_keys.secret_access_key
    }

    if (!config.endpoint.startsWith('https://')) {
      config.endpoint = `https://${config.endpoint}`
    }
    debug('endpoint', config.endpoint)

    const cos = new AWS.S3(config)
    debug('cos initialized')

    debug('cleanBucket', Bucket)
    await cleanBucket(cos, Bucket)

    debug('createBucket', Bucket)
    await createBucket(cos, Bucket)

    debug('setting up bucket CORS', Bucket)
    await putBucketCors(cos, Bucket)

    debug('assembling assets')
    const assets = await Promise.all([
      // globp('../../../app/plugins/modules/', 'web/css/**/*.css', true),
      globp('../../../app/content/css/', '**/*.css'),
      globp('../../../app/content/', '**/*.ico'),
      globp('../../../app/content/', '**/*.jpg'),
      globp('../../../app/content/', '**/*.png'),
      globp('../../../app/content/', '**/*.svg'),
      globp('./build/', '*.bundle.js.br')
    ]).then(flatten)

    debug('uploading assets', assets)
    await Promise.all(assets.map(putObject(cos, Bucket)))

    // NOTE: we upload this after the assets have been uploaded, so that there is
    // a semblance of atomicity in the web site update; i.e. update the assets first,
    // then update the index.html after those assets are in place
    debug('uploading index')
    const index = await putObject(cos, Bucket)({
      filepath: '../../../app/build/index-webpack.html',
      targetName: 'index.html'
    })

    debug('uploads done')
    const base = `${config.endpoint}/${Bucket}`
    console.log(colors.bold('Endpoint: ' + `${base}/${encodeURIComponent(index)}`))

    console.log('ok')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
