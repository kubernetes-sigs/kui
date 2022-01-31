/*
 * Copyright 2021 The Kubernetes Authors
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

export interface NotebookDefinitionMenuItem {
  /** The title to use in the menu */
  notebook: string

  /** The VFS filepath to this notebook */
  filepath: string

  /** Open this guidebook, for auto-playing clients? (@see Client.firstOpenGuidebook()) */
  open?: boolean
}

export interface SeparatorMenuItem {
  type: 'separator'
}

type NotebookMenuItem = NotebooksMenu | NotebookDefinitionMenuItem | SeparatorMenuItem

export function isMenu(item: NotebookMenuItem): item is NotebooksMenu {
  const menu = item as NotebooksMenu
  return typeof menu === 'object' && typeof menu.label === 'string' && Array.isArray(menu.submenu)
}

export function isLeaf(item: NotebookMenuItem): item is NotebookDefinitionMenuItem {
  const leaf = item as NotebookDefinitionMenuItem
  return typeof leaf === 'object' && typeof leaf.notebook === 'string' && typeof leaf.filepath === 'string'
}

export interface NotebooksMenu {
  /** Name for this menu in the UI */
  label: string

  /** Entries of this menu */
  submenu: NotebookMenuItem[]

  /** Is this menu displayed as expanded? [Default: true] */
  expanded?: boolean
}

/** @return the client's definition of a Notebooks menu */
export default function loadClientNotebooksMenuDefinition(): NotebooksMenu {
  try {
    return require('@kui-shell/client/config.d/notebooks.json') as NotebooksMenu
  } catch (err) {
    return undefined
  }
}
