const needle = require('needle')

const apihost = 'https://sherpa-stage.wdpdist.com'

/**
 * Format a URL that references the given composition
 *
 */
function composition (namespace, pkgname, shortname) {
  const suffix = shortname ? `/${shortname}` : ''

  return `${apihost}/v1/namespaces/${encodeURIComponent(namespace)}/packages/${encodeURIComponent(pkgname)}/compositions${suffix}`
}

const main = params => { // eslint-disable-line
  console.log(params)

  const namespace = process.env.__OW_NAMESPACE
  const pkgname = '_'
  const shortname = 'cloudshell-done'
  const blocking = true
  const result = false

  const tmp = process.env.__OW_API_KEY.split(':')
  const auth = { username: tmp[0], password: tmp[1], json: true }

  return needle('post',
    `${composition(namespace, pkgname, shortname)}?blocking=${!!blocking || !!result}&result=${!!result}`,
    params,
    auth).then(response => response.statusCode >= 400 ? Promise.reject(response) : response)
}
