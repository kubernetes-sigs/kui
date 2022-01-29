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

import { Parent } from 'unist'
import { Element, Root } from 'hast'
import { visitParents as visit } from 'unist-util-visit-parents'

import { tryFrontmatter } from '../../frontmatter'

function isExecutableCodeBlock(language: string) {
  return /^(bash|sh|shell)$/.test(language)
}

function isElementWithProperties(_: Parent): _ is Element {
  const elt = _ as Element
  return typeof elt.tagName === 'string' && elt.properties !== undefined
}

/**
 * This rehype plugin adds a unique codeIdx ordinal property to each
 * executable code block.
 */
export default function plugin(uuid: string) {
  return (ast: Root) => {
    let codeIdx = 0

    visit<Element>(ast, 'element', function visitor(node, ancestors) {
      if (node.tagName === 'code') {
        // react-markdown v6+ places the language in the className
        const match = node.properties.className ? /language-(\w+)/.exec(node.properties.className.toString()) : ''
        const language = match ? match[1] : undefined

        if (isExecutableCodeBlock(language)) {
          const myCodeIdx = codeIdx++
          node.properties.codeIdx = myCodeIdx

          if (node.children.length === 1 && node.children[0].type === 'text') {
            const code = String(node.children[0].value).trim()
            const { body, attributes } = tryFrontmatter(code)

            if (typeof attributes === 'object' && !attributes.id) {
              // assign a codeBlockId if the author did not specify one
              attributes.id = `${uuid}-${myCodeIdx}`
            }

            const codeBlockProps = Buffer.from(JSON.stringify(Object.assign({ body, language }, attributes))).toString(
              'base64'
            )
            ancestors.forEach(_ => {
              if (isElementWithProperties(_) && Array.isArray(_.properties.containedCodeBlocks)) {
                _.properties.containedCodeBlocks.push(codeBlockProps)
              }
            })
          }
        }
      }
    })
  }
}
