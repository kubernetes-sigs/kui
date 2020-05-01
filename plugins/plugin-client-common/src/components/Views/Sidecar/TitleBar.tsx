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
import { REPL } from '@kui-shell/core'
import {
  Maximize16 as MaximizeIcon,
  Minimize16 as MinimizeIcon,
  ArrowLeft16 as BackIcon,
  ArrowRight16 as ForwardIcon,
  ChevronDown16 as CloseIcon,
  Close20 as QuitIcon
} from '@carbon/icons-react'

import Width from './width'
import Breadcrumb, { BreadcrumbView } from '../Breadcrumb/'

export interface Props {
  kind?: string
  name?: string
  namespace?: string
  breadcrumbs?: BreadcrumbView[]

  repl: REPL
  fixedWidth: boolean
  width: Width

  onClickNamespace?: () => void
  onMaximize: () => void
  onRestore: () => void
  onClose: () => void

  back?: { enabled: boolean; onClick: () => void }
  forward?: { enabled?: boolean; onClick: () => void }
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
      if (this.props.width !== Width.Maximized) {
        this.props.onMaximize()
      } else {
        this.props.onRestore()
      }
    } catch (err) {
      console.error(err)
    }
  }

  private toggleClose() {
    this.props.onClose()
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
            onClick={() => this.toggleClose()}
          >
            <CloseIcon />
          </a>
        </div>
      )
    )
  }

  private maximizeButton() {
    if (this.props.width !== Width.Closed && !this.props.fixedWidth) {
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

  /** back button */
  private back() {
    if (this.props.back) {
      return (
        <span className="sidecar-bottom-stripe-button">
          <a href="#" className="graphical-icon kui--tab-navigable">
            <BackIcon
              onClick={this.props.back.onClick}
              onMouseDown={evt => evt.preventDefault()}
              className="kui--sidecar--titlebar-navigation--back"
            />
          </a>
        </span>
      )
    }
  }

  /** forward button */
  private forward() {
    if (this.props.forward) {
      return (
        <span className="sidecar-bottom-stripe-button">
          <a href="#" className="graphical-icon kui--tab-navigable">
            <ForwardIcon
              onClick={this.props.forward.onClick}
              onMouseDown={evt => evt.preventDefault()}
              className="kui--sidecar--titlebar-navigation--forward"
            />
          </a>
        </span>
      )
    }
  }

  /** render history navigation UI */
  private history() {
    const breadcrumbs = this.props.breadcrumbs && this.props.breadcrumbs.filter(_ => _.label)

    return (
      <div className="kui--sidecar--titlebar-navigation">
        {this.back()}
        {this.forward()}

        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb breadcrumbs={breadcrumbs} repl={this.props.repl} />}
      </div>
    )
  }

  public render() {
    return (
      <div
        className={
          'sidecar-bottom-stripe zoomable' + (this.props.breadcrumbs ? ' kui--sidecar--titlebar-has-breadcrumbs' : '')
        }
      >
        {this.history()}

        <div className="sidecar-bottom-stripe-left-bits"></div>

        <div className="sidecar-bottom-stripe-right-bits">
          <div className="sidecar-window-buttons">
            {this.maximizeButton()}
            {/* this.closeButton() */}
            {this.quitButton()}
          </div>
        </div>
      </div>
    )
  }
}
