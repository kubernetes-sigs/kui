/*
 * Copyright 2017 The Kubernetes Authors
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

import Debug from 'debug'
const debug = Debug('core/plugins')
debug('loading')

import preloader from './preloader'
import { makeResolver } from './resolver'
import { PrescanModel, unify } from './prescan'

import { KuiPlugin } from '../models/plugin'
import { userDataDir } from '../core/userdata'
// import { isHeadless } from '../core/capabilities'
import { setPluginResolver } from '../core/command-tree'

debug('modules loaded')

export const pluginRoot = '../../../../plugins'

/**
 * This is the registrar for plugins used at runtime (i.e. "live, not
 * scanning"). This is not related to the prescan computation.
 *
 */
export const registrar: Record<string, KuiPlugin> = {}

/**
 * When in "live, not scanning" mode, this state will store the result
 * of a previous plugin scan
 *
 */
let basePrescan: PrescanModel // without any user-installed plugins
let prescan: PrescanModel
try {
  prescan = require('@kui-shell/prescan.json') as PrescanModel // the result of unify(basePrescan, userPrescan)
} catch (err) {
  debug(err)
}
export function prescanModel(): PrescanModel {
  return prescan
}

/**
 * For internal use only: set the prescan model
 *
 */
export function _useUpdatedUserPrescan(userPrescan: PrescanModel) {
  debug('useUpdatedUserPrescan', userPrescan, basePrescan)
  prescan = unify(basePrescan, userPrescan)
  setPluginResolver(makeResolver(prescan, registrar))
}

export const preload = () => {
  return preloader(prescan)
}

/**
 * @return the home directory for user-installed plugins. All
 * artifacts related to user-installed plugins will be stored within
 * this directory.
 *
 */
export async function userInstalledHome() {
  const { join } = await import('path')
  const rootDir = userDataDir()
  return join(rootDir, 'plugins')
}

/**
 * Load the prescan model, in preparation for loading the shell
 *
 * @return truthy value if we indeed did the initialization
 */
export const init = async (): Promise<boolean> => {
  debug('init')

  if (basePrescan) {
    return false
  }

  // pre-installed plugins
  basePrescan = prescan

  /* if (isHeadless() && prescan) {
    try {
      const [{ existsSync }, { join }] = await Promise.all([import('fs'), import('path')])
      const userPath = join(await userInstalledHome(), 'node_modules/@kui-shell/prescan.json')
      if (existsSync(userPath)) {
        const userInstalledPrescan = (await import(userPath)) as PrescanModel

        // merge builtin plugins with user-installed plugins
        prescan = unify(prescan, userInstalledPrescan)
        // debug('prescan', prescan)
      }
      debug('user-installed prescan loaded')
    } catch (err) {
      debug('error loading user-installed prescan', err)
    }
  } */

  /* const { default: eventChannelUnsafe } = await import('../core/events')
  eventChannelUnsafe.on('/plugin/compile/request', async (pluginToBeRemoved?: string) => {
    const { compileUserInstalled } = await import('./assembler')
    compileUserInstalled(pluginToBeRemoved)
  }) */

  setPluginResolver(makeResolver(prescan, registrar))

  debug('init done')
  return true
}

debug('done loading')
