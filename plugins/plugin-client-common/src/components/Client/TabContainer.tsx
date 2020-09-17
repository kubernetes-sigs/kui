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
import { StatusStripeChangeEvent, Tab, eventBus, pexecInCurrentTab } from '@kui-shell/core'

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

    eventBus.on('/tab/new/request', ({ statusStripeDecoration, title, background, cmdline, onClose } = {}) => {
      this.onNewTab(statusStripeDecoration, background, title, cmdline, onClose)
    })

    eventBus.on('/tab/switch/request', (idx: number) => {
      this.onSwitchTab(idx)
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
    }

    setTimeout(() => eventBus.emit('/tab/switch/request/done', idx))
  }

  private readonly _onSwitchTab = this.onSwitchTab.bind(this)

  /**
   * Close Tab event
   *
   */
  private async onCloseTab(idx: number) {
    const residualTabs = this.state.tabs.slice(0, idx).concat(this.state.tabs.slice(idx + 1))

    if (residualTabs.length > 0) {
      const activeIdx = idx === 0 ? 0 : idx - 1
      this.restoreState(activeIdx)

      this.setState({
        tabs: residualTabs,
        activeIdx
      })
    }
  }

  private readonly _onCloseTab = this.onCloseTab.bind(this)

  private listenForTabClose(model: TabModel) {
    eventBus.onceWithTabId('/tab/close/request', model.uuid, async (uuid: string, tab: Tab) => {
      if (this.state.tabs.length === 1) {
        // then we are closing the last tab, so close the window
        tab.REPL.qexec('window close')
      } else {
        this.onCloseTab(this.state.tabs.findIndex(_ => _.uuid === model.uuid))
      }
    })
  }

  private newTabModel(
    statusStripeDecoration?: StatusStripeChangeEvent,
    background?: boolean,
    title?: string,
    cmdline?: string,
    onClose?: string
  ) {
    // !this.state means: if this is the very first tab we've ever
    // !created, *and* we were given an initial title (via
    // !this.props.title), then use that
    const model = new TabModel(
      undefined,
      statusStripeDecoration,
      background,
      title || (!this.state && this.props.title ? this.props.title : undefined),
      undefined,
      undefined,
      cmdline,
      onClose
    )
    this.listenForTabClose(model)
    return model
  }

  /**
   * New Tab event
   *
   */
  private onNewTab(
    statusStripeDecoration?: StatusStripeChangeEvent,
    background = false,
    title?: string,
    cmdline?: string,
    onClose?: string
  ) {
    // if we already have a tab with this title, and this isn't a
    // background tab, then switch to it
    if (title) {
      const existingIdx = this.state.tabs.findIndex(_ => _.title === title)
      if (existingIdx >= 0) {
        if (!background) {
          this.onSwitchTab(existingIdx)
        }
        return
      }
    }

    this.captureState()

    const model = this.newTabModel(statusStripeDecoration, background, title, cmdline, onClose)

    this.setState(curState => ({
      tabs: curState.tabs.concat(model),
      activeIdx: !background ? curState.tabs.length : curState.activeIdx
    }))
  }

  private readonly _onNewTab = () => this.onNewTab()

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
    // "initial tab" handling
    if (!this.state.isFirstTabReady) {
      if (this.props.onTabReady) {
        this.props.onTabReady(tab)
      }
      this.setState({ isFirstTabReady: true })
    }

    // then, for all tabs: we were asked to execute a command line in
    // the new tab?
    const tabModel = this.state.tabs.find(_ => _.uuid === tab.uuid)
    if (tabModel) {
      // execute a command onReady?
      if (tabModel.initialCommandLine) {
        try {
          pexecInCurrentTab(tabModel.initialCommandLine, tab)
        } catch (err) {
          console.error('Error executing initial command line in new tab', err)
        }
      }

      // execute a command onClose?
      if (tabModel.onClose) {
        eventBus.on('/tab/close', async tab => {
          try {
            await tab.REPL.qexec(tabModel.onClose)
          } catch (err) {
            console.error('Error executing tab onClose handler', err)
          }
        })
      }
    }
  }

  private readonly _onTabReady = this.onTabReady.bind(this)

  /** Render the row of Tabs along the top */
  private topTabStripe() {
    return (
      <TopTabStripe
        tabs={this.state.tabs}
        onNewTab={this._onNewTab}
        onCloseTab={this._onCloseTab}
        onSwitchTab={this._onSwitchTab}
        activeIdx={this.state.activeIdx}
        topTabNames={this.props.topTabNames}
      />
    )
  }

  /** Render the content of the tabs */
  private tabContent() {
    return (
      <div className="tab-container">
        {this.state.tabs.map((_, idx) => (
          <TabContent
            {...this.props}
            key={_.uuid}
            uuid={_.uuid}
            active={idx === this.state.activeIdx}
            willUpdateTopTabButtons={this.willUpdateTopTabButtons.bind(this, _.uuid)}
            onTabReady={this._onTabReady}
            state={_.state}
          >
            {this.children(_.uuid)}
          </TabContent>
        ))}
      </div>
    )
  }

  public render() {
    return (
      <div className="kui--full-height">
        {this.topTabStripe()}
        {this.tabContent()}
      </div>
    )
  }
}
