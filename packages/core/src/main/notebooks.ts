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

import { MenuItemConstructorOptions, webContents } from 'electron'

import tellRendererToExecute from './tell'
import encodeComponent from '../repl/encode'
import { NotebooksMenu, isMenu, isLeaf } from './load'

interface OpenNotebookItem {
  label: string
  click: () => void
}

/** Open a new window or tab and replay the contents of the given `filepath` */
export function replay(filepath: string, createWindow: (executeThisArgvPlease?: string[]) => void) {
  try {
    // if we have no open kui windows, open a new one; otherwise,
    // use a tab in an existing window
    if (webContents.getAllWebContents().length === 0) {
      createWindow(['replay', filepath])
    } else {
      tellRendererToExecute(`replay ${encodeComponent(filepath)}`, 'pexec')
    }
  } catch (err) {
    console.log(err)
  }
}

/** @return a menu item that opens the given notebook */
export function openNotebook(
  createWindow: (executeThisArgvPlease?: string[]) => void,
  label: string,
  filepath: string
): OpenNotebookItem {
  return {
    label,
    click: () => replay(filepath, createWindow)
  }
}

/** We only need to replace the NotebookDefinitionMenuItem with calls to our `notebook` helper */
export function clientNotebooksDefinitionToElectron(
  defn: NotebooksMenu,
  notebook: (label: string, filepath: string) => OpenNotebookItem
): MenuItemConstructorOptions {
  if (defn) {
    return Object.assign(
      {},
      {
        label: defn.label,
        submenu: defn.submenu.map(item => {
          if (isMenu(item)) {
            return clientNotebooksDefinitionToElectron(item, notebook)
          } else if (isLeaf(item)) {
            // this is the only mogrifier
            return notebook(item.notebook, item.filepath)
          } else {
            // separator, no change
            return item
          }
        })
      }
    )
  }
}
