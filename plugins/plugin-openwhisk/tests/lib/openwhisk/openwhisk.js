/*
 * Copyright 2017-18 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const assert = require('assert')
const { Common, CLI, ReplExpect, Selectors } = require('@kui-shell/test')
const { expandHomeDir } = require('@kui-shell/core')

// read and cache local ~/.wskprops
let wskprops
const localWskProps = () => {
  if (!wskprops) {
    const propertiesParser = require('properties-parser')

    try {
      wskprops = propertiesParser.read(process.env['WSK_CONFIG_FILE'] || expandHomeDir('~/.wskprops'))
    } catch (err) {
      if (err.code === 'ENOENT') {
        // this probably is OK, it probably means that the user set everything via env vars
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

const apihost = process.env.__OW_API_HOST || process.env.API_HOST || process.env.APIHOST || localWskProps().APIHOST
const apihostIsLocal = apihost
  ? apihost.indexOf('localhost') >= 0 ||
    apihost.startsWith('192.') ||
    apihost.startsWith('172.') ||
    apihost.startsWith('https://192.') ||
    apihost.startsWith('https://172.')
  : null

exports.apihost = apihost
exports.apihostIsLocal = apihostIsLocal

const cleanAll = (
  noDefault,
  apiKey = !noDefault && (process.env.__OW_API_KEY || process.env.AUTH || localWskProps().AUTH)
) => {
  if (!apiKey) {
    return Promise.resolve(true)
  }

  const opts = {
    apihost,
    api_key: apiKey,
    ignore_certs: process.env.IGNORE_CERTS || process.env.INSECURE_SSL || localWskProps().INSECURE_SSL || apihostIsLocal
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
    Promise.all(
      entities.map(entity => {
        const tryDelete = () => {
          return ow[entity.type]
            .delete({ name: `/${entity.namespace}/${entity.name}` })
            .then(deleted => {
              const feedAnnotation = deleted.annotations && deleted.annotations.find(kv => kv.key === 'feed')
              if (feedAnnotation) {
                // console.log('Deleting feed', feedAnnotation.value)
                return ow.feeds.delete({
                  feedName: feedAnnotation.value,
                  trigger: entity.name
                })
              } else {
                return deleted
              }
            })
            .catch(err => {
              if (err.statusCode === 404) {
                // ignore 404s on deletes
              } else {
                throw err
              }
            })
        }

        // with retries...
        return tryDelete()
          .catch(logThen(tryDelete))
          .catch(logThen(tryDelete))
          .catch(logThen(tryDelete))
          .catch(logThen(tryDelete))
          .catch(logThen(tryDelete))
          .catch(logThen(tryDelete))
          .catch(logThen(tryDelete))
          .catch(logThen(tryDelete))
      })
    )

  const list = type => {
    return ow[type].list({ limit: 200 }).then(list =>
      list.map(e => {
        e.type = type
        return e
      })
    )
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
    return list(type)
      .then(deleteAllUntilDone(type))
      .catch(err => {
        console.error('List failure')
        console.error(err)
        throw err
      })
  }

  //
  // here is the core logic
  //
  const cleanOnce = () =>
    Promise.all([clean('triggers'), clean('actions')]).then(() => Promise.all([clean('rules'), clean('packages')]))

  return cleanOnce()
    .catch(logThen(cleanOnce))
    .catch(logThen(cleanOnce))
  //  .then(() => event.sender.send('asynchronous-reply', 'true'))
  //  .catch(() => event.sender.send('asynchronous-reply', 'false'))
}

exports.cleanAll = cleanAll

exports.before = (ctx, opts) => {
  if (process.env.TRAVIS_JOB_ID) {
    ctx.retries(10) // don't retry the mocha.it in local testing
  }

  return function() {
    const setApiHost =
      process.env.MOCHA_RUN_TARGET !== 'webpack' || (opts && opts.fuzz)
        ? x => x
        : () =>
            CLI.command(`wsk host set ${apihost}`, ctx.app)
              .then(ReplExpect.ok)
              .catch(err => {
                console.log(`Failed at command: wsk host set ${apihost}`)
                return Common.oops(ctx)(err)
              })

    const addWskAuth =
      process.env.MOCHA_RUN_TARGET !== 'webpack' || (opts && opts.fuzz)
        ? x => x
        : () =>
            CLI.command(`wsk auth add ${process.env.__OW_API_KEY || process.env.AUTH}`, ctx.app)
              .then(ReplExpect.ok)
              .catch(err => {
                console.log(`Failed at command: wsk auth add ${process.env.__OW_API_KEY || process.env.AUTH}`)
                return Common.oops(ctx)(err)
              })

    // clean openwhisk assets from previous runs, then start the app
    return Promise.all([
      cleanAll(false, process.env.__OW_API_KEY || process.env.AUTH),
      cleanAll(true, process.env.AUTH2)
    ])
      .then(Common.before(ctx, opts))
      .then(setApiHost)
      .then(addWskAuth)
  }
}

exports.aliases = {
  activation: ['activation', '$'],
  list: ['list'],
  remove: ['delete']
}

/** validate an activationId */
const activationIdPattern = /^\w{12}$/
exports.expectValidActivationId = () => activationId => activationId.match(activationIdPattern)

/**
 * Wait till activation list shows the given activationId. Optionally,
 * use an action name filter
 *
 */
const waitForActivationOrSession = entityType => (app, activationId, { name = '' } = {}) => {
  return app.client.waitUntil(() => {
    return CLI.command(`wsk ${entityType} list ${name}`, app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(
        N => !!app.client.getText(`${Selectors.LIST_RESULTS_N(N)} .activationId[data-activation-id="${activationId}"]`)
      )
  })
}

exports.waitForActivation = waitForActivationOrSession('activation')
exports.waitForSession = waitForActivationOrSession('session')

/**
 * @return the expected namespace string for this test
 *
 */
exports.expectedNamespace = (
  space = process.env.TEST_SPACE || (process.env.LOCAL_OPENWHISK && 'guest'),
  org = process.env.TEST_ORG
) => {
  if (!org || org.length === 0) {
    return space
  } else if (space) {
    return `${org}_${space}`
  }
}

/**
 * Valdiate that the observed namespace matches the expected namespace
 * for this test
 *
 */
exports.validateNamespace = observedNamespace => {
  assert.strictEqual(observedNamespace.toLowerCase(), exports.expectedNamespace().toLowerCase())
}

/**
 * Normalize data for conformance testing of an HTML file
 *
 */
exports.normalizeHTML = s => {
  const result = s
    .toString()
    .replace(/http(s?):\/\/[^/]+/g, '') // strip out any hostnames that may vary
    .replace(/>\s+</g, '><') // remove white-space between tags
    .replace(/"/g, "'") // convert to single quotes
    .replace(/href=(['"])([^'"]+).css(['"])/, 'href=$1$2.http$3')
  return result
}

exports.rp = opts => {
  const rp = require('request-promise')
  const withRetry = require('promise-retry')

  return withRetry((retry, iter) => {
    return rp(Object.assign({ timeout: 20000 }, typeof opts === 'string' ? { url: opts } : opts)).catch(err => {
      const isNormalError = err && (err.statusCode === 400 || err.statusCode === 404 || err.statusCode === 409)
      if (!isNormalError && iter < 10) {
        console.error(err)
        retry()
      } else {
        console.error(`Error in rp with opts=${JSON.stringify(opts)}`)
        throw err
      }
    })
  })
}
