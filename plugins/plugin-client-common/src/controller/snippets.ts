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
import { isAbsolute as pathIsAbsolute, dirname as pathDirname, join as pathJoin } from 'path'
import { Arguments } from '@kui-shell/core'
import { loadNotebook } from '@kui-shell/plugin-client-common/notebook'

import { stripFrontmatter } from '../components/Content/Markdown/frontmatter'

const debug = Debug('plugin-client-common/markdown/snippets')

const RE_SNIPPET = /^--(-*)8<--(-*)\s+"([^"]+)"(\s+"([^"]+)")?$/

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

function join(a: string, b: string) {
  if (isUrl(a)) {
    const url = new URL(a)
    url.pathname = join(url.pathname, b)
    return url.toString()
  } else {
    return pathJoin(a, b)
  }
}

function isAbsolute(uri: string): boolean {
  return isUrl(uri) || pathIsAbsolute(uri)
}

function toString(data: string | object) {
  return typeof data === 'string' ? data : JSON.stringify(data)
}

/** Rewrite any relative image links to use the given basePath */
function rerouteImageLinks(basePath: string, data: string) {
  return data.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g, // e.g. [linky](https://linky.com)
    (_, p1, p2) => {
      return `[${p1}](${isAbsolute(p2) ? p2 : join(basePath, p2)})`
    }
  )
}

/**
 * Simplistic approximation of
 * https://facelessuser.github.io/pymdown-extensions/extensions/snippets/.
 */
export default function inlineSnippets(snippetBasePath?: string) {
  return async (data: string, srcFilePath: string, args: Pick<Arguments, 'REPL'>): Promise<string> =>
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

          // Call ourselves recursively, in case a fetched snippet
          // fetches other files. We also may need to reroute relative
          // image links according to the given `basePath`.
          const recurse = (basePath: string, data: string) => {
            return inlineSnippets(basePath)(rerouteImageLinks(basePath, data), snippetFileName, args)
          }

          const candidates = match[5]
            ? [match[5]]
            : snippetBasePath
            ? [snippetBasePath]
            : ['./', '../', '../snippets', '../../snippets']

          const snippetData = isUrl(snippetFileName)
            ? await loadNotebook(snippetFileName, args)
                .then(data => recurse(snippetBasePath || dirname(snippetFileName), toString(data)))
                .catch(err => {
                  debug('Warning: could not fetch inlined content', snippetFileName, err)
                  return ''
                })
            : (
                await Promise.all(
                  candidates
                    .map(getBasePath)
                    .filter(Boolean)
                    .map(mySnippetBasePath =>
                      loadNotebook(join(mySnippetBasePath, snippetFileName), args)
                        .then(data => recurse(mySnippetBasePath, toString(data)))
                        .catch(err => {
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

            // for now, we completely strip off the topmatter from
            // snippets. TODO?
            return stripFrontmatter(toString(snippetData))
          }
        }
      })
    ).then(_ => _.join('\n'))
}
