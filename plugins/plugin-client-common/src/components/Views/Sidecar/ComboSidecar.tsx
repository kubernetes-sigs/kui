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
import { eventChannelUnsafe, Tab, NavResponse, MultiModalResponse, isMultiModalResponse } from '@kui-shell/core'

import { SidecarOptions } from './BaseSidecar'
import TopNavSidecar from './TopNavSidecar'
import LeftNavSidecar from './LeftNavSidecar'

export type Props = SidecarOptions & {
  /** tab uuid */
  uuid?: string
}

interface State {
  tab: Tab
  response: MultiModalResponse | NavResponse
}

export default class ComboSidecar extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      tab: undefined,
      response: undefined
    }

    const channel1 = `/command/complete/fromuser/NavResponse/${props.uuid}`
    const channel2 = `/command/complete/fromuser/MultiModalResponse/${props.uuid}`
    const onResponse = this.onResponse.bind(this)
    eventChannelUnsafe.on(channel1, onResponse)
    eventChannelUnsafe.on(channel2, onResponse)
    // this.cleaners.push(() => eventChannelUnsafe.off(channel1, onResponse))
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  private onResponse(tab: Tab, response: MultiModalResponse | NavResponse) {
    this.setState({
      tab,
      response
    })
  }

  private onClose() {
    this.setState({ response: undefined })

    // when closing, tell our owner that they can have focus back
    if (this.props.willLoseFocus) {
      this.props.willLoseFocus()
    }
  }

  public render() {
    const isLeftNav = this.state.response && !isMultiModalResponse(this.state.response)

    return (
      <div className="kui--full-height">
        <div className={'kui--full-height' + (isLeftNav || this.state.response === undefined ? ' hide' : '')}>
          <TopNavSidecar {...this.props} onClose={this.onClose.bind(this)} />
        </div>

        <div className={'kui--full-height' + (!isLeftNav ? ' hide' : '')}>
          <LeftNavSidecar {...this.props} onClose={this.onClose.bind(this)} />
        </div>
      </div>
    )
  }
}
