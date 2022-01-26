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

import Card from '../../../../spi/Card'
import { MiniProgressStepper, MiniProgressStep } from '../../../MiniProgressStepper'

import '../../../../../../web/scss/components/Wizard/PatternFly.scss'

const PatternFlyWizard = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.Wizard })))

interface CodeBlockProps {
  id: string
  body: string
  language: string
  validate?: string
}

export default class Wizard extends React.PureComponent<WizardProps> {
  private wizardCodeBlockSteps(containedCodeBlocks: CodeBlockProps[]) {
    return (
      containedCodeBlocks.length > 0 && (
        <MiniProgressStepper>
          {containedCodeBlocks.map((_, idx) => (
            <MiniProgressStep key={idx} codeBlockId={_.id} validate={_.validate} body={_.body} language={_.language} />
          ))}
        </MiniProgressStepper>
      )
    )
  }

  private wizardStepDescription(description: string, containedCodeBlocks: CodeBlockProps[]) {
    return (
      <div className="kui--wizard-nav-item-description">
        {this.wizardCodeBlockSteps(containedCodeBlocks)}
        <div className="paragraph">{description}</div>
      </div>
    )
  }

  private containedCodeBlocks(_: WizardProps['children'][0]): CodeBlockProps[] {
    if (typeof _.props.containedCodeBlocks === 'string' && _.props.containedCodeBlocks.length > 0) {
      return _.props.containedCodeBlocks
        .split(' ')
        .filter(Boolean)
        .map(_ => JSON.parse(Buffer.from(_, 'base64').toString()) as CodeBlockProps)
    } else {
      return []
    }
  }

  private footer() {
    // use this if you want no footer (Next, Previous buttons)
    // return <React.Fragment />

    // use this if you want the default footer
    return undefined
  }

  public render() {
    const steps = (this.props.children || []).slice(1).map(_ => ({
      name: _.props['data-kui-title'],
      stepNavItemProps: {
        children: this.wizardStepDescription(_.props['data-kui-description'], this.containedCodeBlocks(_))
      },
      component: <Card className="kui--markdown-tab-card">{_.props && _.props.children}</Card>
    }))

    // onGoToStep={this._onWizardStepChange} onNext={this._onWizardStepChange} onBack={this._onWizardStepChange}
    return (
      <PatternFlyWizard
        hideClose
        steps={steps.length === 0 ? [{ name: '', component: '' }] : steps}
        className="kui--wizard"
        data-hide-cancel={true}
        footer={this.footer()}
        title={this.props['data-kui-title'].trim()}
        description={this.props.children[0]}
      />
    )
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
