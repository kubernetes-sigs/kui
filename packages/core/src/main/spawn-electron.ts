/*
 * Copyright 2017 The Kubernetes Authors
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

import Debug from 'debug'
const debug = Debug('main/spawn-electron')
debug('loading')

import {
  BrowserWindow as BrowserWindowType,
  BrowserWindowConstructorOptions,
  Event,
  IpcMainEvent,
  Rectangle,
  Screen
} from 'electron'

import { join } from 'path'
import windowDefaults, { popupWindowDefaults } from '../webapp/defaults'
import ISubwindowPrefs from '../models/SubwindowPrefs'
import { webpackPath } from '../plugins/path'

/**
 * Information passed to the primary process from a "second instance"
 * IPC. We will be opening a new window for this new request (which
 * happens in a new process), and so we need to pass through some
 * state, such as environment variables, to the first/primary process,
 * so that the window it opens has the desired state.
 */
type KuiSecondInstanceAdditionalData = {
  /**
   * The environment variables from thse cond instance to use for this
   * new window. We stringify it, so that it survives the IPC
   * (@starpit i can't remember why this is needed; one would think
   * that electron's "second instance" ipc mechanism would take care
   * of that for us).
   */
  env: string

  /**
   * Window preferences from the controller.
   */
  subwindowPrefs: ISubwindowPrefs
}

/**
 * Keep a global reference of the window object, if you don't, the window will
 * be closed automatically when the JavaScript object is garbage collected.
 *
 */
let nWindows = 0

/** cleaners to be invoked when the last window is closed */
let cleaners: (() => void)[] = []

/** Sigh. Spectron uses @electron/remote */
const electronRemoteIsNeeded = !!process.env.RUNNING_SHELL_TEST

/** @electron/remote fails if you try to initialize it more than once */
let electronRemoteNeedsInit = electronRemoteIsNeeded

interface EventEmitter {
  on(event: string, listener: Function): void // eslint-disable-line @typescript-eslint/ban-types
  once(event: string, listener: Function): void // eslint-disable-line @typescript-eslint/ban-types
}
interface App extends EventEmitter {
  hide(): void
  quit(): void
  exit(exitCode?: number): void
  requestSingleInstanceLock(additionalData?: Record<any, any>): boolean
}

/**
 * Keep refs to the electron app around
 *
 */
let app: App

type BW = {
  getAllWindows: () => any[]
}

/**
 * Screen coordinates for regular window
 *
 */
function getPositionForRegularWindow({ screen, BrowserWindow }: { screen: Screen; BrowserWindow: BW }) {
  if (screen) {
    const nWindows = BrowserWindow.getAllWindows().length
    const { bounds } = screen.getPrimaryDisplay()
    const delta = nWindows * 40

    const x = Math.round((bounds.width - windowDefaults.width) / 2) + delta
    const y = Math.round((bounds.height - windowDefaults.height) / 2) + delta
    return { x, y }
  }
}

/**
 * Screen coordinates for popup window
 *
 */
function getPositionForPopup({ screen, BrowserWindow }: { screen: Screen; BrowserWindow: BW }) {
  if (screen && BrowserWindow) {
    const nWindows = BrowserWindow.getAllWindows().length
    const { bounds } = screen.getPrimaryDisplay()
    return {
      x: bounds.width - popupWindowDefaults.width - 50,
      y: Math.round((bounds.height - popupWindowDefaults.height) / 4 + (nWindows - 1) * 40)
    }
  }
}

/** Special purpose createWindow that accepts only an argv */
function createWindowWithArgv(executeThisArgvPlease?: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  createWindow(true, process.env, executeThisArgvPlease)
}

function getClientProductName(): Promise<string> {
  return import('@kui-shell/client/config.d/name.json').then(_ => _.productName)
}

function getClientIcons(): Promise<{ linux: string; win32: string }> {
  return import('@kui-shell/client/config.d/icons.json').then(_ => _.filesystem)
}

function getClientStyles(): Promise<BrowserWindowConstructorOptions & { defaultTheme?: string }> {
  return import('@kui-shell/client/config.d/style.json').then(_ => _.default)
}

