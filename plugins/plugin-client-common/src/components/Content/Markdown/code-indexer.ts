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

import { visit } from 'unist-util-visit'
import { CodeProps } from 'react-markdown/lib/ast-to-react'

export function isExecutableCodeBlock(props: CodeProps) {
  // react-markdown v6+ places the language in the className
  const match = /language-(\w+)/.exec(props.className || '')
  const language = match ? match[1] : undefined

  return /^(bash|sh|shell)$/.test(language)
}

/**
 * This rehype plugin adds a unique codeIdx ordinal property to each
 * executable code block.
 */
function transformer(ast) {
  let codeIdx = 0

  function visitor(node) {
    if (node.tagName === 'code' && isExecutableCodeBlock(node.properties)) {
      node.properties.codeIdx = codeIdx++
    }
  }

  visit(ast, 'element', visitor)
}

function plugin() {
  return transformer
}

export default plugin
