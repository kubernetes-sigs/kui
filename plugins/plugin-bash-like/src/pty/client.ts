/*
 * Copyright 2019-2020 IBM Corporation
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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import Debug from 'debug'
import { v4 as uuid } from 'uuid'
import { IDisposable, Terminal as XTerminal } from 'xterm'
// import { webLinksInit } from 'xterm/lib/addons/webLinks/webLinks'

// uses of the public kui-shell API
import {
  Tab,
  eventBus,
  CodedError,
  inBrowser,
  ExecType,
  ExecOptions,
  ParsedOptions,
  setCustomCaret,
  sameTab,
  disableInputQueueing,
  pasteQueuedInput
} from '@kui-shell/core'

import ChannelId from './channel-id'
import { getChannelForTab } from './session'
import { cleanupTerminalAfterTermination } from './util'
import { Channel, InProcessChannel, WebViewChannelRendererSide } from './channel'

const debug = Debug('plugins/bash-like/pty/client')

/* eslint-disable no-control-regex */
const enterApplicationModePattern = /\x1b\[\?1h/
const exitApplicationModePattern = /\x1b\[\?1l/
const enterAltBufferPattern = /\x1b\[\??(47|1047|1049)h/
const exitAltBufferPattern = /\x1b\[\??(47|1047|1049)l/
/* eslint-enable no-control-regex */

import copy from './copy'

import 'xterm/css/xterm.css'
import '../../web/css/static/xterm.css'

interface Size {
  resizeGeneration: number
  //  sidecarState: SidecarState
  rows: number
  cols: number
}
let resizeGeneration = 0
if (window) {
  window.addEventListener('resize', () => {
    resizeGeneration++
  })
}
function getCachedSize(tab: Tab): Size {
  const cachedSize: Size = tab['_kui_pty_cachedSize']
  if (
    cachedSize &&
    // cachedSize.sidecarState === getSidecarState(tab) &&
    cachedSize.resizeGeneration === resizeGeneration
  ) {
    return cachedSize
  }
}
function setCachedSize(tab: Tab, { rows, cols }: { rows: number; cols: number }) {
  tab['_kui_pty_cachedSize'] = {
    rows,
    cols,
    // sidecarState: getSidecarState(tab),
    resizeGeneration
  }
}

interface HTerminal extends XTerminal {
  _core: {
    viewport: {
      _bufferService: {
        cols: number
      }
      _charSizeService: {
        width: number
      }
      _renderService: {
        dimensions: {
          scaledCharWidth: number
          actualCellWidth: number
          actualCellHeight: number
          canvasWidth: number
          scaledCanvasWidth: number
          scaledCellWidth: number
        }
      }
    }
  }
}

class Resizer {
  /** our tab */
  private readonly tab: Tab

  /** execOptions */
  private readonly execOptions: ExecOptions

  /** exit alt buffer mode async */
  private exitAlt?: NodeJS.Timeout

  /** are we in alt buffer mode? */
  private alt = false

  /** were we ever in alt buffer mode? */
  private wasAlt = false

  /** are we in application mode? e.g. less */
  private app = false

  /** have we already deleted empty rows? */
  private _frozen = false

  private readonly terminal: HTerminal

  private _ws: Channel

  private readonly uuid: string

  // remember any global event handlers that we registered in the
  // constructor, so that we can remove them in destroy()
  private readonly resizeNow: () => void
  private readonly clearXtermSelectionNow: () => void

  private readonly doToggle: ({ tab }: { tab: Tab }) => void

  constructor(terminal: XTerminal, tab: Tab, execOptions: ExecOptions, uuid: string) {
    this.tab = tab
    this.execOptions = execOptions
    this.terminal = terminal as HTerminal
    this.uuid = uuid

    // window resize; WARNING: since this is a global event, make sure
    // to remove the event listener in the destroy() method
    this.resizeNow = this.resize.bind(this, true)
    window.addEventListener('resize', this.resizeNow)

    // text selection; WARNING: since this is a global event, make
    // sure to remove the event listener in the destroy() method
    this.clearXtermSelectionNow = () => {
      terminal.clearSelection()
    }
    document.addEventListener('select', this.clearXtermSelectionNow)

    const ourTab = tab
    this.doToggle = ({ tab }: { tab: Tab }) => {
      // sidecar resize
      if (sameTab(tab, ourTab)) {
        this.resizeNow()
      } else {
        debug('toggle event, but not for our sidecar')
      }
    }
    eventBus.on('/sidecar/toggle', this.doToggle)

    this.resize()
  }

  get ws(): Channel {
    return this._ws
  }

  set ws(ws: Channel) {
    this._ws = ws
  }

  destroy() {
    this.exitAltBufferMode()
    this.exitApplicationMode()
    eventBus.off('/sidecar/toggle', this.doToggle)
    window.removeEventListener('resize', this.resizeNow)
    document.removeEventListener('select', this.clearXtermSelectionNow)
  }

  /**
   * Hide trailing empty blanks
   *
   */
  hideTrailingEmptyBlanks(remove = false, element = this.terminal.element, from = 0) {
    if (this.frozen) {
      // we have already trimmed trailing empty blanks by removal from
      // the DOM; this is irreversible
      return
    }

    // debug('hideTrailingEmptyBlanks', remove, from)

    if (!remove) {
      const hidden = element.querySelectorAll('.xterm-rows > .xterm-hidden-row')
      for (let idx = 0; idx < hidden.length; idx++) {
        hidden[idx].classList.remove('xterm-hidden-row')
      }
    } else {
      this.frozen = true
    }

    const rows = element.querySelector('.xterm-rows').children
    for (let idx = rows.length - 1; idx >= from; idx--) {
      if (rows[idx].children.length === 0) {
        if (remove) {
          rows[idx].remove()
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
  static hideCursorOnlyRow(element: Element) {
    cleanupTerminalAfterTermination(element)
  }

  static paddingHorizontal(elt: Element) {
    const style = window.getComputedStyle(elt)
    return (
      parseInt(style.getPropertyValue('padding-left') || '0', 10) +
      parseInt(style.getPropertyValue('padding-right') || '0', 10)
    )
  }

  static paddingVertical(elt: Element) {
    const style = window.getComputedStyle(elt)
    return (
      parseInt(style.getPropertyValue('padding-top') || '0', 10) +
      parseInt(style.getPropertyValue('padding-bottom') || '0', 10)
    )
  }

  private getSize(forceRecompute: boolean) {
    const cachedSize = getCachedSize(this.tab)
    if (!forceRecompute && cachedSize !== undefined) {
      // using cached size
      return cachedSize
    }

    const _core = this.terminal._core
    const hack = _core.viewport
    const dimensions = hack._renderService.dimensions
    const scaledCharWidth = hack._charSizeService.width * window.devicePixelRatio
    const ratio = scaledCharWidth / dimensions.scaledCharWidth

    const selectorForSize = '.repl-inner'
    const sizeElement = this.tab.querySelector(selectorForSize)
    const enclosingRect = sizeElement.getBoundingClientRect()

    const selectorForWidthPad = '.repl-inner .repl-block .repl-output'
    const widthPadElement = this.tab.querySelector(selectorForWidthPad)
    const heightPadElement = sizeElement

    const width = enclosingRect.width - Resizer.paddingHorizontal(widthPadElement)
    const height = enclosingRect.height - Resizer.paddingVertical(heightPadElement)

    const cols = Math.floor(width / dimensions.actualCellWidth / ratio)
    const rows = Math.floor(height / dimensions.actualCellHeight)

    debug('getSize', cols, rows, width, height)

    const newSize = { rows, cols }
    if (!isNaN(rows) && !isNaN(cols)) {
      setCachedSize(this.tab, newSize)
    }

    return newSize
  }

  set frozen(val: boolean) {
    this._frozen = val
  }

  get frozen(): boolean {
    return this._frozen
  }

  /** flush=true means that it is likely that the dimensions might have changed; false means definitely have not changed */
  resize(flush = false, force = false) {
    if (this.frozen) {
      return
    }

    const { rows, cols } = this.getSize(flush)
    if (this.terminal.rows !== rows || this.terminal.cols !== cols || force) {
      debug('resize', cols, rows, this.terminal.cols, this.terminal.rows, this.inAltBufferMode())
      try {
        if (!isNaN(rows) && !isNaN(cols)) {
          this.terminal.resize(cols, rows)

          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'resize', cols, rows, uuid: this.uuid }))
          }
        }
      } catch (err) {
        debug(err.message)
      }
    }
  }

  inApplicationMode(): boolean {
    return this.app
  }

  inAltBufferMode(): boolean {
    return this.alt
  }

  wasEverInAltBufferMode(): boolean {
    return this.wasAlt
  }

  enterApplicationMode() {
    // switching to application mode
    debug('switching to application mode')
    this.app = true
    this.tab.classList.add('xterm-application-mode')
  }

  exitApplicationMode() {
    // switching out of application mode
    debug('switching from application mode')
    this.app = false
    this.tab.classList.remove('xterm-application-mode')
  }

  enterAltBufferMode() {
    debug('switching to alt buffer mode')
    this.alt = true
    this.wasAlt = true
    if (this.exitAlt) {
      clearTimeout(this.exitAlt)
    }

    /** e.g. `kubectl exec -it mypod -- vi` doesn't seem to have the proper size */
    if (this.execOptions['pty/force-resize']) {
      const { rows, cols } = this.getSize(false)
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'resize', cols, rows: rows + 1, uuid: this.uuid }))
        setTimeout(() => {
          this.ws.send(JSON.stringify({ type: 'resize', cols, rows: rows, uuid: this.uuid }))
          this.tab.classList.add('xterm-alt-buffer-mode')
        }, 1)
      }
    } else {
      this.tab.classList.add('xterm-alt-buffer-mode')
    }
  }

  exitAltBufferMode() {
    // switching to normal buffer mode
    debug('switching from alt buffer mode')
    this.alt = false
    this.tab.classList.remove('xterm-alt-buffer-mode')
  }
}

