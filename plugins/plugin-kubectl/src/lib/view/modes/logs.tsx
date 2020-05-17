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
  FlowControllable,
  Streamable,
  Tab,
  ModeRegistration,
  ToolbarProps
} from '@kui-shell/core'

import { Pod, isPod } from '../../model/resource'
import { Loading } from '@kui-shell/plugin-client-common'

const strings = i18n('plugin-kubectl', 'logs')

interface Props {
  repl: REPL
  pod: Pod
  toolbarController: ToolbarProps
  container?: string
}

interface State {
  ref?: HTMLElement
  logs: string[]
  isLive: boolean
  job: Abortable & FlowControllable
}

class Logs extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      logs: [],
      isLive: false,
      job: undefined
    }

    this.initStream(true)
  }

  public componentWillUnmount() {
    if (this.state.job) {
      this.state.job.abort()
    }
  }

  private updateToolbar(isLive = this.state.isLive) {
    this.props.toolbarController.willUpdateToolbar(
      {
        type: isLive ? 'info' : 'warning',
        text: isLive ? strings('Logs are live streaming') : strings('Log streaming is paused')
      },
      [
        {
          mode: 'toggle-streaming',
          label: isLive ? strings('Pause Streaming') : strings('Resume Streaming'),
          kind: 'view',
          command: this.toggleStreaming.bind(this, !isLive),
          order: -1
        }
      ]
    )
  }

  private doFlowControl(desiredStateIsLive = this.state.isLive) {
    if (this.state.job) {
      if (desiredStateIsLive) {
        this.state.job.xon()
      } else {
        this.state.job.xoff()
      }
    }
  }

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

  private initStream(isLive: boolean) {
    setTimeout(async () => {
      const { pod, repl } = this.props
      const cmd = `kubectl logs ${pod.metadata.name} -n ${pod.metadata.namespace} ${isLive ? '-f' : ''}`

      this.updateToolbar(isLive)

      repl.qexec(cmd, undefined, undefined, {
        onInit: (job: Abortable & FlowControllable) => {
          this.setState({ isLive, job })

          return (_: Streamable) => {
            if (typeof _ === 'string') {
              this.setState(curState => ({
                logs: curState.logs.concat([_])
              }))
            }
          }
        }
      })
    })
  }

  private logs() {
    if (this.state.logs.length === 0) {
      return this.nothingToShow()
    } else {
      return this.state.logs.map((__html, idx) => (
        <pre key={idx} className="pre-wrap break-all monospace" dangerouslySetInnerHTML={{ __html }} />
      ))
    }
  }

  private doScroll(ref = this.state.ref) {
    ref.scrollTop = ref.scrollHeight
  }

  private notDoneLoading() {
    return <Loading />
  }

  private nothingToShow() {
    return <div className="kui--hero-text">No log data</div>
  }

  public render() {
    if (!this.state.job) {
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