/** Open a new Electron window */
export async function createWindow(
  noHeadless = false,
  env: Record<any, any>,
  executeThisArgvPlease?: string | string[],
  subwindowPlease?: boolean,
  subwindowPrefs?: ISubwindowPrefs,
  secondary = false,
  isForPopup = false
) {
  debug('createWindow', executeThisArgvPlease)

  if (subwindowPrefs && subwindowPrefs.bringYourOwnWindow) {
    subwindowPrefs.bringYourOwnWindow()
    return
  }

  // Create the browser window.
  let width = subwindowPrefs && subwindowPrefs.width
  let height = subwindowPrefs && subwindowPrefs.height
  if (process.env.WINDOW_WIDTH) {
    width = parseInt(process.env.WINDOW_WIDTH, 10)
    if (isNaN(width)) {
      console.error('Cannot parse WINDOW_WIDTH ' + process.env.WINDOW_WIDTH)
      width = undefined
    }
  }
  if (process.env.WINDOW_HEIGHT) {
    height = parseInt(process.env.WINDOW_HEIGHT, 10)
    if (isNaN(height)) {
      console.error('Cannot parse WINDOW_HEIGHT ' + process.env.WINDOW_HEIGHT)
      height = undefined
    }
  }

  let promise = Promise.resolve()
  if (!app) {
    debug('we need to spawn electron', subwindowPlease, subwindowPrefs)
    delete subwindowPrefs.synonymFor // circular JSON
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    promise = initElectron(['--'].concat(executeThisArgvPlease), {}, subwindowPlease, subwindowPrefs, isForPopup)
      .then(async () => {
        app = (await import('electron')).app as App
      })
      .catch((err: Error) => {
        // headless
        debug('not ready for graphics', err)
      })
  }

  // note: titleBarStyle on macOS needs to be customButtonsOnHover if we want to support cursor:pointer
  // but this doesn't render the inset window buttons
  // see https://github.com/electron/electron/issues/10243
  return new Promise<void>((resolve, reject) => {
    promise
      .then(async () => {
        const [productName, icons, styles] = await Promise.all([
          getClientProductName(),
          getClientIcons(),
          getClientStyles()
        ])

        const { screen, BrowserWindow, app } = await import('electron')
        const position =
          subwindowPrefs && subwindowPrefs.position
            ? await subwindowPrefs.position()
            : getPositionForRegularWindow({ screen, BrowserWindow })
        const opts: BrowserWindowConstructorOptions = Object.assign(
          {},
          styles,
          {
            title: (subwindowPrefs && subwindowPrefs.title) || productName,
            width: width || styles.width || 1280,
            height: height || styles.height || 960,
            webPreferences: {
              backgroundThrottling: false,
              contextIsolation: false, // prior to electron 12, nodeIntegration: true did not need this
              nodeIntegration: true // prior to electron 5, this was the default
            }
            // titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default'
          },
          position
        )

        // if we are opening a random URL, then we cannot use a
        // frameless window; otherwise, it is unlikely the window will
        // be moveable
        if (typeof executeThisArgvPlease === 'string') {
          delete opts.frame
          delete opts.titleBarStyle
          if (!subwindowPrefs) {
            subwindowPrefs = {}
          }
          subwindowPrefs._notAKuiWindow = true
        }

        // if user ups zoom level, reloads, we're stuck at a higher zoom
        // see https://github.com/electron/electron/issues/10572
        // note that this requires show: false above
        opts.webPreferences.zoomFactor = 1

        // when jumping directly to the UI from bash, getAppPath() may
        // include dist/headless; if so, we need to back out of that
        await promise // wait for `app` to be defined, since we're about to use it
        if (!app) return // then we will go a different route to opening the electron window
        const appPath = app.getAppPath()
        const root = join(appPath, /headless$/.test(appPath) ? '../../' : '', 'node_modules/@kui-shell')

        if (process.platform === 'linux') {
          const icon = join(root, 'build', icons.linux)
          opts.icon = icon
        } else if (process.platform === 'win32') {
          const icon = join(root, 'build', icons.win32)
          opts.icon = icon
        }

        if (subwindowPlease) {
          // this tells electron to size content to the given width and height,
          // (i.e. NOT vice versa, to size the window to the content!)
          opts.useContentSize = true
        }

        if (electronRemoteNeedsInit) {
          require('@electron/remote/main').initialize()
          electronRemoteNeedsInit = false
        }

        if (process.env.KUI_POSITION_X) {
          opts.x = parseInt(process.env.KUI_POSITION_X, 10)
        }
        if (process.env.KUI_POSITION_Y) {
          opts.y = parseInt(process.env.KUI_POSITION_Y, 10)
        }
        debug('createWindow::new BrowserWindow')
        interface KuiBrowserWindow extends BrowserWindowType {
          executeThisArgvPlease?: string[]
          subwindow?: ISubwindowPrefs
        }
        const mainWindow = new BrowserWindow(opts) as KuiBrowserWindow
        if (electronRemoteIsNeeded) {
          require('@electron/remote/main').enable(mainWindow.webContents)
        }
        nWindows++
        debug('createWindow::new BrowserWindow success')

        mainWindow.once('ready-to-show', () => {
          mainWindow.setVisibleOnAllWorkspaces(true)
          mainWindow.show()
          mainWindow.setVisibleOnAllWorkspaces(false)
        })

        // remember certain classes of windows, so we don't have multiple
        // open; e.g. one for docs, one for videos...
        interface Win {
          window?: BrowserWindowType
          url?: string
        }
        const fixedWindows: Record<string, Win> = {}
        const openFixedWindow = (opts: {
          type: string
          url: string
          size?: { width: number; height: number }
          position?: { x: number; y: number }
        }) => {
          const { type, url, size = mainWindow.getBounds(), position = mainWindow.getBounds() } = opts

          const existing = fixedWindows[type] || ({} as Win)
          const { window: existingWindow, url: currentURL } = existing

          if (!existingWindow || existingWindow.isDestroyed()) {
            const window = new BrowserWindow({
              width: size.width,
              height: size.height,
              frame: true
            })
            fixedWindows[type] = { window, url }
            window.setPosition(position.x + 62, position.y + 62)
            // window.on('closed', () => { docsWindow = null })
            window.loadURL(url)
          } else {
            if (currentURL !== url) {
              existingWindow.loadURL(url)
              existing.url = url
            }
            existingWindow.focus()
          }
        }

        /** this event handler will be called when the window's content finishes loading */
        mainWindow.webContents.on('did-finish-load', async () => {
          if (mainWindow) {
            try {
              // const { switchToPersistedThemeChoice } = await import('../webapp/themes/persistence')
              // await switchToPersistedThemeChoice(mainWindow.webContents /*, Electron.nativeTheme.shouldUseDarkColors */)
            } catch (err) {
              console.error('error initializing themes', err)
            }
          }
        })

        /**
         * Intercept window.location=... and send to platform browser.
         * see https://github.com/IBM/kui/issues/2881
         */
        mainWindow.webContents.on('will-navigate', async (event, url) => {
          const openInKui = /kui-shell\/build\/index.html/.test(url) // webpack-dev-server causes this navigation; ignore

          if (!openInKui) {
            event.preventDefault()
            ;(await import('electron')).shell.openExternal(url)
          }
        })

        /** jump in and manage the way popups create new windows */
        mainWindow.webContents.setWindowOpenHandler(({ url }) => {
          if (url.startsWith('https://youtu.be')) {
            // special handling of youtube links
            openFixedWindow({
              type: 'videos',
              url,
              size: { width: 800, height: 600 }
            })
            return { action: 'deny' }
          } else {
            import('electron').then(_ => _.shell).then(_ => _.openExternal(url))
            return { action: 'deny' }
          }
        })

        let commandContext =
          Array.isArray(executeThisArgvPlease) && executeThisArgvPlease.find(_ => /--command-context/.test(_))
        if (Array.isArray(executeThisArgvPlease) && commandContext) {
          executeThisArgvPlease = executeThisArgvPlease.filter(_ => !_.match(/--command-context/))

          // strip off the leading --, to help with URL window.location.search
          commandContext = commandContext.replace(/^--/, '')
        }

        debug('subwindowPrefs', subwindowPrefs)

        // and load the index.html of the app.
        const searchFields = [
          commandContext ? `command-context=${encodeURIComponent(commandContext)}` : '',
          noHeadless === true && Array.isArray(executeThisArgvPlease)
            ? `executeThisArgvPlease=${encodeURIComponent(JSON.stringify(executeThisArgvPlease))}`
            : '',
          subwindowPrefs && Object.keys(subwindowPrefs).length > 0
            ? `subwindow=${encodeURIComponent(JSON.stringify(subwindowPrefs))}`
            : ''
        ].filter(Boolean)

        const url =
          typeof executeThisArgvPlease === 'string'
            ? executeThisArgvPlease
            : require('url').format({
                pathname: join(root, 'build', 'index.html'),
                protocol: 'file:',
                search: searchFields.length === 0 ? '' : `?${searchFields.join('&')}`,
                slashes: true
              })
        debug('mainWindow::loadURL', url)
        try {
          mainWindow.loadURL(url)
        } catch (err) {
          const errorIsNavigatedError: boolean =
            err.message.includes('Inspected target navigated or closed') ||
            err.message.includes('cannot determine loading status') ||
            err.message.includes('Inspected target navigated or closed')

          if (!process.env.TRAVIS_JOB_ID || !errorIsNavigatedError) {
            reject(err)
          }
        }

        debug('install menus')
        require('./menu').install(createWindowWithArgv)

        // Open the DevTools.
        // mainWindow.webContents.openDevTools()

        // Emitted when the window is closed.
        mainWindow.once('closed', function () {
          // Dereference the window object, usually you would store windows
          // in an array if your app supports multi windows, this is the time
          // when you should delete the corresponding element.
          if (--nWindows === 0) {
            cleaners.forEach(cleaner => cleaner())
            cleaners = []
          }

          // now that the window is closed, resolve the promise of `createWindow`
          resolve()
        })

        if (!secondary && cleaners.length === 0) {
          //
          // set up ipc from renderer
          //
          const { ipcMain } = await import('electron')

          //
          // take a screenshot; note that this has to be done in the main
          // process, due to the way clipboard.writeImage is implemented on
          // Linux. on macOS, this could be done entirely in the renderer
          // process. on Linux, however, the nativeImages aren't
          // translatable between the renderer and main processes as fluidly
          // as they are on macOS. oh well! this is why the screenshot
          // plugin has to pollute main.js
          //
          debug('ipc registration')

          const onCaptureToClipboard = async (event: IpcMainEvent, contentsId: string, rect: Rectangle) => {
            try {
              const { clipboard, nativeImage, webContents } = await import('electron')
              const image = await webContents.fromId(parseInt(contentsId, 10)).capturePage(rect)
              try {
                const buf = image.toPNG()
                clipboard.writeImage(nativeImage.createFromBuffer(buf))
                event.sender.send('capture-page-to-clipboard-done', buf)
              } catch (err) {
                console.log(err)
                event.sender.send('capture-page-to-clipboard-done')
              }
            } catch (err) {
              console.log(err)
              event.sender.send('capture-page-to-clipboard-done')
            }
          }
          // end of screenshot logic

          const onSynchronousMessage = async (event: IpcMainEvent, arg: string) => {
            const message = JSON.parse(arg)
            switch (message.operation) {
              case 'quit':
                app.quit()
                break
              case 'new-window':
                createWindow(
                  true,
                  env,
                  message.argv,
                  undefined,
                  {
                    width: message.width,
                    height: message.height,
                    title: message.title,
                    initialTabTitle: message.initialTabTitle || message.title,
                    quietExecCommand: message.quietExecCommand !== undefined ? message.quietExecCommand : false
                  },
                  true
                )
                break
              case 'open-graphical-shell':
                createWindow(true, env)
                break
              case 'enlarge-window':
                mainWindow.setContentSize(1400, 1050, true)
                break
              case 'reduce-window':
                mainWindow.setContentSize(1024, 768, true)
                break
              case 'maximize-window':
                mainWindow.maximize()
                break
              case 'unmaximize-window':
                mainWindow.unmaximize()
                break
              case 'find-in-page':
                event.sender.on('found-in-page', (ev, result) => {
                  // if (result.finalUpdate) event.sender.stopFindInPage('activateSelection')
                  event.sender.send('found-in-page-result', result)
                })
                event.sender.findInPage(message.value, message.options)
                break

              case 'stop-find-in-page':
                event.sender.stopFindInPage('activateSelection')
                break
            }
            event.returnValue = 'ok'
          }

          const onExecInvoke = async (event: IpcMainEvent, arg: string) => {
            const message = JSON.parse(arg)
            const channel = `/exec/response/${message.hash}`
            debug('invoke', message)

            try {
              const mod = await import('@kui-shell/plugin-' + webpackPath(message.module) + '/mdist/electron-main.js')
              debug('invoke got module')

              const returnValue = await mod[message.main || 'main'](
                message.args,
                event.sender,
                (argv: string | string[], prefs?: ISubwindowPrefs) => createWindow(true, env, argv, undefined, prefs)
              )
              debug('invoke got returnValue', returnValue)

              event.sender.send(
                channel,
                JSON.stringify({
                  success: true,
                  returnValue
                })
              )
            } catch (error) {
              debug('error in exec', error)
              event.sender.send(
                channel,
                JSON.stringify({
                  success: false,
                  error
                })
              )
            }
          }

          ipcMain.on('/exec/invoke', onExecInvoke)
          ipcMain.on('synchronous-message', onSynchronousMessage)
          ipcMain.on('capture-page-to-clipboard', onCaptureToClipboard)

          cleaners.push(() => ipcMain.off('/exec/invoke', onExecInvoke))
          cleaners.push(() => ipcMain.off('synchronous-message', onSynchronousMessage))
          cleaners.push(() => ipcMain.off('capture-page-to-clipboard', onCaptureToClipboard))
        }

        debug('createWindow done')
      })
      .catch(err => {
        // headless
        debug('not ready for graphics (2)', err)
      })
  })
}

