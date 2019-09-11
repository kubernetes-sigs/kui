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

import * as Debug from 'debug'
const debug = Debug('plugins/core-support/preload')
debug('loading')

import { isHeadless, inBrowser } from '@kui-shell/core/core/capabilities'

import { CommandRegistrar } from '@kui-shell/core/models/command'
import { PreloadRegistration } from '@kui-shell/core/models/plugin'

/**
 * This is the module
 *
 */
const registration: PreloadRegistration = async (commandTree: CommandRegistrar) => {
  const asyncs = []

  if (!isHeadless()) {
    asyncs.push(import('./lib/cmds/zoom').then(_ => _.default(commandTree)))
    asyncs.push(
      import('./lib/cmds/theme')
        .then(_ => _.preload())
        .then(() => import('./lib/new-tab'))
        .then(_ => _.default(commandTree))
    )
    asyncs.push(import('./lib/cmds/history/reverse-i-search').then(_ => _.default()))
    asyncs.push(import('./lib/cmds/about/about').then(_ => _.preload()))
    asyncs.push(import('./lib/tab-completion').then(_ => _.default()))
  }

  if (!isHeadless() && !inBrowser()) {
    // in webpack, use the default text-search bar of browser
    asyncs.push(import('./lib/text-search').then(_ => _.default()))
  }

  return Promise.all(asyncs)
}

export default registration

debug('finished loading')
