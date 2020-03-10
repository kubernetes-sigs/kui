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

// FIXME:
/* eslint-disable react/prop-types */

import * as React from 'react'
import { eventBus, Tab as KuiTab } from '@kui-shell/core'
import { ComboSidecar } from '@kui-shell/plugin-sidecar'
import { InputStripe, TabContent, TabModel } from '@kui-shell/plugin-client-common'

import '../web/css/static/Popup.scss'

interface Props {
  commandLine: string[]
}

interface State {
  model: TabModel
  promptPlaceholder: string
}

export default class Popup extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    eventBus.on('/tab/close/request', async (tab: KuiTab) => {
      // tab close is window close for the popup client
      tab.REPL.qexec('window close')
    })

    eventBus.on('/command/complete', ({ command }: { command: string }) => {
      this.setState({ promptPlaceholder: command })
    })

    this.state = {
      model: new TabModel(),
      promptPlaceholder: ''
    }
  }

  /* public componentDidMount() {
    if (this.state.tab && this.state.tab.REPL) {
      this.state.tab.REPL
    }
  } */

  private onTabReady(tab: KuiTab) {
    tab.REPL.pexec(this.props.commandLine.join(' '))
  }

  public render() {
    return (
      <div className="kui--full-height">
        <TabContent
          noActiveInput
          bottom={<InputStripe promptPlaceholder={this.state.promptPlaceholder} />}
          uuid={this.state.model.uuid}
          active
          state={this.state.model.state}
          onTabReady={this.onTabReady.bind(this)}
        >
          <ComboSidecar defaultWidth="75%" />
        </TabContent>
      </div>
    )
  }
}