/**
 * Strip off the command to be executed from the given argv
 *
 */
interface Command {
  argv: string[]
  subwindowPlease: boolean
  subwindowPrefs: ISubwindowPrefs
}
export const getCommand = (
  argv: string[],
  cwd: string,
  env: Record<any, any>,
  screen: () => Promise<{ screen: Screen; BrowserWindow: BW }>
): Command => {
  debug('getCommand', argv)
  const dashDash = argv.lastIndexOf('--')
  argv = dashDash === -1 ? argv.slice(1) : argv.slice(dashDash + 1)

  // re: the -psn bit, opening Kui from macOS Finder adds additional argv -psn; see: https://github.com/IBM/kui/issues/382
  // re: the --allow-file... and --enable-av...; see https://github.com/kubernetes-sigs/kui/issues/8746
  argv = argv.filter(
    _ =>
      _ !== '--ui' &&
      _ !== '--no-color' &&
      !_.match(/^-psn/) &&
      _ !== '--allow-file-access-from-files' &&
      _ !== '--enable-avfoundation' &&
      _ !== '--enable-crashpad' // this one seems to be linux-specific?
  )

  // re: argv.length === 0, this should happen for double-click launches
  const isShell =
    !env.KUI_POPUP &&
    (argv.length === 0 || argv.find(_ => _ === 'shell') || (env.RUNNING_SHELL_TEST && !env.KUI_TEE_TO_FILE))

  debug('isShell', argv, isShell)

  let subwindowPlease = true
  let subwindowPrefs: ISubwindowPrefs = {
    cwd,
    env,
    fullscreen: true,
    width: windowDefaults.width,
    height: windowDefaults.height
  }

  if (isShell) {
    // use a full window for 'shell'
    argv = ['shell']
    subwindowPlease = false
    subwindowPrefs = { cwd, env }
  } else if (env.KUI_POPUP) {
    argv = JSON.parse(env.KUI_POPUP)
    subwindowPrefs = { cwd, env }
  }

  if (env.KUI_POPUP_WINDOW_RESIZE) {
    subwindowPrefs = {
      cwd,
      env,
      fullscreen: true,
      position: async () => getPositionForPopup(await screen()),
      width: popupWindowDefaults.width,
      height: popupWindowDefaults.height
    }
  }

  debug('using args', argv, subwindowPrefs)
  return { argv, subwindowPlease, subwindowPrefs }
}

