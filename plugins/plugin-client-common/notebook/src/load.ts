/*
 * Copyright 2022 The Kubernetes Authors
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

import Debug from 'debug'
import { FStat } from '@kui-shell/plugin-bash-like/fs'
import { Arguments, Util, encodeComponent } from '@kui-shell/core'

const debug = Debug('plugin-client-common/notebook/load')

export async function loadNotebook(
  filepath: string,
  { REPL }: Pick<Arguments, 'REPL'>,
  errOk = false
): Promise<string | object> {
  try {
    // replace any environment variable references
    filepath = filepath.replace(/\${?([^/s]+)}?/g, (_, p1) => process.env[p1])

    debug('attempting to load guidebook data', filepath)
    if (/^https:/.test(filepath)) {
      return (await REPL.rexec<(string | object)[]>(`_fetchfile ${encodeComponent(filepath)}`)).content[0]
    } else {
      //   --with-data says give us the file contents
      const fullpath = Util.absolute(Util.expandHomeDir(filepath))
      const stats = (await REPL.rexec<FStat>(`vfs fstat ${encodeComponent(fullpath)} --with-data`)).content

      if (stats.isDirectory) {
        throw new Error('Invalid filepath')
      } else {
        debug('successfully loaded guidebook data', filepath)
        return stats.data as string
      }
    }
  } catch (err) {
    debug('error loading guidebook data', filepath, err)
    if (!errOk) {
      throw err
    } else {
      return undefined
    }
  }
}
