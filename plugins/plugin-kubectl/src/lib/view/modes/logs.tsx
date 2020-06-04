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
import { i18n, Arguments, Button, Tab, ModeRegistration, ToolbarProps } from '@kui-shell/core'

import { Icons } from '@kui-shell/plugin-client-common'

import { Terminal } from './ExecIntoPod'
import { Pod, isPod } from '../../model/resource'
import { getCommandFromArgs } from '../../util/util'
import { ContainerProps, StreamingStatus } from './ContainerCommon'
import { KubeOptions, getContainer, hasLabel } from '../../../controller/kubectl/options'

const strings = i18n('plugin-kubectl', 'logs')

/**
 * Default --tail flag, if the user does not specify one. See
 * https://github.com/IBM/kui/issues/4810
 *
 */
const defaultTail = 1000

export class Logs extends Terminal {
  public constructor(props: ContainerProps) {
    super(props)

    this.state = Object.assign(this.state, {
      container: this.defaultContainer()
    })
  }

  protected supportsAllContainers() {
    return true
  }

  /** Which container should we focus on by default? */
  protected defaultContainer() {
    if (this.props.args.argsForMode) {
      const container = getContainer(this.props.args.argsForMode, 'logs')
      if (container) {
        // TODO MAYBE? validate container name?
        return container
      }
    }

    // undefined means all containers
    return this.props.pod.spec.containers.length === 1 ? this.props.pod.spec.containers[0].name : undefined
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

    if (!msgAndType) {
      return
    }

    const msg1 = msgAndType[status].message
    const msg2 = this.state.isTerminated
      ? msg1
      : `${msg1} ${this.state.container ? 'Showing container X.' : 'Showing all containers.'}`

    return {
      type: msgAndType[status].type,
      text: this.state.container ? strings(msg2, this.state.container) : strings(msg2)
    }
  }

  private isMulti() {
    return !!(this.props.args.argsForMode && hasLabel(this.props.args.argsForMode))
  }

  /** @return the command to issue in order to initialize the pty stream */
  protected ptyCommand() {
    const { args, pod } = this.props
    const { container: containerName } = this.state
    const container = containerName ? `-c ${containerName}` : '--all-containers'
    const isMulti = this.isMulti()

    if (args.argsForMode && args.argsForMode.command && (!isMulti || !containerName)) {
      // 1) if the user specified no container, we will inject
      // --all-containers for convenience
      // 2) only use argsForMode once
      // 3) do not add -f unless the user requested it
      const tail = !args.argsForMode.parsedOptions.tail ? ` --tail ${defaultTail}` : ''
      const command = `${args.argsForMode.command} ${!containerName ? container : ''} ${tail}`

      if (!isMulti) {
        args.argsForMode.command = undefined // point 2
      }

      return { command, isLive: args.parsedOptions.f ? ('Live' as const) : ('Paused' as const) }
    } else {
      // pod:container? a sign of a multi-pod view
      const dashF = !isMulti || (args.argsForMode && args.argsForMode.parsedOptions.f) ? '-f' : ''
      const isLive = dashF ? ('Live' as const) : undefined

      if (!containerName && args.argsForMode && hasLabel(args.argsForMode)) {
        // all container... re-execute label-selector
        return { command: args.argsForMode.command, isLive }
      }

      const split = isMulti && containerName && containerName.split(/:/)
      const possibleMulti = split && split.length === 2 && split
      const podName = possibleMulti ? possibleMulti[0] : pod.metadata.name
      const theContainer = possibleMulti ? `-c ${possibleMulti[1]}` : container

      const command = `${getCommandFromArgs(args)} logs ${podName} -n ${
        pod.metadata.namespace
      } ${theContainer} ${dashF} --tail ${defaultTail}`

      return {
        isLive,
        command
      }
    }
  }

  protected toolbarButtonsForStreaming(status: StreamingStatus): Button[] {
    if (status === 'Live' || status === 'Paused') {
      const isLive = status === 'Live'
      return [
        {
          mode: 'toggle-streaming',
          label: isLive ? strings('Pause Streaming') : strings('Resume Streaming'),
          kind: 'view',
          icon: <Icons icon={isLive ? 'Pause' : 'Play'} />,
          command: this.toggleStreaming.bind(this, !isLive)
        } as Button
      ]
    } else {
      return []
    }
  }

  /** The part of toggleStreaming that deals with PTY flow control. */
  private doFlowControl(desiredStateIsLive: boolean) {
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
    const desiredStatus = desiredState ? 'Live' : 'Paused'
    if (this.state.isLive !== desiredStatus) {
      this.doFlowControl(desiredState)
      this.updateToolbar(desiredState ? 'Live' : 'Paused')
      this.setState(curState => {
        if (curState.isLive !== desiredStatus) {
          return { isLive: desiredStatus }
        }
      })
    }
  }

  /** Should we wait a bit before proclaiming we have no data? */
  protected needsHysteresis() {
    return true
  }

  /** Render the log content in the case we no logs to show. */
  protected nothingToShow() {
    return (
      <div className="kui--sidecar-text-content kui--center-absolute">
        <div className="kui--hero-text">{strings('No log data')}</div>
      </div>
    )
  }
}

/**
 * The content renderer for the summary tab
 *
 */
async function content(tab: Tab, pod: Pod, args: Arguments<KubeOptions>) {
  return {
    react: function LogsProvider(toolbarController: ToolbarProps) {
      return <Logs tab={tab} pod={pod} args={args} toolbarController={toolbarController} />
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
