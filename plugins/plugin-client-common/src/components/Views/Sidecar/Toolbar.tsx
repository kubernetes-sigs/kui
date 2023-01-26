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
import type { ToolbarText, Button, MultiModalResponse, ParsedOptions } from '@kui-shell/core'

import Icons from '../../spi/Icons'
import LocationProps from './Location'
import ToolbarButton from './ToolbarButton'
import Markdown from '../../Content/Markdown'

export type Props = LocationProps & {
  buttons: Button[]
  response: MultiModalResponse
  toolbarText?: ToolbarText
  noAlerts?: boolean
  bottom?: boolean
  args: {
    argvNoOptions: string[]
    parsedOptions: ParsedOptions
  }
}

/** helper to ensure exhaustiveness of the switch statement below */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertUnreachable(x: never): never {
  throw new Error('Did not expect to get here')
}

export default class Toolbar extends React.PureComponent<Props> {
  private icon() {
    if (this.props.toolbarText) {
      const { type } = this.props.toolbarText
      switch (type) {
        case 'info':
          return <Icons icon="Info" />
        case 'success':
          return <Icons icon="Checkmark" />
        case 'warning':
          return <Icons icon="Warning" />
        case 'error':
          return <Icons icon="Error" />
      }

      // this bit of magic ensures exhaustiveness of the switch;
      // reference: https://stackoverflow.com/a/39419171
      return assertUnreachable(type)
    }
  }

  private buttons() {
    if (this.props.buttons) {
      return this.props.buttons
        .sort() // sort alphabetically first
        .sort((a, b) => {
          return (a.order || 0) - (b.order || 0)
        })
        .map((button, idx) => (
          <ToolbarButton
            tab={this.props.tab}
            execUUID={this.props.execUUID}
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
          <div
            className="sidecar-toolbar-text"
            data-location-bottom={this.props.bottom || undefined}
            data-type={this.props.toolbarText && this.props.toolbarText.type}
          >
            <div className="sidecar-toolbar-text-icon">{this.icon()}</div>
            {this.props.toolbarText &&
              (typeof this.props.toolbarText.text === 'string' ? (
                <Markdown source={this.props.toolbarText.text} className="sidecar-toolbar-text-content" />
              ) : (
                <div
                  className="sidecar-toolbar-text-content"
                  dangerouslySetInnerHTML={{
                    __html: this.props.toolbarText.text.innerHTML
                  }}
                />
              ))}
          </div>

          <div
            className="sidecar-bottom-stripe-mode-bits sidecar-bottom-stripe-button-container"
            data-location-bottom={this.props.bottom || undefined}
          >
            <div className="fill-container flex-layout flush-right flex-align-stretch">{this.buttons()}</div>
          </div>
        </div>
      )
    } catch (err) {
      console.error(err)
      return <div />
    }
  }
}
