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

import { Tab, REPL, Table as KuiTable, TableStyle, i18n } from '@kui-shell/core'

import * as React from 'react'
import { DataTable, DataTableHeader, TableContainer, Table } from 'carbon-components-react'

import sortRow from './sort'
import Card from '../../spi/Card'
import renderBody from './TableBody'
import renderHeader from './TableHeader'
import Toolbar, { Props as ToolbarProps } from './Toolbar'
import Grid, { findGridableColumn } from './Grid'
import kui2carbon, { NamedDataTableRow } from './kui2carbon'
import { BreadcrumbView } from '../../spi/Breadcrumb'

/** carbon styling */
import 'carbon-components/scss/components/data-table/_data-table-core.scss'
import 'carbon-components/scss/components/data-table/_data-table-sort.scss'

/** hack (see comments in file) */
import '../../../../web/scss/components/Table/hack-select.scss'

/** import the kui theme alignment */
import '../../../../web/scss/components/Table/carbon-kui-theme-alignment.scss'

import '../../../../web/css/static/ToolbarButton.scss'
import '../../../../web/scss/components/Table/Toolbar.scss'

const strings = i18n('plugin-client-common')

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

  /** use title? */
  title: boolean

  /** display as grid (versus as regular table)? */
  asGrid: boolean

  /** prefix breadcrumbs? */
  prefixBreadcrumbs?: BreadcrumbView[]
}

/** state of PaginatedTable component */
export type State = ToolbarProps & {
  headers: DataTableHeader[]
  rows: NamedDataTableRow[]

  page: number
  pageSize: number
}

export function getBreadcrumbsFromTable(response: KuiTable, prefixBreadcrumbs: BreadcrumbView[]) {
  const titleBreadcrumb: BreadcrumbView[] = response.title
    ? [{ label: response.title, className: 'kui--data-table-title', isCurrentPage: true }]
    : []

  const _responseCrumbs = typeof response.breadcrumbs === 'function' ? response.breadcrumbs() : response.breadcrumbs
  const responseCrumbs = !_responseCrumbs
    ? []
    : _responseCrumbs.map(_ => Object.assign({}, _, { className: 'kui--secondary-breadcrumb' }))

  const breadcrumbs = (prefixBreadcrumbs || []).concat(responseCrumbs).concat(titleBreadcrumb)

  return breadcrumbs
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
      const { headers, rows } = kui2carbon(this.props.response)

      this.state = {
        headers,
        rows,
        asGrid: this.props.asGrid,
        page: 1,
        pageSize: this.defaultPageSize
      } as S
    } catch (err) {
      console.error('Internal error preparing PaginatedTable', err)
    }
  }

  private topToolbar() {
    // 1) If we started as a table, and are now a grid, then show
    // "Status Grid", otherwise:
    // 2) only for client w/o disableTableTitle, show a breadcrumb
    const breadcrumbs =
      !this.props.asGrid && this.state.asGrid
        ? [{ label: strings('Status Grid') }]
        : !this.props.asGrid && !this.props.title
        ? []
        : getBreadcrumbsFromTable(this.props.response, this.props.prefixBreadcrumbs)

    if (breadcrumbs.length > 0) {
      return <Toolbar className="kui--data-table-toolbar-top" breadcrumbs={breadcrumbs.length > 0 && breadcrumbs} />
    }
  }

  private isPaginated() {
    return false
    /**
     * return (
     * this.props.paginate !== undefined &&
     * this.props.paginate !== false &&
     * !this.state.asGrid &&
     * (this.props.paginate === true || this.state.rows.length > this.props.paginate)
     * )
     */
  }

  private bottomToolbar() {
    const gridableColumn = findGridableColumn(this.props.response)

    return (
      this.props.toolbars &&
      (this.isPaginated() || gridableColumn >= 0) && (
        <Toolbar
          framed
          className="kui--data-table-toolbar-bottom"
          asGrid={this.state.asGrid}
          gridableColumn={gridableColumn}
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
      <Grid
        tab={this.props.tab}
        repl={this.props.repl}
        response={this.props.response}
        visibleRows={visibleRows}
        justUpdated={this.justUpdatedMap()}
      />
    )
  }

  private justUpdatedMap() {
    return this.state.rows.reduce((M, _) => {
      if (_.justUpdated) M[_.rowKey] = true
      return M
    }, {} as Record<string, boolean>)
  }

  private table() {
    const { tab, repl, response } = this.props
    const { headers, rows, page } = this.state

    const dataTable = (visibleRows: NamedDataTableRow[], offset = 0) => (
      <React.Fragment>
        <DataTable
          rows={visibleRows}
          headers={headers}
          isSortable
          sortRow={sortRow}
          render={renderOpts => (
            <TableContainer
              className={
                (this.props.title ? 'kui--data-table-container-with-toolbars' : '') +
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
                    : 'short'
                }
              >
                {response.header && renderHeader(response.header, renderOpts)}
                {renderBody(response.body, this.justUpdatedMap(), renderOpts, tab, repl, offset)}
              </Table>
            </TableContainer>
          )}
        />
      </React.Fragment>
    )

    const paginated = this.isPaginated()
    return dataTable(
      !paginated ? rows : rows.slice((page - 1) * this.state.pageSize, page * this.state.pageSize),
      !paginated ? 0 : (page - 1) * this.state.pageSize
    )
  }

  private content(includeToolbars = false) {
    return (
      <React.Fragment>
        {includeToolbars && this.topToolbar()}
        {this.state.asGrid ? this.grid(this.state.rows) : this.table()}
        {includeToolbars && this.bottomToolbar()}
      </React.Fragment>
    )
  }

  public render() {
    if (!this.state) {
      return <div className="oops">Internal Error</div>
    } else {
      const className =
        'kui--data-table-wrapper kui--screenshotable' + (this.state.asGrid ? ' kui--data-table-as-grid' : '')
      return this.props.response.style === TableStyle.Light || this.props.asGrid ? (
        <div className={className}>{this.content(true)}</div>
      ) : (
        <Card header={this.topToolbar()} footer={this.bottomToolbar()} className={className}>
          {this.content()}
        </Card>
      )
    }
  }
}
