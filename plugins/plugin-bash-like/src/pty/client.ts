/*
 * Copyright 2019 IBM Corporation
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
const debug = Debug('plugins/bash-like/pty/client')

import * as path from 'path'
import * as xterm from 'xterm'
// import * as WebSocket from 'ws'

import eventBus from '@kui-shell/core/core/events'
import { qexec as $ } from '@kui-shell/core/core/repl'
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { clearPendingTextSelection, setPendingTextSelection, clearTextSelection, disableInputQueueing, pasteQueuedInput, scrollIntoView } from '@kui-shell/core/webapp/cli'
import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'
import { formatUsage } from '@kui-shell/core/webapp/util/ascii-to-usage'

import { Channel, InProcessChannel, WebSocketChannel } from './channel'

const enterApplicationModePattern = /\x1b\[\?1h/
const exitApplicationModePattern = /\x1b\[\?1l/
const enterAltBufferPattern = /\x1b\[\??(47|1047|1049)h/
const exitAltBufferPattern = /\x1b\[\??(47|1047|1049)l/

/**
 * Strip off ANSI and other control characters from the given string
 *
 */
const stripControlCharacters = (str: string): string => {
  return str.replace(/\x1b\[(\d+;)?\d+m/g, '') // ansi color codes
    .replace(/^\x08+/, '') // control characters
    .replace(/^\x1b\[[012]?K/, '')
    .replace(/^\x1b\[\(B/, '')
    .replace(/^\x1b\[38;5;(\d+)m/, '')
    .replace(/^\x1b\[\d?J/, '')
    .replace(/^\x1b\[\d{0,3};\d{0,3}f/, '')
    .replace(/^\x1b\[?[\d;]{0,3}/, '')
    .replace(/^\W*OK\W*\n/, '') // OK at the beginning
}

/**
 * Strip off ANSI control characters and color codes
 *
 */
const stripClean = (str: string): string => {
  return str.replace(/\x1b\[[0-9;]*m/g, '') // Remove color sequences only
    .replace(/\x1b\[[0-9;]*[a-zA-Z]~?/g, '') // Remove all escape sequences
    .replace(/\x1b\[[0-9;]*[mGKH]/g, '') // Remove color and move sequences
    .replace(/\x1b\[[0-9;]*[mGKF]/g, '')
}

/**
 * Take a hex color string and return the corresponding RGBA with the given alpha
 *
 */
const alpha = (hex, alpha) => {
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    const red = parseInt(hex.slice(1,3), 16)
    const green = parseInt(hex.slice(3,5), 16)
    const blue = parseInt(hex.slice(5,7), 16)

    return `rgba(${red},${green},${blue},${alpha})`
  } else {
    return hex
  }
}

class Resizer {
  private currentAsync: any

  /** have we already hidden the cursor? */
  private hiddenCursorRow: Element

  /** are we in alt buffer mode? */
  private alt = false

  /** are we in application mode? e.g. less */
  private app = false

  private quiescent: any

  private readonly ws: Channel
  private readonly terminal: xterm.Terminal
  private readonly resizeNow: any

  constructor (terminal: xterm.Terminal, ws: Channel) {
    this.ws = ws
    this.terminal = terminal

    this.scheduleResize(100)

    this.resizeNow = () => {
      return this.scheduleResize()
    }

    window.addEventListener('resize', this.resizeNow) // window resize
    eventBus.on('/sidecar/toggle', this.resizeNow) // sidecar resize
  }

  destroy () {
    window.removeEventListener('resize', this.resizeNow)
  }

  private isEmptyCursorRow (row: Element): boolean {
    return row.children.length === 1 && row.children[0].classList.contains('xterm-cursor')
  }

  /**
   * Render a row that contains only the cursor as invisible
   *
   */
  hideCursorOnlyRow () {
    const doHide = () => {
      const cursor = this.terminal.element.querySelector('.xterm-rows .xterm-cursor')
      const cursorRow = cursor && (cursor.parentNode as Element)
      if (cursorRow) {
        if (cursorRow != this.hiddenCursorRow) { // tslint:disable-line:triple-equals
          this.maybeUnhideCursorRow()
        }

        if (cursorRow.children.length === 1) {
          cursorRow.classList.add('hide')
          this.hiddenCursorRow = cursorRow
        }
      }
    }

    // Notes: terminal.write (just above, in 'data') is
    // asynchronous. For now, cascade some calls so that we can
    // get it done ASAP.
    setTimeout(doHide, 0)
    setTimeout(doHide, 40)
    setTimeout(doHide, 200)
    setTimeout(doHide, 400)
    setTimeout(doHide, 800)
  }

  /**
   * Due to a race with exit versus data events, we need to be careful
   * to unhide the hiddenCursorRow if new data flows in
   *
   */
  maybeUnhideCursorRow () {
    if (this.hiddenCursorRow) {
      this.hiddenCursorRow.classList.remove('hide')
      this.hiddenCursorRow = undefined
    }
  }

  scheduleResize (when = 0) {
    const altBuffer = this.inAltBufferMode()
    debug('scheduleResize', altBuffer, when)

    if (this.currentAsync) {
      debug('cancelling current resize')
      clearTimeout(this.currentAsync)
    }

    if (when === 0) {
      this.resize()
    } else {
      this.currentAsync = setTimeout(() => this.resize(), when)
    }
  }

  private paddingHorizontal (elt: Element) {
    const style = window.getComputedStyle(elt)
    return parseInt(style.getPropertyValue('padding-left') || '0', 10)
      + parseInt(style.getPropertyValue('padding-right') || '0', 10)
  }

  private paddingVertical (elt: Element) {
    const style = window.getComputedStyle(elt)
    return parseInt(style.getPropertyValue('padding-top') || '0', 10)
      + parseInt(style.getPropertyValue('padding-bottom') || '0', 10)
  }

  private resize () {
    const altBuffer = this.inAltBufferMode()

    const selectorForWidth = altBuffer ? 'tab.visible .repl' : 'tab.visible .repl-inner .repl-block .repl-output'
    const widthElement = document.querySelector(selectorForWidth)
    const width = widthElement.getBoundingClientRect().width - this.paddingHorizontal(widthElement)

    const selectorForHeight = altBuffer ? selectorForWidth : 'tab.visible .repl-inner'
    const heightElement = selectorForHeight === selectorForWidth ? widthElement : document.querySelector(selectorForHeight)
    const height = heightElement.getBoundingClientRect().height - this.paddingVertical(heightElement)

    const cols = Math.floor(width / this.terminal['_core'].renderer.dimensions.actualCellWidth)
    const rows = Math.floor(height / this.terminal['_core'].renderer.dimensions.actualCellHeight)
    debug('resize', cols, rows, width, height)

    this.terminal.resize(cols, rows)
    this.currentAsync = false

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'resize', cols, rows }))
    }
  }

  inApplicationMode (): boolean {
    return this.app
  }

  inAltBufferMode (): boolean {
    return this.alt
  }

  /** ANSI control characters of the "h" class, i.e. setMode control */
  setMode (params: number[], collect: string): boolean {
    if (collect === '?' && params.find(_ => _ === 47 || _ === 1047)) {
      // switching to alt screen buffer
      this.enterAltBufferMode()
      this.scheduleResize()
      return true
    }
  }

  /** ANSI control characters of the "l" class, i.e. resetMode control */
  resetMode (params: number[], collect: string): boolean {
    if (collect === '?' && params.find(_ => _ === 47 || _ === 1047)) {
      // switching to normal screen buffer
      this.exitAltBufferMode()
      this.terminal.clear()
      this.scheduleResize()
      return true
    }
  }

  enterApplicationMode () {
    debug('switching to application mode')
    this.app = true
    document.querySelector('tab.visible').classList.add('xterm-application-mode')
  }

  exitApplicationMode () {
    debug('switching out of application mode')
    this.app = false
    document.querySelector('tab.visible').classList.remove('xterm-application-mode')
  }

  enterAltBufferMode () {
    debug('switching to alt buffer mode')
    this.alt = true
    document.querySelector('tab.visible').classList.add('xterm-alt-buffer-mode')
  }

  exitAltBufferMode () {
    debug('switching to normal buffer mode')
    this.alt = false
    document.querySelector('tab.visible').classList.remove('xterm-alt-buffer-mode')
  }
}

/**
 * Convert the current theme to an xterm.js ITheme
 *
 */
const injectTheme = (terminal: xterm.Terminal): void => {
  const theme = getComputedStyle(document.body)
  // debug('kui theme for xterm', theme)

  /** helper to extract a kui theme color */
  const val = (key: string, kind = 'color'): string => theme.getPropertyValue(`--${kind}-${key}`).trim()

  const itheme: xterm.ITheme = {
    foreground: val('text-01'),
    background: val('ui-01'),
    cursor:  val('support-01'),
    selection: alpha(val('selection-background'), 0.2),

    black: val('black'),
    red: val('red'),
    green: val('green'),
    yellow: val('yellow'),
    blue: val('blue'),
    magenta: val('magenta'),
    cyan: val('cyan'),
    white: val('white'),

    brightBlack: val('black'),
    brightRed: val('red'),
    brightGreen: val('green'),
    brightYellow: val('yellow'),
    brightBlue: val('blue'),
    brightMagenta: val('magenta'),
    brightCyan: val('cyan'),
    brightWhite: val('white')
  }

  debug('itheme for xterm', itheme)
  terminal.setOption('theme', itheme)
  terminal.setOption('fontFamily', val('monospace', 'font'))

  try {
    const fontTheme = getComputedStyle(document.querySelector('body .repl .repl-input input'))
    terminal.setOption('fontSize', parseInt(fontTheme.fontSize.replace(/px$/, ''), 10))
    // terminal.setOption('lineHeight', )//parseInt(fontTheme.lineHeight.replace(/px$/, ''), 10))

    // FIXME. not tied to theme
    terminal.setOption('fontWeight', 400)
    terminal.setOption('fontWeightBold', 600)
  } catch (err) {
    console.error('Error setting terminal font size', err)
  }
}

/**
 * Create a websocket channel to a remote bash
 *
 */
const remoteChannelFactory = async (): Promise<Channel> => {
  const url = await $('bash websocket open')
  debug('websocket url', url)
  return new WebSocketChannel(url)
}

const electronChannelFactory = async (): Promise<Channel> => {
  const channel = new InProcessChannel()
  channel.init()
  return channel
}

/**
 * websocket factory for remote/proxy connection
 *
 */
const getOrCreateChannel = async (cmdline: string, channelFactory): Promise<Channel> => {
  // tell the server to start a subprocess
  const doExec = (ws: Channel) => {
    debug('exec after open')
    ws.send(JSON.stringify({ type: 'exec', cmdline, cwd: !inBrowser() && process.cwd(), env: !inBrowser() && process.env }))
  }

  const tab = document.querySelector('tab.visible')
  const cachedws = tab['ws'] as Channel

  if (!cachedws || cachedws.readyState === WebSocket.CLOSING || cachedws.readyState === WebSocket.CLOSED) {
    debug('allocating new channel')
    const ws = await channelFactory()
    debug('allocated new channel', ws)
    tab['ws'] = ws

    // when the websocket is ready, handle any queued input; only then
    // do we focus the terminal (till then, the CLI module will handle
    // queuing, and read out the value via disableInputQueueing()
    ws.on('open', () => doExec(ws))

    return ws
  } else {
    debug('reusing existing websocket')
    doExec(cachedws)
    return cachedws
  }
}

/**
 *
 *
 */
let alreadyInjectedCSS
export const doExec = (block: HTMLElement, cmdline: string, execOptions) => new Promise((resolve, reject) => {
  debug('doExec', cmdline)

  if (!alreadyInjectedCSS) {
    if (inBrowser()) {
      injectCSS({ css: require('xterm/dist/xterm.css'), key: 'xtermjs' })
      injectCSS({ css: require('@kui-shell/plugin-bash-like/web/css/xterm.css'), key: 'kui-xtermjs' })
    } else {
      injectCSS({ path: path.join(path.dirname(require.resolve('xterm/package.json')), 'dist/xterm.css'), key: 'xtermjs' })
      injectCSS({ path: path.join(path.dirname(require.resolve('@kui-shell/plugin-bash-like/package.json')), 'web/css/xterm.css'), key: 'kui-xtermjs' })
    }
    alreadyInjectedCSS = true
  }

  // do the rest after injectCSS
  setTimeout(async () => {
    // attach the terminal to the DOM
    try {
      const parent = block.querySelector('.repl-result')
      const xtermContainer = document.createElement('div')
      xtermContainer.classList.add('xterm-container')
      xtermContainer.classList.add('repl-output-like')
      // xtermContainer.classList.add('zoomable')
      parent.appendChild(xtermContainer)

      const terminal = new xterm.Terminal({ rendererType: 'dom' })
      terminal.open(xtermContainer)

      // theming
      const inject = () => injectTheme(terminal)
      inject() // inject once on startup
      eventBus.on('/theme/change', inject) // and re-inject when the theme changes
      eventBus.on('/zoom', inject) // respond to font zooming

      const channelFactory = inBrowser() ? remoteChannelFactory : electronChannelFactory
      const ws: Channel = await getOrCreateChannel(cmdline, channelFactory)
      const resizer = new Resizer(terminal, ws)
      let currentScrollAsync = scrollIntoView({ which: '.repl-block:last-child', when: 10 })

      // tell server that we are done, so that it can clean up
      /* window.addEventListener('beforeunload', () => {
         try {
         if (ws.readyState === WebSocket.OPEN) {
         ws.send(JSON.stringify({ type: 'exit', exitCode: 0 }))
         }
         } catch (err) {
         console.error(err)
         }
         }) */

      // relay keyboard input to the server
      let queuedInput
      terminal.on('key', (key, ev) => {
        if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
          debug('queued input out back', key)
          queuedInput += key
        } else {
          ws.send(JSON.stringify({ type: 'data', data: key }))
        }
      })

      const maybeClearSelection = () => {
        if (!terminal.hasSelection()) {
          clearPendingTextSelection()
        }
      }
      terminal.on('focus', maybeClearSelection)
      terminal.on('blur', maybeClearSelection)
      document.addEventListener('select', (evt: Event) => {
        terminal.clearSelection()
      })

      terminal.on('paste', (data: string) => {
        terminal.write(data)
      })

      terminal.on('selection', () => {
        debug('xterm selection', terminal.getSelection())
        clearTextSelection()
        setPendingTextSelection(terminal.getSelection())
      })

      terminal.on('linefeed', () => {
        try {
          if (!resizer.inAltBufferMode() && block.classList.contains('processing')) {
            if (currentScrollAsync) {
              clearTimeout(currentScrollAsync)
            }
            currentScrollAsync = scrollIntoView({ which: '.repl-block:last-child', when: 30 })
          }
        } catch (err) {
          console.error(err)
        }
      })

      // we need to identify when the application wants us to switch
      // into and out of "alt buffer" mode; e.g. typing "vi" then :wq
      // from vi would enter and exit alt buffer mode, respectively.
      terminal.addCsiHandler('h', resizer.setMode.bind(resizer))
      terminal.addCsiHandler('l', resizer.resetMode.bind(resizer))

      terminal.element.classList.add('fullscreen')

      const onMessage = (data: string) => {
        const msg = JSON.parse(data)

        if (msg.type === 'state' && msg.state === 'ready') {
          const queuedInput = disableInputQueueing()
          if (queuedInput.length > 0) {
            debug('queued input up front', queuedInput)
            setTimeout(() => ws.send(JSON.stringify({ type: 'data', data: queuedInput })), 50)
          }

          // now that we've grabbed queued input, focus on the terminal,
          // and it will handle input for now until the process exits
          terminal.focus()
        } else if (msg.type === 'data') {
          // plain old data flowing out of the PTY; send it on to the xterm UI

          if (enterApplicationModePattern.test(msg.data)) {
            // e.g. less start
            resizer.enterApplicationMode()
          } else if (exitApplicationModePattern.test(msg.data)) {
            // e.g. less exit
            resizer.exitApplicationMode()
          } if (enterAltBufferPattern.test(msg.data)) {
            // we need to fast-track this; xterm.js does not invoke the
            // setMode/resetMode handlers till too late; we might've
            // called raw += ... even though we are in alt buffer mode
            resizer.enterAltBufferMode()
          } else if (exitAltBufferPattern.test(msg.data)) {
            // ... same here
            resizer.exitAltBufferMode()
          } else if (!resizer.inAltBufferMode()) {
            raw += stripClean(msg.data)
          }

          const maybeUsage = !resizer.inAltBufferMode() && (pendingUsage || formatUsage(cmdline, msg.data, { drilldownWithPip: true }))
          if (maybeUsage) {
            pendingUsage = true
          } else {
            terminal.write(msg.data)
          }
        } else if (msg.type === 'exit') {
          // server told us that it is done
          debug('exit', msg.exitCode)
          // ws.close()
          terminal.blur()

          ws.removeEventListener('message', onMessage)

          resizer.exitAltBufferMode()
          resizer.exitApplicationMode()
          resizer.hideCursorOnlyRow()

          resizer.destroy()
          xtermContainer.classList.add('xterm-terminated')

          if (pendingUsage) {
            execOptions.stdout(formatUsage(cmdline, raw, { drilldownWithPip: true }))
          }

          // vi, then :wq, then :q, you will get an exit code of 1, but
          // with no output (raw===''); note how we treat this as "ok",
          // i.e. no error thrown
          if (msg.exitCode !== 0 && raw.length > 0) {
            const error = new Error('')
            if (/File exists/i.test(raw)) error['code'] = 409 // re: i18n, this is for tests
            else if (msg.exitCode !== 127 && (/no such/i.test(raw) || /not found/i.test(raw))) error['code'] = 404 // re: i18n, this is for tests
            else error['code'] = msg.exitCode

            if (msg.exitCode === 127) {
              xtermContainer.classList.add('hide')
            } else {
              error['hide'] = true
            }

            reject(error)
          } else {
            if (queuedInput && queuedInput.length > 0) {
              pasteQueuedInput(queuedInput)
            }

            resolve(true)
          }
        }
      }

      let pendingUsage = false
      let raw = ''
      ws.on('message', onMessage)
    } catch (err) {
      if (err['code'] === 127 || err['code'] === 404) {
        err['code'] = 127
        reject(err)
      } else {
        debug('error in client', err)
        reject('Internal Error')
      }
    }
  }, 0)
})
