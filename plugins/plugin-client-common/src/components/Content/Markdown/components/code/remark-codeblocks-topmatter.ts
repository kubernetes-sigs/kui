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

import { Node } from 'hast'
import { Code } from 'mdast'
import { visit } from 'unist-util-visit'

import dump from './dump'
import { tryFrontmatter } from '../../frontmatter'
import KuiFrontmatter, { hasCodeBlocks } from '../../KuiFrontmatter'

function isCode(node: Node): node is Code {
  return node.type === 'code' && typeof (node as Code).value === 'string'
}

/** Scan and process the `codeblocks` schema of the given `frontmatter` */
export default function preprocessCodeBlocks(tree /*: Root */, frontmatter: KuiFrontmatter) {
  if (hasCodeBlocks(frontmatter)) {
    const codeblocks = frontmatter.codeblocks.map(_ =>
      Object.assign({}, _, { match: new RegExp(_.match.replace(/\./g, '\\.')) })
    )

    visit(tree, 'code', node => {
      if (isCode(node)) {
        const matched = codeblocks.find(_ => _.match.test(node.value))

        if (matched) {
          if (matched.language) {
            // smash in a code block language (this would be the ```${language} part of the text)
            node.lang = matched.language
          }

          if (matched.optional !== undefined || matched.validate || matched.cleanup) {
            const { body, attributes } = tryFrontmatter(node.value)

            attributes.optional = matched.optional

            if (matched.validate) {
              // smash in validation logic; this is done in the
              // topmatter of the code block, and parsed out by rehype-code-indexer
              attributes.validate = matched.validate
            }

            if (matched.cleanup) {
              // smash in cleanup logic; this is done in the
              // topmatter of the code block, and parsed out by rehype-code-indexer
              attributes.cleanup = matched.cleanup
            }

            node.value = dump(attributes, body)
          }
        }
      }
    })
  }
}
