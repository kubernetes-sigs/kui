/*
 * Copyright 2020 The Kubernetes Authors
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

import { FStat } from '@kui-shell/plugin-bash-like/fs'
import { Arguments, Util, encodeComponent } from '@kui-shell/core'

export async function loadNotebook(
  filepath: string,
  { REPL }: Pick<Arguments, 'REPL'>,
  errOk = false
): Promise<string | object> {
  try {
    if (/^https:/.test(filepath)) {
      return (await REPL.rexec<(string | object)[]>(`_fetchfile ${encodeComponent(filepath)}`)).content[0]
    } else {
      //   --with-data says give us the file contents
      const fullpath = Util.absolute(Util.expandHomeDir(filepath))
      const stats = (await REPL.rexec<FStat>(`vfs fstat ${encodeComponent(fullpath)} --with-data`)).content

      if (stats.isDirectory) {
        throw new Error('Invalid filepath')
      } else {
        return stats.data as string
      }
    }
  } catch (err) {
    if (!errOk) {
      throw err
    } else {
      return undefined
    }
  }
}
