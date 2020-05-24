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
  i18n,
  REPL,
  Arguments,
  Abortable,
  Button,
  FlowControllable,
  Streamable,
  Tab,
  ModeRegistration,
  ToolbarProps,
  ToolbarText
} from '@kui-shell/core'

import { DropDown, Icons, Loading } from '@kui-shell/plugin-client-common'

import { Pod, isPod } from '../../model/resource'
import { getCommandFromArgs } from '../../util/util'
import { KubeOptions } from '../../../controller/kubectl/options'

const strings = i18n('plugin-kubectl', 'logs')

/**
 * We will wait this many milliseconds after the PTY is ready for log
 * data to arrive before proclaiming No log data.
 *
 */
export const HYSTERESIS = 1500

export type Job = Abortable & FlowControllable

export type StreamingStatus = 'Live' | 'Paused' | 'Stopped' | 'Error'

export interface ContainerProps {
  args: Arguments<KubeOptions>
  repl: REPL
  pod: Pod
  toolbarController: ToolbarProps
}

export interface ContainerState {
  /** Are we focused on one container? `undefined` means all containers. */
  container: string

  /** The underlying PTY streaming job. */
  job: Job

  /**
   * To help with races, e.g. switch to container A, then B, then A;
   * we need to distinguish the PTYs for the first and last, despite
   * them targeting the same container
   *
   */
  streamUUID: string
}

interface State extends ContainerState {
  /** Reference to the scrollable region. Allows us to manage scroll-to-bottom. */
  ref?: HTMLElement

  /** The current log entries. */
  logs: string

  /** Are we streaming? */
  isLive: boolean

  /** It may take a second or two between establishing the PTY stream
   * and receiving the first log record. */
  waitingForHysteresis: boolean
}

export abstract class ContainerComponent<State extends ContainerState> extends React.PureComponent<
  ContainerProps,
  State
> {
  protected abstract toolbarText(status: StreamingStatus): ToolbarText

  /** Buttons to display in the Toolbar. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected toolbarButtons(status: StreamingStatus): Button[] {
    return this.containerList()
  }

  protected supportsAllContainers() {
    return false
  }

  /** When we are going away, make sure to abort the streaming job. */
  public componentWillUnmount() {
    if (this.state.job) {
      this.state.job.abort()
    }
  }

  /** Update Toolbar text and Toolbar buttons. */
  protected updateToolbar(status: StreamingStatus) {
    this.props.toolbarController.willUpdateToolbar(
      this.toolbarText(status),
      this.toolbarButtons(status),
      true // replace default buttons
    )
  }

  protected showContainer(container: string) {
    this.setState({ container })
  }

  /** Render a selection component that allows user to select a container. */
  protected containerOptions() {
    const { containers } = this.props.pod.spec
    if (containers.length > 1) {
      const actions = containers
        .map(_ => ({
          label: _.name,
          isSelected: this.state.container === _.name,
          hasDivider: false,
          handler: () => this.showContainer(_.name)
        }))
        .concat(
          !this.supportsAllContainers()
            ? []
            : [
                {
                  label: strings('All Containers'),
                  isSelected: !this.state.container,
                  hasDivider: true,
                  handler: () => this.showContainer(undefined)
                }
              ]
        )

      return <DropDown actions={actions} className="kui--repl-block-right-element" />
    }
  }

  /** List of containers that is compatible with toolbar buttons model */
  protected containerList() {
    return this.props.pod.spec.containers.length <= 1
      ? []
      : [
          {
            mode: 'container-list',
            label: 'Select a container',
            kind: 'view' as const,
            command: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
            icon: this.containerOptions()
          } as Button
        ]
  }
}

export class Logs extends ContainerComponent<State> {
  public constructor(props: ContainerProps) {
    super(props)

    const streamUUID = uuid()
    const container = this.defaultContainer()

    this.state = {
      logs: '',
      isLive: false,
      container,
      waitingForHysteresis: false,
      job: undefined,
      streamUUID
    }

    this.initStream(streamUUID, true, container)
  }

  protected supportsAllContainers() {
    return true
  }

  /** Text to display in the Toolbar. */
  protected toolbarText(status: StreamingStatus) {
    // i18n message key for toolbar text
    const msgAndType = {
      Live: {
        message: 'Logs are live streaming.',
        type: 'info' as const
      },
      Paused: {
        message: 'Log streaming is paused.',
        type: 'warning' as const
      },
      Stopped: {
        message: 'Log streaming stopped.',
        type: 'warning' as const
      },
      Error: {
        message: 'Log streaming stopped abnormally.',
        type: 'error' as const
      }
    }

    const msg1 = msgAndType[status].message
    const msg2 = `${msg1} ${this.state.container ? 'Showing container X.' : 'Showing all containers.'}`

    return {
      type: msgAndType[status].type,
      text: this.state.container ? strings(msg2, this.state.container) : strings(msg2)
    }
  }

  /** Buttons to display in the Toolbar. */
  protected toolbarButtons(status: StreamingStatus) {
    if (status === 'Stopped' || status === 'Error') {
      return this.containerList()
    } else {
      const isLive = status === 'Live'
      return [
        {
          mode: 'toggle-streaming',
          label: isLive ? strings('Pause Streaming') : strings('Resume Streaming'),
          kind: 'view',
          icon: <Icons icon={isLive ? 'Pause' : 'Play'} />,
          command: this.toggleStreaming.bind(this, !isLive)
        } as Button
      ].concat(this.containerList())
    }
  }

