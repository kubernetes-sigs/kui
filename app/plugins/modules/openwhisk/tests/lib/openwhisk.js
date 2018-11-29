// read and cache local ~/.wskprops
let wskprops
const localWskProps = () => {
  if (!wskprops) {
    const propertiesParser = require('properties-parser')
    const expandHomeDir = require('expand-home-dir')

    try {
      wskprops = propertiesParser.read(process.env['WSK_CONFIG_FILE'] || expandHomeDir('~/.wskprops'))
    } catch (err) {
      if (err.code === 'ENOENT') {
        // this probably is OK, it probably means that the user set everything via env vars
        // see https://github.ibm.com/composer/cloudshell/issues/145
        wskprops = {}
      } else {
        throw err
      }
    }
  }

  return wskprops
}

/**
 * The OpenWhisk entity types
 *
 */
exports.entities = ['action', 'trigger', 'rule', 'package']

const apihost = process.env.__OW_API_HOST || process.env.API_HOST || process.env.APIHOST || localWskProps().APIHOST || 'openwhisk.ng.bluemix.net'
const apihostIsLocal = apihost.indexOf('localhost') >= 0 ||
      apihost.startsWith('192.') ||
      apihost.startsWith('172.') ||
      apihost.startsWith('https://192.') ||
      apihost.startsWith('https://172.')

exports.apihost = apihost
exports.apihostIsLocal = apihostIsLocal

exports.cleanAll = (noDefault, api_key = !noDefault && (process.env.__OW_API_KEY || process.env.AUTH || localWskProps().AUTH)) => {
  if (!api_key) return Promise.resolve(true) // eslint-disable-line

  const opts = {
    apihost,
    api_key,
    ignore_certs: process.env.IGNORE_CERTS || process.env.INSECURE_SSL || localWskProps().INSECURE_SSL ||
                  apihostIsLocal
  }

  const ow = require('openwhisk')(opts)

  /** log a message, then call the given function */
  const logThen = f => msg => {
    if (msg.statusCode === 404 || msg.statusCode === 409) {
      // ignore 404. trying to delete a resource that doesn't exist is ok
      // ignore 409. concurrent delete is ok
    } else {
      // console.log(msg)
      return f()
    }
  }

  const deleteAllOnce = entities =>
    Promise.all(entities.map(entity => {
      const tryDelete = () => {
        return ow[entity.type].delete({ name: `/${entity.namespace}/${entity.name}` })
          .then(deleted => {
            const feedAnnotation = deleted.annotations && deleted.annotations.find(kv => kv.key === 'feed')
            if (feedAnnotation) {
              // console.log('Deleting feed', feedAnnotation.value)
              return ow.feeds.delete({ feedName: feedAnnotation.value,
                trigger: entity.name
              })
            } else {
              return deleted
            }
          }).catch(err => {
            if (err.statusCode === 404) {
              // ignore 404s on deletes
            } else {
              throw err
            }
          })
      }

      // with retries...
      return tryDelete()
        .catch(logThen(tryDelete)).catch(logThen(tryDelete)).catch(logThen(tryDelete)).catch(logThen(tryDelete))
        .catch(logThen(tryDelete)).catch(logThen(tryDelete)).catch(logThen(tryDelete)).catch(logThen(tryDelete))
    }))

  const list = type => {
    return ow[type].list({ limit: 200 }).then(list => list.map(e => { e.type = type; return e }))
  }

  const deleteAllUntilDone = type => entities => {
    // console.log(`cleanAll::deleteAllUntilDone ${type} ${entities.length}`)

    if (entities.length === 0) {
      return Promise.resolve(true)
    } else {
      return deleteAllOnce(entities)
        .then(() => list(type))
        .then(deleteAllUntilDone(type))
    }
  }

  const clean = type => {
    // console.log(`Cleaning ${type}`)
    return list(type).then(deleteAllUntilDone(type))
      .catch(err => {
        console.error('List failure')
        console.error(err)
        throw err
      })
  }

  //
  // here is the core logic
  //
  const cleanOnce = () => Promise.all([clean('triggers'), clean('actions')])
    .then(() => Promise.all([clean('rules'), clean('packages')]))

  return cleanOnce()
    .catch(logThen(cleanOnce)).catch(logThen(cleanOnce))
//  .then(() => event.sender.send('asynchronous-reply', 'true'))
//  .catch(() => event.sender.send('asynchronous-reply', 'false'))
}
