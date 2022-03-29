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

import { Node, Parent } from 'unist'
import { Element, ElementContent } from 'hast'

export function isParent(node: Node): node is Parent {
  return Array.isArray((node as Parent).children)
}

export function isElement(_: Node | Parent | ElementContent): _ is Element {
  const elt = _ as Element
  return elt && typeof elt.tagName === 'string'
}

export default function isElementWithProperties(_: Element | ElementContent | Parent | Node): _ is Element {
  return isElement(_) && _.properties !== undefined
}
