/*
 * Copyright 2018 IBM Corporation
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

import * as Debug from 'debug'

import { Commands } from '@kui-shell/core'

import { preprocessTable, formatTable } from './formatTable'

const debug = Debug('k8s/view/helm-status')

/**
 * Approximate character width of the given table
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const width = (table: any[]): number => {
  return table.reduce((max, { name, attributes }) => {
    return Math.max(max, name.length + attributes.reduce((sum, { value }) => sum + value.length, 0))
  }, 0)
}

/**
 * Format the output of a helm status command
 *
 */
export const format = async (
  command: string,
  verb: string,
  entityType: string,
  options,
  response: string,
  execOptions: Commands.ExecOptions
) => {
  debug('nested?', execOptions.nested)
  debug('command', command)
  debug('verb', verb)
  debug('entityType', entityType)

  const [headerString, resourcesString, notesString] = response.split(/RESOURCES:|(?=NOTES:)/)

  const namespaceMatch = response.match(/^NAMESPACE:\s+(.*)$/m) || []
  const namespaceFromHelmStatusOutput = namespaceMatch[1]
  debug('namespace', namespaceFromHelmStatusOutput)

  // const namespaceFor = (entityType: string) => {
  const namespaceFor = () => {
    return namespaceFromHelmStatusOutput
  }

  const resources = resourcesString
    .split(/==>/)
    .map(_ => _.split(/[\n\r]/))
    .filter(A => A.length > 0 && A[0])
    .map(A => {
      const kind = A[0].trim()

      // "v1/pod(related)" => "pod"
      const entityType = kind.replace(/(v\w+\/)?([^()]*)(\s*\(.*\))?/, '$2')

      if (!/\s*NAME(\s+|$)/.test(A[1])) {
        // no header row? this seems to be a bug in helm
        const match = A[1].match(/(.+\s+)(.+)/)
        if (match && match[1]) {
          const secondColIdx = match[1].length
          const firstCol = 'NAME'
          const secondCol = 'AGE'
          const spaces = (nSpaces: number) => new Array(nSpaces).join(' ')
          const header = `${firstCol}${spaces(secondColIdx - firstCol.length)}${secondCol}`
          A.splice(1, 0, header)
        }
      }

      return {
        kind,
        table: formatTable(
          command,
          verb,
          entityType,
          Object.assign({}, options, { namespace: namespaceFor() }),
          preprocessTable([A.slice(1).join('\n')])[0]
        )
      }
    })

  debug('resources', resources)
  const resourcesOut = resources
    .map(({ kind, table }) => {
      table.title = kind
      return table
    })
    .sort((a, b) => {
      // number of columns
      const diff1 = a.header.attributes.length - b.header.attributes.length

      if (diff1 === 0) {
        return -(width(a.body) - width(b.body))
      } else {
        return -diff1
      }
    })

  const tables = Array.isArray(resourcesOut) ? { tables: resourcesOut } : resourcesOut
  if (execOptions.nested) {
    debug('returning tables for nested call', tables)
    return tables
  } else {
    const result: Commands.MixedResponse = []

    // helm status sometimes emits some text before the tables
    if (headerString) {
      result.push(await headerString)
    }

    result.push(await tables)

    // helm status sometimes emits a "Notes" section after the tables
    if (notesString) {
      result.push(await notesString)
    }

    return result
  }
}
