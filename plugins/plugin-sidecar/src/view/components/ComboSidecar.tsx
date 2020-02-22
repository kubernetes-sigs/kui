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
import { eventBus, Tab, NavResponse, MultiModalResponse, isMultiModalResponse } from '@kui-shell/core'

import TopNavSidecar from './TopNavSidecar'
import LeftNavSidecar from './LeftNavSidecar'

interface Props {
  willLoseFocus?: () => void
}

interface State {
  tab: Tab
  execUUID: string
  response: MultiModalResponse | NavResponse
}

export default class ComboSidecar extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      tab: undefined,
      execUUID: undefined,
      response: undefined
    }

    const channel1 = '/command/complete/fromuser/NavResponse'
    const channel2 = '/command/complete/fromuser/MultiModalResponse'
    const onResponse = this.onResponse.bind(this)
    eventBus.on(channel1, onResponse)
    eventBus.on(channel2, onResponse)
    // this.cleaners.push(() => eventBus.off(channel1, onResponse))
  }

  private onResponse(tab: Tab, response: MultiModalResponse | NavResponse, execUUID: string) {
    this.setState({
      tab,
      execUUID,
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
    if (!this.state.response) {
      return <div />
    } else if (isMultiModalResponse(this.state.response)) {
      return (
        <TopNavSidecar
          managed
          tab={this.state.tab}
          key={this.state.execUUID}
          response={this.state.response}
          onClose={this.onClose.bind(this)}
          willLoseFocus={this.props.willLoseFocus}
        />
      )
    } else {
      return (
        <LeftNavSidecar
          managed
          tab={this.state.tab}
          key={this.state.execUUID} // <!-- forces react to render child on execUUID change
          response={this.state.response}
          onClose={this.onClose.bind(this)}
          willLoseFocus={this.props.willLoseFocus}
        />
      )
    }
  }
}
