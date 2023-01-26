/*
 * Copyright 2017 The Kubernetes Authors
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

import { basename, dirname as pathDirname } from 'path'
import type { Tab, Arguments, CommandLine, Registrar, TabCompletionSpec, CompletionResponse } from '@kui-shell/core'

import { ls } from '../vfs/delegates'
import { GlobStats } from '../lib/glob'

function findMatchingFilesFrom(
  files: GlobStats[],
  dirToScan: string,
  last: string,
  lastIsDir: boolean
): CompletionResponse[] {
  const partial = basename(last) + (lastIsDir ? '/' : '')
  const partialHasADot = partial.startsWith('.')

  const matches = files.filter(_f => {
    const f = _f.name

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
  return matches.map(matchStats => {
    const match = matchStats.nameForDisplay
    const completion = lastIsDir ? match : match.substring(partial.length)

    // show a special label only if we have a dirname prefix
    const label = lastHasPath ? basename(matchStats.nameForDisplay) : undefined

    if (matchStats.dirent.isDirectory || matchStats.dirent.isSymbolicLink) {
      return {
        completion: !/\/$/.test(completion) ? `${completion}/` : completion,
        label: label ? (!/\/$/.test(label) ? `${label}/` : label) : undefined
      }
    } else {
      return { completion, addSpace: true, label }
    }
  })
}

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

async function doComplete(args: Arguments) {
  const last = args.command.substring(args.command.indexOf('-- ') + '-- '.length).replace(/^"(.*)"$/, '$1')

  // dirname will "foo" in the above example; it
  // could also be that last is itself the name
  // of a directory
  const lastIsDir = last.charAt(last.length - 1) === '/'
  const dirname = lastIsDir ? last : pathDirname(last)

  if (dirname) {
    const { expandHomeDir } = await import('@kui-shell/core/mdist/api/Util')
    try {
      // Note: by passing a: true, we effect an `ls -a`, which will give us dot files
      const dirToScan = expandHomeDir(dirname)
      const fileList = await ls({ tab: args.tab, REPL: args.REPL, parsedOptions: { a: true } }, [dirToScan])
      const _matchingFiles = findMatchingFilesFrom(await fileList, dirToScan, last, lastIsDir)
      const matchingFiles = _matchingFiles && _matchingFiles.length !== 0 ? _matchingFiles : []

      return {
        mode: 'raw',
        content: matchingFiles
      }
    } catch (err) {
      console.error('tab completion vfs.ls error', err)
      throw err
      //      return {
      //        mode: 'raw',
      //        content: doCompleteWithMounts(last, err)
      //      }
    }
  }
}

/**
 * Entry point to register tab completion handlers. Register this as a
 * very low priority enumerator. We don't want e.g. to enumerate files
 * when the user is doing a `git checkout myBran<tab>`.
 *
 */
export async function preload() {
  const { registerTabCompletionEnumerator } = await import('@kui-shell/core/mdist/api/TabCompletion')
  registerTabCompletionEnumerator(completeLocalFiles, -100)
}

export function plugin(registrar: Registrar) {
  registrar.listen('/fscomplete', doComplete, { hidden: true, requiresLocal: true })
}