/**
 * Handle messages coming back from the PTY
 *
 */
async function initOnMessage(
  terminal: KuiTerminal,
  xtermContainer: HTMLElement,
  ourUUID: string,
  resizer: Resizer,
  ws: Channel,
  tab: Tab,
  cmdline: string,
  argvNoOptions: string[],
  execOptions: ExecOptions,
  cleanUpTerminal: () => void,
  resolve: (val: boolean) => void,
  reject: (err: Error) => void
) {
  let gotExit = false
  let pendingWrites = 0
  let disposeOnRender: IDisposable

  const focus = (terminal: KuiTerminal) => {
    if (!terminal._kuiAlreadyFocused) {
      setTimeout(() => {
        // expensive reflow, async it
        if (!gotExit) {
          if (!terminal._kuiAlreadyFocused) {
            terminal._kuiAlreadyFocused = true
            terminal.focus()
          }
        }
      }, 100)
    }
  }

  // used to manage the race between pending writes to the
  // terminal canvas and process exit; see
  // https://github.com/IBM/kui/issues/1272
  let cbAfterPendingWrites: () => void

  let bytesWereWritten = false
  let sawCode: number
  let raw = ''

  //
  // here, we deal with user typing! we need to relay keyboard
  // input to the node-pty, but we do so with a bit of debouncing
  //
  let queuedInput = ''
  let flushAsync: NodeJS.Timeout
  if (terminal) {
    terminal.onData(key => {
      if (gotExit) {
        // keys typed after the pty process already exited
        resizer.frozen = true
        return
      }

      if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
        debug('queued input out back', key)
        queuedInput += key
      } else {
        // even with the xterm active, buffer input and flush in
        // chunks to increase responsiveness for fast typing, and
        // to reduce load in the proxy server (compared to sending
        // one message per keypress)
        queuedInput += key

        if (flushAsync) {
          clearTimeout(flushAsync)
        }
        flushAsync = setTimeout(() => {
          if (queuedInput && ws.readyState === WebSocket.OPEN) {
            const data = queuedInput
            queuedInput = ''
            ws.send(JSON.stringify({ type: 'data', data, uuid: ourUUID }))
          }
        }, 20)
      }
    })
  }

  //
  // here, we debounce scroll to bottom events
  //
  const activeDiv = tab.querySelector('.repl-inner')
  const doScroll = () => {
    if (!resizer.inAltBufferMode()) {
      activeDiv.scrollTop = activeDiv.scrollHeight
    }
  }
  const scrollPoll = terminal && setInterval(doScroll, 200)

  const onFirstMessage = () => {
    const queuedInput = disableInputQueueing(tab)
    if (queuedInput.length > 0) {
      debug('queued input up front', queuedInput)
      setTimeout(() => ws.send(JSON.stringify({ type: 'data', data: queuedInput, uuid: ourUUID })), 50)
    }

    // now that we've grabbed queued input, focus on the terminal,
    // and it will handle input for now until the process exits
    if (terminal) {
      focus(terminal)
    }
  }

  // xtermjs writes are asynchronous, and ultimately occur in an
  // animation frame; the result is that the terminal canvas may
  // receive updates after we receive a process exit event; but we
  // will always receive a `refresh` event when the animation
  // frame is done. see https://github.com/IBM/kui/issues/1272
  let first = true
  const onRefresh = async (evt: { start: number; end: number }) => {
    if (evt.end > evt.start || first) {
      resizer.hideTrailingEmptyBlanks()
    }
    first = false
  }
  if (terminal) {
    disposeOnRender = terminal.onRender(onRefresh)
  }

  // Notes: InProcessChannel returns the former (string);
  // WebSocketChannel returns the latter ({data: string}). In order to
  // avoid memory leaks in listeners, we deal with that variational
  // complexity here. The alternative cannot be to interject a handler
  // in the channel impl, because then it would be harder to remove
  // listeners...
  const onMessage = async (data: string | { data: string }) => {
    const msg = JSON.parse(typeof data === 'string' ? data : data.data)

    if (msg.uuid !== ourUUID) {
      return
    }

    if (msg.type === 'state' && msg.state === 'ready') {
      if (terminal) {
        onFirstMessage()
      }
    } else if (msg.type === 'data' && terminal) {
      // plain old data flowing out of the PTY; send it on to the xterm UI

      if (!terminal._kuiAlreadyFocused) {
        onFirstMessage()
      }

      if (enterApplicationModePattern.test(msg.data)) {
        // e.g. less start
        resizer.enterApplicationMode()
        focus(terminal)
      } else if (exitApplicationModePattern.test(msg.data)) {
        // e.g. less exit
        resizer.exitApplicationMode()
      }
      if (enterAltBufferPattern.test(msg.data)) {
        // we need to fast-track this; xterm.js does not invoke the
        // setMode/resetMode handlers till too late; we might've
        // called raw += ... even though we are in alt buffer mode
        focus(terminal)
        resizer.enterAltBufferMode()
      } else if (exitAltBufferPattern.test(msg.data)) {
        // ... same here
        resizer.exitAltBufferMode()
      } else if (!resizer.inAltBufferMode()) {
        raw += msg.data
      }

      if (execOptions.type !== ExecType.Nested || execOptions.quiet === false) {
        pendingWrites++
        bytesWereWritten = true
        sawCode = /File exists/i.test(raw) ? 409 : /no such/i.test(raw) || /not found/i.test(raw) ? 404 : sawCode
        terminal.write(msg.data, () => {
          // at this point, xterm.js has populated its data model,
          // though it may not yet have rendered the content to the
          // live DOM
          if (--pendingWrites <= 0 && cbAfterPendingWrites) {
            cbAfterPendingWrites()
          }
        })
        raw = ''
      }
    } else if (msg.type === 'data' && execOptions.stdout && execOptions.onInit) {
      bytesWereWritten = true
      execOptions.stdout(msg.data)
    } else if (msg.type === 'exit') {
      gotExit = true

      if (terminal) {
        clearInterval(scrollPoll)
        disposeOnRender.dispose()
      }

      // server told us that it is done with msg.exitCode

      if (msg.exitCode !== 0 && bytesWereWritten && xtermContainer !== undefined) {
        xtermContainer.classList.add('error')
      }

      /** emit our final response and return control to the repl */
      const respondToRepl = async () => {
        // vi, then :wq, then :q, you will get an exit code of
        // 1, but with no output (!bytesWereWritten); note how
        // we treat this as "ok", i.e. no error thrown
        if (msg.exitCode !== 0 && (bytesWereWritten || execOptions.onInit)) {
          const error = new Error('')
          if (sawCode === 409) error['code'] = 409
          // re: i18n, this is for tests
          else if (msg.exitCode !== 127 && sawCode === 404) error['code'] = 404
          // re: i18n, this is for tests
          else error['code'] = msg.exitCode

          // we want whatever the PTY emitted to by the "message" part
          // of the error; Kui core can add whatever it wants, but we
          // want to be in charge of the error message
          error['hide'] = true

          reject(error)
        } else {
          if (queuedInput && queuedInput.length > 0) {
            pasteQueuedInput(queuedInput)
          }

          resolve(true)
        }
      }
      if (!terminal) {
        ws.removeEventListener('message', onMessage)
        respondToRepl()
        return
      }

      /** called after final resize */
      const finishUp = () => {
        doScroll()

        ws.removeEventListener('message', onMessage)
        cleanUpTerminal()

        // grab a copy of the terminal now that it has terminated;
        //  1) avoids lingering xterm event capture (see https://github.com/IBM/kui/issues/1393)
        //  2) allows for optimization of one-span-per-character
        //  3) avoids race conditions and bugs with xtermjs final rendering
        //     e.g. we have seen problems with xtermjs rendering versus react shadow doms
        //          that result in xtermjs never performing the final paint in the case of scrolling
        //     note: this is still an open issue for things like `git log` or `less` where
        //           the xterm stays alive in race with scrolling
        window.requestAnimationFrame(() => {
          xtermContainer.removeChild(terminal.element)
          xtermContainer.appendChild(copy(terminal))
        })

        // respond to the REPL
        respondToRepl()
      }

      if (pendingWrites > 0) {
        cbAfterPendingWrites = finishUp
      } else {
        finishUp()
      }
    }
  }

  ws.on('message', onMessage)
}

