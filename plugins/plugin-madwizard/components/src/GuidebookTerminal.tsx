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
import { Loading } from '@kui-shell/plugin-client-common'
import { respawn } from '@kui-shell/plugin-madwizard/watch'
import { Arguments, encodeComponent } from '@kui-shell/core'

import { Props as BaseProps } from './RestartableTerminal'
import AskingTerminal, { AskingProps } from './AskingTerminal'

export type Props = AskingProps & {
  /** Any extra env vars to add to the guidebook execution. These will be pre-joined with the default env. */
  extraEnv?: BaseProps['env']
}

type State = Partial<Pick<BaseProps, 'cmdline' | 'env'>>

/**
 * A wrapper over <AskingTerminal/> that initializes the `cmdline` and
 * `env` properties.
 *
 */
export default class GuidebookTerminal extends React.PureComponent<Props, State> {
  // eslint-disable-next-line no-template-curly-in-string
  private readonly tasks = [{ label: 'Run a Job', argv: ['madwizard', '-p', '${SELECTED_PROFILE}'] }]

  public componentDidMount() {
    this.init()
  }

  /**
   * Initialize the `cmdline` and `env` state. This is the command
   * line (and env vars) that will be executed in order to process
   * this.props.guidebook.
   *
   */
  private async init() {
    const guidebook = this.props.guidebook

    if (guidebook === null) {
      return
    }

    // respawn, meaning launch it with ourselves, i.e. however we
    // were launched (e.g. electron app? or using node to launch?)
    const { argv, env } = await respawn(this.tasks[0].argv)
    const cmdline = [
      ...argv.map(_ => encodeComponent(_)),
      guidebook,
      ...(this.props.noninteractive ? ['--y'] : []),
      ...(this.props.ifor ? ['--ifor', guidebook] : [])
    ]
      .filter(Boolean)
      .join(' ')

    this.setState({
      cmdline,
      env: Object.assign(
        {},
        env,
        {
          /* MWCLEAR_INITIAL: "true" */
        },
        this.props.extraEnv
      )
    })
  }

  public render() {
    if (!this.state?.cmdline || !this.state?.env) {
      return <Loading />
    } else {
      return <AskingTerminal {...this.props} cmdline={this.state.cmdline} env={this.state.env} />
    }
  }
}

type WrapperProps = Pick<Props, 'guidebook' | 'terminalProps'>
type WrapperState = Pick<Props, 'initCount'>

class Wrapper extends React.PureComponent<WrapperProps, WrapperState> {
  private readonly _home = () => this.setState(curState => ({ initCount: (curState?.initCount || 0) + 1 }))

  public render() {
    return (
      <GuidebookTerminal
        initCount={this.state?.initCount || 0}
        guidebook={this.props.guidebook}
        selectedProfile="default"
        home={this._home}
        terminalProps={this.props.terminalProps}
      />
    )
  }
}

/** If invoked as a command */
export function controller(args: Arguments) {
  const guidebook = args.argvNoOptions[2]
  if (!guidebook) {
    throw new Error('Usage: madwizard guide <guidebook>')
  }

  return <Wrapper guidebook={guidebook} terminalProps={args} />
}
