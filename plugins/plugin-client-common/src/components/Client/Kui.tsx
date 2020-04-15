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

import { ComboSidecar, InputStripe, StatusStripe, TabContainer, Loading } from '../..'

const Popup = React.lazy(() => import('./Popup'))

export interface Props {
  /** no Kui bootstrap needed? */
  noBootstrap?: boolean

  /** operate in bottom Input mode? rather than as a conventional Input/Output terminal */
  bottomInput?: boolean

  /** operate in popup mode? */
  isPopup?: boolean

  /** if in popup mode, execute the given command line */
  commandLine?: string[]
}

interface State {
  isBootstrapped: boolean

  productName: string
}

/**
 * Render the main body of our client
 *
 */
export class Kui extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    if (!props.noBootstrap) {
      import('@kui-shell/core')
        .then(_ => _.bootIntoSandbox())
        .then(() => {
          this.setState({ isBootstrapped: true })
        })
    }

    try {
      this.state = {
        isBootstrapped: !!props.noBootstrap,
        productName: require('@kui-shell/client/config.d/name.json').productName
      }
    } catch (err) {
      console.log('using default configuration')
      this.state = {
        isBootstrapped: !!props.noBootstrap,
        productName: 'Kui Demo'
      }
    }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  public render() {
    if (!this.state.isBootstrapped) {
      return <Loading />
    }

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
