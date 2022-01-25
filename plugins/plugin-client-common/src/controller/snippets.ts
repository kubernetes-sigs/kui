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
import { isAbsolute as pathIsAbsolute, join as pathJoin } from 'path'
import { Arguments } from '@kui-shell/core'
import { loadNotebook } from '@kui-shell/plugin-client-common/notebook'

const debug = Debug('plugin-client-common/markdown/snippets')

const RE_SNIPPET = /^--(-*)8<--(-*)\s+"([^"]+)"(\s+"([^"]+)")?$/

function join(a: string, b: string) {
  if (/^https?:/.test(a)) {
    const url = new URL(a)
    url.pathname = join(url.pathname, b)
    return url.toString()
  } else {
    return pathJoin(a, b)
  }
}

function isAbsolute(uri: string): boolean {
  return /^https?:/.test(uri) || pathIsAbsolute(uri)
}

/**
 * Simplistic approximation of
 * https://facelessuser.github.io/pymdown-extensions/extensions/snippets/.
 */
export default function inlineSnippets(snippetBasePath?: string) {
  return async (data: string, srcFilePath, args: Pick<Arguments, 'REPL'>): Promise<string> =>
    Promise.all(
      data.split(/\n/).map(async line => {
        const match = line.match(RE_SNIPPET)
        if (!match) {
          return line
        } else {
          const snippetFileName = match[3]

          const getBasePath = (snippetBasePath: string) => {
            const basePath = match[5] || snippetBasePath

            return isAbsolute(basePath) ? basePath : srcFilePath ? join(srcFilePath, basePath) : undefined
          }

          const candidates = match[5]
            ? [match[5]]
            : snippetBasePath
            ? [snippetBasePath]
            : ['./', '../', '../snippets', '../../snippets']

          const snippetData = (
            await Promise.all(
              candidates
                .map(getBasePath)
                .filter(Boolean)
                .map(mySnippetBasePath =>
                  loadNotebook(join(mySnippetBasePath, snippetFileName), args).catch(err => {
                    debug('Warning: could not fetch inlined content', mySnippetBasePath, err)
                    return ''
                  })
                )
            ).then(_ => _.filter(Boolean))
          )[0]

          if (!snippetData) {
            return line
          } else {
            debug('successfully fetched inlined content')
            return typeof snippetData === 'string' ? snippetData : JSON.stringify(snippetData)
          }
        }
      })
    ).then(_ => _.join('\n'))
}
