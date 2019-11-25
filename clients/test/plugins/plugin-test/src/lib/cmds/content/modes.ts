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

import { UI } from '@kui-shell/core'

import htmlTextContent from './text-html'
import plainTextContent from './text-plain'
import markdownTextContent from './text-markdown'

// string from content function
export const plainTextMode: UI.MultiModalMode[] = [{ mode: 'text', label: 'T1', content: plainTextContent() }]

// string directly as content
export const plainTextModeAlt: UI.MultiModalMode[] = [{ mode: 'text2', label: 'T2', content: 'plain as day' }]

// html string
const htmlTextMode: UI.MultiModalMode[] = [
  { mode: 'html', label: 'H', content: htmlTextContent(), contentType: 'text/html' }
]

const markdownTextMode: UI.MultiModalMode[] = [
  { mode: 'm', content: markdownTextContent(), contentType: 'text/markdown' }
]

const yamlMode: UI.MultiModalMode[] = [
  {
    mode: 'yaml',
    label: 'R',
    content: 'apiVersion: this is the api version field\nkind: this is the kind field',
    contentType: 'yaml'
  }
]

export const textModes: UI.MultiModalMode[] = [].concat(
  plainTextMode,
  plainTextModeAlt,
  htmlTextMode,
  markdownTextMode,
  yamlMode
)
