/*
 * Copyright 2020 The Kubernetes Authors
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
import { v4 as uuid } from 'uuid'

import {
  Arguments,
  ModeRegistration,
  Job,
  isResizable,
  Streamable,
  Tab,
  ToolbarProps,
  ToolbarText,
  i18n,
  TabLayoutChangeEvent,
  eventBus,
  eventChannelUnsafe
} from '@kui-shell/core'

import { inDebugMode, Loading } from '@kui-shell/plugin-client-common'

import { Terminal as XTerminal, ITheme } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import { getCommandFromArgs } from '../../util/util'
import { KubeResource, Pod, isPod, Deployment, ReplicaSet } from '../../model/resource'
import { KubeOptions, getContainer, withKubeconfigFrom } from '../../../controller/kubectl/options'

import { ContainerProps, ContainerState, ContainerComponent, HYSTERESIS, StreamingStatus } from './ContainerCommon'

import '../../../../web/scss/components/Terminal/Terminal.scss'

const strings = i18n('plugin-kubectl', 'exec')

/** subclasses might override this */
const mode = 'terminal'

/**
 * Interval in milliseconds before we warn the user that we are about
 * to abort the PTY.
 */
const MINUTES = 60 * 1000
const INTERVAL_TILL_IDLE_COUNTDOWN = 15 * MINUTES

/**
 * Interval in milliseconds after the first countdown after which we
 * actually abort the PTY.
 */
const INTERVAL_OF_IDLE_COUNTDOWN = 5 * MINUTES

/** Cleanup function */
type Cleaner = () => void

/** React state for the Terminal */
export interface TerminalState extends ContainerState {
  /** Are we streaming? */
  isLive: StreamingStatus

  /** Has the PTY been terminated? */
  isTerminated: boolean

  /** Have we received any data yet, from the PTY? */
  gotSomeData: boolean

  /** Are we in the period between pty init and got-some-data before
   * we want to complain about not having any data? */
  waitingForHysteresis: boolean

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

export class Terminal<S extends TerminalState = TerminalState> extends ContainerComponent<S> {
  private readonly cleaners: Cleaner[] = []

  /** After some period of receiving no data, auto-abort the PTY */
  private isIdle = true
  private idleTimeout?: ReturnType<typeof setTimeout>

  public constructor(props: ContainerProps) {
    super(props)

    this.state = {
      container: this.defaultContainer(),

      dom: undefined,
      xterm: undefined,
      doResize: undefined,
      perTerminalCleaners: [],

      isLive: 'Paused',
      isTerminated: false,
      waitingForHysteresis: false,
      gotSomeData: false,
      job: undefined,
      streamUUID: undefined
    } as S

    this.updateToolbar(this.state.isLive)

    // Tab uuid, used for listening for mode focus events. This will
    // facilitate xon/xoff as we switch tabs.
    const { uuid } = this.props.tab

    const focus = () => {
      this.doFocus()
      this.doXon()
    }
    const focusOnEvent = `/mode/focus/on/tab/${uuid}/mode/${this.mode()}`
    eventChannelUnsafe.on(focusOnEvent, focus)
    this.cleaners.push(() => eventChannelUnsafe.off(focusOnEvent, focus))

    const xoff = this.doXoff.bind(this)
    const focusOffEvent = `/mode/focus/off/tab/${uuid}/mode/${this.mode()}`
    eventChannelUnsafe.on(focusOffEvent, xoff)
    this.cleaners.push(() => eventChannelUnsafe.off(focusOffEvent, xoff))

    const resizeListener = this.onWindowResize.bind(this)
    window.addEventListener('resize', resizeListener)
    this.cleaners.push(() => window.removeEventListener('resize', resizeListener))

    const layoutListener = this.onTabLayoutChange.bind(this)
    eventBus.onTabLayoutChange(uuid, layoutListener)
    this.cleaners.push(() => eventBus.offTabLayoutChange(uuid, layoutListener))
  }

  /** Which container should we focus on by default? */
  protected defaultContainer() {
    if (this.props.args.argsForMode) {
      const container = getContainer(this.props.args.argsForMode, 'exec')
      if (container) {
        // TODO MAYBE? validate container name?
        return container
      }
    }

    return this.props.resource.spec.containers[0].name
  }

  /** Subclasses: override this! */
  protected mode() {
    return mode
  }

  private doXon() {
    if (this.state && this.state.job) {
      setTimeout(() => this.state.job.xon())
    }
  }

  private doXoff() {
    if (this.state && this.state.job) {
      setTimeout(() => this.state.job.xoff())
    }
  }

