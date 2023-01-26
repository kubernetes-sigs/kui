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
import { Page } from '@patternfly/react-core/dist/esm/components/Page'

import { Tab } from '@kui-shell/core/mdist/api/Tab'
import { pexecInCurrentTab } from '@kui-shell/core/mdist/api/Exec'
import { isReadOnlyClient } from '@kui-shell/core/mdist/api/Client'
import { eventBus, NewTabRequestEvent } from '@kui-shell/core/mdist/api/Events'

import Sidebar from './Sidebar'
import TabModel, { TopTabButton, uuidForFirstTab } from './TabModel'
import TabContent, { TabContentOptions } from './TabContent'
import TopTabStripe, { TopTabStripeConfiguration } from './TopTabStripe'

import CommonProps from './props/Common'
import BrandingProps from './props/Branding'
import InterfaceProps from './props/Interface'
import GuidebookProps from './props/Guidebooks'

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

type Props = TabContentOptions &
  TopTabStripeConfiguration &
  BrandingProps &
  InterfaceProps &
  GuidebookProps &
  React.PropsWithChildren<Pick<CommonProps, 'closeableTabs' | 'noTopTabs'>>

interface State {
  /** hamburger menu expanded? */
  isSidebarOpen: boolean

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
      isSidebarOpen: this.props.guidebooksExpanded || false,
      tabs: [this.newTabModel(undefined, undefined, uuidForFirstTab().toString())],
      activeIdx: 0
    }
  }

  public componentDidMount() {
    eventBus.on('/tab/new/request', (evt: NewTabRequestEvent) => {
      // the protocol is: if we are opening multiple tabs in the
      // "foreground", then make sure the *first* of the new tabs is
      // active
      const weWillAssertActiveTab = !evt.background && evt.tabs.length > 1

      evt.tabs.forEach((spec, idx) => {
        // re: the `&& idx > 0` part: we do want the *first* tab to assert activeness
        const doNotChangeActiveTab = evt.background || (weWillAssertActiveTab && idx > 0)
        this.onNewTab(spec, doNotChangeActiveTab)
      })

      if (weWillAssertActiveTab) {
        // here is where make sure the *first* of the new tabs is
        // active
        this.setState(curState => ({
          activeIdx: curState.tabs.length - evt.tabs.length
        }))
      }
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
    // execute a command onClose?
    const tabModel = this.state.tabs[idx]
    if (tabModel && tabModel.onClose) {
      try {
        await pexecInCurrentTab(tabModel.onClose, undefined, true)
      } catch (err) {
        console.error('Error executing tab onClose handler', err)
      }
    }

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

  private newTabModel(spec: NewTabRequestEvent['tabs'][0] = {}, doNotChangeActiveTab = false, uuid?: string) {
    // !this.state means: if this is the very first tab we've ever
    // !created, *and* we were given an initial title (via
    // !this.props.title), then use that
    const model = new TabModel(
      uuid,
      spec.statusStripeDecoration,
      doNotChangeActiveTab,
      spec.title || this.props.title,
      undefined,
      undefined,
      spec.cmdline,
      spec.onClose,
      spec.exec
    )
    this.listenForTabClose(model)

    return model
  }

  /**
   * New Tab event
   *
   */
  private onNewTab(spec: NewTabRequestEvent['tabs'][0] = {}, doNotChangeActiveTab = false) {
    // if we already have a tab with this title, and this isn't a
    // background tab, then switch to it
    if (spec.title) {
      const existingIdx = this.state.tabs.findIndex(_ => _.title === spec.title)
      if (existingIdx >= 0) {
        if (!doNotChangeActiveTab) {
          this.onSwitchTab(existingIdx)
        }
        return
      }
    }

    this.captureState()

    const model = this.newTabModel(spec, doNotChangeActiveTab)

    this.setState(curState => ({
      tabs: curState.tabs.concat(model),
      activeIdx: !doNotChangeActiveTab ? curState.tabs.length : curState.activeIdx
    }))
  }

  private readonly _onNewTab = () => this.onNewTab()

  private graft(node: Props['children'], uuid: string, key?: number) {
    if (React.isValidElement(node)) {
      // ^^^ this check avoids tsc errors
      return React.cloneElement(node as React.ReactElement<{ key?: number; uuid: string }>, {
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
        needsSidebar={this.needsSidebar}
        isSidebarOpen={this.state.isSidebarOpen}
        onToggleSidebar={this.toggleSidebar}
        noTopTabs={this.props.noTopTabs}
        noNewTabButton={this.props.noNewTabButton}
        noNewSplitButton={this.props.noNewSplitButton}
        closeableTabs={this.state.tabs.length > 1 && (this.props.closeableTabs || !isReadOnlyClient())}
      />
    )
  }

  private readonly _onSetTabTitle = (uuid: string, title: string) => {
    this.setState(({ tabs }) => {
      const tabIdx = tabs.findIndex(_ => _.uuid === uuid)
      if (tabIdx < 0 || tabs[tabIdx].title === title) {
        return null
      } else {
        return {
          tabs: [...tabs.slice(0, tabIdx), tabs[tabIdx].setTitle(title), ...tabs.slice(tabIdx + 1)]
        }
      }
    })
  }

  /** Render the content of the tabs */
  private tabContent() {
    return (
      <div className="tab-container">
        {this.state.tabs.map((_, idx) => (
          <TabContent
            {...this.props}
            tabTitle={_.title}
            key={_.uuid}
            uuid={_.uuid}
            active={idx === this.state.activeIdx}
            initialCommandLine={_.initialCommandLine}
            onTabReady={this._onTabReady}
            willSetTitle={this._onSetTabTitle}
            state={_.state}
          >
            {this.children(_.uuid)}
          </TabContent>
        ))}
      </div>
    )
  }

  private readonly toggleSidebar = () => {
    this.setState(curState => ({ isSidebarOpen: !curState.isSidebarOpen }))
  }

  private readonly toggleSidebarFromSidebar = () => {
    if (this.props.guidebooksExpanded !== true) {
      this.toggleSidebar()
    }
  }

  private get needsSidebar() {
    return !!this.props.guidebooks
  }

  private sidebar() {
    return (
      <Sidebar
        version={this.props.version}
        isOpen={this.state.isSidebarOpen}
        toggleOpen={this.toggleSidebarFromSidebar}
        noTopTabs={this.props.noTopTabs}
        guidebooks={this.props.guidebooks}
        productName={this.props.productName}
        indicateActiveItem={!!this.props.noTopTabs}
        guidebooksCommand={this.props.guidebooksCommand}
      />
    )
  }

  public render() {
    return (
      <Page
        mainContainerId="kui--page-main"
        className="kui--tab-container-page"
        header={this.topTabStripe()}
        sidebar={this.sidebar()}
        data-sidebar-open={this.state.isSidebarOpen || undefined}
      >
        {this.tabContent()}
      </Page>
    )
  }
}
