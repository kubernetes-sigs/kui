/*
 * Copyright 2022 The Kubernetes Authors
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

import React from 'react'
import { eventChannelUnsafe } from '@kui-shell/core/mdist/api/Events'
import { ITheme, Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebglAddon } from 'xterm-addon-webgl'
import { SearchAddon, ISearchOptions } from 'xterm-addon-search'
import { Toolbar, ToolbarContent, ToolbarItem, SearchInput } from '@patternfly/react-core'

import '../../web/scss/components/Terminal/_index.scss'

export type WatchInit = () => {
  /**
   * Will be used to attach to an underlying streaming
   * provider of additional terminal output.
   */
  on(eventType: 'data', cb: (data: any) => void): void

  /** Does the caller want to handle input? */
  onInput?(data: string): void

  /** Does the caller want to handle resizes? */
  onResize?(rows: number, cols: number): void

  /**
   * Terminate any streaming. Will be invoked un unmount, whenever
   * `this.props.streamer` is given.
   */
  unwatch(): void
}

type ClassName = {
  /** Optional class for the top-level component */
  className?: string
}

export type TerminalOptions = ClassName & {
  /** Show search ui? [default: true] */
  searchable?: boolean

  /** Font size scaling factor from the stock font size from Kui [default: 16/14] */
  fontSizeAdjust?: number

  /** Initial content to display in the terminal */
  initialContent?: string
}

type Props = TerminalOptions & {
  /**
   * Commence/recommence streaming. Will be invoked on mount.
   */
  watch?: WatchInit
}

interface State extends ClassName {
  /** Ouch, something bad happened during the render */
  catastrophicError?: Error

  /** Controller for streaming output */
  streamer?: ReturnType<WatchInit>

  /** Current search filter */
  filter?: string

  /** Current search results */
  searchResults?: { resultIndex: number; resultCount: number } | void
}

export default class XTerm extends React.PureComponent<Props, State> {
  private readonly terminal: Terminal = new Terminal({
    convertEol: true,
    scrollback: 5000,
    allowProposedApi: true
  })

  private readonly searchAddon = new SearchAddon()

  private readonly cleaners: (() => void)[] = []
  private readonly container = React.createRef<HTMLDivElement>()

  public constructor(props: Props) {
    super(props)
    this.state = {
      className: 'flex-layout flex-column flex-align-stretch flex-fill' + (props.className ? ` ${props.className}` : '')
    }
  }

  public static getDerivedStateFromError(error: Error) {
    return { catastrophicError: error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('catastrophic error', error, errorInfo)
  }

  public componentDidMount() {
    if (this.mountTerminal()) {
      if (this.props.watch) {
        const streamer = this.props.watch()
        streamer.on('data', this.terminal.write.bind(this.terminal))

        if (streamer.onInput) {
          // pass user input from the terminal to the watcher
          this.terminal.onData(streamer.onInput)
          this.terminal.focus()
        }

        if (streamer.onResize) {
          const onResize = streamer.onResize
          this.terminal.onResize(({ rows, cols }) => onResize(rows, cols))
        }

        this.setState({ streamer })
      }
    }
  }

  public componentWillUnmount() {
    this.unmountTerminal()
    this.cleaners.forEach(cleaner => cleaner())

    if (this.state.streamer) {
      this.state.streamer.unwatch()
    }
  }

  private unmountTerminal() {
    if (this.terminal) {
      this.terminal.dispose()
      this.searchAddon.dispose()
    }
  }

  private mountTerminal() {
    const xtermContainer = this.container.current
    if (!xtermContainer) {
      // no, we are not yet ready to initialize the terminal
      return false
    }

    const fitAddon = new FitAddon()
    this.terminal.loadAddon(fitAddon)
    setTimeout(() => {
      this.terminal.loadAddon(this.searchAddon)
      this.searchAddon.onDidChangeResults(this.searchResults)
    }, 100)

    const inject = () => this.injectTheme(this.terminal, xtermContainer)
    inject()
    eventChannelUnsafe.on('/theme/change', inject)
    this.cleaners.push(() => eventChannelUnsafe.on('/theme/change', inject))

    eventChannelUnsafe.on('/zoom', inject)
    this.cleaners.push(() => eventChannelUnsafe.off('/zoom', inject))

    if (this.props.initialContent) {
      // @starpit i don't know why we have to split the newlines...
      // versus: this.terminal.write(this.props.initialContent)
      this.props.initialContent.split(/\n/).forEach((line, idx, A) => {
        if (idx === A.length - 1 && line.length === 0) {
          // skip trailing blank line resulting from the split
        } else {
          this.terminal.writeln(line)
        }
      })
    }

    this.terminal.open(xtermContainer)

    const webgl = new WebglAddon()
    webgl.onContextLoss(() => webgl.dispose())
    this.terminal.loadAddon(webgl)

    const doResize = () => {
      try {
        fitAddon.fit()
      } catch (err) {
        // this is due to not being in focus, so it isn't critical
        console.error(err)
      }
    }

    const observer = new ResizeObserver(function observer(observed) {
      // re: the if guard, see https://github.com/IBM/kui/issues/6585
      if (observed.every(_ => _.contentRect.width > 0 && _.contentRect.height > 0)) {
        setTimeout(doResize)
      }
    })
    observer.observe(xtermContainer)
    this.cleaners.push(() => observer.disconnect())

    // yes, we have initialized the terminal
    return true
  }

  /** Clear screen */
  public clear() {
    this.terminal.clear()
  }

  /** Write a line */
  public write(msg: string) {
    this.terminal.write(msg)
  }

  /**
   * Take a hex color string and return the corresponding RGBA with the given alpha
   *
   */
  private alpha(hex: string, alpha: number): string {
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      const red = parseInt(hex.slice(1, 3), 16)
      const green = parseInt(hex.slice(3, 5), 16)
      const blue = parseInt(hex.slice(5, 7), 16)

      return `rgba(${red},${green},${blue},${alpha})`
    } else {
      return hex
    }
  }

