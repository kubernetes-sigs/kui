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

import Debug from 'debug'
import React from 'react'
import { i18n, Arguments, Button } from '@kui-shell/core'
import Icons from '@kui-shell/plugin-client-common/mdist/components/spi/Icons'

import { getCommandFromArgs } from '../../util/util'
import Terminal, { TerminalState } from './Terminal'
import { ContainerProps, StreamingStatus } from './ContainerCommon'
import { KubeOptions, getContainer, hasLabel, withKubeconfigFrom } from '../../../controller/kubectl/options'
import { kindPartOf } from '../../../controller/kubectl/fqn'

import '../../../../web/scss/components/LogsSearch.scss'

const debug = Debug('plugin-kubectl/Logs')
const strings = i18n('plugin-kubectl', 'logs')

/**
 * Default --tail flag, if the user does not specify one. See
 * https://github.com/IBM/kui/issues/4810
 *
 */
const defaultTail = 1000

interface State extends TerminalState {
  nLines: number
  filter: Partial<string>
  showingPrevious: boolean
}

export function showingPrevious(args: Arguments<KubeOptions>) {
  return args && (!!args.parsedOptions.p || !!args.parsedOptions.previous)
}

export default class Logs extends Terminal<State> {
  public constructor(props: ContainerProps) {
    super(props)

    this.state = Object.assign(this.state, {
      nLines: 0,
      filter: undefined,
      showingPrevious: showingPrevious(this.props.args.argsForMode),
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
    return this.containers.length === 1 ? this.containers[0].name : undefined
  }

  /** Text to display in the Toolbar. */
  protected toolbarText(status: StreamingStatus) {
    // i18n message key for toolbar text
    const msgAndType = {
      Live: {
        message: 'Logs are live streaming.',
        type: 'info' as const
      },
      Idle: {
        message: 'Log streaming is idle.',
        type: 'warning' as const
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
    } else if (!msgAndType[status]) {
      console.error(`Unknown streaming status: ${status}`)
      return
    }

    const msg1 = msgAndType[status].message
    const msg2 = this.previousMessage(
      this.state.isTerminated
        ? msg1
        : `${msg1} ${this.state.container ? 'Showing container X.' : 'Showing all containers.'}`
    )

    return {
      type: msgAndType[status].type,
      text: this.state.container ? strings(msg2, this.state.container) : strings(msg2)
    }
  }

  /** Addendum to toolbar text to denote whether we are showingPrevious */
  private previousMessage(baseMsg: string): string {
    return this.state.showingPrevious ? `${baseMsg} Showing previous instance.` : baseMsg
  }

  /**
   *
   * @return whether we are showing logs for multiple containers,
   * e.g. via a label selector
   *
   */
  private isMulti(): boolean {
    return !!(this.props.args.argsForMode && hasLabel(this.props.args.argsForMode))
  }

  /**
   *
   * @return the command to issue in order to initialize the pty stream
   *
   */
  protected ptyCommand() {
    const { args, resource } = this.props
    const { container: containerName } = this.state
    const container = containerName ? `-c ${containerName}` : '--all-containers'
    const isMulti = this.isMulti()

    const parsedOptions = args.parsedOptions || {}

    if (args.argsForMode && args.argsForMode.command && (!isMulti || !containerName)) {
      // 1) if the user specified no container, we will inject
      // --all-containers for convenience
      // 2) only use argsForMode once
      // 3) do not add -f unless the user requested it
      const previous = showingPrevious(args.argsForMode) ? '--previous' : ''
      const tail = !args.argsForMode.parsedOptions.tail ? ` --tail ${defaultTail}` : ''
      const command = `${args.argsForMode.command} ${!containerName ? container : ''} ${tail} ${previous}`

      if (!isMulti) {
        args.argsForMode.command = undefined // point 2
      }

      return { command, isLive: parsedOptions.f ? ('Live' as const) : ('Paused' as const) }
    } else {
      // pod:container? a sign of a multi-pod view
      const previous =
        this.state.showingPrevious || (args.argsForMode && showingPrevious(args.argsForMode)) ? '--previous' : ''
      const dashF = !isMulti || (args.argsForMode && args.argsForMode.parsedOptions.f) ? '-f' : ''
      const isLive = dashF ? ('Live' as const) : undefined

      if (!containerName && args.argsForMode && hasLabel(args.argsForMode)) {
        // all container... re-execute label-selector
        return { command: args.argsForMode.command, isLive }
      }

      const split = isMulti && containerName && containerName.split(/:/)
      const possibleMulti = split && split.length === 2 && split
      const podName = possibleMulti ? possibleMulti[0] : resource.spec._podName || resource.metadata.name
      const theContainer = possibleMulti ? `-c ${possibleMulti[1]}` : container

      const command = withKubeconfigFrom(
        args,
        `${getCommandFromArgs(args)} logs ${kindPartOf(resource)}/${podName} -n ${
          resource.metadata.namespace
        } ${theContainer} ${dashF} ${previous} --tail ${defaultTail}`
      )
      debug('log command', command)

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

  /** Previous logs button */
  private previous(): Button {
    return {
      mode: 'kubectl-logs-previous-toggle',
      label: this.state.showingPrevious ? strings('Show Current') : strings('Show Previous'),
      icon: <Icons icon={this.state.showingPrevious ? 'NextPage' : 'PreviousPage'} />,
      kind: 'view',
      command: () =>
        this.showContainer(undefined, curState => ({
          showingPrevious: !curState.showingPrevious
        }))
    }
  }

  protected toolbarButtons(status: StreamingStatus): Button[] {
    return [this.previous()].concat(super.toolbarButtons(status))
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

  private readonly loglines: string[] = []
  private delay: ReturnType<typeof setTimeout>
  protected write(line: string) {
    this.loglines.push(line)
    if (!this.state.filter && this.state.xterm) {
      this.state.xterm.write(line)
    } else {
      if (this.delay) clearTimeout(this.delay)
      this.delay = setTimeout(() => this.setState({ nLines: this.loglines.length }), 20)
    }
  }

  private refill(filter: string) {
    this.setState(curState => {
      curState.xterm.clear()
      const pattern = new RegExp(filter, /^[a-z0-9]+$/.test(filter) ? 'i' : undefined)
      this.loglines
        .join()
        .split(/\n/)
        .forEach(_ => {
          if (pattern.test(_)) {
            curState.xterm.writeln(_)
          }
        })
      return { filter }
    })
  }

  private delay2: ReturnType<typeof setTimeout>
  private onFilterChange(evt: React.ChangeEvent<HTMLInputElement>) {
    if (this.delay2) clearTimeout(this.delay2)
    const filter = evt.currentTarget.value
    this.delay2 = setTimeout(() => this.refill(filter), 20)
  }

  private readonly _onFilterChange = this.onFilterChange.bind(this)

  private filterPane() {
    return (
      <div className="flex-layout kui--sidecar-filter-area">
        <input
          className="flex-fill kui--sidecar-filter-input"
          placeholder="Enter filter string or regular expression"
          onChange={this._onFilterChange}
        />
      </div>
    )
  }

  public render() {
    if (this.notReady()) {
      return super.render()
    } else {
      return (
        <React.Fragment>
          <div className="flex-fill">{super.render()}</div>
          {this.filterPane()}
        </React.Fragment>
      )
    }
  }
}
