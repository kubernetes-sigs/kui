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

import { setHasAuth } from '@kui/core/core/capabilities'
import { PluginRequire, PreloadRegistration } from '@kui/core/models/plugin'
import { getDefaultCommandContext } from '@kui/core/core/command-tree'

import editorPreload from './preload-editor-extensions'

/**
 * This is the module
 *
 */
const registration: PreloadRegistration = async (commandTree, prequire: PluginRequire, options?) => {
  if (getDefaultCommandContext()[0] === 'wsk' && getDefaultCommandContext()[1] === 'action') {
    const { auth } = await import('./lib/models/auth')

    if (auth.get()) {
      setHasAuth('openwhisk')
    }

    editorPreload(commandTree, prequire, options)
  }
}

export default registration
