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

// require('electron-is-dev');

import { theme } from '@kui-shell/core/core/settings'
import { Menu, MenuItemConstructorOptions } from 'electron'

const isDev = false
const { productName, gettingStarted } = theme

/**
 * Tell the renderer to execute a command
 *
 */
const tellRendererToExecute = async (command: string, exec = 'qexec') => {
  const { webContents } = await import('electron')
  const focusedWindow = webContents.getFocusedWebContents() || webContents.getAllWebContents()[0] // see https://github.com/IBM/kui/issues/1717

  const devTools = webContents
    .getAllWebContents()
    .map(_ => _.devToolsWebContents)
    .filter(x => x)
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
    focusedWindow.send(`/repl/${exec}`, { command })
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

export const install = (createWindow: () => void) => {
  if (!isDev) {
    const fileMenuItems: MenuItemConstructorOptions[] = [
      {
        label: 'New Window',
        click: () => createWindow(),
        accelerator: 'CommandOrControl+N'
      },
      {
        label: 'New Tab',
        click: () => newTab(),
        accelerator: 'CommandOrControl+T'
      },
      { type: 'separator' },
      {
        label: 'Close Tab',
        click: closeTab,
        accelerator: 'CommandOrControl+W'
      },
      { role: 'close' }
    ]
    if (process.platform !== 'darwin') {
      fileMenuItems.push({ type: 'separator' })
      fileMenuItems.push({ role: 'quit' })
    }

    const themeMenuItem: MenuItemConstructorOptions = {
      label: 'Choose a Theme',
      click: () => {
        try {
          tellRendererToExecute('themes', 'pexec')
        } catch (err) {
          console.log(err)
        }
      }
    }

    const helpMenuItems: MenuItemConstructorOptions[] = [
      {
        label: `Getting Started with ${productName}`,
        click: () => {
          try {
            tellRendererToExecute('about --mode gettingStarted')
          } catch (err) {
            console.log(err)
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Report Issue...',
        click() {
          require('electron').shell.openExternal('https://github.com/IBM/kui/issues/new')
        }
      }
    ]

    const menuTemplate: MenuItemConstructorOptions[] = [
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
          themeMenuItem,
          { type: 'separator' },
          {
            accelerator: process.platform === 'darwin' ? 'Meta+R' : 'Shift+CmdOrCtrl+R',
            role: 'reload'
          },
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
        submenu: [{ role: 'minimize' }, { role: 'close' }]
      },

      {
        role: 'help',
        submenu: helpMenuItems
      }
    ]

    const about: MenuItemConstructorOptions = {
      label: `About ${productName}`,
      click: () => {
        try {
          tellRendererToExecute('about', 'pexec')
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
