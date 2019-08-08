/*
 * Copyright 2019 IBM Corporation
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
const debug = Debug('plugins/bash-like/preload')
debug('loading')

import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'
import { CommandRegistrar } from '@kui-shell/core/models/command'
import { CapabilityRegistration } from '@kui-shell/core/models/plugin'

import prefetchShellState from './pty/prefetch'
import { preload as registerCatchAll } from './lib/cmds/catchall'

export const registerCapability: CapabilityRegistration = async () => {
  if (inBrowser()) {
    import('./pty/session').then(({ init }) => init())
  }
}

/**
 * This is the module
 *
 */
export default async (commandTree: CommandRegistrar) => {
  if (!isHeadless()) {
    import('./lib/tab-completion/git').then(_ => _.default())
  }

  if (isHeadless()) {
    try {
      await prefetchShellState()
      debug('done with state prefetch')
    } catch (err) {
      console.error('error in state prefetch', err)
    }
  }

  return registerCatchAll(commandTree)
}

debug('finished loading')
