/*
 * Copyright 2017-20 IBM Corporation
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

import { lstat, realpath, readdir } from 'fs'
import { basename, join, dirname as pathDirname } from 'path'

import {
  Tab,
  Arguments,
  CommandLine,
  Registrar,
  expandHomeDir,
  registerTabCompletionEnumerator,
  TabCompletionSpec,
  CompletionResponse
} from '@kui-shell/core'

/**
 * Is the given filepath a directory?
 *
 */
const isDirectory = (filepath: string): Promise<boolean> =>
  new Promise<boolean>((resolve, reject) => {
    lstat(filepath, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        if (stats.isSymbolicLink()) {
          // debug('following symlink')
          // TODO: consider turning these into the better async calls?
          return realpath(filepath, (err, realpath) => {
            if (err) {
              reject(err)
            } else {
              isDirectory(realpath)
                .then(resolve)
                .catch(reject)
            }
          })
        }

        resolve(stats.isDirectory())
      }
    })
  }).catch(err => {
    if (err.code === 'ENOENT') {
      return false
    } else {
      throw err
    }
  })

/**
 * Tab completion handler for local files
 *
 */
async function completeLocalFiles(
  tab: Tab,
  commandLine: CommandLine,
  { toBeCompleted }: TabCompletionSpec
): Promise<CompletionResponse[]> {
  return (await tab.REPL.rexec<CompletionResponse[]>(`fscomplete -- "${toBeCompleted}"`)).content
}

function doComplete(args: Arguments) {
  const last = args.command.substring(args.command.indexOf('-- ') + '-- '.length).replace(/^"(.*)"$/, '$1')

  // dirname will "foo" in the above example; it
  // could also be that last is itself the name
  // of a directory
  const lastIsDir = last.charAt(last.length - 1) === '/'
  const dirname = lastIsDir ? last : pathDirname(last)

  // debug('suggest local file', dirname, last)

  if (dirname) {
    // then dirname exists! now scan the directory so we can find matches
    return new Promise((resolve, reject) => {
      const dirToScan = expandHomeDir(dirname)
      readdir(dirToScan, async (err, files) => {
        if (err) {
          console.error('fs.readdir error', err)
          reject(err)
        } else {
          const partial = basename(last) + (lastIsDir ? '/' : '')
          const partialHasADot = partial.startsWith('.')

          const matches: string[] = files.filter(_f => {
            const f = _f

            // exclude dot files from tab completion, also emacs ~ temp files just for fun
            return (
              (lastIsDir || f.indexOf(partial) === 0) &&
              !f.endsWith('~') &&
              f !== '.' &&
              f !== '..' &&
              (partialHasADot || !f.startsWith('.'))
            )
          })

          // add a trailing slash to any matched directory names
          const lastHasPath = /\//.test(last)
          resolve({
            mode: 'raw',
            content: await Promise.all(
              matches.map(async match => {
                const completion = lastIsDir ? match : match.substring(partial.length)

                // show a special label only if we have a dirname prefix
                const label = lastHasPath ? basename(match) : undefined

                if (await isDirectory(join(dirToScan, match))) {
                  return { completion: `${completion}/`, label: label ? `${label}/` : undefined }
                } else {
                  return { completion, addSpace: true, label }
                }
              })
            )
          })
        }
      })
    })
  }
}

/**
 * Entry point to register tab completion handlers. Register this as a
 * very low priority enumerator. We don't want e.g. to enumerate files
 * when the user is doing a `git checkout myBran<tab>`.
 *
 */
export function preload() {
  registerTabCompletionEnumerator(completeLocalFiles, -100)
}

export function plugin(registrar: Registrar) {
  registrar.listen('/fscomplete', doComplete, { hidden: true, requiresLocal: true })
}
