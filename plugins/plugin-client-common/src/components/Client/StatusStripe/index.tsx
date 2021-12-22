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

// FIXME:
/* eslint-disable react/prop-types */

import React from 'react'
import { decode } from 'html-entities'
import { Events, pexecInCurrentTab, i18n } from '@kui-shell/core'

import Settings from './Settings'
import Icons from '../../spi/Icons'
import Tooltip from '../../spi/Tooltip'
import MeterWidgets from './MeterWidgets'
import '../../../../web/scss/components/StatusStripe/StatusStripe.scss'

const strings = i18n('plugin-client-common')

type State = Events.StatusStripeChangeEvent
export type Props = Partial<State> & {
  noHelp?: boolean
  noSettings?: boolean
}

/** see https://github.com/microsoft/TypeScript/issues/10485 */
function hasType(
  evt: Partial<Events.StatusStripeChangeEvent>
): evt is Pick<Required<Events.StatusStripeChangeEvent>, 'type'> {
  return evt.type !== undefined
}

export default class StatusStripe extends React.PureComponent<Props, State> {
  private readonly helpRef = React.createRef<HTMLAnchorElement>()

  public constructor(props: Props) {
    super(props)
    Events.eventBus.onStatusStripeChangeRequest(this.onChangeRequest.bind(this))

    this.state = this.withStateDefaults(props)
  }

  /** Overlay default values for required state variables */
  private withStateDefaults(
    evt: Partial<Events.StatusStripeChangeEvent>
  ): Omit<Required<Events.StatusStripeChangeEvent>, 'message'> {
    if (hasType(evt)) {
      return evt
    } else {
      return Object.assign({}, evt, { type: 'default' })
    }
  }

  /** Status Stripe change request */
  private onChangeRequest(evt: Events.StatusStripeChangeEvent) {
    this.setState(this.withStateDefaults(evt))
  }

  /**
   * User has clicked on the Settings icon.
   *
   */
  private async doAbout() {
    pexecInCurrentTab('about')
  }

  /**
   * If the Client offers no status stripe widgets, we should insert a
   * filler, so that the Settings icon is presented flush-right.
   *
   */
  private filler() {
    return <div style={{ flex: 1 }} />
  }

  /**
   * Render the current State.message, if any
   *
   */
  private message() {
    if (this.state.type !== 'default' && this.state.message) {
      return (
        <div className="kui--status-stripe-element left-pad kui--status-stripe-message-element">
          {decode(this.state.message)}
        </div>
      )
    }
  }

  /**
   * Render any widgets specified by the client. Note how we don't
   * show widgets if we were given a message. See
   * https://github.com/IBM/kui/issues/5490
   *
   */
  private widgets() {
    if (this.state.type !== 'default' || React.Children.count(this.props.children) === 0) {
      return this.filler()
    } else {
      return this.props.children
    }
  }

  private className() {
    return 'kui--status-stripe'
  }

  public render() {
    return (
      <React.Suspense fallback={<div />}>
        <div className={this.className()} id="kui--status-stripe" data-type={this.state.type}>
          {this.message()}
          {this.widgets()}

          <MeterWidgets className="kui--hide-in-narrower-windows">
            {!this.props.noSettings && <Settings />}
          </MeterWidgets>

          {!this.props.noHelp && (
            <div className="kui--status-stripe-button">
              <a
                href="#"
                className="kui--tab-navigatable kui--status-stripe-element-clickable kui--status-stripe-element"
                id="help-button"
                aria-label="Help"
                tabIndex={0}
                ref={this.helpRef}
                onClick={() => this.doAbout()}
              >
                <Icons icon="Help" />
              </a>
              <Tooltip reference={this.helpRef} position="top">
                {strings('Click for help')}
              </Tooltip>
            </div>
          )}
        </div>
      </React.Suspense>
    )
  }
}
