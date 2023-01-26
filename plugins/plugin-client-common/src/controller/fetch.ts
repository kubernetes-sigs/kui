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

import { basename, dirname as pathDirname, join as pathJoin } from 'path'

import type { Arguments, CommentaryResponse } from '@kui-shell/core'
import { loadNotebook } from '@kui-shell/plugin-client-common/notebook'

function isUrl(a: string) {
  return /^https?:/.test(a)
}

function dirname(a: string) {
  if (isUrl(a)) {
    const url = new URL(a)
    url.pathname = pathDirname(url.pathname)
    return url.toString()
  } else {
    return pathDirname(a)
  }
}

export function join(a: string, b: string) {
  if (isUrl(a)) {
    const url = new URL(a)
    url.pathname = pathJoin(url.pathname, b)
    return url.toString()
  } else {
    return pathJoin(a, b)
  }
}

export function filepathForResponses(filepath: string) {
  return join(dirname(filepath), basename(filepath).replace(/\..*$/, '') + '.json')
}

export default async function fetchMarkdownFile(filepath: string, args: Pick<Arguments, 'REPL'>) {
  const [data, codeBlockResponses] = await Promise.all([
    loadNotebook(filepath, args),
    loadNotebook(filepathForResponses(filepath), args, true)
  ])

  return {
    data: typeof data === 'string' ? data : JSON.stringify(data),
    codeBlockResponses: (typeof codeBlockResponses === 'string'
      ? JSON.parse(codeBlockResponses)
      : codeBlockResponses) as CommentaryResponse['props']['codeBlockResponses']
  }
}
