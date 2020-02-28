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
import { eventBus } from '@kui-shell/core'

import Search from './Search'
import TabModel from './TabModel'
import TopTabStripe, { TopTabStripeConfiguration } from './TopTabStripe'
import TabContent, { TabContentOptions } from './TabContent'

/**
 *
 * TabContainer
 * ----------------
 * | TopTabStripe |
 * |--------------|
 * |              |
 * | TabContent[] |
 * |              |
 * ----------------
 *
 */

type TabContainerOptions = TabContentOptions
type Props = TabContainerOptions & TopTabStripeConfiguration

interface State {
  /** list of current tabs; one TabContent for each */
  tabs: TabModel[]

  /** current active tab index */
  activeIdx: number
}

export default class TabContainer extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      tabs: [new TabModel()],
      activeIdx: 0
    }

    eventBus.on('/tab/new/request', () => {
      this.onNewTab()
    })
    eventBus.on('/tab/close/request', () => {
      this.onCloseTab(this.state.activeIdx)
    })
    eventBus.on('/tab/switch/request', (idx: number) => {
      this.onSwitchTab(idx)
    })
  }

  /** temporary hack to regrab focus to the repl */
  private hackFocus() {
    setTimeout(() => {
      try {
        const input = document.querySelector(
          `tab[data-tab-id="${this.state.activeIdx + 1}"] .repl-active input`
        ) as HTMLElement
        if (input) {
          input.focus()
        }
      } catch (err) {
        console.error(err)
      }
    })
  }

  /** save tab state such as CWD prior to a tab switch */
  private captureState() {
    try {
      this.state.tabs[this.state.activeIdx].state.capture()
    } catch (err) {
      console.error(err)
    }
  }

  /** restore tab state after a tab switch */
  private restoreState(tabIdx: number) {
    this.state.tabs[tabIdx].state.restore()
  }

  /**
   * Switch Tab event: update state so that activeIdx=idx
   *
   */
  private onSwitchTab(idx: number) {
    // capture current state, restore state of the switched-to tab
    this.captureState()
    this.restoreState(idx)

    if (idx >= 0 && idx < this.state.tabs.length) {
      this.setState({
        activeIdx: idx
      })

      this.hackFocus()
    }
  }

  /**
   * Close Tab event
   *
   */
  private onCloseTab(idx: number) {
    const residualTabs = this.state.tabs.slice(0, idx).concat(this.state.tabs.slice(idx + 1))

    if (residualTabs.length > 0) {
      const activeIdx = idx === 0 ? 0 : idx - 1
      this.restoreState(activeIdx)

      this.setState({
        tabs: residualTabs,
        activeIdx
      })

      this.hackFocus()
    }
  }

  /**
   * New Tab event
   *
   */
  private onNewTab() {
    this.captureState()

    this.setState(curState => ({
      tabs: curState.tabs.concat(new TabModel()),
      activeIdx: curState.tabs.length
    }))
  }

  public render() {
    return (
      <div className="kui--full-height">
        <TopTabStripe
          {...this.props}
          activeIdx={this.state.activeIdx}
          tabs={this.state.tabs}
          onNewTab={() => this.onNewTab()}
          onCloseTab={(idx: number) => this.onCloseTab(idx)}
          onSwitchTab={(idx: number) => this.onSwitchTab(idx)}
        />
        <Search />
        <div className="tab-container">
          {this.state.tabs.map((_, idx) => (
            <TabContent key={idx} uuid={_.uuid} active={idx === this.state.activeIdx} state={_.state} {...this.props}>
              {this.props.children}
            </TabContent>
          ))}
        </div>
      </div>
    )
  }
}
