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

import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import { Transformer } from 'unified'

import '@mdi/font/css/materialdesignicons.min.css'

export default function plugin() {
  const transformer: Transformer = ast => {
    // capture the :material-(xxx):(trailing whitespace)
    // as match[1] and match[2], respectively
    const RE_ICON = /^\s*:material-([^:]+):(\s*)$/

    visit(ast, 'text', function() {
      // ugh, typescript bug
      // https://github.com/microsoft/TypeScript/issues/46900 and we
      // have to disable the eslint check here, because rest ...args
      // still triggers the typescript bug
      const [node, childIdx, parent] = arguments // eslint-disable-line prefer-rest-params

      const match = node.value.match(RE_ICON)
      if (match) {
        parent.children[childIdx] = u(
          'element',
          {
            tagName: 'span',
            properties: {
              className: `mdi mdi-${match[1]}`
            }
          },
          match[2] ? [u('text', match[2])] : undefined
        ) // trailing whitespace...
      }
    })
  }

  return transformer
}
