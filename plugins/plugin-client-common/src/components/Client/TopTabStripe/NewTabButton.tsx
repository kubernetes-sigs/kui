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
import { Capabilities, i18n } from '@kui-shell/core'

import Icons from '../../spi/Icons'
import Tooltip from '../../spi/Tooltip'
import ctrlOrMeta from './ctrlOrMeta'

const strings = i18n('plugin-client-common')

interface Props {
  onNewTab: () => void
}

export default class NewTabButton extends React.PureComponent<Props> {
  private readonly ref = React.createRef<HTMLAnchorElement>()
  private readonly _onNewTab = () => this.props.onNewTab()

  private tooltip() {
    return (
      <Tooltip reference={this.ref} position="bottom">
        {strings('New Tab', Capabilities.inBrowser() ? '' : ctrlOrMeta('T'))}
      </Tooltip>
    )
  }

  private button() {
    return (
      <a
        href="#"
        className="kui--tab-navigatable kui--top-tab-button kui-new-tab"
        id="new-tab-button"
        aria-label="Open a new tab"
        tabIndex={0}
        ref={this.ref}
        onClick={this._onNewTab}
      >
        <Icons icon="Add" className="kui-new-tab__plus" />
      </a>
    )
  }

  public render() {
    return (
      <React.Fragment>
        {this.button()}
        {this.tooltip()}
      </React.Fragment>
    )
  }
}
