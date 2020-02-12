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
import { eventBus, getReplImpl, Tab as KuiTabModel, TabState } from '@kui-shell/core'

import ScrollableTerminal from './Terminal/ScrollableTerminal'

interface Props {
  idx: number
  uuid: string
  active: boolean
  state: TabState
}

export default class TabContent extends React.PureComponent<Props> {
  private _tab: KuiTabModel

  public componentDidMount() {
    try {
      this.tab.state = this.props.state
      getReplImpl(this.tab)
      eventBus.emit('/tab/new', this.tab)
    } catch (err) {
      console.error(err)
    }
  }

  public componentWillUnmount() {
    eventBus.emit('/tab/close', this.tab)
  }

  private get tab() {
    return this._tab
  }

  public render() {
    return (
      <tab
        ref={c => (this._tab = c as KuiTabModel)}
        className={this.props.active ? 'visible' : ''}
        data-tab-id={this.props.idx + 1}
      >
        <tabrow className="kui--rows">
          <tabcolumn className="kui--columns">
            <ScrollableTerminal active={this.props.active} />
          </tabcolumn>
        </tabrow>
      </tab>
    )
  }
}
