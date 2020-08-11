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

import { Tab, REPL, Table as KuiTable, TableStyle, i18n, isTableWithTimestamp, isWatchable } from '@kui-shell/core'

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
import Bar from './Bar'

/** carbon styling */
import 'carbon-components/scss/components/data-table/_data-table-core.scss'
import 'carbon-components/scss/components/data-table/_data-table-sort.scss'

/** hack (see comments in file) */
import '../../../../web/scss/components/Table/hack-select.scss'

/** import the kui theme alignment */
import '../../../../web/scss/components/Table/carbon-kui-theme-alignment.scss'

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

  /** Is this table being rendered in a minisplit? */
  isPartOfMiniSplit: boolean

  /** Is the Sidecar visible in this Tab? or some other width constraint? */
  isWidthConstrained: boolean

  /** display as grid (versus as regular table)? */
  asGrid: boolean

  /** prefix breadcrumbs? */
  prefixBreadcrumbs?: BreadcrumbView[]
}

/** state of PaginatedTable component */
export type State = ToolbarProps & {
  headers: DataTableHeader[]
  rows: NamedDataTableRow[]
  footer: string[]

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

  /**
   * A lock that governs the --kui--table-max-height
   * initialization. See https://github.com/IBM/kui/issues/5206
   *
   */
  private static oneTimeInit = false

  public constructor(props: P) {
    super(props)
    this.defaultPageSize = props.pageSize || 10

    /** Manage the --kui--table-max-height css variable */
    if (!PaginatedTable.oneTimeInit) {
      PaginatedTable.oneTimeInit = true
      const adjustMaxHeight = () => {
        const maxHeight = ~~(0.66 * document.body.getBoundingClientRect().height)
        document.body.style.setProperty('--kui--table-max-height', `${maxHeight}px`)
      }
      adjustMaxHeight()
      window.addEventListener('resize', adjustMaxHeight)
    }

    try {
      // assemble the data model
      const { headers, rows, footer } = kui2carbon(this.props.response)

      this.state = {
        headers,
        rows,
        footer,
        asSequence: false,
        asGrid: this.props.asGrid && findGridableColumn(this.props.response) >= 0,
        page: 1,
        pageSize: this.defaultPageSize
      } as S
    } catch (err) {
      console.error('Internal error preparing PaginatedTable', err)
    }
  }

  private topToolbar(lightweightTables = false) {
    // 1) If we started as a table, and are now a grid, then show
    // "Status Grid", otherwise:
    // 2) only for client w/o disableTableTitle, show a breadcrumb
    const breadcrumbs =
      !lightweightTables && !this.props.asGrid && this.state.asGrid
        ? [{ label: strings('Status Grid') }]
        : !this.props.asGrid && !this.props.title
        ? []
        : getBreadcrumbsFromTable(this.props.response, this.props.prefixBreadcrumbs)

    if (!this.state.asGrid) {
      const nRows = this.props.response.body.length
      if (!lightweightTables && (nRows > 1 || isWatchable(this.props.response))) {
        breadcrumbs.push({
          label: nRows === 1 ? strings('nRows1') : strings('nRows', nRows),
          className: 'kui--secondary-breadcrumb kui--nrows-breadcrumb'
        })
      }
    }

    if (breadcrumbs.length > 0) {
      return (
        <Toolbar
          className="kui--data-table-toolbar-top"
          breadcrumbs={breadcrumbs.length > 0 && breadcrumbs}
          repl={this.props.repl}
        />
      )
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

  private hasFooterLines() {
    return this.state.footer && this.state.footer.length > 0
  }

  private footerLines() {
    const nRows = this.props.isPartOfMiniSplit ? -1 : -6
    return this.state.footer ? this.state.footer.slice(nRows) : undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private bottomToolbar(lightweightTables = false) {
    const gridableColumn = findGridableColumn(this.props.response)
    return (
      <React.Fragment>
        {this.hasFooterLines() && <Toolbar stream={this.footerLines()} repl={this.props.repl} />}
        {this.props.toolbars &&
          (this.isPaginated() || gridableColumn >= 0 || isTableWithTimestamp(this.props.response)) && (
            <Toolbar
              className="kui--data-table-toolbar-bottom"
              repl={this.props.repl}
              asGrid={this.state.asGrid}
              gridableColumn={gridableColumn}
              setAsGrid={(asGrid: boolean) => this.setState({ asGrid })}
              paginate={this.isPaginated()}
              setPage={(page: number) => this.setState({ page })}
              page={this.state.page}
              totalItems={this.state.rows.length}
              pageSize={this.state.pageSize}
              hasSequenceButton={isTableWithTimestamp(this.props.response)}
              asSequence={this.state.asSequence}
              setAsSequence={(asSequence: boolean) => this.setState({ asSequence })}
            />
          )}
      </React.Fragment>
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

  private transformTableWithTimestamp(kuiTable: KuiTable) {
    const table = JSON.parse(JSON.stringify(kuiTable)) // deep copy
    const startIdx = table.startColumnIdx
    const endIdx = table.completeColumnIdx

    // add 'hide-with-sidecar' css to start column and remove end column
    table.header.attributes[startIdx].outerCSS = `${table.header.attributes[startIdx].outerCSS || ''} hide-with-sidecar`
    table.header.attributes.splice(endIdx, 1)

    // add duration header column if needed
    if (table.durationColumnIdx === undefined) {
      table.header.attributes.push({ key: 'Duration', value: 'Duration' })
    }

    // add interval header column
    table.header.attributes.push({ key: 'Interval', value: 'Interval' })

    // compute the max completion time and min start time
    let minStart = -1
    let maxEnd = -1

    table.body.forEach(row => {
      const start = new Date(row.attributes[startIdx].value).getTime()
      const end = new Date(row.attributes[endIdx].value).getTime()

      minStart = start < minStart || minStart === -1 ? start : minStart
      maxEnd = end > maxEnd || maxEnd === -1 ? end : maxEnd
    })

    const getFraction = (numerator: number) => {
      return `${((numerator / (maxEnd - minStart)) * 100).toFixed(2).toString()}%`
    }

    table.body.forEach(row => {
      const durationCol =
        table.durationColumnIdx >= 0 && new Date(row.attributes[table.durationColumnIdx].value).getTime()

      const start = new Date(row.attributes[startIdx].value).getTime()
      const end = new Date(row.attributes[endIdx].value).getTime()

      const duration = durationCol || end - start
      const width = getFraction(duration)
      const left = getFraction(start - minStart)
      const right = getFraction(maxEnd - end)

      // add 'hide-with-sidecar' css to start column and remove end column
      row.attributes[startIdx].outerCSS = `${row.attributes[startIdx].outerCSS || ''} hide-with-sidecar`
      row.attributes.splice(endIdx, 1)

      // add duration column if needed
      if (table.durationColumnIdx === undefined) {
        row.attributes.push({ key: 'Duration', value: duration.toString() })
      }

      // add interval column
      row.attributes.push({
        key: 'Interval',
        value: duration.toString(),
        valueDom: <Bar left={left} right={right} width={width} />
      })
    })

    // add durationColumnIdx if needed
    if (table.durationColumnIdx === undefined) {
      table.durationColumnIdx = table.header.attributes.findIndex(_ => _.key === 'Duration')
    }

    return table
  }

  private table() {
    const { tab, repl } = this.props
    const { page } = this.state

    const response = !this.state.asSequence
      ? this.props.response
      : this.transformTableWithTimestamp(this.props.response)
    const { headers, rows } = !this.state.asSequence ? this.state : kui2carbon(response)

    const isSortable = response.body.length > 1
    const dataTable = (visibleRows: NamedDataTableRow[], offset = 0) => (
      <React.Fragment>
        <DataTable
          rows={visibleRows}
          headers={headers}
          isSortable={isSortable}
          sortRow={sortRow}
          render={renderOpts => (
            <TableContainer
              className={
                'kui--data-table-container' +
                (this.props.title ? ' kui--data-table-container-with-toolbars' : '') +
                (this.props.response.title || this.props.response.breadcrumbs
                  ? ' kui--data-table-container-with-title'
                  : '') +
                (isSortable ? ' kui--data-table-sortable' : '')
              }
            >
              <Table
                size={
                  this.props.response.style === TableStyle.Heavy
                    ? 'tall'
                    : this.props.response.style === undefined || this.props.response.style === TableStyle.Medium
                    ? 'short'
                    : 'compact'
                }
              >
                {response.header && renderHeader(response.header, renderOpts)}
                {renderBody(response, this.justUpdatedMap(), renderOpts, tab, repl, offset)}
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

  private content(includeToolbars = false, lightweightTables = false) {
    return (
      <React.Fragment>
        {includeToolbars && this.topToolbar(lightweightTables)}
        {this.state.asGrid ? this.grid(this.state.rows) : this.table()}
        {includeToolbars && this.bottomToolbar(lightweightTables)}
      </React.Fragment>
    )
  }

  public render() {
    if (!this.state) {
      return <div className="oops">Internal Error</div>
    } else {
      const lightweightTables = this.props.response.style === TableStyle.Light && !this.props.isPartOfMiniSplit
      const className =
        'kui--data-table-wrapper' +
        (this.state.asGrid ? ' kui--data-table-as-grid' : '') +
        (this.state.asSequence ? ' kui--data-table-as-sequence' : '') +
        (lightweightTables ? ' kui--data-table-wrapper-lightweight' : '')

      return (
        <div className={className}>
          <div className="kui--screenshotable">
            {lightweightTables ? (
              this.content(true, true)
            ) : (
              <Card header={this.topToolbar()} footer={this.bottomToolbar()}>
                {this.content()}
              </Card>
            )}
          </div>
        </div>
      )
    }
  }
}
