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
import { eventBus, Tab as KuiTab, TabState, initializeSession, i18n } from '@kui-shell/core'

import Cleaner from './cleaner'
import Loading from './Loading'
import ScrollableTerminal from './Terminal/ScrollableTerminal'

const strings = i18n('client')

interface Props {
  uuid: string
  active: boolean
  state: TabState
}

interface State {
  tab?: KuiTab
  sessionInit: 'NotYet' | 'InProgress' | 'Done'
}

/**
 *
 * TabContent
 * ----------------  <Tab/> from here down
 * | ST  |        |
 * |     |        |
 * |     |        |
 * |     |        |
 * |     |        |
 * |     |        |
 * ----------------
 *  ST: <ScrollableTerminal/>
 *
 */
export default class TabContent extends React.PureComponent<Props, State> {
  private readonly cleaners: Cleaner[] = []

  public constructor(props: Props) {
    super(props)

    eventBus.once(`/tab/new/${props.uuid}`, () => this.setState({ sessionInit: 'Done' }))

    const onOffline = this.onOffline.bind(this)
    eventBus.on(`/tab/offline/${props.uuid}`, onOffline)
    this.cleaners.push(() => eventBus.off(`/tab/offline/${props.uuid}`, onOffline))

    this.state = {
      tab: undefined,
      sessionInit: 'NotYet'
    }
  }

  private onOffline() {
    this.setState({
      sessionInit: 'InProgress'
    })

    initializeSession(this.state.tab).then(() => {
      this.setState({
        sessionInit: 'Done'
      })
    })
  }

  /** emit /tab/new event, if we have now a tab, but have not yet
   * emitted the event */
  public static getDerivedStateFromProps(props: Props, state: State) {
    if (state.tab && state.sessionInit === 'NotYet') {
      try {
        state.tab.state = props.state
        initializeSession(state.tab).then(() => {
          eventBus.emit('/tab/new', state.tab)
          eventBus.emit(`/tab/new/${props.uuid}`)
        })

        return {
          sessionInit: 'InProgress'
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      return state
    }
  }

  public componentWillUnmount() {
    eventBus.emit('/tab/close', this.state.tab)
  }

  private terminal() {
    if (this.state.sessionInit !== 'Done') {
      return <Loading description={strings('Please wait while we connect to your cloud')} />
    } else {
      return <ScrollableTerminal uuid={this.props.uuid} tab={this.state.tab} />
    }
  }

  public render() {
    return (
      <tab
        ref={c => this.setState({ tab: c as KuiTab })}
        className={this.props.active ? 'visible' : ''}
        data-tab-id={this.props.uuid}
      >
        <tabrow className="kui--rows">
          <tabcolumn className="kui--columns">{this.terminal()}</tabcolumn>
        </tabrow>
      </tab>
    )
  }
}
