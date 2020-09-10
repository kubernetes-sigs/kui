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
import { StatusStripeChangeEvent, Tab, eventBus } from '@kui-shell/core'

import TabModel, { TopTabButton } from './TabModel'
import TabContent, { TabContentOptions } from './TabContent'
import TopTabStripe, { TopTabStripeConfiguration } from './TopTabStripe'

import '../../../web/css/static/TabContainer.scss'

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
type Props = TabContentOptions & TopTabStripeConfiguration

interface State {
  /** list of current tabs; one TabContent for each */
  tabs: TabModel[]

  /** Has the first tab activated itself? */
  isFirstTabReady: boolean

  /** current active tab index */
  activeIdx: number
}

export default class TabContainer extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      tabs: [this.newTabModel()],
      isFirstTabReady: false,
      activeIdx: 0
    }

    eventBus.on('/tab/new/request', ({ uuid, statusStripeDecoration, title, background } = {}) => {
      this.onNewTab(uuid, statusStripeDecoration, background, title)
    })

    eventBus.on('/tab/switch/request', (idx: number) => {
      this.onSwitchTab(idx)
    })
  }

  /**
   * Temporary hack to regrab focus to the repl. The hack part is the
   * querySelector. This really needs to be done in TabContent, which
   * owns the Tab impl.
   *
   */
  private hackFocus() {
    setTimeout(() => {
      try {
        const selector = `.kui--tab-content[data-tab-id="${this.state.activeIdx + 1}"] .repl-active input`
        const input = document.querySelector(selector) as HTMLElement
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

  private listenForTabClose(model: TabModel) {
    eventBus.onceWithTabId('/tab/close/request', model.uuid, async (uuid: string, tab: Tab) => {
      if (this.state.tabs.length === 1) {
        // then we are closing the last tab, so close the window
        tab.REPL.qexec('window close')
      } else {
        this.onCloseTab(this.state.activeIdx)
      }
    })
  }

  private newTabModel(
    useThisUUID?: string,
    statusStripeDecoration?: StatusStripeChangeEvent,
    background?: boolean,
    title?: string
  ) {
    // !this.state means: if this is the very first tab we've ever
    // !created, *and* we were given an initial title (via
    // !this.props.title), then use that
    const model = new TabModel(
      useThisUUID,
      statusStripeDecoration,
      background,
      title || (!this.state && this.props.title ? this.props.title : undefined)
    )
    this.listenForTabClose(model)
    return model
  }

  /**
   * New Tab event
   *
   */
  private onNewTab(
    useThisUUID?: string,
    statusStripeDecoration?: StatusStripeChangeEvent,
    background = false,
    title?: string
  ) {
    if (title && this.state.tabs.find(_ => _.title === title)) {
      console.error('NOPE')
      return
    }

    this.captureState()

    const model = this.newTabModel(useThisUUID, statusStripeDecoration, background, title)

    this.setState(curState => ({
      tabs: curState.tabs.concat(model),
      activeIdx: !background ? curState.tabs.length : curState.activeIdx
    }))
  }

  private graft(node: React.ReactNode | {}, uuid: string, key?: number) {
    if (React.isValidElement(node)) {
      // ^^^ this check avoids tsc errors
      return React.cloneElement(node, {
        key,
        uuid
      })
    } else {
      return node
    }
  }

  /** Graft the tab `uuid` */
  private children(uuid: string) {
    if (Array.isArray(this.props.children)) {
      return this.props.children.map((child, idx) => this.graft(child, uuid, idx))
    } else {
      return this.graft(this.props.children, uuid)
    }
  }

  private willUpdateTopTabButtons(uuid: string, buttons: TopTabButton[]) {
    this.setState(curState => {
      const idx = curState.tabs.findIndex(_ => _.uuid === uuid)
      if (idx >= 0) {
        return {
          tabs: curState.tabs
            .slice(0, idx)
            .concat([curState.tabs[idx].update(buttons)])
            .concat(curState.tabs.slice(idx + 1))
        }
      }
    })
  }

  private onTabReady(tab: Tab) {
    if (this.props.onTabReady) {
      this.props.onTabReady(tab)
    }
    this.setState({ isFirstTabReady: true })
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
          onSwitchTab={(idx: number) => eventBus.emit('/tab/switch/request', idx)}
        />
        <div className="tab-container">
          {this.state.tabs.map((_, idx) => (
            <TabContent
              key={_.uuid}
              uuid={_.uuid}
              active={idx === this.state.activeIdx}
              willUpdateTopTabButtons={this.willUpdateTopTabButtons.bind(this, _.uuid)}
              onTabReady={
                idx === 0 && this.props.onTabReady && !this.state.isFirstTabReady && this.onTabReady.bind(this)
              }
              state={_.state}
              {...this.props}
            >
              {this.children(_.uuid)}
            </TabContent>
          ))}
        </div>
      </div>
    )
  }
}
