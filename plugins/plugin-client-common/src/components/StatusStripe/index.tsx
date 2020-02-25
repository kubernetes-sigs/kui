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

// FIXME:
/* eslint-disable react/prop-types */

import * as React from 'react'
import { SettingsAdjust16 as SettingsIcon } from '@carbon/icons-react'

import Screenshot from '../Screenshot'

export default class StatusStripe extends React.PureComponent {
  /**
   * User has clicked on the Settings icon.
   *
   */
  private async doAbout() {
    const { internalBeCarefulPExec: pexec } = await import('@kui-shell/core')
    pexec('about')
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
   * Render any widgets specified by the client.
   *
   */
  private widgets() {
    if (React.Children.count(this.props.children) === 0) {
      return this.filler()
    } else {
      return this.props.children
    }
  }

  public render() {
    return (
      <div className="kui--status-stripe" id="kui--status-stripe">
        {this.widgets()}
        <div className="kui--status-stripe-button">
          <div className="kui--status-stripe-element">
            <Screenshot />
          </div>
        </div>

        <div className="kui--status-stripe-button">
          <div className="kui--status-stripe-element">
            <a
              href="#"
              className="kui--tab-navigatable clickable"
              id="help-button"
              aria-label="Help"
              tabIndex={2}
              onClick={() => this.doAbout()}
            >
              <SettingsIcon />
            </a>
          </div>
        </div>
      </div>
    )
  }
}
