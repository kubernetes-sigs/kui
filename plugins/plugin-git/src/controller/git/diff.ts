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

import {
  Arguments,
  i18n,
  KResponse,
  Registrar,
  SupportedStringContent,
  Mode,
  MultiModalResponse,
  Util
} from '@kui-shell/core'
import { doExecWithPty } from '@kui-shell/plugin-bash-like'
import { File, FStat } from '@kui-shell/plugin-bash-like/fs'

import { basename, dirname } from 'path'

const strings = i18n('plugin-git')

/** Important for alignment to the Editor view component */
function contentTypeOf(suffix: string): SupportedStringContent {
  switch (suffix) {
    case 'sh':
      return 'shell'
    case 'md':
      return 'text/markdown'
    case 'html':
      return 'text/html'
    case 'yaml':
    case 'json':
      return suffix
    default:
      return 'text/plain'
  }
}

async function gitDiff(args: Arguments): Promise<KResponse> {
  try {
    const { argvNoOptions, REPL } = args
    const filepath = argvNoOptions[argvNoOptions.indexOf('diff') + 1]
    const fullpath = Util.absolute(Util.expandHomeDir(filepath))
    const name = basename(filepath)
    const suffix = filepath.substring(filepath.lastIndexOf('.') + 1)
    const enclosingDirectory = dirname(filepath)
    const packageName = enclosingDirectory === '.' ? undefined : enclosingDirectory
    const contentType = contentTypeOf(suffix)

    const [previousCommit, workingTree] = await Promise.all([
      REPL.qexec<string>(`git show HEAD:${filepath}`),
      REPL.rexec<FStat>(`vfs fstat ${REPL.encodeComponent(filepath)} --with-data`)
    ])

    const mode: Mode = {
      mode: 'git diff',
      label: strings('Git Diff'),
      content: { a: previousCommit, b: workingTree.content.data },
      contentType
    }

    const response: MultiModalResponse<File> = {
      apiVersion: 'kui-shell/v1',
      kind: 'File',
      metadata: {
        name,
        namespace: packageName
      },
      toolbarText: { type: 'info', text: strings('Showing changes between the working tree and previous commit.') },
      modes: [mode],
      spec: {
        filepath,
        fullpath,
        size: workingTree.content.size
      }
    }

    return response
  } catch (err) {
    console.error('failed at git diff', err)
    return doExecWithPty(args)
  }
}

export default function(registrar: Registrar) {
  registrar.listen('/git/diff', gitDiff)
}