  private doFocus() {
    if (this.state && this.state.xterm) {
      setTimeout(() => {
        this.state.xterm.focus()
      })
    }
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

  private onWindowResize() {
    if (this.state.xterm) {
      this.state.doResize()
    }
  }

  private onTabLayoutChange(evt: TabLayoutChangeEvent) {
    if (this.state.xterm && !evt.isSidecarNowHidden) {
      this.state.doResize()
    }
  }

  /** When we are going away, make sure to abort the streaming job. */
  public componentWillUnmount() {
    this._unmounted = true
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
    this.updateToolbar(this.state.isLive)

    if (!this.state.job && !this.state.isTerminated) {
      this.initStream()
    }
  }

  private abortPriorJob() {
    if (this.state.job) {
      const abortThisJob = this.state.job

      // the setTimeout helps us avoid exit-after-spawn races
      setTimeout(() => abortThisJob.abort(), 5000)
    }
  }

  protected showContainer(container: string, extraState?: (curState: S) => Partial<S>) {
    this.setState(curState => {
      this.abortPriorJob()

      return Object.assign(
        {
          container,
          job: undefined,
          streamUUID: undefined,
          isTerminated: false
        },
        extraState ? extraState(curState) : {}
      )
    })
  }

  public static getDerivedStateFromProps(props: ContainerProps, state: TerminalState) {
    if (state.dom && !state.xterm) {
      return Terminal.initTerminal(state.dom)
    } else {
      return state
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected toolbarText(status: StreamingStatus): ToolbarText {
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
    } else if (this.state.isLive === 'Idle') {
      return {
        type: 'warning',
        text: strings('Connection is idle, and will expire shortly. Connected to container X.', this.state.container)
      }
    } else {
      return {
        type: 'info',
        text: strings('Connected to container X.', this.state.container)
      }
    }
  }

  /** @return the command to issue in order to initialize the pty stream */
  protected ptyCommand(): { command: string; isLive?: 'Live' | 'Paused' } {
    const { args, resource } = this.props
    const { container } = this.state

    const command =
      (args.argsForMode && withKubeconfigFrom(args.argsForMode, args.argsForMode.command)) ||
      withKubeconfigFrom(
        this.props.args,
        `${getCommandFromArgs(this.props.args)} exec -it ${resource.metadata.name} -c ${container} -n ${
          resource.metadata.namespace
        } -- sh`
      )

    // only use argsForMode once
    if (args.argsForMode && args.argsForMode.command) {
      args.argsForMode.command = undefined
    }

    return { command }
  }

  /** Write to the UI */
  protected write(line: string) {
    if (this.state.xterm) {
      this.state.xterm.write(line)
    }
  }

  /** Indicate that we have received some data */
  private gotSomeData(streamUUID: string) {
    if (!this.state.gotSomeData) {
      this.setState(curState => {
        if (!curState.gotSomeData && curState.streamUUID === streamUUID) {
          return { gotSomeData: true }
        }
      })
    }
  }

  /** Tell the user whether or not we are preparing to idle the PTY */
  private indicate(isLive: 'Idle' | 'Live' | 'Paused') {
    this.updateToolbar(isLive)
    this.setState({
      isLive
    })
  }

  private initiateIdleCountdown() {
    this.indicate('Idle')
    this.idleTimeout = setTimeout(() => {
      this.abortPriorJob()
    }, INTERVAL_OF_IDLE_COUNTDOWN)
  }

  private initiateIdleTimer() {
    return setTimeout(() => this.initiateIdleCountdown(), INTERVAL_TILL_IDLE_COUNTDOWN)
  }

  private _unmounted = false
  private _initInProgressForContainer: string | false = false
  private _initCount = 0

  /** Initialize a PTY stream from the current state's settings */
  private initStream(): void {
    const {
      tab: { REPL: repl }
    } = this.props
    const { xterm } = this.state

    const streamUUID = uuid()

    if (this._initInProgressForContainer === this.state.container) {
      return
    } else if (this._initCount++ > 0) {
      // Note: reset, not clear. This will fully clear the xterm screen
      // as we prepare for a new connection. clear() alone only does a
      // ctrl+L, and thus the xterm will still show e.g. the CWD part of
      // the old prompt.
      xterm.reset()
    }
    this._initInProgressForContainer = this.state.container

    // what command line should we use? and should we default to Live?
    // or Paused?
    const { command, isLive = 'Live' } = this.ptyCommand()

    // execute that command, setting up the onInit, onReady, and
    // onExit lifecycle handlers
    repl
      .qexec(command, undefined, undefined, {
        tab: this.props.tab,
        onInit: () => {
          if (this._unmounted) {
            return
          }

          this._initInProgressForContainer = false

          return (_: Streamable) => {
            if (this.idleTimeout) {
              clearTimeout(this.idleTimeout)
              this.indicate(isLive)
              this.idleTimeout = this.initiateIdleTimer()
            }

            if (typeof _ === 'string' && this.state.streamUUID === streamUUID) {
              this.gotSomeData(streamUUID)
              this.write(_)
            }
          }
        },

        onReady: (job: Job) => {
          if (this._unmounted) {
            return
          }

          if (isResizable(job)) {
            xterm.onResize(({ rows, cols }) => {
              job.resize(rows, cols)
            })

            const { doResize } = this.state
            if (doResize) {
              // resize once on init
              this.state.doResize()

              const observer = new ResizeObserver(function observer(observed) {
                // re: the if guard, see https://github.com/IBM/kui/issues/6585
                if (observed.every(_ => _.contentRect.width > 0 && _.contentRect.height > 0)) {
                  setTimeout(doResize)
                }
              })
              observer.observe(this.state.dom)
              this.state.perTerminalCleaners.push(() => observer.disconnect())
            }
          }

          xterm.onData((data: string) => {
            if (!this._unmounted && this.state.streamUUID === streamUUID) {
              job.write(data)
            }
          })

          this.doFocus()

          setTimeout(() => {
            if (!this.state.isTerminated) {
              this.setState(curState => {
                if (curState.streamUUID === streamUUID) {
                  return { waitingForHysteresis: false }
                }
              })
            }
          }, HYSTERESIS)

          if (this.idleTimeout) {
            clearTimeout(this.idleTimeout)
          }
          this.idleTimeout = this.initiateIdleTimer()

          this.setState({
            job,
            streamUUID,
            isLive,
            waitingForHysteresis: true
          })
        },

        onExit: (exitCode: number) => {
          if (this._unmounted) {
            return
          }

          this.setState(curState => {
            if (curState.streamUUID === streamUUID) {
              const isLive = exitCode === 0 ? 'Stopped' : 'Error'
              this.updateToolbar(isLive)
              return {
                job: undefined,
                streamUUID: undefined,
                container: curState.container,
                isLive,
                isTerminated: true
              }
            }
          })
        }
      })
      .catch(err => {
        if (!this._unmounted && this.state.streamUUID === streamUUID) {
          console.error(err)
          this.updateToolbar('Error')
        }
      })
  }

  /** Are we focusing on all containers? */
  protected isAllContainers() {
    return super.isAllContainers() && !this.state.isTerminated
  }

  private static initTerminal(dom: HTMLElement): Partial<TerminalState> {
    // for tests, we need to extract the text in the Terminal; for
    // now, we facilitate this by using the dom renderer
    const rendererType =
      inDebugMode() || process.env.RUNNING_SHELL_TEST || process.env.RUNNING_KUI_TEST ? 'dom' : 'canvas'

    const xterm = new XTerminal({
      scrollback: 1000,
      rendererType
    })
    const perTerminalCleaners: Cleaner[] = []

    const inject = () => Terminal.injectTheme(xterm, dom)
    inject()
    eventChannelUnsafe.on('/theme/change', inject)
    perTerminalCleaners.push(() => eventChannelUnsafe.on('/theme/change', inject))

    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)

    xterm.open(dom)

    const doResize = () => {
      try {
        fitAddon.fit()
      } catch (err) {
        // this is due to not being in focus, so it isn't critical
        console.error(err)
      }
    }

    return {
      xterm,
      doResize,
      perTerminalCleaners
    }
  }

  /** Should we wait a bit before proclaiming we have no data? */
  protected needsHysteresis(): boolean {
    return false
  }

  /** Render in the case we have received no information from the PTY */
  protected nothingToShow(): React.ReactNode {
    return <React.Fragment />
  }

  /** If needsHysteresis(), and we haven't yet received any data, render as such */
  protected maybeNothingToShow(): React.ReactNode {
    if (this.needsHysteresis()) {
      if (this.state.waitingForHysteresis || !this.state.xterm || !this.state.job) {
        return <React.Fragment />
      } else if (!this.state.gotSomeData) {
        return this.nothingToShow()
      }
    }
  }

  /** Not ready to render? */
  protected notReady() {
    return this.state.dom && !this.state.xterm
  }

  public render() {
    if (this.notReady()) {
      return <Loading />
    } else {
      return (
        <div
          className="kui--full-height kui--terminal kui--relative-positioning"
          data-needs-hysteresis={this.needsHysteresis()}
          data-got-some-data={this.state.gotSomeData}
          ref={dom => this.setState({ dom })}
        >
          {this.maybeNothingToShow()}
        </div>
      )
    }
  }
}

/**
 * The content renderer for the summary tab
 *
 */
async function content(tab: Tab, resource: Pod | Deployment | ReplicaSet, args: Arguments<KubeOptions>) {
  return {
    react: function TerminalProvider(toolbarController: ToolbarProps) {
      return <Terminal tab={tab} resource={resource} args={args} toolbarController={toolbarController} />
    }
  }
}

/**
 * Add a Pods mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const terminalMode: ModeRegistration<KubeResource> = {
  when: (resource: KubeResource) => isPod(resource) && !resource.isSimulacrum,
  mode: {
    mode,
    label: 'Terminal',
    content
  }
}

export default terminalMode