/**
 * Inject current font settings
 *
 */
let cachedFontProperties: { fontFamily: string; fontSize: number }
function getFontProperties(flush: boolean) {
  if (flush || !cachedFontProperties) {
    debug('computing font properties')
    const fontTheme = getComputedStyle(document.querySelector('body .repl .repl-input input'))

    /** helper to extract a kui theme color */
    const val = (key: string, kind = 'color'): string => fontTheme.getPropertyValue(`--${kind}-${key}`).trim()

    const fontSize = parseFloat(fontTheme.fontSize.replace(/px$/, ''))
    const fontFamily = val('monospace', 'font')

    cachedFontProperties = { fontFamily, fontSize }
  }

  return cachedFontProperties
}
const injectFont = (terminal: XTerminal, flush = false) => {
  try {
    const { fontFamily, fontSize } = getFontProperties(flush)
    terminal.setOption('fontFamily', fontFamily)
    terminal.setOption('fontSize', fontSize)

    debug('fontSize', fontSize)

    // FIXME. not tied to theme
    terminal.setOption('fontWeight', 400)
    terminal.setOption('fontWeightBold', 600)
  } catch (err) {
    console.error('Error setting terminal font size', err)
  }
}

type ChannelFactory = (tab: Tab) => Promise<Channel>

