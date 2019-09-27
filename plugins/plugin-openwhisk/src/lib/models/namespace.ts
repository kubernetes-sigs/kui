/*
 * Copyright 2018 IBM Corporation
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

import * as Debug from 'debug'

import { Capabilities, Models, REPL, UI } from '@kui-shell/core'

import { apiHost, auth as authModel } from './auth'

const debug = Debug('plugins/openwhisk/models/namespace')

/** localStorage key */
const key = 'wsk.namespaces'

/** semi-globals */
let cached
let currentNS

const read = () =>
  apiHost.get().then(host => {
    debug('read:host', host)
    let model = cached
    if (!model) {
      debug('read:not cached')
      const raw = Models.Store().getItem(key)
      try {
        model = raw ? JSON.parse(raw) : {}
      } catch (e) {
        console.error(`Error parsing namespace JSON ${raw}`)
        console.error(e)
        model = {}
      }

      if (!model[host]) {
        debug(`read no model yet for ${host}`)
        model[host] = {}
      }

      cached = model
      debug('read:computed', model)
    }
    return {
      _full: model, // the full model, needed for reserializing
      _host: host, // help for updates and reserializing
      namespaces: model[host] // this host's model
    }
  })

const write = model => {
  cached = model._full
  Models.Store().setItem(key, JSON.stringify(model._full))
}

/**
 * If user switches namespace, save it to local storage
 *
 */
const writeSelectedNS = selectedNS => {
  if (Models.Store().getItem('selectedNS') !== selectedNS) {
    Models.Store().setItem('selectedNS', selectedNS)
    debug('stored selected namespace to local storage', Models.Store().getItem('selectedNS'))
  }
}

export const setApiHost = (apiHost = '') => {
  const apiHostDom = document.querySelector('#openwhisk-api-host') as HTMLElement

  // strip off the proto
  const idx = apiHost.indexOf('://')
  apiHostDom.innerText = idx >= 0 ? apiHost.substring(idx + '://'.length) : apiHost
  // apiHostDom.setAttribute('size', apiHostDom.value.length + 3)
}

/** for debugging only; removes localStorage model for current host */
/* self.__reset = () => apiHost.get().then(host => read().then(model => {
   delete model[host]
   console.error('namespace::reset', host, model[host])
   write(model)
   }))
   self.__lookup = () => apiHost.get().then(host => read().then(model => console.error(`Namespace list for ${host} is ${model.namespaces ? JSON.stringify(model.namespaces) : 'empty'}`))) */

/**
 * User does not have a namespace! warn the user of how to proceed
 *
 */
export const setNoNamespace = (provideHelp = true) => {
  if (Capabilities.isHeadless()) {
    return
  }

  const namespaceDom = document.querySelector('#openwhisk-namespace') as HTMLElement
  namespaceDom.className += ' oops'
  namespaceDom.innerText = 'no auth key!'
  namespaceDom.onclick = () => UI.LowLevel.partialInput('wsk auth add <your_auth_key>')
  namespaceDom.removeAttribute('data-value')
  document.body.classList.add('no-auth')

  // cache
  currentNS = undefined

  if (provideHelp) {
    if (Capabilities.inBrowser()) {
      REPL.qexec('getting started')
    }
  }
}

/**
 * User has a namespace, but needs to select one before they can proceed
 *
 */
export const setPleaseSelectNamespace = () => {
  if (Capabilities.isHeadless()) {
    return
  }

  const namespaceDom = document.querySelector('#openwhisk-namespace') as HTMLElement
  namespaceDom.className += ' oops'
  namespaceDom.innerText = 'please select a namespace'
  namespaceDom.removeAttribute('data-value')
}

/**
 * List known namespaces
 *
 */
export const list = async () => {
  const model = await read()
  const namespaces = model.namespaces
  const A = []

  for (const namespace in namespaces) {
    A.push({
      namespace: namespace,
      auth: namespaces[namespace]
    })
  }

  debug('list', A)
  return A
}

/**
 * We don't know yet what's going on, all we know is that the
 * wsk.namespace.get call failed
 *
 */
