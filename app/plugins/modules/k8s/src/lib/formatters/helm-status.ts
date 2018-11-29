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

const debug = require('debug')('k8s/formatters/helm-status')

import { preprocessTable, formatTable } from './formatTable'

/**
 * Approximate character width of the given table
 *
 */
const width = (table: Array<any>): number => {
  return table.reduce((max, { name, attributes }) => {
    return Math.max(max,
                        name.length + attributes.reduce((sum, { value }) => sum + value.length, 0))
  }, 0)
}

/**
 * Format the output of a helm status command
 *
 */
export const format = (command: string, verb: string, entityType: string, options, response: string) => {
  const [ headerString, resourcesString, notesString ] = response.split(/RESOURCES:|NOTES:/)

  const resources = resourcesString
        .split(/==>/)
        .map(_ => _.split(/[\n\r]/))
        .filter(A => A.length > 0 && A[0])
        .map(A => ({
          kind: A[0].trim(),
          table: formatTable(command, verb, entityType, options, preprocessTable([A.slice(1).join('\n')]))[0]
        }))
  debug('resources', resources)

  return resources
        .map(({ kind, table }) => {
          table[0].title = kind
          table[0].flexWrap = true
          return table
        }).sort((a, b) => {
            // number of columns
          const diff1 = a[0].attributes.length - b[0].attributes.length

          if (diff1 === 0) {
            return - (width(a) - width(b))
          } else {
            return -diff1
          }
        })
}
