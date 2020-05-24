/*
 * Copyright 2020 IBM Corporation
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

import * as React from 'react'
import { v4 as uuid } from 'uuid'
import {
  Abortable,
  Arguments,
  FlowControllable,
  ModeRegistration,
  Streamable,
  Tab,
  ToolbarProps,
  ToolbarText,
  i18n,
  eventChannelUnsafe
} from '@kui-shell/core'

import { Terminal as XTerminal, ITheme } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import { getCommandFromArgs } from '../../util/util'
import { KubeOptions } from '../../../controller/kubectl/options'
import { KubeResource, Pod, isPod } from '../../model/resource'

import { ContainerProps, ContainerState, ContainerComponent } from './logs'

import '@kui-shell/plugin-bash-like/web/css/static/xterm.css'

const strings = i18n('plugin-kubectl', 'exec')

type Job = Abortable & FlowControllable
type Cleaner = () => void

interface State extends ContainerState {
  isTerminated: boolean

  dom: HTMLDivElement
  xterm: XTerminal
  doResize: () => void
  perTerminalCleaners: Cleaner[]
}

/**
 * Take a hex color string and return the corresponding RGBA with the given alpha
 *
 */
function alpha(hex: string, alpha: number): string {
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    const red = parseInt(hex.slice(1, 3), 16)
    const green = parseInt(hex.slice(3, 5), 16)
    const blue = parseInt(hex.slice(5, 7), 16)

    return `rgba(${red},${green},${blue},${alpha})`
  } else {
    return hex
  }
}

class Terminal extends ContainerComponent<State> {
  private readonly cleaners: Cleaner[] = []

  public constructor(props: ContainerProps) {
    super(props)

    this.state = {
      container: props.pod.spec.containers[0].name,

      dom: undefined,
      xterm: undefined,
      doResize: undefined,
      perTerminalCleaners: [],

      isTerminated: false,
      job: undefined,
      streamUUID: undefined
    }

    this.updateToolbar('Paused')

    const resizeListener = this.onResize.bind(this)
    window.addEventListener('resize', resizeListener)
    this.cleaners.push(() => window.removeEventListener('resize', resizeListener))
  }

