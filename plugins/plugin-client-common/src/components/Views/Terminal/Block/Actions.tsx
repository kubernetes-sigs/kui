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
import { Tab, i18n, inBrowser } from '@kui-shell/core'
import DropDown, { DropDownAction } from '../../../spi/DropDown'

import { InputOptions } from './Input'
import BlockModel, { hasUUID } from './BlockModel'
import { SupportedIcon } from '../../../spi/Icons'
import TwoFaceIcon from '../../../spi/Icons/TwoFaceIcon'

const strings = i18n('plugin-client-common')
const strings2 = i18n('plugin-client-common', 'screenshot')

type Props = InputOptions & {
  tab?: Tab

  // MYAN TODO: instead pass in execUUID, or willRerun and willCopy? to avoid spurious rerenders
  command?: string
  model?: BlockModel
}

function Action(props: { onClick: () => void; icon: SupportedIcon; title: string }) {
  return (
    <TwoFaceIcon
      a={props.icon}
      b="Checkmark"
      onClick={props.onClick}
      classNameB="green-text"
      className="kui--block-action"
      title={strings(props.title)}
    />
  )
}

export default class Actions extends React.PureComponent<Props> {
  private rerunAction() {
    const handler = () =>
      hasUUID(this.props.model)
        ? this.props.tab.REPL.pexec(this.props.command, { execUUID: this.props.model.execUUID })
        : this.props.tab.REPL.pexec(this.props.command)

    return (
      this.props.tab && this.props.command && <Action icon="Retry" onClick={handler} title="Re-execute this command" />
    )
    /* [
      {
        label: strings('Rerun'),
        handler
      }
    ] */
  }

  private copyAction(): DropDownAction[] {
    return (
      this.props
        .command /* (
        <Action
          icon="Copy"
          onClick={() => navigator.clipboard.writeText(this.props.command)}
          title="Copy the command line to the clipboard"
        />
)
    ) */ && [
        {
          label: strings('Copy'),
          handler: () => navigator.clipboard.writeText(this.props.command)
        }
      ]
    )
  }

  private removeAction() {
    return (
      this.props.willRemove && (
        <Action icon="WindowClose" onClick={() => this.props.willRemove()} title="Remove this block" />
      )
    )
  }

  private insertAction(): DropDownAction[] {
    return !this.props.willInsertBlock
      ? []
      : [
          {
            label: strings('Insert Command'),
            handler: () => this.props.willInsertBlock()
          }
        ]
  }

  private screenshotAction(): DropDownAction[] {
    return !this.props.willScreenshot || inBrowser()
      ? []
      : [
          {
            label: strings2('Screenshot'),
            handler: () => this.props.willScreenshot()
          }
        ]
  }

  public render() {
    const actions = this.copyAction()
      .concat(this.screenshotAction())
      .concat(this.insertAction())

    return (
      <React.Fragment>
        {actions.length > 0 && (
          <DropDown
            actions={actions}
            className="kui--repl-block-right-element kui--toolbar-button-with-icon"
            onClose={this.props.willLoseFocus}
          />
        )}
        {/* this.copyAction() */}
        {this.rerunAction()}
        {this.removeAction()}
      </React.Fragment>
    )
  }
}
