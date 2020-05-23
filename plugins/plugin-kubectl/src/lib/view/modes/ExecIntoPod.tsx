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
  i18n
} from '@kui-shell/core'

import { Terminal as XTerminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import { getCommandFromArgs } from '../../util/util'
import { KubeOptions } from '../../../controller/kubectl/options'
import { KubeResource, Pod, isPod } from '../../model/resource'

import { ContainerProps, ContainerState, ContainerComponent } from './logs'

import '@kui-shell/plugin-bash-like/web/css/static/xterm.css'

const strings = i18n('plugin-kubectl', 'exec')

type Job = Abortable & FlowControllable

interface State extends ContainerState {
  isTerminated: boolean

  dom: HTMLDivElement
  xterm: XTerminal
  doResize: () => void
}

class Terminal extends ContainerComponent<State> {
  private readonly resizeListener: () => void

  public constructor(props: ContainerProps) {
    super(props)

    this.state = {
      container: props.pod.spec.containers[0].name,

      dom: undefined,
      xterm: undefined,
      doResize: undefined,

      isTerminated: false,
      job: undefined,
      streamUUID: undefined
    }

    this.updateToolbar('Paused')

    this.resizeListener = this.onResize.bind(this)
    window.addEventListener('resize', this.resizeListener)
  }

  private onResize() {
    if (this.state.xterm) {
      this.state.doResize()
    }
  }

  /** When we are going away, make sure to abort the streaming job. */
  public componentWillUnmount() {
    super.componentWillUnmount()
    this.state.xterm.dispose()

    window.removeEventListener('resize', this.resizeListener)
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

    xterm.clear()

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
    const xterm = new XTerminal({ fontFamily: 'IBM Plex Mono' })
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
      doResize
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
