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
import { pexecInCurrentTab } from '@kui-shell/core'

import { Props as PopoverProps } from '../../spi/Popover'
const Popover = React.lazy(() => import('../../spi/Popover'))

/** variants of how the information should be presented */
export type ViewLevel = 'removed' | 'hidden' | 'normal' | 'obscured' | 'ok' | 'warn' | 'error' | 'info'

/** End-user options */
export interface Options {
  className?: string

  /** popover position override specified by container (not client)? */
  position?: PopoverProps['position']
}

/** Component-specific Options */
export interface Props extends Options {
  text: string
  viewLevel: ViewLevel

  title?: string
  iconIsNarrow?: boolean
  iconOnclick?: string | (() => void)
  textOnclick?: string | (() => void)
  id?: string

  /** popover properties specified by client */
  popover?: Pick<PopoverProps, 'bodyContent' | 'headerContent'> & Partial<PopoverProps>
}

export default class TextWithIconWidget extends React.PureComponent<Props> {
  /** Render the content (excluding any popover/tooltip wrappers) part */
  private content() {
    const iconClassName =
      'kui--status-stripe-icon ' +
      (this.props.iconIsNarrow ? 'tiny-right-pad' : 'small-right-pad') +
      (this.props.iconOnclick ? ' clickable' : '')

    const iconPart = this.props.iconOnclick ? (
      <a
        href="#"
        className={iconClassName}
        onMouseDown={evt => evt.preventDefault()}
        onClick={
          !this.props.iconOnclick
            ? undefined
            : (evt: React.MouseEvent) => {
                evt.stopPropagation()
                if (typeof this.props.iconOnclick === 'string') {
                  pexecInCurrentTab(this.props.iconOnclick)
                } else {
                  this.props.iconOnclick()
                }
              }
        }
      >
        {this.props.children}
      </a>
    ) : (
      <span className={iconClassName}>{this.props.children}</span>
    )

    const textPart = <span className="kui--status-stripe-text">{this.props.text}</span>

    const className =
      'kui--status-stripe-element' +
      (this.props.textOnclick || this.props.popover ? ' kui--status-stripe-element-clickable' : '') +
      (!this.props.id ? '' : ' ' + this.props.id) +
      (this.props.className ? ' ' + this.props.className : '')

    return (
      <div className={className} onClick={this._onClick} title={this.props.title} data-view={this.props.viewLevel}>
        {iconPart}
        {textPart}
      </div>
    )
  }

  private readonly _onClick = !this.props.textOnclick
    ? undefined
    : () => {
        if (typeof this.props.textOnclick === 'string') {
          pexecInCurrentTab(this.props.textOnclick)
        } else {
          this.props.textOnclick()
        }
      }

  public render() {
    if (this.props.popover) {
      return (
        <Popover
          maxWidth="60rem"
          minWidth="5rem"
          triggerClassName="kui--status-stripe-element-wrapper"
          position={this.props.position || 'top-start' /* default value; the props.popover may override this */}
          {...this.props.popover}
        >
          {this.content()}
        </Popover>
      )
    } else {
      return this.content()
    }
  }
}