  /** Which container should we focus on by default? */
  protected defaultContainer() {
    // undefined means all containers
    return this.props.pod.spec.containers.length === 1 ? this.props.pod.spec.containers[0].name : undefined
  }

  /** Handler to focus on the given container. */
  protected showContainer(container?: string) {
    this.setState(curState => {
      if (curState.container !== container) {
        if (curState.job) {
          setTimeout(() => curState.job.abort(), 5000)
        }
        const streamUUID = uuid()

        this.initStream(streamUUID, true, container)

        return {
          streamUUID,
          container,
          logs: ''
        }
      }
    })
  }

  /** The part of toggleStreaming that deals with PTY flow control. */
  private doFlowControl(desiredStateIsLive = this.state.isLive) {
    if (this.state.job) {
      if (desiredStateIsLive) {
        this.state.job.xon()
      } else {
        this.state.job.xoff()
      }
    }
  }

  /** Handler for Pause/Play. */
  private toggleStreaming(desiredState: boolean) {
    if (this.state.isLive !== desiredState) {
      this.doFlowControl(desiredState)
      this.updateToolbar(desiredState ? 'Live' : 'Paused')
      this.setState(curState => {
        if (curState.isLive !== desiredState) {
          return { isLive: desiredState }
        }
      })
    }
  }

  /** Set up the PTY stream. */
  private initStream(streamUUID: string, isLive: boolean, containerName: string) {
    setTimeout(async () => {
      const { pod, repl } = this.props
      const container = containerName ? `-c ${containerName}` : '--all-containers'
      const cmd = `${getCommandFromArgs(this.props.args)} logs ${pod.metadata.name} -n ${
        pod.metadata.namespace
      } ${container} ${isLive ? '-f' : ''}`

      this.updateToolbar(isLive ? 'Live' : 'Paused')

      repl.qexec(cmd, undefined, undefined, {
        /** prior to PTY initialization, we provide a streaming consumer */
        onInit: () => {
          // this is our streaming consumer
          return (_: Streamable) => {
            if (typeof _ === 'string') {
              this.setState(curState => {
                if (curState.streamUUID === streamUUID) {
                  // concat the new logs data with the prior one
                  const allLogs = curState.logs.concat(_)
                  const charLimit = 1000000

                  // only show the last `limit` characters of the logs
                  if (allLogs.length > charLimit) {
                    const logsWithLimit = allLogs.slice(charLimit * -1)
                    // due to the limit slice, we might have partial line at the top of the logs
                    // don't display that to users
                    const trimFirstPartialLine = logsWithLimit.substring(logsWithLimit.indexOf('\n') + 1)
                    return {
                      logs: trimFirstPartialLine
                    }
                  } else {
                    return {
                      logs: allLogs
                    }
                  }
                }
              })
            } else {
              console.error('pty stream does not return string back', _)
            }
          }
        },

        /** when the PTY is up, but before any data has been processed */
        onReady: (job: Job) => {
          setTimeout(() => this.setState({ waitingForHysteresis: false }), HYSTERESIS)
          this.setState({ isLive, job, waitingForHysteresis: true })
        },

        onExit: (exitCode: number) => {
          this.setState(curState => {
            if (curState.streamUUID === streamUUID) {
              this.updateToolbar(exitCode === 0 ? 'Stopped' : 'Error')
            }
          })
        }
      })
    })
  }

  private ST: number
  private SH: number
  /** Scroll to bottom if needed. */
  private doScroll(ref = this.state.ref) {
    ref.scrollTop = ref.scrollHeight
    this.ST = ref.scrollTop
    this.SH = ref.scrollHeight
  }

  /** user (or we) have scrolled */
  private onScroll() {
    if (this.state.ref.scrollTop !== this.ST) {
      // user...
      this.toggleStreaming(false)
    }
  }

  /** Render the log content in the case we have logs to show. */
  private logs() {
    if (this.state.logs.length === 0) {
      return this.nothingToShow()
    } else {
      return <pre className="smaller-text pre-wrap break-all monospace">{this.state.logs}</pre>
    }
  }

  /** Render the log content in the case we not yet finished initializing. */
  private notDoneLoading() {
    return <Loading />
  }

  /** Render the log content in the case we no logs to show. */
  private nothingToShow() {
    return <div className="kui--hero-text">{strings('No log data')}</div>
  }

  /** Render the log content. */
  public render() {
    if (!this.state.job || this.state.waitingForHysteresis) {
      return this.notDoneLoading()
    }

    if (this.state.ref) {
      setTimeout(() => this.doScroll())
    }

    return (
      <div
        className="padding-content scrollable scrollable-auto scrollable-x kui--sidecar-text-content"
        onScroll={this.onScroll.bind(this)}
        ref={ref => {
          if (ref) {
            if (this.state.ref !== ref) {
              this.doScroll(ref)
              this.setState({ ref })
            }
          }
        }}
      >
        {this.logs()}
      </div>
    )
  }
}

/**
 * The content renderer for the summary tab
 *
 */
async function content({ REPL }: Tab, pod: Pod, args: Arguments<KubeOptions>) {
  return {
    react: function LogsProvider(toolbarController: ToolbarProps) {
      return <Logs repl={REPL} pod={pod} args={args} toolbarController={toolbarController} />
    }
  }
}

/**
 * The Summary mode applies to all KubeResources, and uses
 * `renderContent` to render the view.
 *
 */
const logsMode: ModeRegistration<Pod> = {
  when: isPod,
  mode: {
    mode: 'logs',
    label: strings('Logs'),
    content
  }
}

export default logsMode
