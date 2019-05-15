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
import { webLinksInit } from 'xterm/lib/addons/webLinks/webLinks'

import eventBus from '@kui-shell/core/core/events'
import { qexec as $ } from '@kui-shell/core/core/repl'
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { getSidecar } from '@kui-shell/core/webapp/views/sidecar'
import { clearPendingTextSelection, setPendingTextSelection, clearTextSelection, disableInputQueueing, pasteQueuedInput, scrollIntoView, sameTab, ITab } from '@kui-shell/core/webapp/cli'
import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'
import { formatUsage } from '@kui-shell/core/webapp/util/ascii-to-usage'

import { Channel, InProcessChannel, WebViewChannelRendererSide } from './channel'

const enterApplicationModePattern = /\x1b\[\?1h/
const exitApplicationModePattern = /\x1b\[\?1l/
const enterAltBufferPattern = /\x1b\[\??(47|1047|1049)h/
const exitAltBufferPattern = /\x1b\[\??(47|1047|1049)l/

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
const alpha = (hex: string, alpha: number): string => {
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
  private currentAsync: NodeJS.Timeout

  /** our tab */
  private tab: ITab

  /** exit alt buffer mode async */
  private exitAlt?: NodeJS.Timeout

  /** are we in alt buffer mode? */
  private alt = false

  /** are we in application mode? e.g. less */
  private app = false

  /** have we already deleted empty rows? */
  private _frozen = false

  private readonly terminal: xterm.Terminal
  private _ws: Channel
  private readonly resizeNow: any

  constructor (terminal: xterm.Terminal, tab: ITab) {
    this.tab = tab
    this.terminal = terminal

    const resizeNow = this.scheduleResize.bind(this)
    window.addEventListener('resize', resizeNow) // window resize

    const ourTab = tab
    eventBus.on('/sidecar/toggle', ({ tab }: { tab: ITab }) => {
      // sidecar resize
      if (sameTab(tab, ourTab)) {
        resizeNow()
      } else {
        debug('toggle event, but not for our sidecar')
      }
    })

    resizeNow()
  }

  get ws (): Channel {
    return this._ws
  }

  set ws (ws: Channel) {
    this._ws = ws
  }

  destroy () {
    window.removeEventListener('resize', this.resizeNow)
  }

  private isEmptyCursorRow (row: Element): boolean {
    return row.children.length === 1 && row.children[0].classList.contains('xterm-cursor')
  }

  /**
   * Hide trailing empty blanks
   *
   */
  hideTrailingEmptyBlanks (remove = false, from = 0) {
    if (this.frozen) {
      // we have already trimmed trailing empty blanks by removal from
      // the DOM; this is irreversible
      return
    }

    // debug('hideTrailingEmptyBlanks', remove, from)

    if (!remove) {
      const hidden = this.terminal.element.querySelectorAll('.xterm-rows > .xterm-hidden-row')
      for (let idx = 0; idx < hidden.length; idx++) {
        hidden[idx].classList.remove('xterm-hidden-row')
      }
    } else {
      this._frozen = true
    }

    const rows = this.terminal.element.querySelector('.xterm-rows').children
    for (let idx = rows.length - 1; idx >= from; idx--) {
      if (rows[idx].children.length === 0) {
        if (remove) {
          rows[idx].parentNode.removeChild(rows[idx])
        } else {
          rows[idx].classList.add('xterm-hidden-row')
        }
      } else {
        break
      }
    }
  }

  /**
   * Render a row that contains only the cursor as invisible
   *
   */
  hideCursorOnlyRow () {
    const cursor = this.terminal.element.querySelector('.xterm-rows .xterm-cursor')
    const cursorRow = cursor && (cursor.parentNode as Element)
    if (cursorRow) {
      if (cursorRow.children.length === 1) {
        cursorRow.classList.add('hide')
      }
    }
  }

  scheduleResize (when = 0) {
    if (this.currentAsync) {
      debug('cancelling current resize')
      clearTimeout(this.currentAsync)
    }

    this.currentAsync = undefined

    if (when === 0) {
      this.resize()
    } else {
      this.currentAsync = setTimeout(() => {
        this.resize()
      }, when)
    }
  }

  static paddingHorizontal (elt: Element) {
    const style = window.getComputedStyle(elt)
    return parseInt(style.getPropertyValue('padding-left') || '0', 10)
      + parseInt(style.getPropertyValue('padding-right') || '0', 10)
  }

  static paddingVertical (elt: Element) {
    const style = window.getComputedStyle(elt)
    return parseInt(style.getPropertyValue('padding-top') || '0', 10)
      + parseInt(style.getPropertyValue('padding-bottom') || '0', 10)
  }

  static getSize (terminal: xterm.Terminal, tab: Element) {
    const selectorForWidth = '.repl-inner .repl-block.processing .repl-output'
    const widthElement = tab.querySelector(selectorForWidth)
    const width = widthElement.getBoundingClientRect().width - this.paddingHorizontal(widthElement)

    const selectorForHeight = '.repl-inner'
    const heightElement = tab.querySelector(selectorForHeight)
    const height = heightElement.getBoundingClientRect().height - this.paddingVertical(heightElement)

    const cols = Math.floor(width / terminal['_core'].renderer.dimensions.actualCellWidth)
    const rows = Math.floor(height / terminal['_core'].renderer.dimensions.actualCellHeight)

    debug('getSize', cols, rows, width, height)
    return { rows, cols }
  }

  get frozen (): boolean {
    return this._frozen
  }

  private resize () {
    if (this.frozen) {
      return
    }

    const { rows, cols } = Resizer.getSize(this.terminal, this.tab)
    debug('resize', cols, rows, this.terminal.cols, this.terminal.rows, this.inAltBufferMode())

    if (this.terminal.rows !== rows || this.terminal.cols !== cols) {
      try {
        this.terminal.resize(cols, rows)
        this.currentAsync = undefined

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'resize', cols, rows }))
        }
      } catch (err) {
        debug(err.message)
      }
    }
  }

  inApplicationMode (): boolean {
    return this.app
  }

  inAltBufferMode (): boolean {
    return this.alt
  }

  enterApplicationMode () {
    debug('switching to application mode')
    this.app = true
    this.tab.classList.add('xterm-application-mode')
    this.scheduleResize(20)
  }

  exitApplicationMode () {
    debug('switching out of application mode')
    this.app = false
    this.tab.classList.remove('xterm-application-mode')
  }

  enterAltBufferMode () {
    debug('switching to alt buffer mode')
    this.alt = true
    if (this.exitAlt) {
      clearTimeout(this.exitAlt)
    }
    this.tab.classList.add('xterm-alt-buffer-mode')
  }

  exitAltBufferMode () {
    debug('switching to normal buffer mode')
    this.alt = false
    this.tab.classList.remove('xterm-alt-buffer-mode')
  }
}

