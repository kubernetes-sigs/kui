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
import * as WebSocket from 'ws'

import eventBus from '@kui-shell/core/core/events'
import { qexec as $ } from '@kui-shell/core/core/repl'
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { disableInputQueueing } from '@kui-shell/core/webapp/cli'
import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'

import { formatUsage } from '@kui-shell/core/webapp/util/ascii-to-usage'

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

const defaultNRows = 1000
class Resizer {
  currentAsync: any

  readonly ws: WebSocket
  readonly terminal: xterm.Terminal
  readonly resizeNow: any

  constructor (terminal: xterm.Terminal, ws: WebSocket) {
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
   * Ensure that trailing empty lines are not visible
   *
   * @param purge: boolean remove such rows entirely from the DOM
   *
   */
  hideTrailingEmptyLines (purge = false) {
    const rows = this.terminal.element.querySelectorAll('.xterm-rows > div')

    let firstNonEmptyRowIdx = -1
    for (let idx = rows.length - 1; idx >= 0; idx--) {
      if (rows[idx].children.length > 0 && !this.isEmptyCursorRow(rows[idx])) {
        // found first non-empty row
        firstNonEmptyRowIdx = idx
        break
      }
    }

    const idx = firstNonEmptyRowIdx
    for (let jdx = idx; jdx >= 0; jdx--) {
      rows[jdx].classList.remove('hide')
    }
    for (let jdx = idx + 1; jdx < rows.length; jdx++) {
      if (purge) {
        rows[jdx].parentNode.removeChild(rows[jdx])
      } else {
        rows[jdx].classList.add('hide')
      }
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

  private resize () {
    const altBuffer = this.inAltBufferMode()

    const selector = altBuffer ? 'tab.visible .repl' : 'tab.visible .repl-input input'
    const rect = document.querySelector(selector).getBoundingClientRect()

    const cols = ~~(rect.width / this.terminal['_core'].renderer.dimensions.actualCellWidth)
    const rows = !altBuffer ? defaultNRows : ~~(rect.height / this.terminal['_core'].renderer.dimensions.actualCellHeight)
    debug('resize', cols, rows)

    this.terminal.resize(cols, rows)
    this.currentAsync = false

    setTimeout(() => this.hideTrailingEmptyLines(), 100)

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'resize', cols, rows }))
    }
  }

  inAltBufferMode (): boolean {
    return document.querySelector('tab.visible').classList.contains('xterm-alt-buffer-mode')
  }

  setModeHandler (params: number[], collect: string): boolean {
    if (collect === '?' && params.find(_ => _ === 47 || _ === 1047)) {
      // switching to alt screen buffer
      debug('switching to alt buffer mode', params, collect)
      document.querySelector('tab.visible').classList.add('xterm-alt-buffer-mode')
      this.scheduleResize()
      return true
    }
  }

  resetModeHandler (params: number[], collect: string): boolean {
    if (collect === '?' && params.find(_ => _ === 47 || _ === 1047)) {
      // switching to normal screen buffer
      debug('switching to normal buffer mode', params, collect)
      document.querySelector('tab.visible').classList.remove('xterm-alt-buffer-mode')
      this.terminal.clear()
      this.hideTrailingEmptyLines()
      this.scheduleResize()
      return true
    }
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
  // terminal.setOption('fontFamily', val('monospace', 'font'))

  try {
    const fontTheme = getComputedStyle(document.querySelector('body .repl .repl-input input'))
    terminal.setOption('fontSize', parseInt(fontTheme.fontSize.replace(/px$/, ''), 10))

    // FIXME. not tied to theme
    terminal.setOption('fontWeight', 400)
    terminal.setOption('fontWeightBold', 600)
  } catch (err) {
    console.error('Error setting terminal font size', err)
  }
}

/**
 *
 *
 */