/**
 * Spawn electron
 *
 */
export async function initElectron(
  command: string[] = [],
  { isRunningHeadless = false } = {},
  subwindowPlease?: boolean,
  subwindowPrefs?: ISubwindowPrefs,
  isForPopup = false
) {
  debug('initElectron', command, subwindowPlease, subwindowPrefs)

  if (process.env.KUI_HEADLESS) {
    if (!process.env.KUI_ELECTRON_HOME) {
      throw new Error('Unable to locate graphics components')
    } else {
      // then we're still in pure headless mode; we'll need to fork ourselves to spawn electron
      const childProcess = import('child_process')
      const appHome = '.'

      const args = [appHome, '--', ...command]
      debug('spawning electron', process.env.KUI_ELECTRON_HOME, args)

      // pass through any window options, originating from the command's usage model, on to the subprocess
      const windowOptions: Record<string, string> = {}
      if (subwindowPlease) {
        debug('passing through subwindowPlease', subwindowPlease)
        windowOptions['subwindowPlease'] = subwindowPlease.toString()
      }
      if (subwindowPrefs && Object.keys(subwindowPrefs).length > 0) {
        debug('passing through subwindowPrefs', subwindowPrefs)
        windowOptions['subwindowPrefs'] = JSON.stringify(subwindowPrefs)
      }

      // note how we ignore the subprocess's stdio if debug mode
      // is not enabled this allows you (as a developer) to
      // debug issues with spawning the subprocess by passing
      // DEBUG=* or DEBUG=main
      const env = Object.assign({}, process.env, windowOptions)
      delete env.KUI_GRAPHICS
      delete env.KUI_HEADLESS
      delete env.ELECTRON_RUN_AS_NODE

      const child = (await childProcess).spawn(process.env.KUI_ELECTRON_HOME, args, {
        stdio: debug.enabled ? 'inherit' : 'ignore',
        env,
        detached: true // needed on windows to separate this process into its own process group
      })

      if (!debug.enabled) {
        // as with the "ignore stdio" comment immediately
        // above: unless we're in DEBUG mode, let's disown
        // ("unref" in nodejs terms) the subprocess
        child.unref()
      }

      debug('spawning electron done, this process will soon exit')
      if (!isForPopup) {
        process.exit(0)
      }
    }
  } else {
    debug('loading electron')
    const Electron = await import('electron')
    app = Electron.app
  }

  // deal with multiple processes
  if (!process.env.RUNNING_SHELL_TEST) {
    const widthFromCaller = subwindowPrefs && subwindowPrefs.width
    const heightFromCaller = subwindowPrefs && subwindowPrefs.height

    app.on(
      'second-instance',
      (event: Electron.Event, commandLine: string[], cwd: string, additionalData: KuiSecondInstanceAdditionalData) => {
        // Someone tried to run a second instance, open a new window
        // to handle it

        const env = !additionalData.env ? process.env : JSON.parse(additionalData.env)
        const {
          argv,
          subwindowPlease,
          subwindowPrefs: defaultSubwindowPrefs
        } = getCommand(commandLine, cwd, env, async () => import('electron'))

        const mySubwindowPrefs = additionalData.subwindowPrefs || defaultSubwindowPrefs
        if (!mySubwindowPrefs.width && widthFromCaller) {
          mySubwindowPrefs.width = widthFromCaller
        }
        if (!mySubwindowPrefs.height && heightFromCaller) {
          mySubwindowPrefs.height = heightFromCaller
        }

        debug('opening window for second instance', commandLine, subwindowPlease, mySubwindowPrefs, additionalData)
        createWindow(true, env, argv, subwindowPlease, mySubwindowPrefs)
      }
    )

    // data to pass along with our request, to preserve some context
    // info, such as desired window size and window title, and
    // environment variables from this second process that we need to
    // pass back to the first, so that the desired env appears in the
    // new window
    const additionalData: KuiSecondInstanceAdditionalData = {
      env: JSON.stringify(process.env),
      subwindowPrefs: !subwindowPrefs
        ? undefined
        : {
            width: subwindowPrefs.width,
            height: subwindowPrefs.height,
            title: subwindowPrefs.title,
            fullscreen: subwindowPrefs.fullscreen
          }
    }

    if (!app.requestSingleInstanceLock(additionalData)) {
      // The primary instance of app failed to optain the lock, which means another instance of app is already running with the lock
      debug('exiting, since we are not the first instance')
      return app.exit(0)
    }
  }

  // See menu.ts; Open Recent leads here
  app.on('open-file', async (evt: Event, filepath: string) => {
    const { replay } = await import('./notebooks')
    replay(filepath, createWindowWithArgv)
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.once('ready', () => {
    debug('opening primary window', command)
    createWindow(true, process.env, command.length > 0 && command, subwindowPlease, subwindowPrefs)
  })

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin' || isRunningHeadless) {
      // if we're running headless, then quit on window closed, no matter which platform we're on
      app.quit()
    } else {
      app.hide()
    }
  })

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (nWindows === 0) {
      createWindow(false, process.env)
    }
  })
}
