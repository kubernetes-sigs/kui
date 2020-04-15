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

import { Tab, REPL, Table as KuiTable, TableStyle } from '@kui-shell/core'

import * as React from 'react'
import { DataTable, DataTableHeader, TableContainer, Table } from 'carbon-components-react'

import sortRow from './sort'
import renderBody from './TableBody'
import renderHeader from './TableHeader'
import Toolbar, { ToolbarBreadcrumb, Props as ToolbarProps } from './Toolbar'
import Grid from './Grid'
import kui2carbon, { NamedDataTableRow } from './kui2carbon'

/** carbon styling */
import 'carbon-components/scss/components/data-table/_data-table-core.scss'
import 'carbon-components/scss/components/radio-button/_radio-button.scss'

/** hack (see comments in file) */
import '../../../../web/scss/components/Table/hack-select.scss'

/** import the kui theme alignment */
import '../../../../web/scss/components/Table/carbon-kui-theme-alignment.scss'

import '../../../../web/css/static/ToolbarButton.scss'
import '../../../../web/scss/components/Table/Toolbar.scss'

interface PaginationConfiguration {
  pageSize?: number
}

/** parameters to PaginatedTable component */
export type Props<T extends KuiTable = KuiTable> = PaginationConfiguration & {
  tab: Tab
  repl: REPL
  response: T

  /**
   * paginate: true -> always paginate
   * paginate: false -> never paginate
   * paginate: number -> paginate if above the threshold of rows
   */
  paginate: boolean | number

  /** use toolbars? */
  toolbars: boolean
}

/** state of PaginatedTable component */
export type State = ToolbarProps & {
  headers: DataTableHeader[]
  rows: NamedDataTableRow[]
  radio: boolean

  page: number
  pageSize: number
}

/**
 * A DataTable/Pagination pair
 *
 */
export default class PaginatedTable<P extends Props, S extends State> extends React.PureComponent<P, S> {
  private readonly defaultPageSize: number

  public constructor(props: P) {
    super(props)
    this.defaultPageSize = props.pageSize || 10

    try {
      // assemble the data model
      const { headers, rows, radio } = kui2carbon(this.props.response)

      const gridableColumn = this.props.response.body[0]
        ? this.props.response.header.attributes.findIndex(cell => /STATUS/i.test(cell.key))
        : -1

      this.state = {
        headers,
        rows,
        radio,
        gridableColumn,
        asGrid: false,
        page: 1,
        pageSize: this.defaultPageSize
      } as S
    } catch (err) {
      console.error('Internal error preparing PaginatedTable', err)
    }
  }

  private topToolbar() {
    if (this.props.toolbars) {
      const titleBreadcrumb: ToolbarBreadcrumb[] = this.props.response.title
        ? [{ label: this.props.response.title, className: 'kui--data-table-title' }]
        : []
      const breadcrumbs = titleBreadcrumb.concat(
        (this.props.response.breadcrumbs || []).map(_ =>
          Object.assign({}, _, { className: 'kui--secondary-breadcrumb' })
        )
      )

      return <Toolbar className="kui--data-table-toolbar-top" breadcrumbs={breadcrumbs.length > 0 && breadcrumbs} />
    }
  }

  private isPaginated() {
    return (
      this.props.paginate !== undefined &&
      this.props.paginate !== false &&
      !this.state.asGrid &&
      (this.props.paginate === true || this.state.rows.length > this.props.paginate)
    )
  }

  private bottomToolbar() {
    return (
      this.props.toolbars && (
        <Toolbar
          framed
          className="kui--data-table-toolbar-bottom"
          asGrid={this.state.asGrid}
          gridableColumn={this.state.gridableColumn}
          setAsGrid={(asGrid: boolean) => this.setState({ asGrid })}
          paginate={this.isPaginated()}
          setPage={(page: number) => this.setState({ page })}
          page={this.state.page}
          totalItems={this.state.rows.length}
          pageSize={this.state.pageSize}
        />
      )
    )
  }

  private grid(visibleRows: NamedDataTableRow[]) {
    return (
      <div className="kui--data-table-wrapper kui--data-table-as-grid kui--screenshotable">
        {this.topToolbar()}
        <Grid
          tab={this.props.tab}
          repl={this.props.repl}
          response={this.props.response}
          visibleRows={visibleRows}
          gridableColumn={this.state.gridableColumn}
        />
        {this.bottomToolbar()}
      </div>
    )
  }

  public render() {
    if (!this.state) {
      return <div className="oops">Internal Error</div>
    }

    const { tab, repl, response } = this.props
    const { headers, rows, radio, page } = this.state

    // the view
    const dataTable = (visibleRows: NamedDataTableRow[], offset = 0) => (
      // `<form>` prevents the radio button selection reads from the global form of browser.
      // See issue: https://github.com/IBM/kui/issues/3871
      <form className="kui--data-table-wrapper kui--screenshotable">
        {this.topToolbar()}
        <DataTable
          rows={visibleRows}
          headers={headers}
          radio={radio}
          isSortable={false} // until we figure out how to handle sort+pagination and TableHeader className
          sortRow={sortRow}
          render={renderOpts => (
            <TableContainer
              className={
                (this.props.toolbars ? 'kui--data-table-container-with-toolbars' : '') +
                (this.props.response.title || this.props.response.breadcrumbs
                  ? ' kui--data-table-container-with-title'
                  : '')
              }
            >
              <Table
                size={
                  this.props.response.style === TableStyle.Heavy
                    ? 'tall'
                    : this.props.response.style === TableStyle.Medium
                    ? 'short'
                    : 'compact'
                }
              >
                {response.header && renderHeader(response.header, renderOpts)}
                {renderBody(response.body, renderOpts, tab, repl, offset)}
              </Table>
            </TableContainer>
          )}
        />
        {this.bottomToolbar()}
      </form>
    )

    const paginated = this.isPaginated()
    return this.state.asGrid
      ? this.grid(rows)
      : dataTable(
          !paginated ? rows : rows.slice((page - 1) * this.state.pageSize, page * this.state.pageSize),
          !paginated ? 0 : (page - 1) * this.state.pageSize
        )
  }
}
