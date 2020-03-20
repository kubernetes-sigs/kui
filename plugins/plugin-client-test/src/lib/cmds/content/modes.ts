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

import { MultiModalMode } from '@kui-shell/core'

import htmlTextContent from './text-html'
import plainTextContent from './text-plain'
import markdownTextContent from './text-markdown'

// string from content function
export const plainTextMode: MultiModalMode[] = [{ mode: 'text', label: 'T1', content: plainTextContent }]

// string directly as content
export const plainTextModeAlt: MultiModalMode[] = [{ mode: 'text2', label: 'T2', content: 'plain as day' }]

// string directly as content function string
// this should take the output of the `test string` command and place it in the mode content section
export const plainTextModeAlt2: MultiModalMode[] = [{ mode: 'text3', label: 'T3', contentFrom: 'test string' }]

// string directly as content function string, with contentType
// this should take the output of the `test string` command and place it in the mode content section
export const plainTextModeAlt3: MultiModalMode[] = [
  { mode: 'text4', label: 'T4', contentFrom: 'test markdown', contentType: 'text/markdown' }
]

const createRows = (length: number) => {
  const rows = []
  for (let num = 1; num <= length; num++) {
    rows.push({ name: `c_${num}_1`, attributes: [{ value: `c_${num}_2` }] })
  }
  return rows
}

// table directly as content
export const tableMode: MultiModalMode[] = [
  {
    mode: 'table',
    label: 'Tbl1',
    content: {
      body: createRows(25)
    }
  }
]

// html string
const htmlTextMode: MultiModalMode[] = [
  { mode: 'html', label: 'H', content: htmlTextContent(), contentType: 'text/html' }
]

const markdownTextMode: MultiModalMode[] = [{ mode: 'm', content: markdownTextContent(), contentType: 'text/markdown' }]

const yamlMode: MultiModalMode[] = [
  {
    mode: 'yaml',
    label: 'R',
    content: 'apiVersion: this is the api version field\nkind: this is the kind field',
    contentType: 'yaml'
  }
]

/** string content as function mode first */
export const modes1: MultiModalMode[] = [].concat(
  plainTextMode,
  plainTextModeAlt,
  plainTextModeAlt2,
  plainTextModeAlt3,
  tableMode,
  htmlTextMode,
  markdownTextMode,
  yamlMode
)

/** table mode first */
export const modes2: MultiModalMode[] = [].concat(
  tableMode, // swapped to first
  plainTextModeAlt,
  plainTextModeAlt2,
  plainTextModeAlt3,
  plainTextMode, // swapped with tableMode
  htmlTextMode,
  markdownTextMode,
  yamlMode
)

/** plain string content mode first */
export const modes3: MultiModalMode[] = [].concat(
  plainTextModeAlt, // swapped to first
  plainTextMode, // swapped with plainTextModeAlt
  plainTextModeAlt2,
  plainTextModeAlt3,
  tableMode,
  htmlTextMode,
  markdownTextMode,
  yamlMode
)

/** command string mode first */
export const modes4: MultiModalMode[] = [].concat(
  plainTextModeAlt2, // swapped to first
  plainTextModeAlt,
  plainTextMode, // swapped with plainTextModeAlt2
  plainTextModeAlt3,
  tableMode,
  htmlTextMode,
  markdownTextMode,
  yamlMode
)

/** html string mode first */
export const modes5: MultiModalMode[] = [].concat(
  htmlTextMode, // swapped to first
  plainTextModeAlt,
  plainTextModeAlt2,
  plainTextModeAlt3,
  tableMode,
  plainTextMode, // swapped with htmlTextMode
  markdownTextMode,
  yamlMode
)

export const modeOrderVariants = [modes1, modes2, modes3, modes4, modes5]
