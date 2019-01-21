/*
 * Copyright 2017 IBM Corporation
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
const debug = Debug('core/preloader')
debug('loading')

import { PluginRequire, PreloadRegistration } from '../models/plugin'

/**
 * This module allows for plugins to register themselves to be
 * preloaded at startup, rather than in response to a user command
 *
 */
export default async (prequire: PluginRequire, commandTree, prescan, options) => {
  debug('init', prescan.preloads)

  const jobs = Promise.all(prescan.preloads.map(async module => {
    // FIXME to support field-installed plugin paths
    try {
      debug('preloading %s', module.path)
      // NOTE ON @kui relativization: this is important so that
      // webpack can be isntructed to pull in the plugins into the
      // build see the corresponding NOTE in ./plugin-assembler.ts and
      // ./plugins.ts
      const registrationRef = await import('@kui/' + module.path)
      const registration: PreloadRegistration = registrationRef.default || registrationRef
      await registration(commandTree.proxy(module.route), prequire, options)
      debug('done preloading %s', module.path)
    } catch (err) {
      debug('error invoking preload', module.path, err)
      console.error(err)
    }
  }))

  try {
    await jobs
  } catch (err) {
    console.error(err)
  }

  debug('done')
}
