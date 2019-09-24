/*
 * Copyright 2017-2018 IBM Corporation
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
import * as openwhisk from 'openwhisk'

import { getDefaultCommandContext } from '@kui-shell/core/core/command-tree'
import { Capabilities, Settings } from '@kui-shell/core'
import store from '@kui-shell/core/models/store'
import expandHomeDir from '@kui-shell/core/util/home'

const debug = Debug('plugins/openwhisk/models/auth')

let wskprops: Record<string, string>
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const propertiesParser = require('properties-parser')
  if (!Capabilities.inBrowser()) {
    wskprops = propertiesParser.read(expandHomeDir(process.env['WSK_CONFIG_FILE'] || '~/.wskprops'))
  } else {
    // then we're running in a browser; we'll initialize this
    // later. clearly there is no local filesystem from which to pull
    // the openwhisk config
    wskprops = {}
  }
} catch (e) {
  wskprops = {}
  if (e.code === 'ENOENT') {
    debug('Could not find wskprops')
  } else {
    console.error(e)
  }
}

debug('wskprops loaded')

/**
 * keys into the localStorage map
 *
 */
const localStorageKey = {
  host: 'wsk.apihost',
  ignoreCerts: 'wsk.apihost.ignoreCerts',
  auth: 'wsk.auth'
}

function getDefaultApiHost() {
  if (Capabilities.inElectron() && Settings.config && Settings.config['electron-host']) {
    return Settings.config['electron-host']
  }
  return window.location ? window.location.host : ''
}

/**
 *
 *
 */
export let apihost: string =
  process.env.__OW_API_HOST ||
  wskprops.APIHOST ||
  store().getItem(localStorageKey.host) ||
  Capabilities.getAuthValue('openwhisk', 'apihost') ||
  getDefaultApiHost()

let authKey: string =
  process.env.__OW_API_KEY ||
  wskprops.AUTH ||
  store().getItem(localStorageKey.auth) ||
  Capabilities.getAuthValue('openwhisk', 'api_key')

const apigwToken: string = process.env.__OW_APIGW_TOKEN || wskprops.APIGW_ACCESS_TOKEN || 'localhostNeedsSomething'

const apigwSpaceGuid: string = process.env.__OW_APIGW_SPACE_GUID || wskprops.APIGW_SPACE_GUID
export let ow /* : openwhisk.Client */

let userRequestedIgnoreCerts = store().getItem(localStorageKey.ignoreCerts) !== undefined
const ignoreCerts = (apiHost: string): boolean =>
  !!(
    userRequestedIgnoreCerts ||
    apiHost.indexOf('localhost') >= 0 ||
    apiHost.startsWith('192.') ||
    apiHost.startsWith('172.') ||
    process.env.IGNORE_CERTS ||
    wskprops.INSECURE_SSL
  )

export const initOWFromConfig = (owConfig: openwhisk.Options) /* : openwhisk.Client */ => {
  debug('initOWFromConfig', owConfig)

  if (owConfig.api_key !== 'unknown') {
    Capabilities.setHasAuth('openwhisk', owConfig)
  }

  debug('initOW', owConfig)
  const ow = openwhisk(owConfig)
  ow['api'] = ow.routes
  delete ow.routes
  debug('initOW done')

  if (owConfig.api_key !== 'unknown' && window && store() && store().setItem) {
    store().setItem(localStorageKey.auth, owConfig.api_key) // remember the choice in localStorage
  }

  return ow
}

export const initOW = () => {
  if (!apihost || !authKey) {
    debug('faking out openwhisk config for now')
  }

  const owConfig = {
    apihost: apihost || 'unknown',
    api_key: authKey || 'unknown',
    apigw_token: apigwToken, // eslint-disable-line @typescript-eslint/camelcase
    apigw_space_guid: apigwSpaceGuid, // eslint-disable-line @typescript-eslint/camelcase
    ignore_certs: ignoreCerts(apihost)
  }

  ow = initOWFromConfig(owConfig)
  return ow
}
if (getDefaultCommandContext()[0] === 'wsk' && getDefaultCommandContext()[1] === 'action') {
  initOW()
}

export const apiHost = {
  get: () => Promise.resolve(apihost),
  set: async (newHost: string, { ignoreCerts = false } = {}) => {
    // eslint-disable-next-line node/no-deprecated-api
    const url = (await import('url')).parse(newHost)
    if (!url.protocol) {
      if (newHost.indexOf('localhost') >= 0 || newHost.indexOf('192.168') >= 0) {
        newHost = `http://${newHost}`
      } else {
        newHost = `https://${newHost}`
      }
    }
    apihost = newHost // global variable
    userRequestedIgnoreCerts = ignoreCerts
    store().setItem(localStorageKey.host, newHost) // remember the choice in localStorage
    store().setItem(localStorageKey.ignoreCerts, userRequestedIgnoreCerts.toString())
    authKey = undefined
    initOW() // re-initialize the openwhisk npm
    debug('apiHost::set', apihost)
    return newHost
  }
}

export const auth = {
  get: () => authKey,
  getSubjectId: () => authKey.split(/:/)[0] || authKey, // if authKey is x:y, return x, otherwise return auth
  set: (newAuthKey: string): Promise<boolean> => {
    const needReinit = !ow

    authKey = newAuthKey
    initOW()

    debug('set', auth)
    return Promise.resolve(needReinit)
  }
}