export const setNeedsNamespace = async (err?: Error) => {
  // oops, we're in a bit of a weird state. if we get here,
  // then the user has specified a valid api host, but
  // hasn't yet selected a namespace.
  if (err) {
    console.error(err)
  }

  debug('setNeedsNamespace')
  const localSelectedNS = Models.Store().getItem('selectedNS')
  if (localSelectedNS) {
    debug('user selected one namespace previously, so auto-selecting it from local storage', localSelectedNS)
    try {
      return await REPL.qexec(`wsk auth switch ${localSelectedNS}`)
    } catch (err) {
      console.error('The previously selected namespace probably does not align with the currently selected host', err)

      // intentionally falling through to "no selected namespace in local storage" ...
    }
  }

  debug('no selected namespace in local storage')
  return list().then(auths => {
    if (auths.length === 0) {
      // user has no namespaces, and so needs to use
      // wsk auth add to tell us about one
      debug('user has no namespace')
      setNoNamespace()
    } else if (auths.length === 1) {
      // user has one namespace, so select it
      const singleNamespace = auths[0].namespace
      debug('user has just one namespace, auto-selecting it', singleNamespace)
      REPL.qexec(`wsk auth switch ${singleNamespace}`)
    } else {
      // user has many namespaces, and didn't select one previously, so list them
      debug('user has more than one namespace, listing them')
      setPleaseSelectNamespace()
      REPL.pexec(`wsk auth list`)
    }
  })
}

/**
 * Record namespace to local store
 *
 */
const persist = (namespace, auth) => {
  return read().then(model => {
    let hostModel = model._full[model._host]
    if (!hostModel) {
      hostModel = model._full[model._host] = {}
    }
    hostModel[namespace] = auth
    write(model)
  })
}

const setNamespace = (namespace: string) => {
  if (!namespace) {
    return setNeedsNamespace()
  }

  // UI bits
  debug(`setNamespace ${namespace}`)
  const namespaceDom = document.querySelector('#openwhisk-namespace') as HTMLElement
  namespaceDom.className = 'clickable' // remove any prior oops
  namespaceDom.onclick = () => REPL.pexec('wsk auth list')
  namespaceDom.innerText = namespace
  namespaceDom.setAttribute('data-value', namespace)

  const hostDom = document.querySelector('#openwhisk-api-host') as HTMLElement
  hostDom.className = 'clickable'
  hostDom.onclick = () => UI.LowLevel.partialInput('host set <your_api_host>')

  // cache
  currentNS = namespace

  // persistence bits
  return persist(namespace, authModel.get())
}

/**
 * Initialize the apihost and namespace bits of the UI
 *
 */
export const init = async (noCatch = false, { noAuthOk = false } = {}) => {
  debug('init')

  return apiHost
    .get() // get the current apihost
    .then(setApiHost) // udpate the UI for the apihost
    .then(() => REPL.qexec('wsk auth namespace get')) // get the namespace associated with the current auth key
    .then(setNamespace) // update the UI for the namespace
    .catch(err => {
      debug('namespace init error', noAuthOk)
      console.error('namespace::init error ' + JSON.stringify(err), err)
      if (!noCatch) {
        return setNeedsNamespace(err)
      } else if (!noAuthOk) {
        throw err
      }
    })
}

/**
 * Return the currently selected namespace
 *
 */
interface CurrentOptions {
  noNamespaceOk: boolean
}
class DefaultCurrentOptions implements CurrentOptions {
  noNamespaceOk = false // eslint-disable-line @typescript-eslint/explicit-member-accessibility
}
export const current = async (opts: CurrentOptions = new DefaultCurrentOptions()): Promise<string> => {
  const ns = currentNS
  debug('current', ns)

  if (!ns && !opts.noNamespaceOk) {
    // lazily initialize ourselves
    await init()
    return current()
  } else {
    return Promise.resolve(ns)
  }
}

/**
 * Switch to use the given openwhisk auth and save
 *
 */
export const useAndSave = (auth: string) =>
  authModel
    .set(auth)
    .then(() => REPL.qexec('wsk namespace current'))
    .then(namespace => writeSelectedNS(namespace)) // store the selected namesapce to local storage (use case e.g. reload the browser after auth switch)
    .then(() => init())

/**
 * Switch to use the given openwhisk auth but don't save
 *
 */
export const use = (auth: string) => {
  return authModel.set(auth).then(() => init())
}

/**
 * Fetch the namespace details for the given namespace, by name
 *
 */
export const get = name => read().then(model => model && model.namespaces[name])
