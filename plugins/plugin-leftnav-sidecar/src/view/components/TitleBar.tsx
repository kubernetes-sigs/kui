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
import { inElectron } from '@kui-shell/core'
import {
  Camera20 as CameraIcon,
  Maximize20 as MaximizeIcon,
  Minimize20 as MinimizeIcon,
  ChevronRight20 as CloseIcon,
  Close20 as QuitIcon
} from '@carbon/icons-react'

const enum Width {
  Default,
  Minimized,
  Maximized
}

interface Props {
  kind: string
  namespace?: string
  fixedWidth: boolean

  onClickNamespace?: () => void
  onScreenshot: () => void
  onMaximize: () => void
  onRestore: () => void
  onMinimize: () => void
  onClose: () => void
}

interface State {
  width: Width
}

/**
 * TitleBar
 * ---------------------------------
 * | Kind | Namespace    S | M m x |
 * ---------------------------------
 *  S: Screenshot button
 *  M: Maximize/Restore button [!props.fixedWith]
 *  m: Minimize button [!props.fixedWith]
 *  x: Close button
 *
 *  Kind: props.kind
 *  Namespace: props.namespace
 */
export default class Window extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      width: Width.Default
    }
  }

  private toggleMaximization() {
    try {
      if (this.state.width === Width.Default) {
        this.props.onMaximize()
      } else {
        this.props.onRestore()
      }
    } catch (err) {
      console.error(err)
    }
    this.setState(({ width }) => ({
      width: width === Width.Maximized ? Width.Default : width === Width.Default ? Width.Maximized : width
    }))
  }

  private closeButton() {
    return (
      <div
        className="sidecar-bottom-stripe-button sidecar-bottom-stripe-close toggle-sidecar-button"
        data-balloon="Minimize"
        data-balloon-length="small"
        data-balloon-pos="down-right"
      >
        <a
          href="#"
          className="graphical-icon kui--tab-navigatable kui--notab-when-sidecar-hidden"
          tabIndex={-1}
          aria-label="Minimize"
          onClick={() => this.props.onMinimize()}
        >
          <CloseIcon />
        </a>
      </div>
    )
  }

  private maximizeButton() {
    if (this.state.width !== Width.Minimized && !this.props.fixedWidth) {
      const max = this.state.width === Width.Maximized
      const className = max ? 'unmaximize-button-label' : 'maximize-button-label'
      const icon = max ? <MinimizeIcon /> : <MaximizeIcon />
      const aria = max ? 'Restore' : 'Maximize'

      return (
        <div className="sidecar-bottom-stripe-button sidecar-bottom-stripe-maximize toggle-sidecar-maximization-button">
          <span className={className}>
            <div aria-label={aria}>
              <a
                href="#"
                className="graphical-icon kui--tab-navigatable kui--notab-when-sidecar-hidden"
                tabIndex={-1}
                onClick={() => this.toggleMaximization()}
              >
                {icon}
              </a>
            </div>
          </span>
        </div>
      )
    }
  }

  private quitButton() {
    return (
      <div
        className="sidecar-bottom-stripe-button sidecar-bottom-stripe-quit"
        data-balloon="Close"
        data-balloon-length="small"
        data-balloon-pos="down-right"
      >
        <a
          href="#"
          className="graphical-icon kui--tab-navigatable kui--notab-when-sidecar-hidden"
          tabIndex={-1}
          aria-label="Close"
          onClick={() => this.props.onClose()}
        >
          <QuitIcon />
        </a>
      </div>
    )
  }

  private kind() {
    return (
      <div className="sidecar-header-icon-wrapper">
        <span className="sidecar-header-icon">{this.props.kind}</span>
      </div>
    )
  }

  private namespace() {
    if (this.props.namespace) {
      const onclick = this.props.onClickNamespace
      return (
        <div className="sidecar-header-icon-wrapper sidecar-header-icon-wrapper-for-namespace">
          <span className={'package-prefix' + (onclick ? ' clickable' : '')} onClick={onclick && (() => onclick())}>
            {this.props.namespace}
          </span>
        </div>
      )
    }
  }

  private screenshotButton() {
    return (
      inElectron() && (
        <div
          className="kui--hide-in-webpack sidecar-screenshot-button sidecar-bottom-stripe-button sidecar-bottom-stripe-maximize screenshot-button"
          data-balloon="Capture Screenshot"
          data-balloon-length="medium"
          data-balloon-pos="down-right"
        >
          <a
            href="#"
            className="graphical-icon kui--tab-navigatable kui--notab-when-sidecar-hidden"
            tabIndex={-1}
            aria-label="Capture Screenshot"
            onClick={() => this.props.onScreenshot()}
          >
            <CameraIcon />
          </a>
        </div>
      )
    )
  }

  public render() {
    return (
      <div className="sidecar-bottom-stripe zoomable">
        <div className="sidecar-bottom-stripe-left-bits">
          {this.kind()}
          {this.namespace()}
        </div>

        <div className="sidecar-bottom-stripe-right-bits">
          <div className="sidecar-non-window-buttons">{this.screenshotButton()}</div>

          <div className="sidecar-window-buttons">
            {this.maximizeButton()}
            {this.closeButton()}
            {this.quitButton()}
          </div>
        </div>
      </div>
    )
  }
}
