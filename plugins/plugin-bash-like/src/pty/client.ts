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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import * as Debug from 'debug'

import * as path from 'path'
import * as xterm from 'xterm'
import stripClean from 'strip-ansi'
import { safeLoad } from 'js-yaml'
import { webLinksInit } from 'xterm/lib/addons/webLinks/webLinks'

import eventBus from '@kui-shell/core/core/events'
import { qexec as $ } from '@kui-shell/core/core/repl'
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { SidecarState, getSidecarState } from '@kui-shell/core/webapp/views/sidecar'
import { setCustomCaret, clearPendingTextSelection, setPendingTextSelection, clearTextSelection, disableInputQueueing, pasteQueuedInput, scrollIntoView, sameTab, Tab } from '@kui-shell/core/webapp/cli'
import { inBrowser } from '@kui-shell/core/core/capabilities'
import { formatUsage } from '@kui-shell/core/webapp/util/ascii-to-usage'
import { preprocessTable, formatTable } from '@kui-shell/core/webapp/util/ascii-to-table'
import { Table } from '@kui-shell/core/webapp/models/table'
import { ParsedOptions } from '@kui-shell/core/models/command'
import { ExecOptions } from '@kui-shell/core/models/execOptions'

import { Channel, InProcessChannel, WebViewChannelRendererSide } from './channel'
const debug = Debug('plugins/bash-like/pty/client')

