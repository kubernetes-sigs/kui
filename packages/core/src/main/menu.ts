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

import { productName } from '@kui-shell/client/config.d/name.json'
import { Menu, MenuItemConstructorOptions, webContents } from 'electron'

import open from './open'
import saveAsNotebook from './save'
import encodeComponent from '../repl/encode'
import tellRendererToExecute from './tell'

const isDev = false

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

const isDarwin = process.platform === 'darwin'
const closeAccelerator = isDarwin ? 'Command+W' : 'Control+Shift+W'

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
function openNotebook(createWindow: (executeThisArgvPlease?: string[]) => void, label: string, filepath: string) {
  return {
    label,
    click: () => replay(filepath, createWindow)
  }
}

export const install = (createWindow: (executeThisArgvPlease?: string[]) => void) => {
  if (!isDev) {
    const notebook = openNotebook.bind(undefined, createWindow)
    const notebookMenuItem: MenuItemConstructorOptions = {
      label: 'Notebooks',
      submenu: [
        notebook('Welcome to Kui', '/kui/welcome.json'),
        { type: 'separator' },
        {
          label: 'Kubernetes',
          submenu: [
            notebook('CRUD Operations', '/kui/kubernetes/crud-operations.json'),
            notebook('Working with Jobs', '/kui/kubernetes/create-jobs.json'),
            notebook('Deploying Applications', '/kui/kubernetes/deploy-applications.json')
          ]
        },
        {
          label: 'iter8',
          submenu: [notebook('Welcome to iter8', '/kui/iter8/welcome.json')]
        },
        {
          label: 'S3',
          submenu: [notebook('Getting Started', '/kui/s3/welcome.json'), notebook('Using S3', '/kui/s3/using-s3.json')]
        },
        {
          label: 'OpenWhisk',
          submenu: [notebook('Getting Started', '/kui/openwhisk/welcome.json')]
        },
        { type: 'separator' },
        notebook('Make Your Own Notebook', '/kui/make-notebook.json')
      ]
    }

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
      {
        label: 'Open',
        click: () => open(createWindow),
        accelerator: 'CommandOrControl+O'
      },
      {
        label: 'Open Recent',
        role: 'recentdocuments' as any, // electron.d.ts insufficiency
        submenu: [
          {
            label: 'Clear Recent',
            role: 'clearrecentdocuments' as any // ibid
          }
        ]
      },
      { type: 'separator' },
      {
        label: 'Save as Notebook...',
        click: saveAsNotebook,
        accelerator: 'CommandOrControl+S'
      },
      { type: 'separator' },
      {
        label: 'Close Tab',
        click: closeTab,
        accelerator: closeAccelerator
      },
      { role: 'close', accelerator: undefined }
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
            tellRendererToExecute('getting started', 'pexec')
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
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' }
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
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      notebookMenuItem,
      {
        role: 'window',
        submenu: [{ role: 'minimize' }, { role: 'close', accelerator: closeAccelerator }]
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

    const separator: MenuItemConstructorOptions = { type: 'separator' }
    const submenu: MenuItemConstructorOptions[] = [
      about,
      notebook('Configure Kui', '/kui/settings.json'),
      separator,
      { role: 'services', submenu: [] as MenuItemConstructorOptions[] },
      separator,
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      separator,
      { role: 'quit' }
    ]

    if (process.platform === 'darwin') {
      menuTemplate.unshift({
        label: productName,
        submenu
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
