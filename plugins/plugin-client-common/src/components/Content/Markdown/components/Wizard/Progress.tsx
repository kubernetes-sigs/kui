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
import { ProgressVariant } from '@patternfly/react-core/dist/esm/components/Progress'

import {
  ReadinessHandler,
  emitCodeBlockReadiness,
  onGetCodeBlockReadiness,
  offGetCodeBlockReadiness
} from '../../../../Views/Terminal/Block/CodeBlockEvents'

import { Graph, Choices } from 'madwizard'

import { ProgressStepState } from '../../../ProgressStepper'

const PatternFlyProgress = React.lazy(() =>
  import('@patternfly/react-core/dist/esm/components/Progress').then(_ => ({ default: _.Progress }))
)

const strings = i18n('plugin-client-common', 'code')

type Status = ProgressStepState['status']

type Props = Choices.Choices & {
  /** Title to display alongside the progress bar */
  title: string

  /** The tasks to be accomplished */
  codeBlocks: Graph.OrderedGraph

  /** The key is a codeBlockId */
  status: Record<string, Status>
}

type State = ReturnType<typeof Graph.progress> & {
  nextCodeBlocks: string[]
}

export default class Progress extends React.PureComponent<Props, State> {
  private readonly cleaners: (() => void)[] = []

  public constructor(props: Props) {
    super(props)

    this.state = Progress.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    const prog = Graph.progress(props.codeBlocks, props.status, props.choices)

    const allCodeBlocks = Graph.blocks(props.codeBlocks)
    if (!state) {
      // initialize all blocks as not ready
      allCodeBlocks.forEach(_ => emitCodeBlockReadiness(_.id, false))
    }

    const nextCodeBlocks = allCodeBlocks.filter(_ => prog.nextOrdinals.includes(_.order)).map(_ => _.id)

    if (state) {
      const noLongerReady = state.nextCodeBlocks.filter(_ => !nextCodeBlocks.includes(_))
      noLongerReady.forEach(id => emitCodeBlockReadiness(id, false))
    }
    nextCodeBlocks.forEach(id => emitCodeBlockReadiness(id, true))

    return Object.assign({}, prog, { nextCodeBlocks })
  }

  private readonly _onGetReadiness = (handler: ReadinessHandler, codeBlockId: string) => {
    const ready = this.state.nextCodeBlocks.includes(codeBlockId)
    handler(ready)
  }

  public componentDidMount() {
    Graph.blocks(this.props.codeBlocks).forEach(({ id }) => {
      onGetCodeBlockReadiness(id, this._onGetReadiness)
      this.cleaners.push(() => offGetCodeBlockReadiness(id, this._onGetReadiness))
    })
  }

  public componentWillUnmount() {
    this.cleaners.forEach(_ => _())
  }

  public render() {
    const { nDone, nError, nTotal } = this.state

    const label =
      nError > 0
        ? strings(nError === 1 ? 'xOfyFailingz' : 'xOfyFailingsz', nDone, nError, nTotal)
        : strings('xOfy', nDone, nTotal)

    const variant = nDone === nTotal ? ProgressVariant.success : nError > 0 ? ProgressVariant.danger : undefined

    return (
      <PatternFlyProgress
        aria-label="wizard progress"
        className="kui--wizard-progress"
        min={0}
        max={nTotal}
        value={nDone}
        title={this.props.title}
        label={label}
        valueText={label}
        size="sm"
        variant={variant}
        measureLocation="outside"
      />
    )
  }
}
