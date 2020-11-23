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
  i18n,
  MultiModalResponse,
  Tab,
  ToolbarProps,
  TreeItem,
  TreeResponse,
  ToolbarText
} from '@kui-shell/core'
import TreeView from '../spi/TreeView'
import Editor from './Editor'
import DiffEditor from './Editor/DiffEditor'
import Events from './Events'

import '../../../web/scss/components/Tree/index.scss'

const strings = i18n('plugin-client-common')

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

  /** render tree item content in `Editor` */
  private editor() {
    return (
      <React.Suspense fallback={<div />}>
        {!this.state.activeItem.modifiedContent ? (
          <Editor
            key={this.state.activeItem.id}
            content={{ content: this.state.activeItem.content, contentType: this.state.activeItem.contentType }}
            readOnly={false}
            sizeToFit
            response={this.props.response}
            repl={this.props.tab.REPL}
            tabUUID={this.props.tab.uuid}
          />
        ) : (
          <DiffEditor
            key={this.state.activeItem.id}
            tabUUID={this.props.tab.uuid}
            originalContent={this.state.activeItem.content}
            modifiedContent={this.state.activeItem.modifiedContent}
            hasPendingChanges={this.updateToolbar.bind(
              this,
              strings('with pending changes'),
              this.props.toolbarButtons
            )}
            noPendingChange={this.updateToolbar.bind(this, strings('with no pending changes'))}
            contentType={this.state.activeItem.contentType}
            sizeToFit
            renderSideBySide={false}
          />
        )}
      </React.Suspense>
    )
  }

  private tree() {
    return (
      <TreeView
        data={this.props.data}
        activeItems={[this.state.activeItem]}
        onSelect={(_, treeViewItem) => {
          this.setState({
            activeItem: treeViewItem as TreeItem
          })
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
