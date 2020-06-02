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
import { eventBus, Tab, NavResponse, MultiModalResponse, CommandCompleteEvent } from '@kui-shell/core'

import { SidecarOptions } from './BaseSidecar'
import TopNavSidecar from './TopNavSidecar'
import LeftNavSidecar from './LeftNavSidecar'

export type Props = SidecarOptions & {
  /** tab uuid */
  uuid?: string
}

interface State {
  tab: Tab
  responseType: 'MultiModalResponse' | 'NavResponse'
}

export default class ComboSidecar extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      tab: undefined,
      responseType: undefined
    }

    const onResponse = this.onResponse.bind(this)
    eventBus.onMultiModalResponse(props.uuid, onResponse)
    eventBus.onNavResponse(props.uuid, onResponse)
    // this.cleaners.push(() => eventChannelUnsafe.off(channel1, onResponse))
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  private onResponse(
    event: CommandCompleteEvent<MultiModalResponse | NavResponse, 'MultiModalResponse' | 'NavResponse'>
  ) {
    this.setState({
      tab: event.tab,
      responseType: event.responseType
    })
  }

  private onClose() {
    // when closing, tell our owner that they can have focus back
    if (this.props.willLoseFocus) {
      this.props.willLoseFocus()
    }
  }

  public render() {
    const isLeftNav = this.state.responseType && this.state.responseType === 'NavResponse'

    return (
      <div className="kui--full-height">
        <div className={'kui--full-height' + (isLeftNav || this.state.responseType === undefined ? ' hide' : '')}>
          <TopNavSidecar {...this.props} onClose={this.onClose.bind(this)} />
        </div>

        <div className={'kui--full-height' + (!isLeftNav ? ' hide' : '')}>
          <LeftNavSidecar {...this.props} onClose={this.onClose.bind(this)} />
        </div>
      </div>
    )
  }
}