  /**
   * Convert the current theme to an xterm.js ITheme
   *
   */
  private injectTheme(xterm: Terminal, dom: HTMLElement): void {
    const theme = getComputedStyle(dom)
    // debug('kui theme for xterm', theme)

    /** helper to extract a kui theme color */
    const val = (key: string, kind = 'color'): string => theme.getPropertyValue(`--${kind}-${key}`).trim()

    const itheme: ITheme = {
      foreground: val('text-01'),
      background: val('sidecar-background-02'),
      cursor: val('support-01'),
      selectionBackground: this.alpha(val('selection-background'), 0.3),

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

    // debug('itheme for xterm', itheme)
    xterm.options.theme = itheme
    xterm.options.fontFamily = val('monospace', 'font')

    try {
      const standIn = document.querySelector('body .repl')
      if (standIn) {
        const fontTheme = getComputedStyle(standIn)
        xterm.options.fontSize = parseInt(fontTheme.fontSize.replace(/px$/, ''), 10) * (this.props.fontSizeAdjust || 1)
        // terminal.setOption('lineHeight', )//parseInt(fontTheme.lineHeight.replace(/px$/, ''), 10))

        // FIXME. not tied to theme
        xterm.options.fontWeight = 400
        xterm.options.fontWeightBold = 700
      }
    } catch (err) {
      console.error('Error setting terminal font size', err)
    }
  }

  private onKeyUp(evt: React.KeyboardEvent) {
    if (evt.key === 'Escape') {
      // swallow escape key presses against the xterm container,
      // e.g. we don't want hitting escape in vi to propagate to other
      // kui elements
      evt.stopPropagation()
    }
  }

  private readonly searchResults = (searchResults: State['searchResults']) => {
    this.setState({ searchResults })
  }

  /** Note: decorations need to be enabled in order for our `onSearch` handler to be called */
  private searchOptions: ISearchOptions = {
    regex: true,
    caseSensitive: true,
    decorations: { matchOverviewRuler: 'orange', activeMatchColorOverviewRuler: 'green' }
    // ^^ re: odd colors; these need to be something in order for the
    // our onSearch handler to be called... the actual values don't seem
    // to matter at the moment; let's make them obvious so we can spot
    // regressions in the future
  }

  private readonly onSearch = (evt: React.FormEvent<HTMLInputElement>, filter: string) => {
    this.setState({ filter })
    this.searchAddon.findNext(filter, this.searchOptions)
  }

  private readonly onSearchClear = () => {
    this.setState({ filter: undefined })
    this.searchAddon.clearDecorations()
  }

  private readonly onSearchNext = () => {
    if (this.state.filter) {
      this.searchAddon.findNext(this.state.filter, this.searchOptions)
    }
  }

  private readonly onSearchPrevious = () => {
    if (this.state.filter) {
      this.searchAddon.findPrevious(this.state.filter, this.searchOptions)
    }
  }

  /** @return "n/m" text to represent the current search results, for UI */
  private resultsCount() {
    if (this.state.searchResults) {
      return `${this.state.searchResults.resultIndex + 1}/${this.state.searchResults.resultCount}`
    }
  }

  private searchInput() {
    return (
      <SearchInput
        aria-label="Search output"
        placeholder="Enter search text"
        value={this.state.filter}
        onChange={this.onSearch}
        onClear={this.onSearchClear}
        onNextClick={this.onSearchNext.bind(this)}
        onPreviousClick={this.onSearchPrevious.bind(this)}
        resultsCount={this.resultsCount()}
      />
    )
  }

  private toolbar() {
    const needsToolbar = this.props.searchable !== false

    return (
      needsToolbar && (
        <Toolbar className="madwizard--toolbar">
          <ToolbarContent className="flex-fill">
            <ToolbarItem variant="search-filter" className="flex-fill">
              {this.props.searchable !== false && this.searchInput()}
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      )
    )
  }

  public render() {
    if (this.state.catastrophicError) {
      return 'InternalError'
    } else {
      return (
        <div className={this.state.className}>
          <div
            ref={this.container}
            className="xterm-container flex-layout flex-fill flex-align-stretch"
            onKeyUp={this.onKeyUp}
          />
          {this.toolbar()}
        </div>
      )
    }
  }
}