/* eslint-disable no-control-regex */
const enterApplicationModePattern = /\x1b\[\?1h/
const exitApplicationModePattern = /\x1b\[\?1l/
const enterAltBufferPattern = /\x1b\[\??(47|1047|1049)h/
const exitAltBufferPattern = /\x1b\[\??(47|1047|1049)l/
/* eslint-enable no-control-regex */

interface Size {
  resizeGeneration: number
  sidecarState: SidecarState
  rows: number
  cols: number
}
let resizeGeneration = 0
if (window) {
  window.addEventListener('resize', () => {
    resizeGeneration++
  })
}
function getCachedSize (tab: Tab): Size {
  const cachedSize: Size = tab['_kui_pty_cachedSize']
  if (cachedSize &&
      cachedSize.sidecarState === getSidecarState(tab) &&
      cachedSize.resizeGeneration === resizeGeneration) {
    return cachedSize
  }
}
function setCachedSize (tab: Tab, { rows, cols }: { rows: number; cols: number }) {
  tab['_kui_pty_cachedSize'] = { rows, cols, sidecarState: getSidecarState(tab), resizeGeneration }
}

interface HTerminal extends xterm.Terminal {
  _core: {
    buffer: { lines: { length: number; get: (idx: number) => { isWrapped: boolean } } }
    renderer: { _terminal: { cols: number; options: { letterSpacing: number }; charMeasure: { width: number } }; dimensions: { scaledCharWidth: number; actualCellWidth: number; actualCellHeight: number; canvasWidth: number; scaledCanvasWidth: number; scaledCellWidth: number } }
  }
}

class Resizer {
  /** our tab */
  private tab: Tab

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
  private readonly resizeNow: () => void

  constructor (terminal: xterm.Terminal, tab: Tab) {
    this.tab = tab
    this.terminal = terminal as HTerminal

    this.resizeNow = this.resize.bind(this, true)
    window.addEventListener('resize', this.resizeNow) // window resize

    const ourTab = tab
    eventBus.on('/sidecar/toggle', ({ tab }: { tab: Tab }) => {
      // sidecar resize
      if (sameTab(tab, ourTab)) {
        this.resizeNow()
      } else {
        debug('toggle event, but not for our sidecar')
      }
    })

    this.resize()
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
   * xtermjs inserts lines to create a line-wrapping effect; this
   * changes the behavior so that the browser can reflow them
   * naturally (in tandem with some CSS)
   *
   */
  reflowLineWraps () {
    const rows = this.terminal.element.querySelector('.xterm-rows').children
    const internalRows = this.terminal._core.buffer.lines
    for (let idx = 0; idx < internalRows.length - 1; idx++) {
      const line = internalRows.get(idx)
      const nextLine = internalRows.get(idx + 1)
      if (nextLine.isWrapped) {
        if (rows[idx + 1]) {
          rows[idx + 1].classList.add('xterm-is-wrapped')
        }

        if (!line.isWrapped) {
          // see https://github.com/IBM/kui/issues/1605 which covers
          // wrapped -> notWrapped, from one line to the next;
          // that the first of that pair belongs with the second, but
          // itself wasn't created as a result of wrapping (that's my
          // interpretation of `isWrapped` - @starpit)
          if (rows[idx]) {
            rows[idx].classList.add('xterm-is-wrapped')
            rows[idx].classList.add('xterm-is-wrapped-with-prefix-break')
          }
          // and the CSS for these two classes will be managed by
          // web/css/xterm.css
        }
      }
    }
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
      this.frozen = true
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

  static paddingHorizontal (elt: Element) {
    const style = window.getComputedStyle(elt)
    return parseInt(style.getPropertyValue('padding-left') || '0', 10) +
      parseInt(style.getPropertyValue('padding-right') || '0', 10)
  }

  static paddingVertical (elt: Element) {
    const style = window.getComputedStyle(elt)
    return parseInt(style.getPropertyValue('padding-top') || '0', 10) +
      parseInt(style.getPropertyValue('padding-bottom') || '0', 10)
  }

  private getSize (forceRecompute: boolean) {
    const cachedSize = getCachedSize(this.tab)
    if (!forceRecompute && cachedSize !== undefined) {
      debug('getSize using cached size', cachedSize.rows, cachedSize.cols)
      return cachedSize
    }

    const _core = this.terminal._core
    const hack = _core.renderer
    const dimensions = hack.dimensions
    const scaledCharWidth = hack._terminal.charMeasure.width * window.devicePixelRatio
    const ratio = scaledCharWidth / dimensions.scaledCharWidth

    const selectorForSize = '.repl-inner'
    const sizeElement = this.tab.querySelector(selectorForSize)
    const enclosingRect = sizeElement.getBoundingClientRect()

    const selectorForWidthPad = '.repl-inner .repl-block .repl-output'
    const widthPadElement = this.tab.querySelector(selectorForWidthPad)
    const heightPadElement = sizeElement

    const width = enclosingRect.width - Resizer.paddingHorizontal(widthPadElement)
    const height = enclosingRect.height - Resizer.paddingVertical(heightPadElement)

    const cols = Math.floor(width / this.terminal._core.renderer.dimensions.actualCellWidth / ratio)
    const rows = Math.floor(height / this.terminal._core.renderer.dimensions.actualCellHeight)

    debug('getSize', cols, rows, width, height)

    const newSize = { rows, cols }
    setCachedSize(this.tab, newSize)
    return newSize
  }

  set frozen (val: boolean) {
    this._frozen = val
  }

  get frozen (): boolean {
    return this._frozen
  }

  /** flush=true means that it is likely that the dimensions might have changed; false means definitely have not changed */
  resize (flush = false) {
    if (this.frozen) {
      return
    }

    const { rows, cols } = this.getSize(flush)
    if (this.terminal.rows !== rows || this.terminal.cols !== cols) {
      debug('resize', cols, rows, this.terminal.cols, this.terminal.rows, this.inAltBufferMode())
      try {
        this.terminal.resize(cols, rows)

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

  wasEverInAltBufferMode (): boolean {
    return this.wasAlt
  }

  enterApplicationMode () {
    debug('switching to application mode')
    this.app = true
    this.tab.classList.add('xterm-application-mode')
  }

  exitApplicationMode () {
    debug('switching out of application mode')
    this.app = false
    this.tab.classList.remove('xterm-application-mode')
  }

  enterAltBufferMode () {
    debug('switching to alt buffer mode')
    this.alt = true
    this.wasAlt = true
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
let cachedFontProperties: { fontFamily: string; fontSize: number }
function getFontProperties (flush: boolean) {
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
const injectFont = (terminal: xterm.Terminal, flush = false) => {
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

type ChannelFactory = () => Promise<Channel>

/**
 * Create a websocket channel to a remote bash
 *
 */
const remoteChannelFactory: ChannelFactory = async () => {
  try {
    const url: string = await $('bash websocket open', undefined, undefined, { rethrowErrors: true })
    debug('websocket url', url)
    const WebSocketChannel = (await import('./websocket-channel')).default
    return new WebSocketChannel(url)
  } catch (err) {
    console.error('error opening websocket', err)
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
 * safeLoad from js-yaml, but protected with try/catch
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeLoadWithCatch (raw: string): Record<string, any> {
  try {
    return safeLoad(raw)
  } catch (err) {
    console.error(err)
  }
}

/**
 *
 *
 */
let alreadyInjectedCSS: boolean
export const doExec = (tab: Tab, block: HTMLElement, cmdline: string, argvNoOptions: string[], parsedOptions: ParsedOptions, execOptions: ExecOptions) => new Promise((resolve, reject) => {
  debug('doExec', cmdline)

  const contentType = parsedOptions.o || parsedOptions.output || parsedOptions.out ||
    (argvNoOptions[0] === 'cat' && /json$/.test(argvNoOptions[1]) && 'json') ||
    (argvNoOptions[0] === 'cat' && /yaml$/.test(argvNoOptions[1]) && 'yaml')
  const expectingSemiStructuredOutput = /yaml|json/.test(contentType)

  const injectingCSS = !alreadyInjectedCSS
  if (injectingCSS) {
    if (inBrowser()) {
      injectCSS({ css: require('xterm/lib/xterm.css'), key: 'xtermjs' })
      injectCSS({ css: require('@kui-shell/plugin-bash-like/web/css/xterm.css'), key: 'kui-xtermjs' })
    } else {
      injectCSS({ path: path.join(path.dirname(require.resolve('xterm/package.json')), 'lib/xterm.css'), key: 'xtermjs' })
      injectCSS({ path: path.join(path.dirname(require.resolve('@kui-shell/plugin-bash-like/package.json')), 'web/css/xterm.css'), key: 'kui-xtermjs' })
    }
    alreadyInjectedCSS = true
  }

  // this is the main work
  const exec = async () => {
    // attach the terminal to the DOM
    try {
      const parent = block.querySelector('.repl-result')
      const xtermContainer = document.createElement('div')
      xtermContainer.classList.add('xterm-container')
      xtermContainer.classList.add('repl-output-like')
      // xtermContainer.classList.add('zoomable')
      parent.appendChild(xtermContainer)

      // xtermjs will handle the "block"
      setCustomCaret(block)

      const cachedSize = getCachedSize(tab)
      const { fontFamily, fontSize } = getFontProperties(false)
      debug('creating terminal', cachedSize)
      const terminal = new xterm.Terminal({
        rendererType: 'dom',
        cols: cachedSize && cachedSize.cols,
        rows: cachedSize && cachedSize.rows,
        fontFamily,
        fontSize
      })

      // used to manage the race between pending writes to the
      // terminal canvas and process exit; see
      // https://github.com/IBM/kui/issues/1272
      let cbAfterPendingWrites: () => void
      let pendingWrites = 0

      terminal.open(xtermContainer)
      webLinksInit(terminal)

      // theming
      // injectFont(terminal) // inject once on startup
      const doInjectTheme = () => injectFont(terminal, true)
      eventBus.on('/theme/change', doInjectTheme) // and re-inject when the theme changes

      const resizer = new Resizer(terminal, tab)

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

      const cleanUpTerminal = () => {
        terminal.blur()

        cleanupEventHandlers()
        resizer.exitAltBufferMode()
        resizer.exitApplicationMode()
        resizer.reflowLineWraps()
        resizer.hideTrailingEmptyBlanks(true)
        resizer.hideCursorOnlyRow()

        resizer.destroy()
        xtermContainer.classList.add('xterm-terminated')
      }

      const channelFactory = inBrowser() ? window['webview-proxy'] !== undefined ? webviewChannelFactory : remoteChannelFactory : electronChannelFactory
      const ws: Channel = await getOrCreateChannel(cmdline, channelFactory, tab, terminal)
        .catch(err => {
          console.error('error creating channel', err)
          cleanUpTerminal()
          throw err
        })
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
      terminal.on('key', (key) => {
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
      document.addEventListener('select', () => {
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

      const notifyOfWriteCompletion = () => {
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
      terminal.on('refresh', (evt: { start: number; end: number }) => {
        debug('refresh', evt.start, evt.end)
        resizer.hideTrailingEmptyBlanks()
        doScroll()
        notifyOfWriteCompletion()
      })

      terminal.element.classList.add('fullscreen')

      let pendingUsage = false
      let definitelyNotUsage = false
      let pendingTable: Table
      let raw = ''

      let definitelyNotTable = expectingSemiStructuredOutput ||
        argvNoOptions[0] === 'grep' // short-term hack until we fix up ascii-to-table

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
          setTimeout(() => terminal.focus(), 0) // expensive reflow, async it
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
            raw += msg.data
          }

          const maybeUsage = !resizer.wasEverInAltBufferMode() &&
            !definitelyNotUsage &&
            (pendingUsage || formatUsage(cmdline, stripClean(raw), { drilldownWithPip: true }))

          if (!definitelyNotTable && raw.length > 0 && !resizer.wasEverInAltBufferMode()) {
            try {
              const tables = preprocessTable(stripClean(raw).split(/^(?=NAME|Name|ID|\n\*)/m))
                .filter(x => x)
              debug('tables', tables)

              if (tables && tables.length > 0) {
                const tableRows = tables
                  .filter(_ => _.rows !== undefined)
                  .flatMap(_ => _.rows)

                if (tableRows && tableRows.length > 0) {
                  debug('tableRows', tableRows)
                  const command = argvNoOptions[0]
                  const verb = argvNoOptions[1]
                  const entityType = /\w+/.test(argvNoOptions[2]) && argvNoOptions[2]
                  const tableModel = formatTable(command, verb, entityType, parsedOptions, tableRows)
                  debug('tableModel', tableModel)
                  pendingTable = tableModel
                }
              } else {
                definitelyNotTable = true
              }
            } catch (err) {
              console.error('error parsing as table', err)
              definitelyNotTable = true
            }
          }

          if (pendingTable || expectingSemiStructuredOutput) {
            // the above is taking care of this
          } else if (maybeUsage) {
            debug('pending usage')
            pendingUsage = true
          } else {
            if (raw.length > 500) {
              definitelyNotUsage = true
            }
            pendingWrites++
            terminal.write(msg.data)
          }
        } else if (msg.type === 'exit') {
          // server told us that it is done
          debug('exit', msg.exitCode)

          if (pendingTable && pendingTable.body.length === 0) {
            terminal.write(raw)
            pendingTable = undefined
          }

          const finishUp = async () => {
            ws.removeEventListener('message', onMessage)
            cleanUpTerminal()

            if (pendingUsage) {
              execOptions.stdout(formatUsage(cmdline, stripClean(raw), { drilldownWithPip: true }))
              xtermContainer.classList.add('xterm-invisible')
            } else if (pendingTable) {
              execOptions.stdout(pendingTable)
            } else if (expectingSemiStructuredOutput) {
              try {
                const resource = contentType === 'yaml' ? safeLoadWithCatch(stripClean(raw)) : JSON.parse(stripClean(raw))

                if (typeof resource === 'string') {
                  // degenerate case e.g. cat foo.json | jq .something.something => string rather than struct
                  execOptions.stdout(resource)
                } else {
                  execOptions.stdout({
                    type: 'custom',
                    isEntity: true,
                    name: argvNoOptions[0] === 'cat' ? path.basename(argvNoOptions[1]) : argvNoOptions.slice(3).join(' '),
                    packageName: argvNoOptions[0] === 'cat' && path.dirname(argvNoOptions[1]),
                    prettyType: argvNoOptions[0] === 'cat' ? contentType : argvNoOptions[2],
                    contentType,
                    content: stripClean(raw),
                    resource,
                    modes: [{ mode: 'raw', direct: cmdline, defaultMode: true }]
                  })
                }
              } catch (err) {
                console.error('error parsing as semi structured output')
                console.error(stripClean(raw))
                execOptions.stdout(stripClean(raw))
              }
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
            // there seems to be a 10% chance that the 'refresh' event
            // is sent to us while there is still pending information
            // flowing over the Channel; we need to get more
            // sophisticated here, but a small delay will help, for
            // the time being.
            setTimeout(finishUp, 100)
          }
        }
      }

      ws.on('message', onMessage)
    } catch (err) {
      console.error('error in pty/client', err)
      if (err['code'] === 127 || err['code'] === 404) {
        err['code'] = 127
        reject(err)
      } else {
        debug('error in client', err)
        reject(new Error('Internal Error'))
      }
    }
  }

  if (injectingCSS) {
    // do the main work after injectCSS
    setTimeout(exec, 0)
  } else {
    // otherwise, we are good to go
    exec()
  }
})
