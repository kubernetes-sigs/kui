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
import { i18n } from '@kui-shell/core'

import Icons from '../../spi/Icons'
import Tooltip from '../../spi/Tooltip'
import { MutabilityContext } from '../../Client/MutabilityContext'

import '../../../../web/scss/components/Terminal/SplitHeader.scss'

const strings = i18n('plugin-client-common')

interface Props {
  onRemove(): void
  onInvert(): void
  onClear(): void
}

/** Render a header for the given split */
export default class SplitHeader extends React.PureComponent<Props> {
  private readonly stopFocusStealing = (evt: React.MouseEvent<HTMLElement>) => evt.preventDefault()

  private closeButton() {
    return (
      <Tooltip markdown={strings('Close this split pane')}>
        <a
          href="#"
          className="kui--split-close-button kui--tab-navigatable kui--split-header-button"
          onMouseDown={this.stopFocusStealing}
          onClick={this.props.onRemove}
        >
          &#x2A2F;
        </a>
      </Tooltip>
    )
  }

  private invertButton() {
    return (
      <Tooltip markdown={strings('Invert colors')}>
        <a href="#" className="kui--tab-navigatable" onMouseDown={this.stopFocusStealing} onClick={this.props.onInvert}>
          <Icons className="kui--split-invert-button kui--split-header-button" icon="Contrast" />
        </a>
      </Tooltip>
    )
  }

  private clearButton() {
    return (
      <Tooltip markdown={strings('Clear this split pane')}>
        <a href="#" className="kui--tab-navigatable" onMouseDown={this.stopFocusStealing} onClick={this.props.onClear}>
          <Icons className="kui--split-clear-button kui--split-header-button" icon="Clear" />
        </a>
      </Tooltip>
    )
  }

  public render() {
    return (
      <MutabilityContext.Consumer>
        {value =>
          value.editable && (
            <div className="kui--split-header flex-layout">
              <div className="flex-fill" />
              {this.invertButton()}
              {this.clearButton()}
              {this.closeButton()}
            </div>
          )
        }
      </MutabilityContext.Consumer>
    )
  }
}
