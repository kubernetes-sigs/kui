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

import * as Debug from 'debug'
const debug = Debug('main/spawn-electron')
debug('loading')

import windowDefaults from '../webapp/defaults'
import ISubwindowPrefs from '../models/SubwindowPrefs'

/**
 * Keep a global reference of the window object, if you don't, the window will
 * be closed automatically when the JavaScript object is garbage collected.
 *
 */
let nWindows = 0

/**
 * Keep refs to the electron app around
 *
 */
let electron
let app

export function createWindow(
  noHeadless = false,
  executeThisArgvPlease?: string[],
  subwindowPlease?: boolean,
  subwindowPrefs?: ISubwindowPrefs
) {
  debug('createWindow', executeThisArgvPlease)

  if (subwindowPrefs && subwindowPrefs.bringYourOwnWindow) {
    subwindowPrefs.bringYourOwnWindow()
    return
  }

  // Create the browser window.
  let width = (subwindowPrefs && subwindowPrefs.width) || 1280
  let height = (subwindowPrefs && subwindowPrefs.height) || 960
  if (process.env.WINDOW_WIDTH) {
    width = parseInt(process.env.WINDOW_WIDTH, 10)
    if (isNaN(width)) {
      console.error('Cannot parse WINDOW_WIDTH ' + process.env.WINDOW_WIDTH)
      width = 1280
    }
  }
  if (process.env.WINDOW_HEIGHT) {
    height = parseInt(process.env.WINDOW_HEIGHT, 10)
    if (isNaN(height)) {
      console.error('Cannot parse WINDOW_HEIGHT ' + process.env.WINDOW_HEIGHT)
      height = 960
    }
  }

  let promise = Promise.resolve()
  if (!electron) {
    debug('we need to spawn electron', subwindowPlease, subwindowPrefs)
    delete subwindowPrefs.synonymFor // circular JSON
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    promise = initElectron(['--'].concat(executeThisArgvPlease), {}, subwindowPlease, subwindowPrefs)
      .then(async () => {
        electron = await import('electron')
      })
      .catch((err: Error) => {
        // headless
        debug('not ready for graphics', err)
      })
  }

  // note: titleBarStyle on macOS needs to be customButtonsOnHover if we want to support cursor:pointer
  // but this doesn't render the inset window buttons
  // see https://github.com/electron/electron/issues/10243
  promise.then(async () => {
    try {
      require('electron-context-menu')()
    } catch (err) {
      debug('not ready for graphics, still', err)
      return
    }

    const Electron = await import('electron')
    const opts: Electron.BrowserWindowConstructorOptions = Object.assign(
      {
        width,
        height,
        webPreferences: {
          nodeIntegration: true // prior to electron 5, this was the default
        },
        show: false // do not remove without consulting the ready-to-show comment below
        // titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default'
      },
      subwindowPrefs && subwindowPrefs.position
    )

    if (subwindowPlease) {
      // this tells electron to size content to the given width and height,
      // (i.e. NOT vice versa, to size the window to the content!)
      opts.useContentSize = true
    }

    if (process.env.KUI_POSITION_X) {
      opts.x = parseInt(process.env.KUI_POSITION_X, 10)
    }
    if (process.env.KUI_POSITION_Y) {
      opts.y = parseInt(process.env.KUI_POSITION_Y, 10)
    }
    debug('createWindow::new BrowserWindow')
    const mainWindow = new Electron.BrowserWindow(opts)
    nWindows++
    debug('createWindow::new BrowserWindow success')

    mainWindow.once('ready-to-show', () => {
      // if user ups zoom level, reloads, we're stuck at a higher zoom
      // see https://github.com/electron/electron/issues/10572
      // note that this requires show: false above
      mainWindow.webContents.setZoomFactor(1)
      mainWindow.setVisibleOnAllWorkspaces(true)
      mainWindow.show()
      mainWindow.setVisibleOnAllWorkspaces(false)
    })

    // install tray menu [DISABLED FOR NOW]
    /* if (noHeadless !== true && !executeThisArgvPlease) {
        mainWindow.tray = require('./tray')(electron, app, createWindow)
    } */

    // remember certain classes of windows, so we don't have multiple
    // open; e.g. one for docs, one for videos...
    const fixedWindows = {}
    const openFixedWindow = opts => {
      const { type, event, url, size = mainWindow.getBounds(), position = mainWindow.getBounds() } = opts

      const existing = fixedWindows[type] || {}
      const { window: existingWindow, url: currentURL } = existing

      if (!existingWindow || existingWindow.isDestroyed()) {
        const window = new Electron.BrowserWindow({
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

      event.preventDefault()
    }

    /** this event handler will be called when the window's content finishes loading */
    mainWindow.webContents.on('did-finish-load', async () => {
      // for some reason, adding the title attribute to the new
      // BrowserWindow opts doesn't stick; and... this has to be on
      // did-finish-load, for some reason... at least these are true
      // statements for electron 1.6.x
      const isDarkMode = Electron.systemPreferences.isDarkMode()
      const productName = (await import('@kui-shell/settings/config.json')).theme.productName

      if (mainWindow) {
        mainWindow.setTitle(productName)
      }

      if (mainWindow) {
        try {
          const { switchToPersistedThemeChoice } = await import('@kui-shell/plugin-core-support/lib/cmds/theme')
          switchToPersistedThemeChoice(mainWindow.webContents, isDarkMode)
        } catch (err) {
          debug('theme support not found', err)
          const { theme, env } = await import('@kui-shell/core/core/settings')
          const { readFile } = await import('fs')
          const { join, dirname } = await import('path')
          const themeModel = theme.themes.find(_ => _.name === theme.defaultTheme)
          const filepath = join(
            dirname(require.resolve('@kui-shell/settings/package.json')),
            env.cssHome,
            themeModel.css
          )
          debug('default theme filepath', filepath)
          readFile(filepath, (err, data) => {
            if (err) {
              throw err
            } else {
              mainWindow.webContents.insertCSS(data.toString())
              mainWindow.webContents.executeJavaScript(`document.body.setAttribute('kui-theme', '${themeModel.name}')`)
              mainWindow.webContents.executeJavaScript(
                `document.body.setAttribute('kui-theme-style', '${themeModel.style}')`
              )
            }
          })
        }
      }
    })

    /** jump in and manage the way popups create new windows */
    mainWindow.webContents.on('new-window', (
      event,
      url: string,
      frameName: string,
      disposition: string,
      options /*, additionalFeatures */
    ) => {
      if (url.startsWith('https://youtu.be')) {
        // special handling of youtube links
        openFixedWindow({
          type: 'videos',
          event,
          url,
          options,
          size: { width: 800, height: 600 }
        })
      } else {
        event.preventDefault()
        require('open')(url)
      }
    })

    let commandContext = executeThisArgvPlease && executeThisArgvPlease.find(_ => /--command-context/.test(_))
    if (commandContext) {
      executeThisArgvPlease = executeThisArgvPlease.filter(_ => !_.match(/--command-context/))

      // strip off the leading --, to help with URL window.location.search
      commandContext = commandContext.replace(/^--/, '')
    }

    if (noHeadless === true && executeThisArgvPlease) {
      debug('setting argv', executeThisArgvPlease)
      mainWindow['executeThisArgvPlease'] = executeThisArgvPlease
    }
    debug('subwindowPrefs', subwindowPrefs)
    if (subwindowPrefs && Object.keys(subwindowPrefs).length > 0) {
      mainWindow['subwindow'] = subwindowPrefs
    }

    // and load the index.html of the app.
    const root = require('path').dirname(require.resolve('@kui-shell/settings/package.json'))
    const urlSpec = {
      pathname: require('path').join(root, 'index.html'),
      protocol: 'file:',
      search: commandContext ? `?${commandContext}` : '',
      slashes: true
    }
    debug('mainWindow::loadURL', urlSpec)
    mainWindow.loadURL(require('url').format(urlSpec))

    debug('install menus')
    require('./menu').install(createWindow)

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.once('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      nWindows--
    })

    //
    // set up ipc from renderer
    //
    const { ipcMain } = Electron

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
    ipcMain.on('capture-page-to-clipboard', (event, contentsId: string, rect) => {
      try {
        const { clipboard, nativeImage, webContents } = Electron
        webContents.fromId(parseInt(contentsId, 10)).capturePage(rect, image => {
          try {
            const buf = image.toPNG()
            clipboard.writeImage(nativeImage.createFromBuffer(buf))
            event.sender.send('capture-page-to-clipboard-done', buf)
          } catch (err) {
            console.log(err)
            event.sender.send('capture-page-to-clipboard-done')
          }
        })
      } catch (err) {
        console.log(err)
        event.sender.send('capture-page-to-clipboard-done')
      }
    })
    // end of screenshot logic

    ipcMain.on('synchronous-message', (event, arg: string) => {
      const message = JSON.parse(arg)
      switch (message.operation) {
        case 'quit':
          app.quit()
          break
        case 'open-graphical-shell':
          createWindow(true)
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
      }
      event.returnValue = 'ok'
    })
    ipcMain.on('/exec/invoke', async (event, arg: string) => {
      const message = JSON.parse(arg)
      const channel = `/exec/response/${message.hash}`
      debug('invoke', message)

      try {
        const mod = await import(message.module)
        debug('invoke got module')

        const returnValue = await mod[message.main || 'main'](message.args)
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
    })

    debug('createWindow done')
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
export const getCommand = (argv: string[]): Command => {
  debug('getCommand', argv)
  const dashDash = argv.lastIndexOf('--')
  argv = dashDash === -1 ? argv.slice(1) : argv.slice(dashDash + 1)

  // re: the -psn bit, opening Kui from macOS Finder adds additional argv -psn; see: https://github.com/IBM/kui/issues/382
  argv = argv.filter(_ => _ !== '--ui' && _ !== '--no-color' && !_.match(/^-psn/))

  // re: argv.length === 0, this should happen for double-click launches
  const isShell =
    !process.env.KUI_POPUP &&
    (argv.length === 0 ||
      argv.find(_ => _ === 'shell') ||
      (process.env.RUNNING_SHELL_TEST && !process.env.KUI_TEE_TO_FILE))

  debug('isShell', argv, isShell)

  let subwindowPlease = true
  let subwindowPrefs: ISubwindowPrefs = {
    fullscreen: true,
    width: windowDefaults.width,
    height: windowDefaults.height
  }

  if (isShell) {
    // use a full window for 'shell'
    argv = ['shell']
    subwindowPlease = false
    subwindowPrefs = {}
  } else if (process.env.KUI_POPUP) {
    argv = JSON.parse(process.env.KUI_POPUP)
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
  { isRunningHeadless = false, forceUI = false } = {},
  subwindowPlease?: boolean,
  subwindowPrefs?: ISubwindowPrefs
) {
  debug('initElectron', command, subwindowPlease, subwindowPrefs)

  let promise: Promise<void>

  // handle squirrel install and update events
  try {
    if (require('electron-squirrel-startup')) return
  } catch (err) {
    debug('electron components not directly installed')

    const spawnGraphics = () => {
      debug('waiting for graphics')
      return app.graphics.wait().then(async graphics => {
        const argv = command.slice(command.indexOf('--') + 1).concat(forceUI ? ['--ui'] : [])

        debug('spawning graphics', graphics, argv)
        try {
          const { spawn } = await import('child_process')
          const child = spawn(graphics, argv, {
            detached: !debug.enabled,
            env: Object.assign({}, process.env, {
              KUI_HEADLESS: true,
              subwindowPlease,
              subwindowPrefs: JSON.stringify(subwindowPrefs)
            })
          })
          child.stdout.on('data', data => {
            if (data.toString().indexOf('WARNING: Textured window') < 0) {
              debug(data.toString())
            }
          })
          child.stderr.on('data', data => {
            debug(data.toString())
          })

          if (!debug.enabled) {
            child.unref()
          }
        } catch (err) {
          debug('error spawning graphics', err)
        }

        debug('done with spawning graphics')
        if (!debug.enabled) {
          process.exit(0)
        }
      })
    }

    /**
     * We seem to be running with a headless.zip build; now determine
     * the best course of action
     */
    const maybeSpawnGraphics = async () => {
      if (!forceUI && !app) {
        const { initHeadless } = await import('./headless')
        await initHeadless(process.argv, true)
      } else {
        const { fetch, watch } = await import('../webapp/util/fetch-ui')
        const { userDataDir } = await import('../core/userdata')
        const stagingArea = userDataDir()
        debug('initiating UI fetcher', stagingArea)

        fetch(stagingArea)
        app = {
          graphics: watch(stagingArea)
        }
      }
      if (app.graphics) {
        promise = spawnGraphics()
      } else {
        const colors = await import('colors/safe')
        console.log(colors.red('Graphical components are not installed.'))
        process.exit(126)
      }
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { _location, name } = require('../../package.json')

      if (!_location || name !== 'kui-shell') {
        // then this is probably an unrelated package.json file
        // _location will only be present for npm install'd assets
        // and the name is there to match our top-level package.json
        await maybeSpawnGraphics()
      } else {
        console.log('Graphical components are not installed.')
        process.exit(126)
      }
    } catch (err) {
      // we couldn't find ../package.json; we're probably using a
      // headless.zip installation
      debug(err)

      await maybeSpawnGraphics()
    }
  }

  if (promise) {
    return promise
  } else if (!electron) {
    debug('loading electron')
    const Electron = await import('electron')
    electron = Electron
    app = Electron.app

    if (!app) {
      // then we're still in pure headless mode; we'll need to fork ourselves to spawn electron
      const path = await import('path')
      const { spawn } = await import('child_process')
      const appHome = path.resolve(path.join(__dirname, 'main'))

      const args = [appHome, '--', ...command]
      debug('spawning electron', appHome, args)

      // pass through any window options, originating from the command's usage model, on to the subprocess
      const windowOptions = {}
      if (subwindowPlease) {
        debug('passing through subwindowPlease', subwindowPlease)
        windowOptions['subwindowPlease'] = subwindowPlease
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
      delete env.KUI_HEADLESS
      const child = spawn(Electron.toString(), args, {
        stdio: debug.enabled ? 'inherit' : 'ignore',
        env
      })

      if (!debug.enabled) {
        // as with the "ignore stdio" comment immediately
        // above: unless we're in DEBUG mode, let's disown
        // ("unref" in nodejs terms) the subprocess
        child.unref()
      }

      debug('spawning electron done, this process will soon exit')
      process.exit(0)
    } else {
      debug('loading electron done')
    }
  }

  // linux oddities; you may see this, and disabling hardware acceleration
  // used to address it:
  //   "context mismatch in svga_sampler_view_destroy"
  /* if (process.platform === 'linux') {
        app.disableHardwareAcceleration()
    } */

  // deal with multiple processes
  if (!process.env.RUNNING_SHELL_TEST) {
    app.on('second-instance', (event, commandLine: string[]) => {
      // Someone tried to run a second instance, open a new window
      // to handle it
      const { argv, subwindowPlease, subwindowPrefs } = getCommand(commandLine)
      debug('opening window for second instance', commandLine, subwindowPlease, subwindowPrefs)
      createWindow(true, argv, subwindowPlease, subwindowPrefs)
    })
    if (!app.requestSingleInstanceLock()) {
      // The primary instance of app failed to optain the lock, which means another instance of app is already running with the lock
      debug('exiting, since we are not the first instance')
      return app.exit(0)
    }
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.once('ready', () => {
    debug('opening primary window', command)
    createWindow(true, command.length > 0 && command, subwindowPlease, subwindowPrefs)
  })

  if (process.env.RUNNING_SHELL_TEST) {
    /* app.on('before-quit', function () {
      const config = { tempDirectory: require('path').join(__dirname, '../tests/.nyc_output') }
      const nyc = new (require('nyc'))(config) // create the nyc instance

      nyc.createTempDirectory() // in case we are the first to the line
      nyc.writeCoverageFile() // write out the coverage data for the renderer code

      mainWindow.webContents.send('/coverage/dump', config)
    }) */
  }

  // Quit when all windows are closed.
  app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin' || isRunningHeadless) {
      // if we're running headless, then quit on window closed, no matter which platform we're on
      app.quit()
    } else {
      app.hide()
    }
  })

  app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (nWindows === 0) {
      createWindow()
    }
  })
} /* initElectron */
