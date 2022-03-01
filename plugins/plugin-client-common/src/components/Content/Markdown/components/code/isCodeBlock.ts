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

import { Element } from 'hast'

export default function isExecutable(language: string) {
  return /^(bash|sh|shell)$/.test(language)
}

export function isExecutableCodeBlock(node: Element) {
  if (node.tagName === 'code') {
    // react-markdown v6+ places the language in the className
    const match = node.properties.className ? /language-(\w+)/.exec(node.properties.className.toString()) : ''
    const language = match ? match[1] : undefined

    return isExecutable(language)
  } else {
    return false
  }
}
