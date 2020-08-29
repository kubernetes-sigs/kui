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
import { eventChannelUnsafe, inBrowser, i18n } from '@kui-shell/core'
import { TagWidget } from '@kui-shell/plugin-client-common'

import { proxyServer } from '@kui-shell/client/config.d/proxy.json'

const strings = i18n('plugin-proxy-support')

/** class designation for our offline indicator */
const buttonDesignation = 'kui--plugin-bash-like--pty-offline-indicator'

type Props = {}

interface State {
  proxyEnabled: boolean
  offline: boolean
}

export default class ProxyOfflineIndicator extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const proxyEnabled = proxyServer['enabled'] === undefined || proxyServer['enabled'] !== false
    this.state = {
      proxyEnabled,
      offline: true
    }

    eventChannelUnsafe.on('/proxy/online', () => this.setState({ offline: false }))
    eventChannelUnsafe.on('/proxy/offline', () => this.setState({ offline: true }))
  }

  /** If the proxy is enabled, and we are offline, then render a widget indicating such. */
  public render() {
    if (!this.state.proxyEnabled || !this.state.offline || !inBrowser()) {
      return <React.Fragment />
    } else {
      return (
        <TagWidget id={buttonDesignation} type="error">
          {strings('Offline')}
        </TagWidget>
      )
    }
  }
}
