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

/**
 * This component offers a fairly thin wrapper over PatternFly's Wizard, with a few extra features:
 *
 * 1. allows control of header theming
 * 2. adds a minimize/maximize toggler to the header
 *
 */

import React from 'react'
import { Wizard, WizardProps } from '@patternfly/react-core'

import Icons from '../../../../spi/Icons'

import '../../../../../../web/scss/components/Wizard/PatternFly.scss'

type HeaderState = {
  /** Is the wizard in "collapsed" mode, where we only show the title and progress bar? */
  collapsedHeader: boolean
}

type Props = WizardProps &
  Partial<HeaderState> & {
    descriptionFooter?: React.ReactNode
  }

type State = HeaderState

export default class KWizard extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      collapsedHeader: props.collapsedHeader || false
    }
  }

  private readonly _toggleCollapsedHeader = () =>
    this.setState(curState => ({ collapsedHeader: !curState.collapsedHeader }))

  private headerActions() {
    return (
      <div className="kui--wizard-header-action-buttons">
        <a className="kui--wizard-collapse-button kui--block-action" onClick={this._toggleCollapsedHeader}>
          <Icons icon={this.state.collapsedHeader ? 'WindowMaximize' : 'WindowMinimize'} />
        </a>
      </div>
    )
  }

  private title() {
    const label = this.props.title
    return (
      <div className="kui--wizard-header-title pf-c-wizard__title" aria-label={label}>
        {label}
      </div>
    )
  }

  private description() {
    return <div className="pf-c-wizard__description">{this.props.description}</div>
  }

  private header() {
    return (
      <React.Fragment>
        <div className="kui--wizard-header">
          {this.headerActions()}
          {this.title()}
          {this.description()}
          {this.props.descriptionFooter}
        </div>
      </React.Fragment>
    )
  }

  private footer() {
    // use this if you want no footer (Next, Previous buttons)
    // return <React.Fragment />

    // use this if you want the default footer
    return undefined
  }

  public render() {
    const { steps, startAtStep } = this.props

    // re: key={startAtStep} see https://github.com/patternfly/patternfly-react/issues/7184
    return (
      <div className="kui--wizard" data-collapsed-header={this.state.collapsedHeader || undefined}>
        {this.header()}
        <div className="kui--wizard-main-content">
          <Wizard
            key={startAtStep}
            steps={steps.length === 0 ? [{ name: '', component: '' }] : steps}
            startAtStep={startAtStep}
            footer={this.footer()}
          />
        </div>
      </div>
    )
  }
}
