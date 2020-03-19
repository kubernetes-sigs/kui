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

import { ComboSidecar, InputStripe, StatusStripe, TabContainer } from '..'

const Popup = React.lazy(() => import('./Popup'))

interface Props {
  bottomInput?: boolean

  isPopup?: boolean
  commandLine?: string[]
}

interface State {
  productName: string
}

/**
 * Render the main body of our client
 *
 */
export class Kui extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    try {
      this.state = {
        productName: require('@kui-shell/client/config.d/name.json').productName
      }
    } catch (err) {
      console.log('using default configuration')
      this.state = {
        productName: 'Kui Demo'
      }
    }
  }

  public render() {
    if (this.props.isPopup && this.props.commandLine) {
      return (
        <React.Suspense fallback={<div />}>
          <Popup commandLine={this.props.commandLine}>{this.props.children}</Popup>
        </React.Suspense>
      )
    } else {
      return (
        <div className="kui--full-height">
          <TabContainer
            productName={this.state.productName}
            noActiveInput={this.props.bottomInput}
            bottom={this.props.bottomInput && <InputStripe />}
          >
            <ComboSidecar />
          </TabContainer>
          <StatusStripe>{this.props.children}</StatusStripe>
        </div>
      )
    }
  }
}

export default Kui
