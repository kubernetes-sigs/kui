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

import { WizardProps } from './rehype-wizard'

import Progress from './Progress'
import CodeBlockProps from './CodeBlockProps'
import { onTabSwitch, offTabSwitch } from '../tabbed'
import { Graph, OrderedGraph, blocks, compile, order, sequence } from '../code/graph'

import Card from '../../../../spi/Card'
import { MiniProgressStepper } from '../../../MiniProgressStepper'
import { ProgressStepState, statusFromStatusVector } from '../../../ProgressStepper'
import { subscribeToLinkUpdates, unsubscribeToLinkUpdates } from '../../../LinkStatus'

import '../../../../../../web/scss/components/Wizard/PatternFly.scss'

const PatternFlyWizard = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.Wizard })))

type Status = ProgressStepState['status']

type Props = WizardProps & { uuid: string }

export interface State {
  codeBlocks: OrderedGraph

  /** Map from codeBlock ID to execution status of that code block */
  status: Record<string, Status>

  /** Map from tab group to currently selected tab member */
  choices: Record<string, string>
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
      status: {},
      choices: {},
      codeBlocks: order(sequence(this.children.flatMap(_ => this.containedCodeBlocks(_)).filter(Boolean)))
    }
  }

  public componentDidMount() {
    blocks(this.state.codeBlocks, 'all').forEach(_ => {
      subscribeToLinkUpdates(_.id, this._statusUpdateHandler)
      this.cleaners.push(() => unsubscribeToLinkUpdates(_.id, this._statusUpdateHandler))
    })

    const switcher = (group: string, member: string) => {
      this.setState(curState => ({
        choices: Object.assign({}, curState.choices, { [group]: member })
      }))
    }

    onTabSwitch(this.props.uuid, switcher)
    this.cleaners.push(() => offTabSwitch(this.props.uuid, switcher))
  }

  public componentDidUnmount() {
    this.cleaners.forEach(_ => _())
  }

  private updateStatus(codeBlockId: string, status: Status) {
    this.setState(curState => {
      curState.status[codeBlockId] = status
      return {
        status: Object.assign({}, curState.status)
      }
    })
  }

  private wizardCodeBlockSteps(containedCodeBlocks: Graph) {
    return (
      containedCodeBlocks && (
        <MiniProgressStepper
          status={this.state.status}
          steps={blocks(containedCodeBlocks, this.state.choices).map(_ => ({
            codeBlockId: _.id,
            validate: _.validate,
            body: _.body,
            language: _.language,
            optional: _.optional
          }))}
        />
      )
    )
  }

  private wizardStepDescription(description: string, containedCodeBlocks: Graph) {
    return (
      <div className="kui--wizard-nav-item-description">
        {this.wizardCodeBlockSteps(containedCodeBlocks)}
        <div className="paragraph">{description}</div>
      </div>
    )
  }

  private containedCodeBlocks(_: WizardProps['children'][0]): Graph {
    if (typeof _.props.containedCodeBlocks === 'string' && _.props.containedCodeBlocks.length > 0) {
      return compile(
        _.props.containedCodeBlocks
          .split(' ')
          .filter(Boolean)
          .map(_ => JSON.parse(Buffer.from(_, 'base64').toString()) as CodeBlockProps)
      )
    } else {
      return undefined
    }
  }

  private footer() {
    // use this if you want no footer (Next, Previous buttons)
    // return <React.Fragment />

    // use this if you want the default footer
    return undefined
  }

  /** Overall progress across all steps */
  private progress() {
    if (this.props['data-kui-wizard-progress'] === 'bar' && blocks(this.state.codeBlocks).length > 0) {
      return (
        <div className="kui--markdown-major-paragraph">
          <Progress status={this.state.status} choices={this.state.choices} codeBlocks={this.state.codeBlocks} />
        </div>
      )
    }
  }

  private get children() {
    return (this.props.children || []).slice(1)
  }

  private wizard() {
    const steps = this.children.map(_ => ({
      name: _.props['data-kui-title'],
      stepNavItemProps: {
        children: this.wizardStepDescription(_.props['data-kui-description'], this.containedCodeBlocks(_))
      },
      component: <Card className="kui--markdown-tab-card">{_.props && _.props.children}</Card>
    }))

    const progress = this.progress()

    // onGoToStep={this._onWizardStepChange} onNext={this._onWizardStepChange} onBack={this._onWizardStepChange}
    return (
      <PatternFlyWizard
        hideClose
        steps={steps.length === 0 ? [{ name: '', component: '' }] : steps}
        className="kui--wizard"
        data-hide-cancel={true}
        data-bottom-margin={!progress /* no bottom margin if we're showing a progress bar */}
        footer={this.footer()}
        title={this.props['data-kui-title'].trim()}
        description={
          <React.Fragment>
            {this.props.children[0]}
            {progress}
          </React.Fragment>
        }
      />
    )
  }

  public render() {
    return this.wizard()
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
