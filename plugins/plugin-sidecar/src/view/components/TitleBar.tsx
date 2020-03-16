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
import {
  Maximize20 as MaximizeIcon,
  Minimize20 as MinimizeIcon,
  ChevronDown20 as CloseIcon,
  Close20 as QuitIcon
} from '@carbon/icons-react'

import Width from './width'

interface Props {
  kind: string
  name?: string
  namespace?: string
  fixedWidth: boolean
  width: Width

  onClickNamespace?: () => void
  onMaximize: () => void
  onRestore: () => void
  onMinimize: () => void
  onClose: () => void
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
export default class Window extends React.PureComponent<Props> {
  private toggleMaximization() {
    try {
      if (this.props.width === Width.Default) {
        this.props.onMaximize()
      } else {
        this.props.onRestore()
      }
    } catch (err) {
      console.error(err)
    }
    /* this.setState(({ width }) => ({
      width: width === Width.Maximized ? Width.Default : width === Width.Default ? Width.Maximized : width
    })) */
  }

  private toggleMinimization() {
    this.props.onMinimize()

    /* this.setState(({ width }) => ({
      width: width === Width.Maximized || width === Width.Default ? Width.Minimized : Width.Default
    })) */
  }

  private closeButton() {
    return (
      !this.props.fixedWidth && (
        <div className="sidecar-bottom-stripe-button sidecar-bottom-stripe-close toggle-sidecar-button">
          <a
            href="#"
            className="graphical-icon kui--tab-navigatable kui--notab-when-sidecar-hidden"
            tabIndex={-1}
            aria-label="Minimize"
            onMouseDown={evt => evt.preventDefault()}
            onClick={() => this.toggleMinimization()}
          >
            <CloseIcon />
          </a>
        </div>
      )
    )
  }

  private maximizeButton() {
    if (this.props.width !== Width.Minimized && !this.props.fixedWidth) {
      const max = this.props.width === Width.Maximized
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
                onMouseDown={evt => evt.preventDefault()}
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
      <div className="sidecar-bottom-stripe-button sidecar-bottom-stripe-quit">
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
    const isMin = this.props.width === Width.Minimized
    const ns = isMin ? this.props.name : this.props.namespace

    if (ns) {
      const onclick = isMin ? undefined : this.props.onClickNamespace
      return (
        <div className="sidecar-header-icon-wrapper sidecar-header-icon-wrapper-for-namespace">
          <span className={'package-prefix' + (onclick ? ' clickable' : '')} onClick={onclick && (() => onclick())}>
            {ns}
          </span>
        </div>
      )
    }
  }

  public render() {
    return (
      <div className="sidecar-bottom-stripe zoomable">
        <div className="sidecar-bottom-stripe-left-bits">
          {this.kind()}
          {this.namespace()}
        </div>

        <div className="sidecar-bottom-stripe-right-bits">
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
