process.env.DEBUG = '*'
const debug = require('debug')('swapIntoPlace')

const AWS = require('ibm-cos-sdk')
const needle = require('needle')

const createBucket = (cos, Bucket) => {
  console.log(`creating bucket ${Bucket}`)

  return cos
    .createBucket({
      Bucket,
      CreateBucketConfiguration: {
        LocationConstraint: 'us-standard'
      }
    })
    .promise()
    .catch(err => {
      if (err.code === 'BucketAlreadyExists') {
        console.log(`bucket already exists: ${Bucket}`)
      } else {
        debug('error making bucket', err)
        throw err
      }
    })
}

/** we decided not to do a swap */
const main = ({ secrets, value }) => {
  // eslint-disable-line
  // WARNING: this has to match the BRANCH= part in .travis.yml
  const TRAVIS_JOB_NUMBER = value.number
  const Bucket = `kui-dev.${TRAVIS_JOB_NUMBER}`
  const destBucket = `kui-dev`

  console.log(`TRAVIS_JOB_NUMBER: ${TRAVIS_JOB_NUMBER}`)
  console.log(`Bucket: ${Bucket}`)

  return needle('get', secrets.endpoints, { json: true })
    .then(endpoints => endpoints.body)
    .then(endpoints => ({
      endpoint:
        endpoints['service-endpoints']['cross-region'].us.public['us-geo'],

      ibmAuthEndpoint: `https://${
        endpoints['identity-endpoints']['iam-token']
      }/oidc/token`,
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

    .then(async config => {
      const cos = new AWS.S3(config)
      console.log('cos initialized', config.apiKeyId)

      console.log('cleaning up bucket', Bucket)

      await createBucket(cos, destBucket)

      return cos
        .listObjects({ Bucket })
        .promise()
        .then(_ => {
          console.log('listObjects', _)
          return _
        })
        .then(({ Contents }) =>
          Promise.all(
            Contents.map(({ Key }) => {
              return cos
                .copyObject({
                  Bucket: destBucket,
                  Key,
                  CopySource: `${Bucket}/${Key}`,
                  ACL: 'public-read'
                })
                .promise()
            })
          )
        )

        .then(() => cos.listObjects({ Bucket: destBucket }).promise())
    })

    .then(details => ({ status: 'done swapping', details }))
}
