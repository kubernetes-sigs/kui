/*
 * Copyright 2021 The Kubernetes Authors
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

import Icon from '../spi/Icons'

import { eventBus, eventChannelUnsafe } from '@kui-shell/core'

interface Props {
  className?: string
  link: string
}

interface State {
  ok: number
  error: number
}

export default class TaskStatus extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      ok: undefined,
      error: undefined
    }
  }

  private async reportStatus(status: number[]) {
    this.setState({
      ok: status[0],
      error: status[1]
    })
  }

  /**
   * Once we have mounted, we immediately check the current branch,
   * and schedule an update based on standard REPL events.
   *
   */
  public componentDidMount() {
    eventChannelUnsafe.on(`/link/status/update/${this.props.link}`, this.reportStatus.bind(this))
    eventChannelUnsafe.emit(`/link/status/get`, this.props.link)
  }

  /** Bye! */
  public componentWillUnmount() {
    eventBus.off(`/link/status/update/${this.props.link}`, this.reportStatus.bind(this))
  }

  private icon(ok: number, error: number) {
    const icon = ok !== 0 ? 'Checkmark' : error !== 0 ? 'Error' : 'Waiting'

    return <Icon className="link-status" icon={icon} />
  }

  public render() {
    if (this.state.ok !== undefined && this.state.error !== undefined) {
      const { ok, error } = this.state
      return this.icon(ok, error)
    } else {
      return <React.Fragment />
    }
  }
}