export const doExec = (block: HTMLElement, cmdLine: string, argv: Array<String>, execOptions) => new Promise((resolve, reject) => {
  disableInputQueueing()

  const cmdLineOrig = cmdLine
  if (cmdLine.match(/^\s*git\s+/)) {
    // force git to output ANSI color codes, even though it is feeding
    // us via a pipe
    cmdLine = cmdLine.replace(/^(\s*git)(\s+)/, '$1 -c color.ui=always$2')
    debug('altered cmdline for git', cmdLine)
  } else if (cmdLine.match(/^\s*tree(\s+.*)?$/) && process.platform !== 'win32') {
    cmdLine = cmdLine.replace(/^(\s*tree)(\s*)/, `$1 -C -F -I '*~' --dirsfirst $2`)
  }

  if (inBrowser()) {
    injectCSS({ css: require('xterm/dist/xterm.css'), key: 'xtermjs' })
    injectCSS({ css: require('@kui-shell/plugin-bash-like/web/css/xterm.css'), key: 'kui-xtermjs' })
  } else {
    injectCSS({ path: path.join(path.dirname(require.resolve('xterm/package.json')), 'dist/xterm.css'), key: 'xtermjs' })
    injectCSS({ path: path.join(path.dirname(require.resolve('@kui-shell/plugin-bash-like/package.json')), 'web/css/xterm.css'), key: 'kui-xtermjs' })
  }

  // do the rest after injectCSS
  setTimeout(async () => {
    // attach the terminal to the DOM
    const parent = block.querySelector('.repl-result')
    const xtermContainer = document.createElement('div')
    xtermContainer.classList.add('xterm-container')
    xtermContainer.classList.add('repl-output-like')
    // xtermContainer.classList.add('zoomable')
    parent.appendChild(xtermContainer)

    const terminal = new xterm.Terminal({ rendererType: 'dom', rows: defaultNRows })
    terminal.open(xtermContainer)
    terminal.focus()

    // theming
    const inject = () => injectTheme(terminal)
    inject() // inject once on startup
    eventBus.on('/theme/change', inject) // and re-inject when the theme changes
    eventBus.on('/zoom', inject) // respond to font zooming

    const cmd = argv[0]
    const args = argv.slice(1).filter(x => x)
    const url = await $('bash websocket open', undefined, undefined, { parameters: { cmdLine } })
    debug('websocket url', url)
    const ws = new WebSocket(url)

    const resizer = new Resizer(terminal, ws)

    // nothing to do here for now:
    // ws.on('open', () => {})

    // tell server that we are done, so that it can clean up
    window.addEventListener('beforeunload', () => {
      ws.send(JSON.stringify({ type: 'exit', exitCode: 0 }))
    })

    // relay keyboard input to the server
    terminal.on('key', (key, ev) => {
      ws.send(JSON.stringify({ type: 'data', data: key }))
    })

    let htel
    terminal.on('linefeed', () => {
      if (!resizer.inAltBufferMode()) {
        if (htel) clearTimeout(htel)
        htel = setTimeout(resizer.hideTrailingEmptyLines.bind(resizer), 50)
        terminal.scrollToBottom()
      }
    })

    // we need to identify when the application wants us to switch
    // into and out of "alt buffer" mode; e.g. typing "vi" then :wq
    // from vi would enter and exit alt buffer mode, respectively.
    terminal.addCsiHandler('h', resizer.setModeHandler.bind(resizer))
    terminal.addCsiHandler('l', resizer.resetModeHandler.bind(resizer))

    terminal.element.classList.add('fullscreen')

    let pendingUsage = false
    let raw = ''
    ws.on('message', (data) => {
      const msg = JSON.parse(data)

      if (msg.type === 'data') {
        // plain old data flowing out of the PTY; send it on to the xterm UI
        raw += stripControlCharacters(msg.data)

        const maybeUsage = !resizer.inAltBufferMode() && (pendingUsage || formatUsage(cmdLine, msg.data, { drilldownWithPip: true }))
        if (maybeUsage) {
          pendingUsage = true
        } else {
          terminal.write(msg.data)
        }
      } else if (msg.type === 'exit') {
        // server told us that it is done
        debug('exit', msg.exitCode)
        ws.close()
        terminal.blur()

        setTimeout(() => {
          const rowWithCursor = xtermContainer.querySelector('.xterm-cursor').parentNode as Element
          if (rowWithCursor.children.length === 1) {
            // hide the row containing the cursor if it ony contains the cursor
            rowWithCursor.classList.add('hide')
          }

          // true: purge trailing empty lines, now that the subprocess has exited
          resizer.hideTrailingEmptyLines(false)
        }, 100)

        resizer.destroy()
        xtermContainer.classList.add('xterm-terminated')

        if (pendingUsage) {
          execOptions.stdout(formatUsage(cmdLine, raw, { drilldownWithPip: true }))
        }

        if (msg.exitCode !== 0) {
          const error = new Error(raw)
          if (/File exists/i.test(raw)) error['code'] = 409 // re: i18n, this is for tests
          else if (msg.exitCode !== 127 && /not found/i.test(raw)) error['code'] = 404 // re: i18n, this is for tests
          else error['code'] = msg.exitCode
          xtermContainer.classList.add('hide')
          reject(error)
        } else {
          resolve(true)
        }
      }
    })

    /* const proc = shell.exec(cmdLine, {
       async: true,
       silent: true,
       env: Object.assign({}, process.env, execOptions.env || {}, {
       IBMCLOUD_COLOR: true,
       IBMCLOUD_VERSION_CHECK: false
       })
       })

       // accumulate doms from the output of the subcommand
       const parentNode = document.createElement('div')
       let rawOut = ''
       let rawErr = ''

       const ansi2HTML = new Ansi2Html({
       bg: 'var(--color-ui-01)',
       fg: 'var(--color-text-01)',
       colors: {
       0: 'var(--color-black)',
       1: 'var(--color-red)',
       2: 'var(--color-green)',
       3: 'var(--color-yellow)',
       4: 'var(--color-blue)',
       5: 'var(--color-magenta)',
       6: 'var(--color-cyan)',
       7: 'var(--color-white)',
       8: 'var(--color-gray)',
       9: 'var(--color-light-red)',
       10: 'var(--color-light-green)',
       11: 'var(--color-light-yellow)'
       },
       stream: true // save state across calls
       })

       let pendingUsage = false
       proc.stdout.on('data', async data => {
       const handleANSI = () => {
       if (isHeadless()) {
       return data
       } else {
       const span = document.createElement('span')
       span.setAttribute('class', 'whitespace')
       span.innerHTML = ansi2HTML.toHtml(data.toString())
       return span
       }
       }

       const out = data.toString()

       if (execOptions.stdout) {
       const strippedOut = stripControlCharacters(out)
       const maybeUsage = formatUsage(cmdLine, strippedOut, { drilldownWithPip: true })
       if (maybeUsage) {
       pendingUsage = true
       rawOut += out
       // no, in case the usage comes in several batches: execOptions.stdout(maybeUsage)
       } else {
       const maybeKeyValue = formatKeyValue(strippedOut)
       if (maybeKeyValue) {
       debug('formatting as key-value')
       resolve(maybeKeyValue)
       } else {
       debug('formatting as ANSI')
       execOptions.stdout(handleANSI())
       }
       }
       } else {
       parentNode.appendChild(handleANSI())
       rawOut += out
       }
       })

       proc.stderr.on('data', data => {
       rawErr += data

       if (execOptions.stderr) {
       execOptions.stderr(data.toString())
       // stderrLines += data.toString()
       } else {
       const span = document.createElement('span')
       parentNode.appendChild(span)
       span.setAttribute('class', 'whitespace oops')
       span.innerHTML = ansi2HTML.toHtml(data.toString())
       }
       })

       proc.on('close', async exitCode => {
       if (exitCode === 0) {
       // great, the process exited normally. resolve!
       if (execOptions && execOptions.json) {
       // caller expects JSON back
       try {
       resolve(JSON.parse(rawOut))
       } catch (err) {
       let error = new Error('unexpected non-JSON')
       error['value'] = rawOut
       reject(error)
       }
       } else if (execOptions && execOptions.raw) {
       // caller just wants the raw textual output
       resolve(rawOut)
       } else if (!rawOut && !rawErr) {
       // in this case, the command produced nothing, but it did exit
       // with a 0 exit code
       resolve(true)
       } else {
       // else, we pass back a formatted form of the output
       const json = extractJSON(rawOut)

       const command = cmdLine.replace(/^\s*(\S+)\s+/, '$1')
       const verb = ''
       const entityType = ''
       const options = {}

       const noControlCharacters = stripControlCharacters(rawOut)
       debug('noControlCharacters', noControlCharacters)

       try {
       const tables = preprocessTable(noControlCharacters.split(/^(?=Name|ID|\n\*)/m))
       .filter(x => x)
       debug('tables', tables)

       if (tables && tables.length === 1) {
       const { rows, trailingString } = tables[0]
       if (!trailingString) {
       debug('rows', rows)

       options['no-header'] = true
       const table = formatTable(command, verb, entityType, options, [rows])
       debug('table', table)
       if (table.length >= 1 && table[0].length > 1) {
       return resolve(table)
       }
       }
       }
       } catch (err) {
       console.error(err)
       }

       try {
       const maybeUsage = formatUsage(cmdLine, noControlCharacters, { drilldownWithPip: true })

       if (maybeUsage) {
       // const message = await maybeUsage.message
       // debug('maybeUsage', message)
       // const commandWithoutOptions = cmdLineOrig.replace(/\s--?\w+/g, '')
       // return resolve(asSidecarEntity(commandWithoutOptions, message, {}, undefined, 'usage'))
       return resolve(maybeUsage)
       }
       } catch (err) {
       console.error(err)
       }

       if (json) {
       json['type'] = 'shell'
       json['verb'] = 'get'
       resolve(json)
       } if (reallyLong(rawOut)) {
       // a lot of output? render in sidecar
       resolve(asSidecarEntity(cmdLineOrig, parentNode, {
       sidecarHeader: !document.body.classList.contains('subwindow')
       }))
       } else {
       resolve(parentNode)
       }
       }
       } else {
       // oops, non-zero exit code. reject!
       debug('non-zero exit code', exitCode)

       try {
       const noControlCharacters = stripControlCharacters(rawOut)
       const maybeUsage = formatUsage(cmdLine, noControlCharacters, { drilldownWithPip: true, stderr: rawErr && parentNode })
       if (maybeUsage) {
       maybeUsage['code'] = exitCode
       reject(maybeUsage)
       } else {
       resolve(handleNonZeroExitCode(cmdLineOrig, exitCode, rawOut, rawErr, execOptions, parentNode))
       }
       } catch (err) {
       reject(err)
       }
       }
       }) */
  }, 0)
})
