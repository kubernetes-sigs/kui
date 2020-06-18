/*
 * Copyright 2020 IBM Corporation
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

import * as React from 'react'
import { i18n } from '@kui-shell/core'
import { ToastNotification } from 'carbon-components-react'
import { Props } from '..'

import 'carbon-components/scss/components/notification/_toast-notification.scss'

const strings = i18n('plugin-client-common', 'editor')

export default class Alert extends React.PureComponent<Props> {
  public render() {
    return (
      <ToastNotification
        id={this.props.id || ''}
        className={this.props.className || 'kui--toolbar-alert'}
        data-type={this.props.alert.type}
        caption=""
        hideCloseButton={false}
        iconDescription={strings('closeAlert')}
        kind={this.props.alert.type}
        statusIconDescription={strings(`${this.props.alert.type} alert`)}
        subtitle={this.props.alert.body || ''}
        timeout={this.props.timeout}
        title={this.props.alert.title}
        onCloseButtonClick={this.props.onCloseButtonClick}
      >
        {this.props.children}
      </ToastNotification>
    )
  }
}
