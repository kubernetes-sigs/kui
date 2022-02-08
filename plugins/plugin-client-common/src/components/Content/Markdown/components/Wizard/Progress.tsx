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
import { i18n } from '@kui-shell/core'

import CodeBlockProps from './CodeBlockProps'

import { ProgressStepState, statusFromStatusVector } from '../../../ProgressStepper'
import { subscribeToLinkUpdates, unsubscribeToLinkUpdates } from '../../../LinkStatus'

import { ProgressVariant } from '@patternfly/react-core'

const PatternFlyProgress = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.Progress })))

const strings = i18n('plugin-client-common', 'code')

interface Props {
  /** The tasks to be accomplished */
  codeBlocks: CodeBlockProps[]
}

type Status = ProgressStepState['status']

interface State {
  /** The key is a codeBlockId */
  status: Record<string, Status>
}

export default class Progress extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      status: {}
    }
  }

  private readonly _statusUpdateHandler = (statusVector: number[], codeBlockId: string) => {
    const status = statusFromStatusVector(statusVector, false)

    this.updateStatus(codeBlockId, status)
  }

  private updateStatus(codeBlockId: string, status: Status) {
    this.setState(curState => {
      curState.status[codeBlockId] = status
      return {
        status: Object.assign({}, curState.status)
      }
    })
  }

  public componentDidMount() {
    this.props.codeBlocks.forEach(_ => {
      subscribeToLinkUpdates(_.id, this._statusUpdateHandler)
    })
  }

  public componentWillUnmount() {
    this.props.codeBlocks.forEach(_ => {
      unsubscribeToLinkUpdates(_.id, this._statusUpdateHandler)
    })
  }

  private get nSteps() {
    return this.props.codeBlocks.length
  }

  private counts() {
    return Object.values(this.state.status).reduce(
      (counts, status) => {
        if (status === 'success') {
          counts.nDone++
        } else if (status === 'error') {
          counts.nError++
        } else if (status === 'in-progress') {
          counts.nInProgress++
        }

        return counts
      },
      { nDone: 0, nError: 0, nInProgress: 0 }
    )
  }

  public render() {
    const { nDone, nError /* , nInProgress */ } = this.counts()

    const title = strings('Completed tasks')
    const label = /* nInProgress > 0 ? strings('status.in-progress') : */ strings('xOfy', nDone, this.nSteps)

    const variant =
      nDone === this.nSteps
        ? ProgressVariant.success
        : nError > 0
        ? ProgressVariant.danger
        : // : nInProgress > 0
          // ? ProgressVariant.warning
          undefined

    return (
      <PatternFlyProgress
        aria-label="wizard progress"
        className="kui--wizard-progress"
        min={0}
        max={this.nSteps}
        value={nDone}
        title={title}
        label={label}
        valueText={label}
        size="sm"
        variant={variant}
      />
    )
  }
}
