/*
 * Copyright 2022 The Kubernetes Authors
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
import { i18n, pexecInCurrentTab } from '@kui-shell/core'

import Tooltip from '../spi/Tooltip'
import { emitLinkUpdate, subscribeToLinkUpdates, unsubscribeToLinkUpdates } from './LinkStatus'
import { ProgressStepState, statusFromStatusVector, statusToClassName, statusToIcon } from './ProgressStepper'

import '../../../web/scss/components/Wizard/MiniProgressStepper.scss'

const strings = i18n('plugin-client-common', 'code')

export class MiniProgressStepper extends React.PureComponent<React.PropsWithChildren<{}>> {
  public render() {
    return (
      <ol className="pf-c-progress-stepper kui--progress-stepper" data-mini={true}>
        {this.props.children}
      </ol>
    )
  }
}

type MiniProps = {
  codeBlockId: string
  body: string
  language: string
  validate?: string
}

export class MiniProgressStep extends React.PureComponent<MiniProps, ProgressStepState> {
  private readonly _statusUpdateHandler = (statusVector: number[]) => {
    this.setState({ status: statusFromStatusVector(statusVector, false) })
  }

  public componentDidMount() {
    subscribeToLinkUpdates(this.props.codeBlockId, this._statusUpdateHandler)

    if (this.props.validate) {
      setTimeout(async () => {
        try {
          emitLinkUpdate(this.props.codeBlockId, 'in-progress')
          await pexecInCurrentTab(this.props.validate, undefined, true, true)
          emitLinkUpdate(this.props.codeBlockId, 'success')
        } catch (err) {
          emitLinkUpdate(this.props.codeBlockId, 'blank')
        }
      })
    }
  }

  public componentWillUnmount() {
    unsubscribeToLinkUpdates(this.props.codeBlockId, this._statusUpdateHandler)
  }

  private get status() {
    return !this.state ? 'blank' : this.state.status
  }

  private get statusClass() {
    return statusToClassName(this.status)
  }

  private icon() {
    return this.status === 'in-progress' ? statusToIcon(this.status) : <React.Fragment />
  }

  private get tooltipText() {
    const title = strings('Code Block')

    return `### ${title}
#### Status: ${strings('status.' + this.status)}

\`\`\`${this.props.language || ''}
${this.props.body}
\`\`\``
  }

  public render() {
    return (
      <Tooltip markdown={this.tooltipText} maxWidth="30rem">
        <li className={['pf-c-progress-stepper__step', 'kui--progress-step', ...this.statusClass].join(' ')}>
          <div className="pf-c-progress-stepper__step-connector">
            <a className="kui--progress-step-status-icon-link" href={`#kui-link-${this.props.codeBlockId}`}>
              <span className="pf-c-progress-stepper__step-icon kui--progress-step-status-icon">{this.icon()}</span>
            </a>
          </div>
        </li>
      </Tooltip>
    )
  }
}
