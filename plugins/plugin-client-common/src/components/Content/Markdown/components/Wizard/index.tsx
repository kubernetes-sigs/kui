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
import { Choices, CodeBlock, Graph, Memoizer, Parser } from 'madwizard'

import Progress from './Progress'

import Card from '../../../../spi/Card'
import Loading from '../../../../spi/Loading'
import { Status, statusFromStatusVector } from '../../../ProgressStepper'
import { MiniProgressStepper, StepperProps } from '../../../MiniProgressStepper'
import { subscribeToLinkUpdates, unsubscribeToLinkUpdates } from '../../../LinkStatus'

import { WizardStep } from '@patternfly/react-core/dist/esm/components/Wizard'

const KWizard = React.lazy(() => import('./KWizard'))

const strings = i18n('plugin-client-common', 'code')

type Props = Choices.Choices & Parser.WizardProps & { uuid: string }

export interface State {
  /** Graph of code blocks across all steps */
  graph: Graph.OrderedGraph

  /** Code blocks contained in each step */
  codeBlocksPerStep: StepperProps['steps'][]

  /** Map from codeBlock ID to execution status of that code block */
  status: Record<string, Graph.Status>
}

export default class Wizard extends React.PureComponent<Props, State> {
  private readonly cleaners: (() => void)[] = []

  private readonly _statusUpdateHandler = (statusVector: number[], codeBlockId: string) => {
    const status = statusFromStatusVector(statusVector, false)

    this.updateStatus(codeBlockId, status)
  }

  public constructor(props: Props) {
    super(props)
    this.state = {
      graph: undefined,
      status: undefined,
      codeBlocksPerStep: undefined
    }
  }

  private readonly memos = new Memoizer()

  public async init(props: Props) {
    const codeBlocks = await Promise.all(
      Wizard.children(props).map(_ => Graph.compile(Wizard.containedCodeBlocks(_), props.choices, this.memos))
    )

    this.setState(state => {
      const status = state.status || {}
      const codeBlocksPerStep = codeBlocks.map(codeBlocksInStep =>
        Graph.blocks(codeBlocksInStep, props.choices).map(_ => ({
          codeBlockId: _.id,
          validate: _.validate,
          body: _.body,
          language: _.language,
          optional: _.optional,
          status: status[_.id]
        }))
      )

      const noChangeToCodeBlocks = state && Wizard.sameCodeBlocks(state.codeBlocksPerStep, codeBlocksPerStep)

      return {
        status,
        codeBlocksPerStep: noChangeToCodeBlocks ? state.codeBlocksPerStep : codeBlocksPerStep,
        graph: noChangeToCodeBlocks ? state.graph : Graph.order(Graph.sequence(codeBlocks.filter(Boolean)))
      }
    })
  }

  private static sameCodeBlock(a: State['codeBlocksPerStep'][0][0], b: State['codeBlocksPerStep'][0][0]) {
    return (
      a.codeBlockId === b.codeBlockId &&
      a.validate === b.validate &&
      a.body === b.body &&
      a.language === b.language &&
      a.optional === b.optional &&
      a.status === b.status
    )
  }

  private static sameCodeBlocks(AA: State['codeBlocksPerStep'], BB: State['codeBlocksPerStep']) {
    return AA && BB && AA.every((A, idx1) => A.every((a, idx2) => Wizard.sameCodeBlock(a, BB[idx1][idx2])))
  }

  public componentDidMount() {
    this.init(this.props)

    Graph.blocks(this.state.graph, 'all').forEach(_ => {
      subscribeToLinkUpdates(_.id, this._statusUpdateHandler)
      this.cleaners.push(() => unsubscribeToLinkUpdates(_.id, this._statusUpdateHandler))
    })
  }

  public componentWillUnmount() {
    this.cleaners.forEach(_ => _())
  }

  private updateStatus(codeBlockId: string, status: Status) {
    this.setState(curState => {
      if (curState.status[codeBlockId] === status) {
        // no change to state!
        return null
      } else {
        curState.status[codeBlockId] = status
        return {
          status: Object.assign({}, curState.status)
        }
      }
    })
  }

  private wizardCodeBlockSteps(stepIdx: number) {
    const containedCodeBlocks = this.state.codeBlocksPerStep[stepIdx]
    return containedCodeBlocks && containedCodeBlocks.length > 0 && <MiniProgressStepper steps={containedCodeBlocks} />
  }

  private wizardStepDescription(stepIdx: number, description: string) {
    return (
      <div className="kui--wizard-nav-item-description">
        {this.wizardCodeBlockSteps(stepIdx)}
        <div className="paragraph">{description}</div>
      </div>
    )
  }

  private static containedCodeBlocks(_: Parser.WizardProps['children'][0]): CodeBlock.CodeBlockProps[] {
    if (typeof _.props.containedCodeBlocks === 'string' && _.props.containedCodeBlocks.length > 0) {
      return _.props.containedCodeBlocks
        .split(' ')
        .filter(Boolean)
        .map(_ => JSON.parse(Buffer.from(_, 'base64').toString()) as CodeBlock.CodeBlockProps)
    } else {
      return undefined
    }
  }

  /** Overall progress across all steps */
  private progress() {
    if (this.props['data-kui-wizard-progress'] === 'bar' && Graph.blocks(this.state.graph).length > 0) {
      return (
        <div className="kui--markdown-major-paragraph">
          <Progress
            status={this.state.status}
            choices={this.props.choices}
            codeBlocks={this.state.graph}
            title={strings('Completed tasks')}
          />
        </div>
      )
    }
  }

  private static children(props: Props) {
    return (props.children || []).slice(1)
  }

  private wizard() {
    const steps: WizardStep[] = Wizard.children(this.props).map((_, stepIdx) => ({
      name: _.props['data-kui-title'],
      hideCancelButton: true,
      stepNavItemProps: {
        children: this.wizardStepDescription(stepIdx, _.props['data-kui-description'])
      },
      component: <Card className="kui--markdown-tab-card">{_.props && _.props.children}</Card>
    }))

    // onGoToStep={this._onWizardStepChange} onNext={this._onWizardStepChange} onBack={this._onWizardStepChange}
    const description = this.props.children[0]
    return (
      <KWizard
        title={this.props['data-kui-title']}
        description={React.isValidElement(description) && description}
        descriptionFooter={this.progress()}
        steps={steps}
      />
    )
  }

  public render() {
    if (!this.state.graph) {
      return <Loading />
    } else {
      return this.wizard()
    }
  }
}

/* private readonly _onWizardStepChange = (newStep: { name: React.ReactNode }) => {
    if (typeof newStep.name === 'string') {
      const activeKey = this.props.children.findIndex(_ => _.props.title === newStep.name)
      if (activeKey >= 0) {
        this.setState({ activeKey })
      }
    }
  } */
