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
const debug = Debug('plugins/editor/preload')
debug('loading')

import { inBrowser } from '@kui/core/capabilities'
import { PluginRequire, PreloadRegistration } from '@kui/models/plugin'

debug('done loading prereqs')

/**
 * Here, we prefetch the editor, if we're running in browser
 * mode. It is slow to load.
 *
 */
const registration: PreloadRegistration = async (commandTree, prequire: PluginRequire) => {
  debug('initializing')

  if (inBrowser()) {
    // NOTE how there is no await; this is because our goal is only to
    // prefetch it
    prequire('editor')
  }
}

export default registration

debug('finished loading')
