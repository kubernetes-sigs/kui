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
import { KResponse, Tab as KuiTab, ParsedOptions, isPopup } from '@kui-shell/core'

import Width from './width'
import LocationProps from './Location'
import TitleBar, { Props as TitleBarProps } from './TitleBar'

import '../../../../web/css/static/sidecar.scss'
import '../../../../web/css/static/sidecar-main.css'
import '../../../../web/scss/components/Sidecar/_index.scss'

export interface SidecarOptions {
  defaultWidth?: Width
  onClose?: () => void

  /** Current presentation of the sidecar; e.g. Maximized or Closed or Default width? */
  width?: Width
  willChangeSize?: (width: Width) => void

  willLoseFocus?: () => void
}

export type BaseProps = {
  uuid?: string
  tab?: KuiTab
  active?: boolean
}

export type Props<R extends KResponse> = SidecarOptions &
  BaseProps &
  LocationProps & {
    response?: R
    argvNoOptions?: string[]
    parsedOptions?: ParsedOptions
    onRender?: (hasContent: boolean) => void
  }

export interface State {
  /** maximized? */
  isMaximized?: boolean
}

export default class BaseSidecar<R extends KResponse, S extends State> extends React.PureComponent<Props<R>, S> {
  /** screenshotable region */
  protected readonly dom = React.createRef<HTMLDivElement>()

  protected readonly _preventDefault = (evt: React.SyntheticEvent) => evt.preventDefault()
  protected readonly _stopPropagation = (evt: React.SyntheticEvent) => evt.stopPropagation()

  protected get current() {
    return this.state
  }

  protected defaultWidth(): Width {
    return this.props.defaultWidth || Width.Split60
  }

  /** Escape key toggles sidecar visibility */
  private onEscape(evt: KeyboardEvent) {
    if (
      evt.key === 'Escape' &&
      this.props.active &&
      !document.getElementById('confirm-dialog') &&
      !isPopup() &&
      this.current
    ) {
      if (this.props.willChangeSize) {
        this.props.willChangeSize(this.props.width === Width.Closed ? this.defaultWidth() : Width.Closed)
      }
    }
  }

  protected onMaximize() {
    if (this.props.willChangeSize) {
      this.props.willChangeSize(Width.Maximized)
    }
    this.setState({ isMaximized: true })
  }

  protected onRestore() {
    if (this.props.willChangeSize) {
      this.props.willChangeSize(this.defaultWidth())
    }
    this.setState({ isMaximized: false })
  }

  protected onClose() {
    if (this.props.onClose) {
      this.props.onClose()
    }

    if (this.props.willChangeSize) {
      this.props.willChangeSize(Width.Closed)
    }
  }

  protected isFixedWidth() {
    return false
  }

  protected width(): Required<string> {
    return 'visible' + (this.state.isMaximized ? ' maximized' : '')
  }

  protected title(
    props?: Omit<
      TitleBarProps,
      'width' | 'fixedWidth' | 'onClose' | 'onRestore' | 'onMaximize' | 'onMinimize' | 'willScreenshot' | 'repl'
    >
  ) {
    return (
      <TitleBar
        {...props}
        notCloseable
        repl={this.props.tab.REPL}
        width={this.defaultWidth()}
        onClose={this.onClose.bind(this)}
      />
    )
  }
}
