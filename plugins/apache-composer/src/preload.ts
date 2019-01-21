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
import { dirname } from 'path'
import { isHeadless } from '@kui/core/core/capabilities'
import { addPath } from '@kui/core/core/find-file'
import * as repl from '@kui/core/core/repl'
import { PluginRequire, PreloadRegistration } from '@kui/core/models/plugin'
import * as Debug from 'debug'
const debug = Debug('plugins/composer/preload')

/**
 * Listen for drag and drop, and try to show a preview of the
 * composition on drop.
 *
 */
const listenForDrops = () => {
  if (!isHeadless() && typeof document !== 'undefined') {
    document.addEventListener('drop', event => {
      const { dataTransfer } = event
      const { files } = dataTransfer

      if (files.length === 1) {
        debug('got one dropped file')

        repl.pexec(`app preview ${files[0].path}`)
          .catch(err => {
            debug('not an app', err)
          })
      }
    })
  }
}
/**
 * This is the module
 *
 */
const registration: PreloadRegistration = async (commandTree, prequire: PluginRequire) => {
  // listen for drag and drop
  listenForDrops()

  // give visibility to our @demos directory on the module path
  addPath(dirname(require.resolve('@kui-plugin/apache-composer/lib/@demos/hello.js')))
}

export default registration
