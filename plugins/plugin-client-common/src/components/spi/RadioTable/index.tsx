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

import React from 'react'

import Props from './model'
import Carbon from './impl/Carbon'
// import PatternFly4 from './impl/PatternFly'

export interface State {
  page: number
  pageSize: number
  offset: number
  selectedIdx: number
}

export default class RadioTableSpi extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const pageSize = 15
    this.state = {
      page: 1,
      pageSize,
      offset: 0,
      selectedIdx: this.props.table.defaultSelectedIdx
    }
  }

  private onChange(selectedIdx: number) {
    this.setState({ selectedIdx })
  }

  private numRows() {
    return this.props.table.body.length
  }

  private carbon() {
    return <Carbon {...this.props} {...this.state} onChange={this.onChange.bind(this)} />
  }

  /* private patternfly() {
    return <PatternFly4 {...this.props} {...this.state} onChange={this.onChange.bind(this)} />
  } */

  private broker() {
    // notes: the PatternFly DataTable is junk
    /* <KuiContext.Consumer>
          {config =>
            config.components === 'patternfly' ? (
              {this.patternfly()}
            ) : (
              {this.carbon()}
            )
          }
        </KuiContext.Consumer> */

    return this.carbon()
  }

  public render() {
    return this.carbon()
  }
}
