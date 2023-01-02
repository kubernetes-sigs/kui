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
import { i18n } from '@kui-shell/core'
import { Title, TitleSizes, Wizard, WizardProps } from '@patternfly/react-core'
import { Icons } from '@kui-shell/plugin-client-common'

import Footer, { KuiFooterExtraProps } from './Footer'

import '@kui-shell/plugin-client-common/web/scss/components/Wizard/PatternFly.scss'

const strings = i18n('plugin-client-common')

type HeaderState = {
  /** Is the wizard in "collapsed" mode, where we only show the title and progress bar? */
  collapsedHeader: boolean
}

type FooterState = {
  activeStep: number
}

export type Props = Omit<WizardProps, 'title'> &
  KuiFooterExtraProps &
  Partial<HeaderState> & {
    title: React.ReactNode
    descriptionFooter?: React.ReactNode
  }

type State = HeaderState & FooterState

export default class KWizard extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      activeStep: props.startAtStep || 1,
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
      <Title
        headingLevel="h2"
        size={TitleSizes['3xl']}
        className="kui--wizard-header-title pf-c-wizard__title"
        aria-label={typeof label === 'string' ? label : 'wizard title'}
      >
        {label}
      </Title>
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

  private readonly onBack = () => this.setState(curState => ({ activeStep: Math.max(1, curState.activeStep - 1) }))
  private readonly onNext = () =>
    this.setState(curState => ({ activeStep: Math.min(this.props.steps.length, curState.activeStep + 1) }))

  private readonly onClose = () => {
    /* noop */
  }

  private footer() {
    if (this.props.steps.length === 1) {
      // use this if you want no footer (Next, Previous buttons)
      return <React.Fragment />
    } else {
      // use this if you want the default footer
      return (
        <Footer
          onNext={this.onNext}
          onBack={this.onBack}
          onClose={this.onClose}
          isValid={this.state.activeStep < this.props.steps.length}
          firstStep={this.state.activeStep === 1}
          activeStep={this.props.steps[this.state.activeStep - 1]}
          nextButtonText={strings('Next')}
          backButtonText={strings('Back')}
          cancelButtonText={strings('Cancel')}
          boxShadow={this.props.boxShadow}
          leftButtons={this.props.leftButtons}
          rightButtons={this.props.rightButtons}
          topContent={this.props.topContent}
        />
      )
    }
  }

  public render() {
    const { steps } = this.props

    // hmm there doesn't seem to be a better way to get the last
    // step's Next button to be disabled; it isn't by default
    steps[steps.length - 1].enableNext = false

    // re: key={startAtStep} see https://github.com/patternfly/patternfly-react/issues/7184
    return (
      <div className="kui--wizard" data-collapsed-header={this.state.collapsedHeader || undefined}>
        {this.header()}
        <div className="kui--wizard-main-content">
          <Wizard
            key={this.state.activeStep}
            steps={steps.length === 0 ? [{ name: '', component: '' }] : steps}
            startAtStep={this.state.activeStep}
            footer={this.footer()}
          />
        </div>
      </div>
    )
  }
}
