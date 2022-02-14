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
import Spinner from '../Views/Terminal/Block/Spinner'
import { ProgressStepState, statusToClassName } from './ProgressStepper'

import { emitLinkUpdate } from './LinkStatus'

import '../../../web/scss/components/Wizard/MiniProgressStepper.scss'

const strings = i18n('plugin-client-common', 'code')

type Status = ProgressStepState['status']

type MiniProps = {
  codeBlockId: string
  body: string
  language: string
  validate?: string
  optional?: boolean

  status: Status
}

export type StepperProps = {
  steps: MiniProps[]
}

export class MiniProgressStepper extends React.PureComponent<StepperProps> {
  private progress() {
    const isComplete = this.isComplete()

    return (
      <ol className="pf-c-progress-stepper kui--progress-stepper" data-mini={true} data-is-complete={this.isComplete()}>
        {this.props.steps
          .filter(_ => !isComplete || !_.optional)
          .map(props => (
            <MiniProgressStep key={props.codeBlockId} {...props} status={props.status} />
          ))}
      </ol>
    )
  }

  private get nSteps() {
    return this.props.steps.length
  }

  private get nRequiredSteps() {
    return this.props.steps.filter(_ => !_.optional).length
  }

  private get nDone() {
    return this.props.steps.filter(_ => _.status === 'success').length
  }

  private isComplete() {
    // it may be greater, it we have successful validation for
    // optional steps
    return this.nDone >= this.nRequiredSteps
  }

  public render() {
    return this.progress()
  }
}

class MiniProgressStep extends React.PureComponent<MiniProps> {
  public componentDidMount() {
    if (this.props.validate && this.props.status !== 'in-progress' && this.props.status !== 'success') {
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

  private get status(): Status {
    return this.props.status || 'blank'
  }

  private get statusClass() {
    return statusToClassName(this.status)
  }

  private icon() {
    return this.status === 'in-progress' ? <Spinner /> : <React.Fragment />
  }

  private get tooltipText() {
    const title = strings('Code Block')
    const status = this.status === 'blank' && this.props.optional ? 'optional' : this.status

    return `### ${title}
#### Status: ${strings('status.' + status)}

\`\`\`${this.props.language || ''}
${this.props.body}
\`\`\``
  }

  public render() {
    return (
      <Tooltip markdown={this.tooltipText} maxWidth="30rem" position="bottom-start">
        <li
          className={['pf-c-progress-stepper__step', 'kui--progress-step', ...this.statusClass].join(' ')}
          data-optional={this.props.optional || undefined}
        >
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
