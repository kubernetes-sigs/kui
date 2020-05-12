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
import { Tab as KuiTab, ToolbarText, Button, MultiModalResponse, ParsedOptions } from '@kui-shell/core'

import Icons from '../../spi/Icons'
import ToolbarButton from './ToolbarButton'

export type Props = {
  tab: KuiTab
  buttons: Button[]
  response: MultiModalResponse
  toolbarText?: ToolbarText
  args: {
    argvNoOptions: string[]
    parsedOptions: ParsedOptions
  }
}

export default class Toolbar extends React.PureComponent<Props> {
  private icon() {
    if (this.props.toolbarText) {
      const { type } = this.props.toolbarText
      switch (type) {
        case 'info':
          return <Icons icon="Info" />
        case 'warning':
          return <Icons icon="Warning" />
        default:
          return <Icons icon="Error" />
      }
    }
  }

  private buttons() {
    if (this.props.buttons) {
      return this.props.buttons
        .sort((a, b) => {
          return (a.order || 0) - (b.order || 0)
        })
        .map((button, idx) => (
          <ToolbarButton
            tab={this.props.tab}
            button={button}
            response={this.props.response}
            args={this.props.args}
            key={idx}
          />
        ))
    }
  }

  public render() {
    try {
      return (
        <div className="sidecar-bottom-stripe-toolbar">
          <div className="sidecar-toolbar-text" data-type={this.props.toolbarText && this.props.toolbarText.type}>
            <div className="sidecar-toolbar-text-icon">{this.icon()}</div>
            {this.props.toolbarText && (
              <div
                className="sidecar-toolbar-text-content"
                dangerouslySetInnerHTML={{
                  __html:
                    typeof this.props.toolbarText.text === 'string'
                      ? this.props.toolbarText.text
                      : this.props.toolbarText.text.innerHTML
                }}
              />
            )}
          </div>

          <div className="sidecar-bottom-stripe-mode-bits sidecar-bottom-stripe-button-container">
            <div className="fill-container flush-right">{this.buttons()}</div>
          </div>
        </div>
      )
    } catch (err) {
      console.error(err)
      return <div />
    }
  }
}
