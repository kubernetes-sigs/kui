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
import {
  i18n,
  REPL,
  Abortable,
  Button,
  FlowControllable,
  Streamable,
  Tab,
  ModeRegistration,
  ToolbarProps
} from '@kui-shell/core'

import { Pod, isPod } from '../../model/resource'
import { DropDown, Icons, Loading } from '@kui-shell/plugin-client-common'

const strings = i18n('plugin-kubectl', 'logs')

/**
 * We will wait this many milliseconds after the PTY is ready for log
 * data to arrive before proclaiming No log data.
 *
 */
const HYSTERESIS = 1500

interface Props {
  repl: REPL
  pod: Pod
  toolbarController: ToolbarProps
}

interface State {
  /** Reference to the scrollable region. Allows us to manage scroll-to-bottom. */
  ref?: HTMLElement

  /** The current log entries. */
  logs: string[]

  /** Are we streaming? */
  isLive: boolean

  /** Are we focused on one container? `undefined` means all containers. */
  container: string

  /** It may take a second or two between establishing the PTY stream
   * and receiving the first log record. */
  waitingForHysteresis: boolean

  /** The underlying PTY streaming job. */
  job: Abortable & FlowControllable
}

class Logs extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      logs: [],
      isLive: false,
      container: this.defaultContainer(),
      waitingForHysteresis: false,
      job: undefined
    }

    this.initStream(true)
  }

  /** When we are going away, make sure to abort the streaming job. */
  public componentWillUnmount() {
    if (this.state.job) {
      this.state.job.abort()
    }
  }

  /** Text to display in the Toolbar. */
  private toolbarText(isLive: boolean) {
    // i18n message key for toolbar text
    const msg1 = isLive ? 'Logs are live streaming.' : 'Log streaming is paused.'
    const msg2 = `${msg1} ${this.state.container ? 'Showing container X.' : 'Showing all containers.'}`

    return {
      type: isLive ? ('info' as const) : ('warning' as const),
      text: this.state.container ? strings(msg2, this.state.container) : strings(msg2)
    }
  }

  /** Buttons to display in the Toolbar. */
  private toolbarButtons(isLive: boolean) {
    return [
      {
        mode: 'toggle-streaming',
        label: isLive ? strings('Pause Streaming') : strings('Resume Streaming'),
        kind: 'view',
        icon: <Icons icon={isLive ? 'Pause' : 'Play'} />,
        command: this.toggleStreaming.bind(this, !isLive)
      } as Button
    ].concat(
      this.props.pod.spec.containers.length <= 1
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
    )
  }

  /** Update Toolbar text and Toolbar buttons. */
  private updateToolbar(isLive = this.state.isLive) {
    this.props.toolbarController.willUpdateToolbar(
      this.toolbarText(isLive),
      this.toolbarButtons(isLive),
      true // replace default buttons
    )
  }

  /** Which container should we focus on by default? */
  private defaultContainer() {
    // undefined means all containers
    return this.props.pod.spec.containers.length === 1 ? this.props.pod.spec.containers[0].name : undefined
  }

  /** Handler to focus on the given container. */
  private showContainer(container?: string) {
    this.setState(curState => {
      if (curState.container !== container) {
        this.initStream(this.state.isLive)
      }

      return {
        container
      }
    })
  }

  /** Render a selection component that allows user to select a container. */
  private containerOptions() {
    const { containers } = this.props.pod.spec
    if (containers.length > 1) {
      const actions = containers
        .map(_ => ({
          label: _.name,
          handler: () => this.showContainer(_.name)
        }))
        .concat([
          {
            label: strings('All Containers'),
            handler: () => this.showContainer()
          }
        ])

      return <DropDown actions={actions} className="kui--repl-block-right-element" />
    }
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
      this.updateToolbar(desiredState)
      this.setState(curState => {
        if (curState.isLive !== desiredState) {
          return { isLive: desiredState }
        }
      })
    }
  }

  /** Set up the PTY stream. */
  private initStream(isLive: boolean) {
    if (this.state.job) {
      // terminate existing watcher
      this.state.job.abort()
    }

    setTimeout(async () => {
      const { pod, repl } = this.props

      const container = this.state.container ? `-c ${this.state.container}` : '--all-containers'
      const cmd = `kubectl logs ${pod.metadata.name} -n ${pod.metadata.namespace} ${container} ${isLive ? '-f' : ''}`

      this.updateToolbar(isLive)

      repl.qexec(cmd, undefined, undefined, {
        /** prior to PTY initialization, we provide a streaming consumer */
        onInit: () => {
          // this is our streaming consumer
          return (_: Streamable) => {
            if (typeof _ === 'string') {
              this.setState(curState => ({
                logs: curState.logs.concat([_])
              }))
            }
          }
        },

        /** when the PTY is up, but before any data has been processed */
        onReady: (job: Abortable & FlowControllable) => {
          setTimeout(() => this.setState({ waitingForHysteresis: false }), HYSTERESIS)
          this.setState({ isLive, job, waitingForHysteresis: true })
        }
      })
    })
  }

  /** Scroll to bottom if needed. */
  private doScroll(ref = this.state.ref) {
    ref.scrollTop = ref.scrollHeight
  }

  /** Render the log content in the case we have logs to show. */
  private logs() {
    if (this.state.logs.length === 0) {
      return this.nothingToShow()
    } else {
      return this.state.logs.map((__html, idx) => (
        <pre key={idx} className="smaller-text pre-wrap break-all monospace" dangerouslySetInnerHTML={{ __html }} />
      ))
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
async function content({ REPL }: Tab, pod: Pod) {
  return {
    react: function LogsProvider(toolbarController: ToolbarProps) {
      return <Logs repl={REPL} pod={pod} toolbarController={toolbarController} />
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
