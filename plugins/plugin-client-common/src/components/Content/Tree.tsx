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

import { MultiModalResponse, Tab, TreeItem, TreeResponse } from '@kui-shell/core'
import TreeView from '../spi/TreeView'
import Editor from './Editor'
import Events from './Events'

import '../../../web/scss/components/Tree/index.scss'

type Props = {
  response: MultiModalResponse
  tab: Tab
  data: TreeResponse['data']
}

interface State {
  activeItems: TreeItem[]
}

export default class KuiTreeView extends React.PureComponent<Props, State> {
  public constructor(props) {
    super(props)

    this.state = {
      activeItems: [this.props.data[0]]
    }
  }

  /** render tree item content in `Editor` */
  private editor() {
    return (
      <React.Suspense fallback={<div />}>
        <Editor
          key={this.state.activeItems[0].id}
          content={{ content: this.state.activeItems[0].content, contentType: this.state.activeItems[0].contentType }}
          readOnly={false}
          sizeToFit
          response={this.props.response}
          repl={this.props.tab.REPL}
          tabUUID={this.props.tab.uuid}
        />
      </React.Suspense>
    )
  }

  private tree() {
    return (
      <TreeView
        data={this.props.data}
        activeItems={this.state.activeItems}
        onSelect={(_, treeViewItem, parentItem) => {
          this.setState({
            activeItems: [treeViewItem as TreeItem, parentItem as TreeItem]
          })
        }}
        hasBadges
      />
    )
  }

  private events() {
    if (this.state.activeItems[0].eventArgs) {
      const { command, schema } = this.state.activeItems[0].eventArgs

      return (
        <Events
          tab={this.props.tab}
          command={command}
          schema={schema}
          involvedObjects={this.state.activeItems[0].extends}
        />
      )
    }
  }

  public render() {
    return (
      <div className="kui--tree kui--full-height">
        <div className="kui--tree-nav-and-body kui--full-height">
          {this.tree()}
          {this.editor()}
        </div>
        {this.events()}
      </div>
    )
  }
}
