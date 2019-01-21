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
const debug = Debug('k8s/loader')
debug('loading')

import auth from './lib/cmds/auth'
debug('auth loaded')
import contexts from './lib/cmds/contexts'
debug('contexts loaded')
import kubectl from './lib/cmds/kubectl'
debug('kubectl loaded')
import status from './lib/cmds/status'
debug('status loaded')

import { inBrowser } from '@kui/core/core/capabilities'
import { PluginRegistration, PluginRequire } from '@kui/core/models/plugin'

export default async (commandTree, prequire: PluginRequire) => {
  debug('init')
  await auth(commandTree, prequire)
  debug('auth')
  await contexts(commandTree, prequire)
  debug('contexts')
  await status(commandTree, prequire)
  debug('status')
  await kubectl(commandTree, prequire)
  debug('kubectl')

  if (!inBrowser()) {
    const kedit: PluginRegistration = (await import('./lib/cmds/kedit')).default
    await kedit(commandTree, prequire)
    debug('kedit')
  }
}
