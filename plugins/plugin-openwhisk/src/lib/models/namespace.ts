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
const debug = Debug('plugins/openwhisk/models/namespace')

import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'
import cli = require('@kui-shell/core/webapp/cli')
import repl = require('@kui-shell/core/core/repl')
import { prequire } from '@kui-shell/core/core/plugins'

import { apiHost } from './auth'

/** localStorage key */
const key = 'wsk.namespaces'

/** semi-globals */
let cached
let _wsk
let currentNS

const read = (wsk = _wsk) => apiHost.get().then(host => {
  debug('read:host', host)
  let model = cached
  if (!model) {
    debug('read:not cached')
    const raw = window.localStorage.getItem(key)
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
  window.localStorage.setItem(key, JSON.stringify(model._full))
}

/**
 * If user switches namespace, save it to local storage
 *
 */
const writeSelectedNS = selectedNS => {
  if (window.localStorage.getItem('selectedNS') !== selectedNS) {
    window.localStorage.setItem('selectedNS', selectedNS)
    debug('stored selected namespace to local storage', window.localStorage.getItem('selectedNS'))
  }
}

export const setApiHost = apiHost => {
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

const setNamespace = (namespace, wsk = _wsk) => {
  if (!namespace) {
    return setNeedsNamespace(wsk)
  }

  // UI bits
  debug(`setNamespace ${namespace}`)
  const namespaceDom = document.querySelector('#openwhisk-namespace') as HTMLElement
  namespaceDom.className = 'clickable' // remove any prior oops
  namespaceDom.onclick = () => repl.pexec('wsk auth list')
  namespaceDom.innerText = namespace
  namespaceDom.setAttribute('data-value', namespace)

  const hostDom = document.querySelector('#openwhisk-api-host') as HTMLElement
  hostDom.className = 'clickable'
  hostDom.onclick = () => cli.partial('host set <your_api_host>')

  // cache
  currentNS = namespace

  // persistence bits
  return store(namespace, wsk.auth.get(), wsk)
}

/**
 * User does not have a namespace! warn the user of how to proceed
 *
 */
export const setNoNamespace = (provideHelp = true) => {
  if (isHeadless()) {
    return
  }

  const namespaceDom = document.querySelector('#openwhisk-namespace') as HTMLElement
  namespaceDom.className += ' oops'
  namespaceDom.innerText = 'no auth key!'
  namespaceDom.onclick = () => cli.partial('wsk auth add <your_auth_key>')
  namespaceDom.removeAttribute('data-value')
  document.body.classList.add('no-auth')

  // cache
  currentNS = undefined

  if (provideHelp) {
    if (inBrowser()) {
      repl.qexec('getting started')
    }
  }
}

/**
 * User has a namespace, but needs to select one before they can proceed
 *
 */
export const setPleaseSelectNamespace = () => {
  if (isHeadless()) {
    return
  }

  const namespaceDom = document.querySelector('#openwhisk-namespace') as HTMLElement
  namespaceDom.className += ' oops'
  namespaceDom.innerText = 'please select a namespace'
  namespaceDom.removeAttribute('data-value')
}

/**
 * We don't know yet what's going on, all we know is that the
 * wsk.namespace.get call failed
 *
 */
export const setNeedsNamespace = async (wsk, err?: Error) => {
  // oops, we're in a bit of a weird state. if we get here,
  // then the user has specified a valid api host, but
  // hasn't yet selected a namespace.
  if (err) {
    console.error(err)
  }

  debug('setNeedsNamespace')
  const localSelectedNS = window.localStorage.getItem('selectedNS')
  if (localSelectedNS) {
    debug('user selected one namespace previously, so auto-selecting it from local storage', localSelectedNS)
    try {
      return await repl.qexec(`auth switch ${localSelectedNS}`)
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
      repl.qexec(`auth switch ${singleNamespace}`)
    } else {
      // user has many namespaces, and didn't select one previously, so list them
      debug('user has more than one namespace, listing them')
      setPleaseSelectNamespace()
      repl.pexec(`wsk auth list`)
    }
  })
}

/**
 * Record namespace to local store
 *
 */
export const store = (namespace, auth, wsk) => {
  return read(wsk).then(model => {
    let hostModel = model._full[model._host]
    if (!hostModel) {
      hostModel = model._full[model._host] = {}
    }
    hostModel[namespace] = auth
    write(model)
  })
}

/**
 * Initialize the apihost and namespace bits of the UI
 *
 */
export const init = async (noCatch = false, { noAuthOk = false } = {}) => {
  debug('init')

  _wsk = await prequire('plugin-openwhisk')

  return apiHost.get() // get the current apihost
    .then(setApiHost) // udpate the UI for the apihost
    .then(_wsk.namespace.get) // get the namespace associated with the current auth key
    .then(setNamespace) // update the UI for the namespace
    .catch(err => {
      debug('namespace init error', noAuthOk)
      console.error('namespace::init error ' + JSON.stringify(err), err)
      if (!noCatch) {
        return setNeedsNamespace(_wsk, err)
      } else if (!noAuthOk) {
        throw err
      }
    })
}

/**
 * List known namespaces
 *
 */
export const list = async (wsk = _wsk) => {
  const model = await read(wsk)
  const namespaces = model.namespaces
  const A = []

  for (let namespace in namespaces) {
    A.push({
      namespace: namespace,
      auth: namespaces[namespace]
    })
  }

  debug('list', A)
  return A
}

/**
 * Return the currently selected namespace
 *
 */
interface ICurrentOptions {
  noNamespaceOk: boolean
}
class DefaultCurrentOptions implements ICurrentOptions {
  noNamespaceOk = false
  constructor () {
    // blank
  }
}
export const current = async (opts: ICurrentOptions = new DefaultCurrentOptions()): Promise<string> => {
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
export const useAndSave = (auth, wsk = _wsk) => wsk.auth.set(auth)
  .then(wsk.namespace.get)
  .then(namespace => writeSelectedNS(namespace)) // store the selected namesapce to local storage (use case e.g. reload the browser after auth switch)
  .then(() => init())

/**
 * Switch to use the given openwhisk auth but don't save
 *
 */
export const use = (auth, wsk = _wsk) => {
  return wsk.auth.set(auth).then(() => init())
}

/**
 * Fetch the namespace details for the given namespace, by name
 *
 */
export const get = (name, wsk = _wsk) => read(wsk).then(model => model && model.namespaces[name])
