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
import { InlineLoading, Loading } from 'carbon-components-react'

import Props from '../model'

import '../../../../../web/scss/components/Loading/Carbon.scss'

export default class CarbonLoading extends React.PureComponent<Props> {
  public render() {
    return (
      <div className="kui--loading flex-layout flex-align-center flex-align-top larger-text big-top-pad">
        {this.props.description ? (
          <InlineLoading status="active" className="flex-align-center fade-in" description={this.props.description} />
        ) : (
          <Loading active className="fade-in" withOverlay={false} />
        )}
      </div>
    )
  }
}