/**
 * Create a websocket channel to a remote bash
 *
 */
const remoteChannelFactory: ChannelFactory = async (tab: Tab) => {
  try {
    // Notes: this command is expected to be handled directly by the
    // proxy server; see for example packages/proxy/app/routes/exec.js
    const resp = await tab.REPL.rexec<ChannelId>('bash websocket open', {
      rethrowErrors: true
    })
    const { url, uid, gid } = resp.content
    debug('websocket url', url, uid, gid)
    const WebSocketChannel = (await import('./websocket-channel')).default
    return new WebSocketChannel(url, uid, gid)
  } catch (err) {
    const error = err as CodedError
    if (error.statusCode !== 503) {
      // don't bother complaining too much about connection refused
      console.error('error opening websocket', err)
    }
    throw err
  }
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

interface KuiTerminal extends HTerminal {
  _kuiAlreadyFocused: boolean
}

/**
 * websocket factory for remote/proxy connection
 *
 */
const getOrCreateChannel = async (
  cmdline: string,
  uuid: string,
  tab: Tab,
  execOptions: ExecOptions,
  terminal: KuiTerminal,
  initOnMessage: (ws: Channel) => void,
  focus: (terminal: KuiTerminal) => void
): Promise<Channel> => {
  const channelFactory = inBrowser()
    ? window['webview-proxy'] !== undefined
      ? webviewChannelFactory
      : remoteChannelFactory
    : electronChannelFactory

  const env = Object.assign({}, process.env, execOptions.env || {})

  // tell the server to start a subprocess
  const doExec = async (ws: Channel) => {
    ws.removeEventListener('open', doExec)

    await initOnMessage(ws)
    const msg = {
      type: 'exec',
      cmdline,
      uuid,
      rows: terminal ? terminal.rows : 80,
      cols: terminal ? terminal.cols : 40,
      cwd: process.env.PWD || (!inBrowser() && process.cwd()), // inBrowser: see https://github.com/IBM/kui/issues/1966
      env: Object.keys(env).length > 0 && env // VERY IMPORTANT: don't send an empty process.env
    }
    debug('exec after open', msg)

    ws.send(JSON.stringify(msg))
  }

  const cachedws = getChannelForTab(tab)

  if (!cachedws || cachedws.readyState === WebSocket.CLOSING || cachedws.readyState === WebSocket.CLOSED) {
    // allocating new channel
    const ws = await channelFactory(tab)
    tab['ws'] = ws

    // when the websocket is ready, handle any queued input; only then
    // do we focus the terminal (till then, the CLI module will handle
    // queuing, and read out the value via disableInputQueueing()
    ws.on('open', () => doExec(ws))

    // when the websocket has closed, notify the user
    const onClose = function(evt) {
      debug('channel has closed', evt.target, uuid)
      ws.removeEventListener('close', onClose)
      if (!tab.state.closed) {
        debug('attempting to reestablish connection, because the tab is still open')
        eventBus.emit('/tab/offline', tab)
        eventBus.emit(`/tab/offline/${tab.state.uuid}`)
      }
    }
    ws.on('close', onClose)

    return ws
  } else {
    // reusing existing websocket
    doExec(cachedws)
    if (terminal) {
      focus(terminal)
    }
    return cachedws
  }
}

interface Options extends ParsedOptions {
  o?: string
  out?: string
  output?: string
}

/**
 *
 *
 */
export const doExec = (
  tab: Tab,
  block: HTMLElement,
  cmdline: string,
  argvNoOptions: string[],
  parsedOptions: Options,
  execOptions: ExecOptions
) =>
  new Promise((resolve, reject) => {
    // this is the main work
    const exec = async () => {
      // attach the terminal to the DOM
      let resizer: Resizer
      let terminal: KuiTerminal
      let xtermContainer: HTMLElement
      let cleanUpTerminal: () => void

      // we will use this to uniquely identify this PTY in this tab
      const ourUUID = uuid()

      try {
        const hasBlock = block !== undefined && typeof block !== 'boolean'
        if ((execOptions.quiet || execOptions.replSilence) && !hasBlock) {
          debug('Warning: non-headless PTY exec without a head')
        }

        if (!execOptions.quiet && !execOptions.replSilence && hasBlock) {
          const parent = (execOptions.block || block).querySelector('.repl-result')
          xtermContainer = document.createElement('xterm')
          xtermContainer.classList.add('xterm-container')
          xtermContainer.classList.add('repl-output-like')
          // xtermContainer.classList.add('zoomable')
          parent.appendChild(xtermContainer)

          if (execOptions.replSilence) {
            debug('repl silence')
            xtermContainer.style.display = 'none'
            xtermContainer.classList.add('repl-temporary')
          }

          // xtermjs will handle the "block"
          setCustomCaret(block)

          const cachedSize = getCachedSize(tab)
          const { fontFamily, fontSize } = getFontProperties(false)
          // creating terminal
          terminal = new XTerminal({
            rendererType: 'dom',
            cols: (cachedSize && cachedSize.cols) || 80,
            rows: (cachedSize && cachedSize.rows) || 40,
            fontFamily,
            fontSize
          }) as KuiTerminal

          terminal.open(xtermContainer)
          // webLinksInit(terminal)

          // theming
          // injectFont(terminal) // inject once on startup
          const doInjectTheme = () => injectFont(terminal, true)
          eventBus.on('/theme/change', doInjectTheme) // and re-inject when the theme changes

          resizer = new Resizer(terminal, tab, execOptions, ourUUID)

          // respond to font zooming
          const doZoom = () => {
            injectFont(terminal, true)
            resizer.resize()
          }
          eventBus.on('/zoom', doZoom)

          const cleanupEventHandlers = () => {
            eventBus.off('/zoom', doZoom)
            eventBus.off('/theme/change', doInjectTheme)
          }

          // heuristic for hiding empty rows
          terminal.element.classList.add('xterm-empty-row-heuristic')
          setTimeout(() => terminal.element.classList.remove('xterm-empty-row-heuristic'), 100)

          //
          // on exit, remove event handlers and the like
          //
          cleanUpTerminal = () => {
            cleanupEventHandlers()
            resizer.destroy()

            if (execOptions.type === ExecType.Nested && execOptions.quiet !== false) {
              xtermContainer.remove()
            } else {
              xtermContainer.classList.add('xterm-terminated')
            }
          }
        }

        // this function will be called just prior to executing the
        // command against the websocket/channel
        const init = async (ws: Channel) => {
          await initOnMessage(
            terminal,
            xtermContainer,
            ourUUID,
            resizer,
            ws,
            tab,
            cmdline,
            argvNoOptions,
            execOptions,
            cleanUpTerminal,
            resolve,
            reject
          )

          if (execOptions.onInit) {
            const job = {
              abort: () => {
                ws.send(JSON.stringify({ type: 'kill', uuid: ourUUID }))
              }
            }
            execOptions.stdout = execOptions.onInit(job)
          }
        }

        //
        // create a channel to the underlying node-pty
        //
        const ws: Channel = await getOrCreateChannel(cmdline, ourUUID, tab, execOptions, terminal, init, focus).catch(
          (err: CodedError) => {
            if (err.code !== 503) {
              // don't bother complaining too much about connection refused
              console.error('error creating channel', err)
            }
            if (cleanUpTerminal) {
              cleanUpTerminal()
            }
            throw err
          }
        )
        if (resizer) {
          resizer.ws = ws
        }
      } catch (error) {
        const err = error as CodedError
        if (err.code === 127 || err.code === 404) {
          err.code = 127
          reject(err)
        } else {
          if (err.code !== 503) {
            // don't bother complaining too much about connection refused
            debug('error in pty/client', err)
          }

          if (!err.message) {
            err.message = 'Internal Error'
          }

          reject(err)
        }
      }
    }

    exec()
  })
