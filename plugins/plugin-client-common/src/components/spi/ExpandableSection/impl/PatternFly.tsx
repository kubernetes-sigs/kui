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
import { i18n } from '@kui-shell/core'
import { ExpandableSection } from '@patternfly/react-core'

import Props from '../model'

const strings = i18n('plugin-client-common')

interface State {
  isExpanded: boolean
}

import '../../../../../web/scss/components/ExpandableSection/PatternFly.scss'

export default class PatternFlyExpandableSection extends React.PureComponent<Props, State> {
  private readonly onToggle = (isExpanded: boolean) => {
    if (this.props.onToggle) {
      this.props.onToggle(isExpanded)
    }
    this.setState({ isExpanded })
  }

  public constructor(props: Props) {
    super(props)

    this.state = {
      isExpanded: this.props.expanded || false
    }
  }

  private toggleText() {
    return this.state.isExpanded
      ? this.props.showLess || this.props.showMore || strings('Show Less')
      : this.props.showMore || strings('Show More')
  }

  public render() {
    const { isExpanded } = this.state
    const className = 'kui--expandable-section' + (this.props.className ? ' ' + this.props.className : '')

    return (
      <ExpandableSection
        className={className}
        toggleText={this.toggleText()}
        onToggle={this.onToggle}
        isExpanded={isExpanded}
        isWidthLimited={this.props.isWidthLimited}
        displaySize={this.props.isWidthLimited ? 'large' : 'default'}
      >
        {isExpanded && this.props.children}
      </ExpandableSection>
    )
  }
}
