/*
 * Copyright 2019 IBM Corporation
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

import { CommandOptions } from '@kui-shell/core'

const defaultBooleans = [
  'w',
  'watch',
  'watch-only',
  'A',
  'all-namespaces',
  'ignore-not-found',
  'no-headers',

  'i',
  'it',
  'ti',
  'stdin',

  't',
  'tty',

  'R',
  'recursive',

  'server-print',
  'show-kind',
  'show-labels'
]

export function flags(booleans: string[] = []): CommandOptions {
  return {
    flags: {
      configuration: {
        // disable yargs-parser being clever with -lapp=name
        'short-option-groups': false
      },
      // Notes on narg: to prevent yargs-parser from processing "--watch true" into watch:true
      narg: { w: 0, watch: 0, 'watch-only': 0 },
      boolean: booleans.concat(defaultBooleans)
    }
  }
}

const defaultFlags = flags()

export const crudFlags = Object.assign({}, flags(), { alwaysViewIn: 'Terminal' })

export default defaultFlags
