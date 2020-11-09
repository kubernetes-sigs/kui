/*
 * Copyright 2020 IBM Corporation
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

import { Entity } from './entity'
import { SupportedStringContent } from './mmr/content-types'

export type TreeItem = {
  /** unique string to distinguish a tree item */
  id: string

  /** label of a tree item */
  name: string

  /** content of a tree item */
  content: string

  /** type of the tree item content */
  contentType: SupportedStringContent

  /** Child nodes of a tree item */
  children?: TreeItem[]

  /** Flag indicating if node is expanded by default */
  defaultExpanded?: boolean
}

export interface TreeResponse {
  apiVersion: 'kui-shell/v1'
  kind: 'TreeResponse'

  /** data of a `TreeResponse` */
  data: TreeItem[]
}

export function isTreeResponse(entity: Entity): entity is TreeResponse {
  const tree = entity as TreeResponse
  return (
    tree.apiVersion === 'kui-shell/v1' &&
    tree.kind === 'TreeResponse' &&
    tree.data &&
    Array.isArray(tree.data) &&
    tree.data.length > 0
  )
}
