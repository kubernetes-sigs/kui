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

import { inBrowser, inElectron } from '../core/capabilities'

/**
 * Get the userdata directory
 *
 */
export const userDataDir = (): string => {
  if (inBrowser()) {
    throw new Error('Unsupported operation')
  } else if (inElectron()) {
    const { app } = require('electron').remote
    return app.getPath('userData')
  } else {
    // headless
    const { join } = require('path')
    const { name } = require('@kui/settings/package.json')

    switch (process.platform) {
      case 'darwin':
        return join(process.env.HOME, 'Library', 'Application Support', name)
      case 'linux':
        const home = process.env.XDG_CONFIG_HOME || require('expand-home-dir')('~/.config')
        return join(home, name)
      case 'win32':
        return join(process.env.APPDATA, name)
    }
  }
}
