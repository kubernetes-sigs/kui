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
import { i18n, inBrowser, pexecInCurrentTab } from '@kui-shell/core'

import Icons from '../../spi/Icons'
import ctrlOrMeta from './ctrlOrMeta'
import Tooltip from '../../spi/Tooltip'

const strings = i18n('plugin-client-common')

/**
 * re: the impl of the onClick handler, see
 * https://github.com/IBM/kui/issues/4876
 *
 */
export default class SplitTerminalButton extends React.PureComponent {
  private readonly ref = React.createRef<HTMLAnchorElement>()
  private readonly _onSplit = () => pexecInCurrentTab('split', undefined, false, true)

  private tooltip() {
    return (
      <Tooltip reference={this.ref} position="bottom">
        {strings('Split the terminal', inBrowser() ? '' : ctrlOrMeta('Y'))}
      </Tooltip>
    )
  }

  private button() {
    return (
      <a
        href="#"
        className="kui--tab-navigatable kui--top-tab-button"
        id="kui--split-terminal-button"
        aria-label="Split terminal"
        tabIndex={0}
        ref={this.ref}
        onClick={this._onSplit}
      >
        <Icons icon="Split" />
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
