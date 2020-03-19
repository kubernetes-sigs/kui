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
import {
  Tab as KuiTab,
  Button,
  ResourceWithMetadata,
  isViewButton,
  MultiModalResponse,
  ParsedOptions
} from '@kui-shell/core'

interface Props {
  tab: KuiTab
  button: Button
  response: MultiModalResponse
  args: {
    argvNoOptions: string[]
    parsedOptions: ParsedOptions
  }
}

export default class ToolbarButton<T extends ResourceWithMetadata = ResourceWithMetadata> extends React.PureComponent<
  Props
> {
  private getCommand() {
    const { tab, response, button, args } = this.props
    if (isViewButton(button)) {
      return button.command
    } else {
      const cmd = typeof button.command === 'string' ? button.command : button.command(tab, response, args)
      if (button.confirm) {
        return `confirm "${cmd}"`
      } else {
        return cmd
      }
    }
  }

  private buttonOnclick() {
    const cmd = this.getCommand()
    const { tab, response, button, args } = this.props

    if (typeof cmd === 'string') {
      if (isViewButton(button) || button.confirm) {
        return tab.REPL.qexec(cmd, undefined, undefined, { rethrowErrors: true })
      } else {
        return tab.REPL.pexec(cmd)
      }
    } else {
      cmd(tab, response, args)
    }
  }

  public render() {
    const { button } = this.props

    return (
      <a
        role="presentation"
        href="#"
        className="kui--tab-navigatable kui--notab-when-sidecar-hidden sidecar-bottom-stripe-button-as-button sidecar-bottom-stripe-button"
        data-mode={button.mode}
        onClick={this.buttonOnclick.bind(this)}
      >
        <span role="tab">{button.label || button.mode}</span>
      </a>
    )
  }
}
