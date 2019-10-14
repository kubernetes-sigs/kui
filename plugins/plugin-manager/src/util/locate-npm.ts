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

import { platform } from 'os'
import { delimiter, dirname } from 'path'

/**
 * Find the location of the npm executable
 *
 */
export default async (): Promise<{ npm: string; env?: Record<string, string> } | void> => {
  const which = await import('which')

  return new Promise(resolve => {
    const resolveWith = (npm: string) => {
      const npmpath = dirname(npm)
      const env = Object.assign({}, process.env)
      env.PATH = `${npmpath}${delimiter}${process.env.PATH}`

      resolve({ npm, env })
    }

    which('npm', (err, resolved) => {
      if (resolved) {
        resolveWith(resolved)
        return
      }

      // Try standard locations
      if (err) {
        const path = platform() === 'win32' ? `C:\\Program Files\\nodejs` : '/usr/local/bin'
        resolved = which.sync('npm', { path, nothrow: true })
        if (resolved) {
          resolveWith(resolved)
          return
        }

        // TODO: eventually install npm or remove dependency on npm
        resolve()
      }
    })
  })
}
