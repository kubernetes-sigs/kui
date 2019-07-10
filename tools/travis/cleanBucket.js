process.env.DEBUG = '*'
const debug = require('debug')('cleanBucket')

const AWS = require('ibm-cos-sdk')
const needle = require('needle')

/** we decided not to do a swap */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const main = _ => {
  debug('_', _)
  const { secrets, value } = _
  debug('value', value)

  // WARNING: this has to match the BRANCH= part in .travis.yml
  const TRAVIS_JOB_NUMBER = value.number

  const Bucket = `kui-dev.${TRAVIS_JOB_NUMBER}`

  return needle('get', secrets.endpoints, { json: true })
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
      debug('cos initialized', config.apiKeyId)

      console.log('cleaning up bucket', Bucket)

      return cos
        .listObjects({ Bucket })
        .promise()
        .then(_ => {
          console.log('listObjects', _)
          return _
        })
        .then(({ Contents }) => Promise.all(Contents.map(({ Key }) => cos.deleteObject({ Bucket, Key }).promise())))
        .then(() => cos.deleteBucket({ Bucket }).promise())
    })

    .then(details => ({ status: 'not swapping', details }))
    .catch(error => {
      console.error(error)
      return { status: 'failed', error }
    })
}
