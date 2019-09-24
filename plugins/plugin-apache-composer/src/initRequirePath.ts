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
import * as path from 'path'

import { Capabilities } from '@kui-shell/core'

const debug = Debug('plugins/apache-composer/initRequirePath')

// help compositions find our openwhisk-composer module
export default async () => {
  if (!Capabilities.inBrowser()) {
    debug('adding node_modules to the require module path')
    const appModulePath = await import('app-module-path')

    // add the directory that encloses `openwhisk-composer`
    // this is needed e.g. for `compose foo`
    const root = path.dirname(require.resolve('openwhisk-composer/package.json'))
    appModulePath.addPath(path.join(root, '..'))
  }
}
