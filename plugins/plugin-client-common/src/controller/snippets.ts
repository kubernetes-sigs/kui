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
import { Arguments, isError } from '@kui-shell/core'
import { loadNotebook } from '@kui-shell/plugin-client-common/notebook'

import { stripFrontmatter } from '../components/Content/Markdown/frontmatter-parser'

const debug = Debug('plugin-client-common/markdown/snippets')

const RE_SNIPPET = /^--(-*)8<--(-*)\s+"([^"]+)"(\s+"([^"]+)")?\s*$/

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
    url.pathname = pathJoin(url.pathname, b)
    return url.toString()
  } else {
    return pathJoin(a, b)
  }
}

export function isAbsolute(uri: string): boolean {
  return isUrl(uri) || pathIsAbsolute(uri)
}

function toString(data: string | object) {
  return (typeof data === 'string' ? data : JSON.stringify(data)).replace(/\n$/, '')
}

function indent(str: string) {
  return str
    .split(/\n/)
    .map(_ => `    ${_}`)
    .join('\n')
}

/** Rewrite any relative <img> and <a> links to use the given basePath */
function rerouteLinks(basePath: string, data: string) {
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
            try {
              const basePath = match[5] || snippetBasePath

              return isAbsolute(basePath) ? basePath : srcFilePath ? join(srcFilePath, basePath) : undefined
            } catch (err) {
              debug(err)
              return undefined
            }
          }

          // Call ourselves recursively, in case a fetched snippet
          // fetches other files. We also may need to reroute relative
          // <img> and <a> links according to the given `basePath`.
          const recurse = (basePath: string, data: string) => {
            // Note: intentionally using `snippetBasePath` for the
            // first argument, as this represents the "root" base
            // path, either from the URL of the original filepath (we
            // may be recursing here) or from the command line or from
            // the topmatter of the original document. The second
            // represents the current base path in the recursion.
            const base = isAbsolute(basePath) ? basePath : snippetBasePath
            return inlineSnippets(base)(rerouteLinks(base, data), snippetFileName, args)
          }

          const candidates = match[5]
            ? [match[5]]
            : ['./', snippetBasePath, '../', '../snippets', '../../snippets'].filter(Boolean)

          const snippetDatas = isUrl(snippetFileName)
            ? [
                await loadNotebook(snippetFileName, args)
                  .then(data => recurse(snippetBasePath || dirname(snippetFileName), toString(data)))
                  .catch(err => {
                    debug('Warning: could not fetch inlined content 1', snippetBasePath, snippetFileName, err)
                    return err
                  })
              ]
            : await Promise.all(
                candidates
                  .map(getBasePath)
                  .filter(Boolean)
                  .map(myBasePath => ({
                    myBasePath,
                    filepath: join(myBasePath, snippetFileName)
                  }))
                  .filter(_ => _ && _.filepath !== srcFilePath) // avoid cycles
                  .map(({ myBasePath, filepath }) =>
                    loadNotebook(filepath, args)
                      .then(data => recurse(myBasePath, toString(data)))
                      .catch(err => {
                        debug('Warning: could not fetch inlined content 2', myBasePath, err)
                        return err
                      })
                  )
              ).then(_ => _.filter(Boolean))

          const snippetData =
            snippetDatas.find(_ => _ && !isError(_)) ||
            snippetDatas.find(_ => isError(_) && !/ENOTDIR/.test(_.message)) ||
            snippetDatas[0]

          if (!snippetData) {
            return line
          } else if (isError(snippetData)) {
            return `??? bug "Could not fetch snippet ${snippetFileName}"
${indent(snippetData.message)}`
          } else {
            debug('successfully fetched inlined content', snippetFileName)

            // for now, we completely strip off the topmatter from
            // snippets. TODO?
            return stripFrontmatter(toString(snippetData))
          }
        }
      })
    ).then(_ => _.join('\n'))
}
