/*
 * Copyright 2017-18 IBM Corporation
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

const isDev = false// require('electron-is-dev');

import { theme } from '@kui-shell/settings/config.json'
const { productName } = theme

interface IMenuItem {
  label?: string
  click?: () => void
  accelerator?: string
  type?: string
  role?: string,
  submenu?: Array<IMenuItem>
}

/**
 * Tell the renderer to execute a command
 *
 */
const tellRendererToExecute = async (command: string) => {
  const { webContents } = await import('electron')
  const focusedWindow = webContents.getFocusedWebContents()

  const devTools = webContents.getAllWebContents().map(_ => _.devToolsWebContents).filter(x => x)
  const isFocusedWindowDevTools = devTools.find(_ => _.id === focusedWindow.id)

  if (isFocusedWindowDevTools) {
    // debug('closing dev tools')
    const owningWindow = webContents.getAllWebContents().find(_ => {
      return _.devToolsWebContents && _.devToolsWebContents.id === focusedWindow.id
    })
    if (owningWindow) {
      owningWindow.closeDevTools()
    }
  } else {
    // debug('closing kui window')
    focusedWindow.send('/repl/qexec', { command })
  }
}

/**
 * tell the current window to open a new tab
 *
 */
const newTab = () => tellRendererToExecute('tab new')

/**
 * tell the current window to close the current tab
 *
 */
const closeTab = () => tellRendererToExecute('tab close')

export const install = (app, Menu, createWindow) => {
  if (!isDev) {
    const fileMenuItems: Array<IMenuItem> = [
      { label: 'New Window',
        click: () => createWindow(),
        accelerator: 'CommandOrControl+N'
      },
      { label: 'New Tab',
        click: () => newTab(),
        accelerator: 'CommandOrControl+T'
      },
      { type: 'separator' },
      { label: 'Close Tab',
        click: closeTab,
        accelerator: 'CommandOrControl+W'
      },
      { role: 'close' }
    ]
    if (process.platform !== 'darwin') {
      fileMenuItems.push({ type: 'separator' })
      fileMenuItems.push({ role: 'quit' })
    }

    const helpMenuItems: Array<IMenuItem> = [
      {
        label: 'Getting Started with Composer',
        click: () => {
          try {
            tellRendererToExecute('getting started')
          } catch (err) {
            console.log(err)
          }
        }
      },
      {
        label: 'Composer Coding 101',
        click: () => {
          try {
            tellRendererToExecute('coding basics')
          } catch (err) {
            console.log(err)
          }
        }
      },
      {
        label: 'Combinator Reference Guide',
        click: () => {
          try {
            tellRendererToExecute('combinators')
          } catch (err) {
            console.log(err)
          }
        }
      },
      {
        label: 'Interactive Tutorials',
        click: () => {
          try {
            tellRendererToExecute('tutorials')
          } catch (err) {
            console.log(err)
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Report Issue...',
        click () { require('electron').shell.openExternal('https://github.com/IBM/kui/issues/new') }
      }
    ]

    const menuTemplate: Array<IMenuItem> = [
      {
        label: 'File',
        submenu: fileMenuItems
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' }
        ]
      },

      {
        label: 'View',
        submenu: [
          { accelerator: process.platform === 'darwin' ? 'Meta+R' : 'Shift+CmdOrCtrl+R', role: 'reload' },
//          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },

      {
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },

      {
        role: 'help',
        submenu: helpMenuItems
      }
    ]

    const about: IMenuItem = { label: `About ${productName}`,
      click: () => {
        try {
          tellRendererToExecute('about')
        } catch (err) {
          console.log(err)
        }
      }
    }

    if (process.platform === 'darwin') {
      menuTemplate.unshift({
        label: productName,
        submenu: [
          about,
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      })
    } else {
      // for windows and linux, put About in the Help menu
      helpMenuItems.push({ type: 'separator' })
      helpMenuItems.push(about)
    }

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
  }
}
