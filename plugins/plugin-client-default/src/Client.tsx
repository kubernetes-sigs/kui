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
import { render as ReactDomRender } from 'react-dom'
import { ComboSidecar } from '@kui-shell/plugin-sidecar'
import { StatusStripe, TabContainer } from '@kui-shell/plugin-client-common'

/**
 * Here we arrange the CSS for base functionality of Kui. Order is
 * preserved in the resulting <link> tags.
 *
 */
import '../web/css/static/kui-ui.css'
import '../web/css/static/carbon-overrides.css'

/**
 * Render the main body of our client
 *
 */
export class DefaultClient extends React.PureComponent {
  public render() {
    return (
      <div className="kui--full-height">
        <TabContainer>
          <ComboSidecar />
        </TabContainer>

        <StatusStripe>{this.props.children}</StatusStripe>
      </div>
    )
  }
}

/**
 * Format the body view
 *
 */
export default function(container: Element) {
  ReactDomRender(<DefaultClient />, container)
}