  /**
   * Convert the current theme to an xterm.js ITheme
   *
   */
  private static injectTheme(xterm: XTerminal, dom: HTMLElement): void {
    const theme = getComputedStyle(dom)
    // debug('kui theme for xterm', theme)

    /** helper to extract a kui theme color */
    const val = (key: string, kind = 'color'): string => theme.getPropertyValue(`--${kind}-${key}`).trim()

    const itheme: ITheme = {
      foreground: val('text-01'),
      background: val('base01'),
      cursor: val('support-01'),
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

    // debug('itheme for xterm', itheme)
    xterm.setOption('theme', itheme)
    xterm.setOption('fontFamily', val('monospace', 'font'))

    try {
      const fontTheme = getComputedStyle(document.querySelector('body .repl .repl-input input'))
      xterm.setOption('fontSize', parseInt(fontTheme.fontSize.replace(/px$/, ''), 10))
      // terminal.setOption('lineHeight', )//parseInt(fontTheme.lineHeight.replace(/px$/, ''), 10))

      // FIXME. not tied to theme
      xterm.setOption('fontWeight', 400)
      xterm.setOption('fontWeightBold', 600)
    } catch (err) {
      console.error('Error setting terminal font size', err)
    }
  }

  private onResize() {
    if (this.state.xterm) {
      this.state.doResize()
    }
  }

  /** When we are going away, make sure to abort the streaming job. */
  public componentWillUnmount() {
    super.componentWillUnmount()
    this.disposeTerminal()
    this.cleaners.forEach(cleaner => cleaner())
  }

  private disposeTerminal() {
    this.state.xterm.dispose()
    this.state.perTerminalCleaners.forEach(cleaner => cleaner())
    this.setState({ xterm: undefined, perTerminalCleaners: [] })
  }

  /** Finish up the initialization of the stream */
  public componentDidUpdate() {
    this.updateToolbar('Live')

    if (!this.state.job && !this.state.isTerminated) {
      this.initStream()
    }
  }

  protected showContainer(container: string) {
    super.showContainer(container)

    this.setState(curState => {
      if (curState.job) {
        curState.job.abort()
      }

      return {
        job: undefined,
        streamUUID: undefined,
        isTerminated: false
      }
    })
  }

  public static getDerivedStateFromProps(props: ContainerProps, state: State) {
    if (state.dom && !state.xterm) {
      return Terminal.initTerminal(state.dom)
    } else {
      return state
    }
  }

  protected toolbarText(): ToolbarText {
    if (this.state.isTerminated) {
      return {
        type: 'error',
        text: strings('The terminal connection has closed.')
      }
    } else if (!this.state.job) {
      return {
        type: 'warning',
        text: strings('Please wait. Connecting to container X.', this.state.container)
      }
    } else {
      return {
        type: 'info',
        text: strings('Connected to container X.', this.state.container)
      }
    }
  }

  private initStream() {
    const streamUUID = uuid()
    const { pod, repl } = this.props
    const { container, xterm } = this.state
    const cmd = `${getCommandFromArgs(this.props.args)} exec -it ${pod.metadata.name} -c ${container} -n ${
      pod.metadata.namespace
    } sh`

    // Note: reset, not clear. This will fully clear the xterm screen
    // as we prepare for a new connection. clear() alone only does a
    // ctrl+L, and thus the xterm will still show e.g. the CWD part of
    // the old prompt.
    xterm.reset()

    repl.qexec(cmd, undefined, undefined, {
      onInit: () => {
        return (_: Streamable) => {
          if (typeof _ === 'string') {
            xterm.write(_)
          }
        }
      },

      onReady: (job: Job) => {
        xterm.onData((data: string) => {
          if (this.state.streamUUID === streamUUID) {
            job.write(data)
          }
        })

        xterm.focus()

        this.setState({
          job,
          streamUUID
        })
      },

      onExit: (exitCode: number) => {
        this.setState(curState => {
          if (curState.streamUUID === streamUUID) {
            this.updateToolbar(exitCode === 0 ? 'Stopped' : 'Error')
            return {
              job: undefined,
              streamUUID: undefined,
              isTerminated: true
            }
          }
        })
      }
    }) /* .catch(err => {
      console.error(err)
      this.updateToolbar('Error')
    }) */
  }

  private static initTerminal(dom: HTMLElement) {
    const xterm = new XTerminal()
    const perTerminalCleaners: Cleaner[] = []

    const inject = () => Terminal.injectTheme(xterm, dom)
    inject()
    eventChannelUnsafe.on('/theme/change', inject)
    perTerminalCleaners.push(() => eventChannelUnsafe.on('/theme/change', inject))

    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)

    xterm.open(dom)

    const doResize = () => {
      fitAddon.fit()
    }

    // resize once on init
    doResize()

    return {
      xterm,
      doResize,
      perTerminalCleaners
    }
  }

  public render() {
    if (this.state.dom && !this.state.xterm) {
      return <React.Fragment />
    } else {
      return <div className="kui--full-height" ref={dom => this.setState({ dom })} />
    }
  }
}

/**
 * The content renderer for the summary tab
 *
 */
async function content({ REPL }: Tab, pod: Pod, args: Arguments<KubeOptions>) {
  return {
    react: function TerminalProvider(toolbarController: ToolbarProps) {
      return <Terminal repl={REPL} pod={pod} args={args} toolbarController={toolbarController} />
    }
  }
}

/**
 * Add a Pods mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const terminalMode: ModeRegistration<KubeResource> = {
  when: isPod,
  mode: {
    mode: 'terminal',
    label: 'Terminal',
    content
  }
}

export default terminalMode
