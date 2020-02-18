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
import { ToolbarText, Button } from '@kui-shell/core'

import Toolbar, { Props } from './Toolbar'

interface State {
  toolbarText: ToolbarText
  extraButtons?: Button[]
}

export default class ToolbarContainer extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      toolbarText: props.toolbarText
    }
  }

  /** Called by children if they desire an update to the Toolbar */
  private onToolbarUpdate(toolbarText: ToolbarText, extraButtons?: Button[]) {
    this.setState({ toolbarText, extraButtons })
  }

  /** Graft on the toolbar event management */
  private children() {
    if (React.isValidElement(this.props.children)) {
      // ^^^ this check avoids tsc errors
      return React.cloneElement(this.props.children, { willUpdateToolbar: this.onToolbarUpdate.bind(this) })
    } else {
      return this.props.children
    }
  }

  public render() {
    return (
      <div className="full-height">
        <Toolbar
          tab={this.props.tab}
          response={this.props.response}
          toolbarText={this.state.toolbarText}
          buttons={this.props.buttons.concat(this.state.extraButtons || [])}
        />
        {this.children()}
      </div>
    )
  }
}
