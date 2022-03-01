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

import { hasImports } from '../components/Content/Markdown/KuiFrontmatter'
import { tryFrontmatter } from '../components/Content/Markdown/frontmatter-parser'

const debug = Debug('plugin-client-common/markdown/snippets')

const RE_IMPORT = /^(\s*):import{(.*)}\s*$/
//                 [1]          [2]
//                  \- [1] leading whitespace
//                               \- filepath to import

const RE_SNIPPET = /^(\s*)--(-*)8<--(-*)\s+"([^"]+)"(\s+"([^"]+)")?\s*$/
//                 [1]    [2]      [3]      [4]         [6]
//                  \- [1] leading whitespace
//                                           \- [4] snippet file name
//                                                       \- [6] deprecated

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

function indent(str: string, indentation = '    ') {
  return str
    .split(/\n/)
    .map(_ => `${indentation}${_}`)
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
 * We want to use remark-directive's `:::` syntax for container
 * directives. It does support nested containers, but the outer
 * containers have to have *more* colons than the inner
 * ones. Ugh. Since we can't predict the maximum nesting depth in
 * advance, this means we need to pick an aribtrary start point, and
 * thus have an unfortunate maximum supported nesting depth.
 *
 * reference:
 * https://github.com/micromark/micromark-extension-directive#syntax
 */
function colonColonColon(nestingDepth: number) {
  const MAX = 100
  return new Array(Math.max(3, MAX - nestingDepth)).join(':')
}

/**
 * Simplistic approximation of
 * https://facelessuser.github.io/pymdown-extensions/extensions/snippets/.
 */
export default function inlineSnippets(
  args: Pick<Arguments, 'REPL'>,
  snippetBasePath?: string,
  includeFrontmatter = true,
  nestingDepth = 0,
  inImport = false
) {
  const fetchRecursively = async (
    snippetFileName: string,
    srcFilePath: string,
    provenance: string[],
    optionalSnippetBasePathInSnippetLine?: string,
    nestingDepth = 0,
    inImport = false
  ) => {
    const getBasePath = (snippetBasePath: string) => {
      try {
        const basePath = optionalSnippetBasePathInSnippetLine || snippetBasePath

        return isAbsolute(basePath) ? basePath : srcFilePath ? join(srcFilePath, basePath) : undefined
      } catch (err) {
        debug(err)
        return undefined
      }
    }

    // Call ourselves recursively, in case a fetched snippet
    // fetches other files. We also may need to reroute relative
    // <img> and <a> links according to the given `basePath`.
    const recurse = async (basePath: string, recursedSnippetFileName: string, data: string) => {
      // Note: intentionally using `snippetBasePath` for the
      // first argument, as this represents the "root" base
      // path, either from the URL of the original filepath (we
      // may be recursing here) or from the command line or from
      // the topmatter of the original document. The second
      // represents the current base path in the recursion.
      const base = isAbsolute(basePath) || !snippetBasePath ? basePath : snippetBasePath
      return inlineSnippets(
        args,
        base,
        inImport,
        nestingDepth + 1,
        inImport
      )(rerouteLinks(base, data), recursedSnippetFileName, provenance)
    }

    const candidates = optionalSnippetBasePathInSnippetLine
      ? [optionalSnippetBasePathInSnippetLine]
      : [
          './',
          snippetBasePath,
          '../',
          '../snippets',
          '../../snippets',
          '../../../snippets',
          '../../../../snippets',
          '../../',
          '../../../'
        ].filter(Boolean)

    debug(
      'Candidates',
      snippetFileName,
      candidates,
      candidates.map(getBasePath).map(myBasePath => ({
        myBasePath,
        filepath: join(myBasePath, snippetFileName)
      }))
    )

    const snippetDatas = isUrl(snippetFileName)
      ? [
          await loadNotebook(snippetFileName, args)
            .then(async data => ({
              filepath: snippetFileName,
              snippetData: await recurse(snippetBasePath || dirname(snippetFileName), snippetFileName, toString(data))
            }))
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
                .then(async data => ({ filepath, snippetData: await recurse(myBasePath, filepath, toString(data)) }))
                .catch(err => {
                  debug('Warning: could not fetch inlined content 2', myBasePath, snippetFileName, err)
                  return err
                })
            )
        ).then(_ => _.filter(Boolean))

    const snippetData =
      snippetDatas.find(_ => _.snippetData !== undefined && !isError(_.snippetData)) ||
      snippetDatas.find(_ => isError(_.snippetData) && !/ENOTDIR/.test(_.snippetData.message)) ||
      snippetDatas[0]

    if (isError(snippetData)) {
      debug('Error: completely failed to fetch inlined content', snippetFileName, snippetDatas)
    } else {
      debug('Success in fetch inline content', snippetFileName, snippetDatas)
    }

    return snippetData
  }

  const oops404 = (snippetFileName: string, errorMessage = 'Failed to fetch this file') => {
    return `??? bug "Could not fetch snippet ${snippetFileName}"
${indent(errorMessage)}`
  }

  const processImport = async (snippetFileName: string, srcFilePath: string, provenance: string[]) => {
    const { filepath, snippetData } = await fetchRecursively(
      snippetFileName,
      srcFilePath,
      provenance.concat([snippetFileName]),
      undefined,
      nestingDepth + 1,
      true
    )

    if (snippetData === undefined) {
      return oops404(snippetFileName)
    }

    const { attributes, body, bodyBegin } = tryFrontmatter(snippetData)

    const attributesEnc = bodyBegin === 0 ? '' : encodeURIComponent(JSON.stringify(attributes))

    // remark-directive uses ::: to indicate container directives,
    // i.e. directives that allow one to mark a block of text as
    // "contained" bythe directive, e.g.
    // :::import{key1=value1 key2=value2}
    // ...import content...
    // :::
    const colons = colonColonColon(nestingDepth)
    return `
${colons}import{provenance=${provenance.concat([snippetFileName])} filepath=${filepath} attributes=${attributesEnc}${
      attributes.title ? ` title="${attributes.title}"` : ''
    }}
${body}
${colons}
<!-- hack: working around a bug in the directive parser for ${snippetFileName} -->
`
  }

  return async (data: string, srcFilePath: string, provenance: string[] = []): Promise<string> => {
    const { body, attributes } = tryFrontmatter(data)

    let importedContent: Promise<string>
    if (hasImports(attributes)) {
      importedContent = Promise.all(attributes.imports.map(_ => processImport(_, srcFilePath, provenance))).then(_ =>
        _.join('\n')
      )
    }

    const mainContent = await Promise.all(
      (includeFrontmatter ? data : body).split(/\n/).map(async line => {
        const match = line.match(RE_SNIPPET)
        if (!match) {
          const matchImport = line.match(RE_IMPORT)
          if (matchImport) {
            const indentation = matchImport[1]
            const snippetFileName = matchImport[2]
            return indent(await processImport(snippetFileName, srcFilePath, provenance), indentation)
          } else {
            return line
          }
        } else {
          const indentation = match[1]
          const snippetFileName = match[4]
          const optionalSnippetBasePathInSnippetLine = match[6]

          const { snippetData } = await fetchRecursively(
            snippetFileName,
            srcFilePath,
            provenance,
            optionalSnippetBasePathInSnippetLine,
            nestingDepth + 1,
            inImport
          )

          if (snippetData === undefined) {
            return line
          } else if (isError(snippetData)) {
            return oops404(snippetFileName, snippetData.message)
          } else {
            debug('successfully fetched inlined content', snippetFileName)
            return indent(toString(snippetData), indentation)
          }
        }
      })
    ).then(_ => _.join('\n'))

    if (!importedContent || (await importedContent).length === 0) {
      return mainContent
    } else {
      const { body, bodyBegin } = tryFrontmatter(mainContent)
      const topmatter =
        !includeFrontmatter || bodyBegin === 0
          ? ''
          : mainContent
              .split(/\n/)
              .slice(0, bodyBegin - 1)
              .join('\n')

      return `${topmatter}

<!-- Begin imported content for ${srcFilePath} -->

${await importedContent}

<!-- End imported content for ${srcFilePath} -->

${body}`
    }
  }
}
