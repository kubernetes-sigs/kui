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

import { Tab, REPL, Table as KuiTable } from '@kui-shell/core'

import * as React from 'react'
import { DataTable, DataTableHeader, TableContainer, Table, Pagination } from 'carbon-components-react'

import sortRow from './sort'
import renderBody from './TableBody'
import renderHeader from './TableHeader'
import kui2carbon, { NamedDataTableRow } from '../model/kui2carbon'

/** carbon styling */
import 'carbon-components/scss/components/pagination/_pagination.scss'
import 'carbon-components/scss/components/data-table/_data-table-core.scss'
import 'carbon-components/scss/components/radio-button/_radio-button.scss'

/** hack (see comments in file) */
import '../../web/css/static/hack-select.scss'

/** import the kui theme alignment */
import '../../web/css/static/carbon-kui-theme-alignment.css'

interface PaginationConfiguration {
  pageSize?: number
}

/** parameters to PaginatedTable component */
export type Props<T extends KuiTable = KuiTable> = PaginationConfiguration & {
  tab: Tab
  repl: REPL
  response: T
  needsPagination: boolean
}

/** state of PaginatedTable component */
export interface State {
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
export class PaginatedTable<P extends Props, S extends State> extends React.PureComponent<P, S> {
  private readonly defaultPageSize: number

  public constructor(props: P) {
    super(props)
    this.defaultPageSize = props.pageSize || 20

    try {
      // assemble the data model
      const { headers, rows, radio } = kui2carbon(this.props.response)

      this.state = {
        headers,
        rows,
        radio,
        page: 1,
        pageSize: this.defaultPageSize
      } as S
    } catch (err) {
      console.error('Internal error preparing PaginatedTable', err)
    }
  }

  public render() {
    if (!this.state) {
      return <div className="oops">Internal Error</div>
    }

    const { tab, repl, response } = this.props
    const { headers, rows, radio, page } = this.state

    // note the comparison versus the default pageSize; we want to
    // know if this row set will every need pagination, not whether it
    // does based on the user's current this.state.pageSize selection
    const needsPagination = this.props.needsPagination && rows.length > this.defaultPageSize

    const visibleRows = rows.slice((page - 1) * this.state.pageSize, page * this.state.pageSize)

    // the view
    const dataTable = (
      // `<form>` prevents the radio button selection reads from the global form of browser.
      // See issue: https://github.com/IBM/kui/issues/3871
      <form>
        <DataTable
          rows={visibleRows}
          headers={headers}
          radio={radio}
          isSortable={false} // until we figure out how to handle sort+pagination and TableHeader className
          sortRow={sortRow}
          render={renderOpts => (
            <TableContainer title={response.title} className="kui--screenshotable">
              <Table size="compact">
                {response.header && renderHeader(response.header, renderOpts)}
                {renderBody(response.body, renderOpts, tab, repl)}
              </Table>
            </TableContainer>
          )}
        />
      </form>
    )

    const pagination = needsPagination && (
      <Pagination
        page={page}
        totalItems={rows.length}
        pageSize={this.state.pageSize}
        pageSizes={new Array(Math.min(5, ~~(rows.length / this.defaultPageSize)))
          .fill(0)
          .map((_, idx) => (idx + 1) * this.defaultPageSize)
          .concat([rows.length])}
        onChange={pagination => {
          this.setState(pagination)
        }}
      />
    )

    if (!needsPagination) {
      return dataTable
    } else {
      // overflow-x: auto so that the pagination parts don't overflow offscreen!
      // see https://github.com/IBM/kui/issues/3773
      return (
        <div className="kui--paginated-table">
          {dataTable}
          {pagination}
        </div>
      )
    }
  }
}

export default function renderTable(tab: Tab, repl: REPL, response: KuiTable, needsPagination = true) {
  return <PaginatedTable tab={tab} repl={repl} response={response} needsPagination={needsPagination} />
}
