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

export type Guidebook = { notebook: string; filepath: string }
type Menu = { label: string; submenu: MenuItem[]; expanded?: boolean }
export type MenuItem = Guidebook | Menu | object

export function isGuidebook(item: MenuItem): item is Guidebook {
  const gb = item as Guidebook
  return typeof gb === 'object' && typeof gb.notebook === 'string' && typeof gb.filepath === 'string'
}

export function isMenu(item: MenuItem): item is Menu {
  const menu = item as Menu
  return typeof menu === 'object' && typeof menu.label === 'string' && Array.isArray(menu.submenu)
}

export default interface GuidebookProps {
  /** Is guidebook content default-expanded [default: false] */
  guidebooksExpanded?: boolean

  /** Command prefix to execute to open a guidebook [default: replay] */
  guidebooksCommand?: string

  /** Present a fixed set of guidebook content. If `false`, then don't show the hamburger menu in the upper left. */
  guidebooks?: MenuItem[] | false
}
