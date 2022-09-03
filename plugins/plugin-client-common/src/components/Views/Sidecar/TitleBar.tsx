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
import { REPL } from '@kui-shell/core'

import Width from './width'
import Icons from '../../spi/Icons'
import Breadcrumb, { BreadcrumbView } from '../../spi/Breadcrumb'

export type Props = React.PropsWithChildren<{
  kind?: string
  name?: string
  namespace?: string
  breadcrumbs?: BreadcrumbView[]

  /** Is this sidecar not closeable? */
  notCloseable?: boolean

  repl: REPL
  width: Width

  onClickNamespace?: () => void
  onClose: () => void

  back?: { enabled: boolean; onClick: () => void }
  forward?: { enabled?: boolean; onClick: () => void }
}>

/**
 * TitleBar
 * ---------------------------------
 * | Kind | Namespace    S | M m x |
 * ---------------------------------
 *
 *  Kind: props.kind
 *  Namespace: props.namespace
 */
export default class Window extends React.PureComponent<Props> {
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
          <Icons icon="WindowClose" />
        </a>
      </div>
    )
  }

  /** back button */
  private back() {
    if (this.props.back) {
      return this.props.back.enabled ? (
        <span className="sidecar-bottom-stripe-button">
          <a href="#" className="graphical-icon kui--tab-navigable">
            <Icons
              icon="Back"
              onClick={this.props.back.onClick}
              onMouseDown={evt => evt.preventDefault()}
              className="kui--sidecar--titlebar-navigation--back"
            />
          </a>
        </span>
      ) : (
        <span className="sidecar-bottom-stripe-button disabled">
          <a className="disabled graphical-icon">
            <Icons icon="Back" onClick={this.props.back.onClick} className="kui--sidecar--titlebar-navigation--back" />
          </a>
        </span>
      )
    }
  }

  /** forward button */
  private forward() {
    if (this.props.forward) {
      return this.props.forward.enabled ? (
        <span className="sidecar-bottom-stripe-button">
          <a href="#" className="graphical-icon kui--tab-navigable">
            <Icons
              icon="Forward"
              onClick={this.props.forward.onClick}
              onMouseDown={evt => evt.preventDefault()}
              className="kui--sidecar--titlebar-navigation--forward"
            />
          </a>
        </span>
      ) : (
        <span className="sidecar-bottom-stripe-button disabled">
          <a className="disabled graphical-icon">
            <Icons
              icon="Forward"
              onClick={this.props.forward.onClick}
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
          <div className="sidecar-window-buttons">{!this.props.notCloseable && this.quitButton()}</div>
        </div>

        {this.props.children}
      </div>
    )
  }
}
