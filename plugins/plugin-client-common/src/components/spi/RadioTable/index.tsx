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

import Props from './model'
import Carbon from './impl/Carbon'
// import PatternFly4 from './impl/PatternFly'

import Toolbar from '../../Content/Table/Toolbar'

export interface State {
  page: number
  pageSize: number
  offset: number
  selectedIdx: number
}

/** @return the row slice for the current page */
export function slice(props: Props & State) {
  return props.table.body.slice((props.page - 1) * props.pageSize, props.page * props.pageSize)
}

export default class RadioTableSpi extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const pageSize = 15
    this.state = {
      page: 1,
      pageSize,
      offset: 0,
      selectedIdx: this.swapSelectedToTop(pageSize)
    }
  }

  /**
   * If the table is going to be paginated, bring the selected row to
   * the top.
   *
   */
  private swapSelectedToTop(pageSize: number): number {
    if (this.isPaginated(pageSize)) {
      const { table } = this.props
      const selectedIdx = table.defaultSelectedIdx

      const selectedRow = table.body[selectedIdx]
      table.body[selectedIdx] = table.body[0]
      table.body[0] = selectedRow

      return 0
    } else {
      return this.props.table.defaultSelectedIdx
    }
  }

  private onChange(selectedIdx: number) {
    this.setState({ selectedIdx })
  }

  private numRows() {
    return this.props.table.body.length
  }

  private isPaginated(pageSize = this.state.pageSize) {
    return this.numRows() > pageSize
  }

  private topToolbar() {
    const { table } = this.props

    const titleBreadcrumb = table.title ? [{ label: table.title, className: 'kui--data-table-title' }] : []
    const breadcrumbs = titleBreadcrumb

    return <Toolbar className="kui--data-table-toolbar-top" breadcrumbs={breadcrumbs.length > 0 && breadcrumbs} />
  }

  private bottomToolbar() {
    return (
      <Toolbar
        className="kui--data-table-toolbar-bottom"
        paginate={this.isPaginated()}
        setPage={(page: number) => this.setState(curState => ({ page, offset: (page - 1) * curState.pageSize }))}
        page={this.state.page}
        totalItems={this.numRows()}
        pageSize={this.state.pageSize}
      />
    )
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
    return (
      <div className="kui--data-table-wrapper kui--screenshotable">
        {this.topToolbar()}
        {this.broker()}
        {this.bottomToolbar()}
      </div>
    )
  }
}
