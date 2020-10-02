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
import { ToolbarText, ToolbarAlert, Button } from '@kui-shell/core'

import Alert from '../../spi/Alert'
import Toolbar, { Props as ToolbarProps } from './Toolbar'
export { Props as ToolbarContainerProps }

export type Props = React.PropsWithChildren<ToolbarProps>

interface State {
  toolbarText: ToolbarText
  extraButtons?: Button[]
  extraButtonsOverride?: boolean
  alerts?: ToolbarAlert[]
}

export default class ToolbarContainer extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      toolbarText: props.toolbarText
    }
  }

  /** Called by children if they desire an update to the Toolbar */
  private onToolbarUpdate(toolbarText: ToolbarText, extraButtons?: Button[], extraButtonsOverride?: boolean) {
    this.setState({ toolbarText, extraButtons, extraButtonsOverride })
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
    const toolbarButtons =
      this.state.extraButtonsOverride && Array.isArray(this.state.extraButtons)
        ? this.state.extraButtons
        : this.props.buttons.concat(this.state.extraButtons || [])
    const toolbarHasContent = this.state.toolbarText || toolbarButtons.length !== 0
    const toolbarHasAlerts =
      !this.props.noAlerts &&
      this.state.toolbarText &&
      this.state.toolbarText.alerts &&
      this.state.toolbarText.alerts.length !== 0

    return (
      <div className="full-height">
        {toolbarHasContent && (
          <Toolbar
            tab={this.props.tab}
            response={this.props.response}
            args={this.props.args}
            toolbarText={this.state.toolbarText}
            buttons={toolbarButtons}
          />
        )}
        {toolbarHasAlerts && this.state.toolbarText.alerts.map((alert, id) => <Alert key={id} alert={alert} />)}
        <React.Suspense fallback={<div />}>{this.children()}</React.Suspense>
      </div>
    )
  }
}
