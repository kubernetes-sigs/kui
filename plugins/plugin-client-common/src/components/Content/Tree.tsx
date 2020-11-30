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

import React from 'react'

import {
  Button,
  eventBus,
  MultiModalResponse,
  Tab,
  ToolbarProps,
  TreeItem,
  TreeResponse,
  ToolbarText
} from '@kui-shell/core'
import TreeView, { TreeViewDataItem } from '../spi/TreeView'
import Events from './Events'

import '../../../web/scss/components/Tree/index.scss'

type Props = {
  response: MultiModalResponse
  tab: Tab
  data: TreeResponse['data']
  toolbarText: ToolbarText
  toolbarButtons: Button[]
} & ToolbarProps

interface State {
  activeItem: TreeItem
}

export default class KuiTreeView extends React.PureComponent<Props, State> {
  public constructor(props) {
    super(props)

    this.state = {
      activeItem: this.props.data[0]
    }
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    if (props.toolbarText) {
      props.willUpdateToolbar(props.toolbarText)
    }
    return state
  }

  private updateToolbar(updateToolbarText: string, buttons: Button[]) {
    if (this.props.toolbarText) {
      const toolbarText = {
        type: this.props.toolbarText.type,
        text: `${this.props.toolbarText.text} ${updateToolbarText}`
      }

      this.props.willUpdateToolbar(toolbarText, buttons)
    }
  }

  /**
   * transform kui TreeItem[] to TreeViewDataItem[]
   * 1. remove content & modifiedContent from each TreeItem for memory in TreeView
   * 2. we used to render the content of each tree node in an editor (or diffEditor)
   *    but this feature is replaced by item.onclick command
   *    NOTE: maybe we can remove the content & modifiedContent from the TreeItem
   *
   */
  private kuiTreeItemsToView(kuiTreeItems: TreeItem[]) {
    const kuiTreeItemToView = (item: TreeItem): TreeViewDataItem => {
      return Object.assign({}, item, {
        content: undefined,
        modifiedContent: undefined
      })
    }

    return kuiTreeItems.map(kuiTreeItem => {
      const treeViewDataItem = kuiTreeItemToView(kuiTreeItem)
      if (kuiTreeItem.children) {
        treeViewDataItem.children = this.kuiTreeItemsToView(kuiTreeItem.children)
      }
      return treeViewDataItem
    })
  }

  private tree() {
    const data = this.kuiTreeItemsToView(this.props.data)
    return (
      <TreeView
        data={data}
        activeItems={[this.state.activeItem]}
        onSelect={(_, treeViewItem) => {
          const item = treeViewItem as TreeItem
          if (item.onclickEvents) {
            eventBus.emitCommandStart(item.onclickEvents.startEvent)
            eventBus.emitCommandComplete(item.onclickEvents.completeEvent)
          } else if (item.onclick) {
            this.props.tab.REPL.pexec(item.onclick)
          }
          this.setState({ activeItem: item })
        }}
      />
    )
  }

  private events() {
    if (this.state.activeItem.eventArgs) {
      const { command, schema } = this.state.activeItem.eventArgs

      return (
        <Events
          tab={this.props.tab}
          command={command}
          schema={schema}
          involvedObjects={this.state.activeItem.extends}
        />
      )
    }
  }

  public render() {
    // NOTE: we could bring Tree and TreeView together, once events and editor are separated out
    return (
      <div className="kui--tree kui--full-height">
        <div className="kui--tree-nav-and-body kui--full-height kui--rows">{this.tree()}</div>
        {this.events()}
      </div>
    )
  }
}
