/*
 * Copyright 2020 The Kubernetes Authors
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

import React from 'react'
import { Page } from '@patternfly/react-core'

import { NewTabRequestEvent, Tab, eventBus, pexecInCurrentTab } from '@kui-shell/core'

import TabModel, { TopTabButton } from './TabModel'
import TabContent, { TabContentOptions } from './TabContent'
import TopTabStripe, { TopTabStripeConfiguration } from './TopTabStripe'

import '../../../web/css/static/TabContainer.scss'
import '../../../web/scss/components/Page/_index.scss'

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

  /** current active tab index */
  activeIdx: number
}

export default class TabContainer extends React.PureComponent<Props, State> {
  /** Has the first tab activated itself? */
  private isFirstTabReady = false

  public constructor(props: Props) {
    super(props)

    this.state = {
      tabs: [this.newTabModel()],
      activeIdx: 0
    }

    eventBus.on('/tab/new/request', (evt?: NewTabRequestEvent) => {
      this.onNewTab(evt)
    })

    eventBus.on('/tab/switch/request', (idx: number) => {
      this.onSwitchTab(idx)
    })

    eventBus.on('/kui/tab/edit/toggle/index', (idx: number) => {
      const tab = this.state.tabs[idx]
      if (tab && tab.uuid) {
        eventBus.emitWithTabId('/kui/tab/edit/toggle', tab.uuid)
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
  private async onSwitchTab(idx: number) {
    // capture current state, restore state of the switched-to tab
    const currentTabState = this.state.tabs[this.state.activeIdx].state
    const nextTabState = this.state.tabs[idx].state
    await currentTabState.switchTo(nextTabState)

    if (idx >= 0 && idx < this.state.tabs.length) {
      this.setState({
        activeIdx: idx
      })
    }

    setTimeout(() => eventBus.emit('/tab/switch/request/done', { idx, tab: nextTabState }))
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

  private newTabModel(evt: NewTabRequestEvent = {}) {
    // !this.state means: if this is the very first tab we've ever
    // !created, *and* we were given an initial title (via
    // !this.props.title), then use that
    const model = new TabModel(
      undefined,
      evt.statusStripeDecoration,
      evt.background,
      evt.title || (!this.state && this.props.title ? this.props.title : undefined),
      undefined,
      undefined,
      evt.cmdline,
      evt.onClose,
      evt.exec,
      evt.snapshot
    )
    this.listenForTabClose(model)
    return model
  }

  /**
   * New Tab event
   *
   */
  private onNewTab(evt: NewTabRequestEvent = {}) {
    // if we already have a tab with this title, and this isn't a
    // background tab, then switch to it
    if (evt.title) {
      const existingIdx = this.state.tabs.findIndex(_ => _.title === evt.title)
      if (existingIdx >= 0) {
        if (!evt.background) {
          this.onSwitchTab(existingIdx)
        }
        return
      }
    }

    this.captureState()

    const model = this.newTabModel(evt)

    this.setState(curState => ({
      tabs: curState.tabs.concat(model),
      activeIdx: !evt.background ? curState.tabs.length : curState.activeIdx
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
    if (!this.isFirstTabReady) {
      if (this.props.onTabReady) {
        this.props.onTabReady(tab)
      }
      this.isFirstTabReady = true
    }

    // then, for all tabs: we were asked to execute a command line in
    // the new tab?
    const tabModel = this.state.tabs.find(_ => _.uuid === tab.uuid)
    if (tabModel) {
      // execute a command onReady?
      if (tabModel.initialCommandLine) {
        try {
          const quiet = tabModel.exec && tabModel.exec === 'qexec'
          pexecInCurrentTab(tabModel.initialCommandLine, tab, quiet)
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
            snapshot={_.snapshot}
            tabTitle={_.title}
            key={_.uuid}
            uuid={_.uuid}
            active={idx === this.state.activeIdx}
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
      <Page mainContainerId="kui--page-main" className="kui--tab-container-page" header={this.topTabStripe()}>
        {this.tabContent()}
      </Page>
    )
  }
}
