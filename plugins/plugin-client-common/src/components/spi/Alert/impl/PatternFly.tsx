/*
 * Copyright 2021 The Kubernetes Authors
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

// ugh, avoid backdrop.css parse errors in plugin prescan
const Alert = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.Alert })))
const AlertActionCloseButton = React.lazy(() =>
  import('@patternfly/react-core').then(_ => ({ default: _.AlertActionCloseButton }))
)

import { Props } from '..'
import '../../../../../web/scss/components/Alert/PatternFly.scss'

interface State {
  props: Props
  isClosed: boolean
}

export default class PatternFlyAlert extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = PatternFlyAlert.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    if (!state || props !== state.props) {
      return {
        props,
        isClosed: false
      }
    } else {
      return state
    }
  }

  private onClose() {
    if (this.props.onCloseButtonClick) {
      this.props.onCloseButtonClick()
    }

    this.setState({ isClosed: true })
  }

  private readonly _onClose = this.onClose.bind(this)

  public render() {
    return this.state.isClosed ? (
      <React.Fragment />
    ) : (
      <Alert
        id={this.props.id || ''}
        className={'kui--toolbar-alert ' + (this.props.className || '')}
        data-type={this.props.alert.type}
        title={this.props.alert.title}
        actionClose={!this.props.hideCloseButton && <AlertActionCloseButton onClose={this._onClose} />}
        timeout={this.props.timeout}
        onTimeout={this._onClose}
        isInline={!this.props.isGlobal}
        variant={this.props.alert.type === 'error' ? 'danger' : this.props.alert.type}
      >
        <React.Fragment>
          {this.props.alert.body || ''}
          {this.props.children}
        </React.Fragment>
      </Alert>
    )
  }
}
