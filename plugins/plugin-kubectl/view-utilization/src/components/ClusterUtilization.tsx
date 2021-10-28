/*
 * Copyright 2019 The Kubernetes Authors
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

import { Events, getCurrentTab } from '@kui-shell/core'
import { ViewLevel, TextWithIconWidget } from '@kui-shell/plugin-client-common'
import { NodeSummary, BarColor, Bar, BarContainer } from '..'

const debug = Debug('plugin-view-utilization/widgets/cluster-utilization')

type Props = {}

interface State {
  cpuFrac: number
  memFrac: number
  viewLevel: ViewLevel
}

export default class ClusterUtilization extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      cpuFrac: 0,
      memFrac: 0,
      viewLevel: 'hidden'
    }
  }

  private async reportClusterUtilization() {
    try {
      const tab = getCurrentTab()
      const { content: info } = await tab.REPL.rexec<NodeSummary>('kubectl top node-summary')

      this.setState({
        cpuFrac: info.cpuFrac,
        memFrac: info.memFrac,
        viewLevel: 'normal' // only show normally if we succeed; see https://github.com/IBM/kui/issues/3537
      })
    } catch (err) {
      debug(err)
      this.setState({
        cpuFrac: 0,
        memFrac: 0,
        viewLevel: 'hidden'
      })
    }
  }

  /**
   * Once we have mounted, we immediately check the current cpu utilization,
   * and schedule an update based on standard REPL events.
   *
   */
  public componentDidMount() {
    this.reportClusterUtilization()
    Events.wireToStandardEvents(this.reportClusterUtilization.bind(this))
  }

  public render() {
    return (
      <TextWithIconWidget
        text=""
        viewLevel={this.state.viewLevel}
        id="kui--plugin-view-utilization--cluster-utilization"
      >
        <BarContainer onClick="kubectl top node">
          <Bar color={BarColor.CPU} fraction={this.state.cpuFrac} />
          <Bar color={BarColor.Memory} fraction={this.state.memFrac} />
        </BarContainer>
      </TextWithIconWidget>
    )
  }
}
