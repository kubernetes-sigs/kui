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
import { Button } from './mmr/types'
import { ToolbarText } from '../webapp/views/toolbar-text'

export type TreeItem = {
  /**
   * Unique string to distinguish a tree item.
   * Note: failing to provide this will result in
   * PatternFly TreeView error in finding active item
   *
   */
  id: string

  /** label of a tree item */
  name: string

  /** content of a tree item */
  content: string

  /** modifed content of a tree item */
  modifiedContent?: string

  /** diff: will this item be added by later operations? */
  willBeAdded?: boolean

  /** diff: will this item be deleted by later operations ? */
  willBeDeleted?: boolean

  /** type of the tree item content */
  contentType: SupportedStringContent

  /** Child nodes of a tree item */
  children?: TreeItem[]

  /** Flag indicating if node is expanded by default */
  defaultExpanded?: boolean

  /** Flag indicating if a tree view item has a badge */
  hasBadge?: boolean

  /** The extensions of this tree item */
  extends?: {
    kind?: string[]
    name?: string[]
    apiVersion?: string[]
  }

  /** Arguments that produce events */
  eventArgs?: {
    /** command that produces events */
    command: string
    /**
     * schema of the event output a table string
     * with each column separated by | and each row separated by \n
     * e.g. 20:18:39Z|eventgen|Back-off|v1|Pod|\n20:18:39Z|eventgen|Error|v1|Pod|\n
     *
     */
    schema?: {
      /** columns that produced by the command */
      nCol: number
      /** nth column that means timestamp */
      timestampCol?: number
      /** nth column that means message */
      messageCol?: number
      /** nth column that means name */
      nameCol?: number
      /** nth column that means kind */
      kindCol?: number
      /** nth column that means apiVersion */
      apiVersionCol?: number
    }
  }
}

export interface TreeResponse {
  apiVersion: 'kui-shell/v1'
  kind: 'TreeResponse'

  /** data of a `TreeResponse` */
  data: TreeItem[]
  /** update the toolbar text */
  toolbarText?: ToolbarText
  /** update the toolbar button */
  toolbarButtons?: Button[]
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
