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
import '@fortawesome/fontawesome-free/css/all.min.css'

function load(provider: string) {
  if (provider === 'fontawesome') {
    import('@fortawesome/fontawesome-free')
  }
}

export default function plugin() {
  const transformer: Transformer = ast => {
    // match[1]: provider (material, fontawesome, ...)
    // match[2]: variant (e.g. -solid for fontawesome solid)
    // match[3]: icon name
    const RE_ICON = /:(badge|material|fontawesome)(-solid|-ok|-warning|-error)?-([^:]+):/g

    visit(ast, 'text', function () {
      // ugh, typescript bug
      // https://github.com/microsoft/TypeScript/issues/46900 and we
      // have to disable the eslint check here, because rest ...args
      // still triggers the typescript bug
      const [node, childIdx, parent] = arguments // eslint-disable-line prefer-rest-params

      const children = []
      let curIndex = 0
      for (const match of node.value.matchAll(RE_ICON)) {
        const [matched, provider, variant, icon] = match
        load(provider)

        if (match.index > curIndex) {
          children.push(u('text', node.value.slice(curIndex, match.index)))
        }

        children.push(
          u(
            'element',
            {
              tagName: provider === 'badge' ? 'tag' : provider === 'fontawesome' ? 'i' : 'span',
              properties: {
                variant: variant ? variant.slice(1) : undefined,
                className:
                  provider === 'material'
                    ? `kui--markdown-icon mdi mdi-${icon}`
                    : provider === 'fontawesome'
                    ? `kui--markdown-icon fa${variant ? variant[1] : 's'} fa-${icon}`
                    : undefined
              }
            },
            provider === 'badge' ? [u('text', icon)] : undefined
          )
        )

        curIndex = match.index + matched.length
      }

      if (children.length > 0) {
        if (curIndex < node.value.length) {
          children.push(u('text', node.value.slice(curIndex)))
        }

        parent.children.splice(childIdx, 1, ...children)
      }
    })
  }

  return transformer
}