/**
 * Inject current font settings
 *
 */
const injectFont = (terminal: xterm.Terminal) => {
  try {
    const fontTheme = getComputedStyle(document.querySelector('body .repl .repl-input input'))
    const fontSize = parseFloat(fontTheme.fontSize.replace(/px$/, ''))
    terminal.setOption('fontSize', fontSize)

    debug('fontSize', fontSize)

    // FIXME. not tied to theme
    terminal.setOption('fontWeight', 400)
    terminal.setOption('fontWeightBold', 600)
  } catch (err) {
    console.error('Error setting terminal font size', err)
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
    selection: alpha(val('selection-background'), 0.3),

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

  injectFont(terminal)
}

type ChannelFactory = () => Promise<Channel>

/**
 * Create a websocket channel to a remote bash
 *
 */
const remoteChannelFactory: ChannelFactory = async () => {
  const url: string = await $('bash websocket open')
  debug('websocket url', url)
  const WebSocketChannel = (await import('./websocket-channel')).default
  return new WebSocketChannel(url)
}

const electronChannelFactory: ChannelFactory = async () => {
  const channel = new InProcessChannel()
  channel.init()
  return channel
}

const webviewChannelFactory: ChannelFactory = async () => {
  console.log('webviewChannelFactory')
  const channel = new WebViewChannelRendererSide()
  channel.init()
  return channel
}

/**
 * websocket factory for remote/proxy connection
 *
 */
const getOrCreateChannel = async (cmdline: string, channelFactory: ChannelFactory, tab: Element, terminal: xterm.Terminal): Promise<Channel> => {
  // tell the server to start a subprocess
  const doExec = (ws: Channel) => {
    debug('exec after open', terminal.cols, terminal.rows)

    ws.send(JSON.stringify({
      type: 'exec',
      cmdline,
      rows: terminal.rows,
      cols: terminal.cols,
      cwd: !inBrowser() && process.cwd(),
      env: !inBrowser() && process.env
    }))
  }

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
let alreadyInjectedCSS: boolean
export const doExec = (tab: ITab, block: HTMLElement, cmdline: string, execOptions) => new Promise((resolve, reject) => {
  debug('doExec', cmdline)

  if (!alreadyInjectedCSS) {
    if (inBrowser()) {
      injectCSS({ css: require('xterm/lib/xterm.css'), key: 'xtermjs' })
      injectCSS({ css: require('@kui-shell/plugin-bash-like/web/css/xterm.css'), key: 'kui-xtermjs' })
    } else {
      injectCSS({ path: path.join(path.dirname(require.resolve('xterm/package.json')), 'lib/xterm.css'), key: 'xtermjs' })
      injectCSS({ path: path.join(path.dirname(require.resolve('@kui-shell/plugin-bash-like/package.json')), 'web/css/xterm.css'), key: 'kui-xtermjs' })
    }
    alreadyInjectedCSS = true
  }

  // make sure to grab currently visible tab right away (i.e. before
  // any asyncs), so that we can store a reference before the user
  // switches away to another tab
  const scrollRegion = tab.querySelector('.repl-inner .repl-block.processing')

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

      debug('creating terminal')
      const terminal = new xterm.Terminal({ rendererType: 'dom' })

      // used to manage the race between pending writes to the
      // terminal canvas and process exit; see
      // https://github.com/IBM/kui/issues/1272
      let cbAfterPendingWrites: () => void
      let pendingWrites = 0

      terminal.open(xtermContainer)
      webLinksInit(terminal)

      // theming
      const inject = () => injectTheme(terminal)
      inject() // inject once on startup
      eventBus.on('/theme/change', inject) // and re-inject when the theme changes

      const resizer = new Resizer(terminal, tab)

      // respond to font zooming
      const doZoom = () => {
        injectFont(terminal)
        resizer.scheduleResize()
      }
      eventBus.on('/zoom', doZoom)

      const cleanupEventHandlers = () => {
        eventBus.off('/zoom', doZoom)
      }

      // heuristic for hiding empty rows
      terminal.element.classList.add('xterm-empty-row-heuristic')
      setTimeout(() => terminal.element.classList.remove('xterm-empty-row-heuristic'), 100)

      const channelFactory = inBrowser() ? window['webview-proxy'] !== undefined ? webviewChannelFactory : remoteChannelFactory : electronChannelFactory
      const ws: Channel = await getOrCreateChannel(cmdline, channelFactory, tab, terminal)
      resizer.ws = ws

      let currentScrollAsync
      // let currentScrollAsync = scrollIntoView({ which: '.repl-block:last-child', when: 10 })
      // scrollRegion.scrollTop = scrollRegion.scrollHeight

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
      let queuedInput: string
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
        ws.send(JSON.stringify({ type: 'data', data }))
      })

      terminal.on('selection', () => {
        debug('xterm selection', terminal.getSelection())
        clearTextSelection()
        setPendingTextSelection(terminal.getSelection())
      })

      const doScroll = () => {
        try {
          if (!resizer.inAltBufferMode() && block.classList.contains('processing')) {
            if (currentScrollAsync) {
              clearTimeout(currentScrollAsync)
            }

            currentScrollAsync = setTimeout(() => {
              if (!resizer.frozen) {
                scrollIntoView({ which: '.repl-block.processing', when: 0, how: 'scrollIntoView' })
              } else {
                debug('skipping scroll to bottom for terminated xterm')
              }
            }, 50)
          }
        } catch (err) {
          console.error(err)
        }
      }

      const notifyOfWriteCompletion = (evt: { start: number, end: number }) => {
        if (pendingWrites > 0) {
          pendingWrites = 0
          if (cbAfterPendingWrites) {
            cbAfterPendingWrites()
            cbAfterPendingWrites = undefined
          }
        }
      }

      // xtermjs writes are asynchronous, and ultimately occur in an
      // animation frame; the result is that the terminal canvas may
      // receive updates after we receive a process exit event; but we
      // will always receive a `refresh` event when the animation
      // frame is done. see https://github.com/IBM/kui/issues/1272
      terminal.on('refresh', (evt: { start: number, end: number }) => {
        // debug('refresh', evt.start, evt.end)
        resizer.hideTrailingEmptyBlanks()
        doScroll()
        notifyOfWriteCompletion(evt)
      })

      terminal.element.classList.add('fullscreen')

      const onMessage = async (data: string) => {
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
            debug('pending usage')
            pendingUsage = true
          } else {
            pendingWrites++
            terminal.write(msg.data)
          }
        } else if (msg.type === 'exit') {
          // server told us that it is done
          debug('exit', msg.exitCode)

          const finishUp = async () => {
            ws.removeEventListener('message', onMessage)
            terminal.blur()

            cleanupEventHandlers()
            resizer.exitAltBufferMode()
            resizer.exitApplicationMode()
            resizer.hideTrailingEmptyBlanks(true)
            resizer.hideCursorOnlyRow()

            resizer.destroy()
            xtermContainer.classList.add('xterm-terminated')

            if (pendingUsage) {
              execOptions.stdout(formatUsage(cmdline, raw, { drilldownWithPip: true }))
            }

            // grab a copy of the terminal now that it has terminated;
            // see https://github.com/IBM/kui/issues/1393
            const copy = terminal.element.cloneNode(true) as HTMLElement
            const viewport = copy.querySelector('.xterm-viewport')
            copy.removeChild(viewport)
            copy.classList.remove('enable-mouse-events')
            xtermContainer.removeChild(terminal.element)
            xtermContainer.appendChild(copy)

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

          if (pendingWrites > 0) {
            cbAfterPendingWrites = finishUp
          } else {
            finishUp()
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
