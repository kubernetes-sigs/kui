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
import { Tile } from 'carbon-components-react'

import Props from '../model'

import '../../../../../web/scss/components/Card/Carbon.scss'

export default class CarbonTile extends React.PureComponent<Props> {
  public render() {
    return <Tile className={this.props.className}>{this.props.children}</Tile>
  }
}
