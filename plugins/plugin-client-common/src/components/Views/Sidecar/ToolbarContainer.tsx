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
import type { ToolbarText, ToolbarAlert, Button } from '@kui-shell/core'

import Alert from '../../spi/Alert'
import Toolbar, { Props as ToolbarProps } from './Toolbar'

export type Props = React.PropsWithChildren<
  ToolbarProps & {
    didUpdateToolbar: (toolbarText: ToolbarText) => void
  }
>
export { Props as ToolbarContainerProps }

interface State {
  extraButtons?: Button[]
  extraButtonsOverride?: boolean
  alerts?: ToolbarAlert[]
}

export default class ToolbarContainer extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {}
  }

  /** Called by children if they desire an update to the Toolbar */
  private onToolbarUpdate(toolbarText: ToolbarText, extraButtons?: Button[], extraButtonsOverride?: boolean) {
    this.setState({ extraButtons, extraButtonsOverride })
    if (
      toolbarText &&
      (!this.props.toolbarText ||
        toolbarText.type !== this.props.toolbarText.type ||
        toolbarText.text !== this.props.toolbarText.text ||
        toolbarText.alerts !== this.props.toolbarText.alerts)
    ) {
      this.props.didUpdateToolbar(toolbarText)
    }
  }

  private readonly _willUpdateToolbar = this.onToolbarUpdate.bind(this)

  /** Graft on the toolbar event management */
  private children() {
    if (React.isValidElement(this.props.children)) {
      // ^^^ this check avoids tsc errors
      return React.cloneElement(
        this.props.children as React.ReactElement<{ willUpdateToolbar: ToolbarContainer['onToolbarUpdate'] }>,
        { willUpdateToolbar: this._willUpdateToolbar }
      )
    } else {
      return this.props.children
    }
  }

  public render() {
    const toolbarButtons =
      this.state.extraButtonsOverride && Array.isArray(this.state.extraButtons)
        ? this.state.extraButtons
        : this.props.buttons.concat(this.state.extraButtons || [])
    const toolbarHasContent = this.props.toolbarText || toolbarButtons.length !== 0
    const toolbarHasAlerts =
      !this.props.noAlerts &&
      this.props.toolbarText &&
      this.props.toolbarText.alerts &&
      this.props.toolbarText.alerts.length !== 0

    return (
      <div className="full-height">
        {toolbarHasContent && (
          <Toolbar
            tab={this.props.tab}
            execUUID={this.props.execUUID}
            response={this.props.response}
            args={this.props.args}
            toolbarText={this.props.toolbarText}
            buttons={toolbarButtons}
          />
        )}
        {toolbarHasAlerts && (
          <React.Suspense fallback={<div />}>
            {this.props.toolbarText.alerts.map((alert, id) => (
              <Alert key={id} alert={alert} />
            ))}
          </React.Suspense>
        )}
        <React.Suspense fallback={<div />}>{this.children()}</React.Suspense>
      </div>
    )
  }
}
