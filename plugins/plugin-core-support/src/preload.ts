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

import { isHeadless, inBrowser } from '@kui-shell/core/core/capabilities'

import help from './lib/cmds/help'

import { CommandRegistrar } from '@kui-shell/core/models/command'
import { PluginRequire, PreloadRegistration } from '@kui-shell/core/models/plugin'

/**
 * This is the module
 *
 */
const registration: PreloadRegistration = async (commandTree: CommandRegistrar, _: PluginRequire, options?) => {
  await Promise.all([
    help(commandTree, _, options)
  ])

  if (!isHeadless()) {
    await Promise.all([
      import('./lib/cmds/zoom').then(_ => _.default(commandTree)),
      import('./lib/new-tab').then(_ => _.default(commandTree)),
      import('./lib/cmds/history/reverse-i-search').then(_ => _.default()),
      import('./lib/cmds/theme').then(_ => _.preload()),
      import('./lib/cmds/about/about').then(_ => _.preload()),
      import('./lib/tab-completion').then(_ => _.default())
    ])
  }

  if (!inBrowser()) await import('./lib/text-search').then(_ => _.default())  // in webpack, use the default text-search bar of browser
}

export default registration
