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
import { Tab, i18n } from '@kui-shell/core'

import { InputOptions } from './Input'
import { SupportedIcon } from '../../../spi/Icons'
import TwoFaceIcon from '../../../spi/Icons/TwoFaceIcon'
import BlockModel, { hasUUID, hasBeenRerun, isBeingRerun, isOutputOnly, isRerunable } from './BlockModel'
import { MutabilityContext } from '../../../Client/MutabilityContext'

const strings = i18n('plugin-client-common')

type Props = InputOptions & {
  tab?: Tab

  /** block index */
  idx: number

  // MYAN TODO: instead pass in execUUID, or willRerun and willCopy? to avoid spurious rerenders
  command?: string
  model?: BlockModel
}

function Action(props: {
  onClick: (evt: React.SyntheticEvent) => void
  icon: SupportedIcon
  iconB?: SupportedIcon
  title: string
}) {
  return (
    <TwoFaceIcon
      a={props.icon}
      b={props.iconB || 'Checkmark'}
      delay={4000}
      onClick={props.onClick}
      classNameB="green-text"
      className="kui--block-action"
      title={strings(props.title)}
    />
  )
}

export default class Actions extends React.PureComponent<Props> {
  private readonly _rerunHandler = () => {
    if (hasUUID(this.props.model)) {
      this.props.tab.REPL.reexec(this.props.command, { execUUID: this.props.model.execUUID })
    }
  }

  private rerunAction(icon: 'Play' | 'Retry') {
    if (
      hasUUID(this.props.model) &&
      isRerunable(this.props.model) &&
      !isOutputOnly(this.props.model) &&
      this.props.tab &&
      this.props.command
    ) {
      if (isBeingRerun(this.props.model)) {
        return <React.Fragment />
      }
      return (
        <Action
          icon={icon}
          iconB="At"
          onClick={this._rerunHandler}
          title={strings(icon === 'Retry' ? 'Re-execute this command' : 'Execute this command')}
        />
      )
    }
  }

  private copyAction() {
    return (
      this.props.command && (
        <Action
          icon="Copy"
          onClick={() => navigator.clipboard.writeText(this.props.command)}
          title="Copy the command line to the clipboard"
        />
      )
    )
  }

  private removeAction() {
    return (
      this.props.willRemove && (
        <Action
          icon="WindowClose"
          onClick={evt => this.props.willRemove(evt, this.props.idx)}
          title={'Remove this block'}
        />
      )
    )
  }

  public render() {
    return (
      <MutabilityContext.Consumer>
        {value => {
          if (!value.editable && value.executable) {
            if (this.props.isExecutable) {
              return (
                <div
                  className="kui--block-actions-buttons"
                  data-has-been-rerun={hasBeenRerun(this.props.model) || undefined}
                >
                  {this.rerunAction('Play')}
                </div>
              )
            }
          } else if (!value.editable && !value.executable) {
            return <React.Fragment />
          } else {
            return (
              <div className="kui--block-actions-buttons kui--inverted-color-context">
                <div className="kui-block-actions-others">
                  {this.copyAction()}
                  {value.executable && this.rerunAction('Play')}
                </div>
                {value.editable && this.removeAction()}
              </div>
            )
          }
        }}
      </MutabilityContext.Consumer>
    )
  }
}
