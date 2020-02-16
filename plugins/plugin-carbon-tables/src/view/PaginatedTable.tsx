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

import { Tab, REPL, Table as KuiTable, getCurrentPrompt } from '@kui-shell/core'

import * as React from 'react'
import { DataTable, DataTableHeader, TableContainer, Table, Pagination } from 'carbon-components-react'

import sortRow from './sort'
import renderBody from './TableBody'
import renderHeader from './TableHeader'
import kui2carbon, { NamedDataTableRow } from '../model/kui2carbon'

import { pageSize } from '@kui-shell/client/config.d/tables.json'

/** import the kui theme alignment */
import '../../web/css/static/carbon-kui-theme-alignment.css'

/** refocus the current prompt */
function focusRepl() {
  const prompt = getCurrentPrompt()
  if (prompt) {
    prompt.focus()
  }
}

/** parameters to PaginatedTable component */
export interface Props<T extends KuiTable = KuiTable> {
  tab: Tab
  repl: REPL
  response: T
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
  public constructor(props: P) {
    super(props)

    try {
      // assemble the data model
      const { headers, rows, radio } = kui2carbon(this.props.response)

      this.state = {
        headers,
        rows,
        radio,
        page: 1,
        pageSize
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
    const needsPagination = rows.length > pageSize

    const visibleRows = rows.slice((page - 1) * this.state.pageSize, page * this.state.pageSize)

    // the view
    const dataTable = (
      <DataTable
        rows={visibleRows}
        headers={headers}
        radio={radio}
        isSortable={false} // until we figure out how to handle sort+pagination and TableHeader className
        sortRow={sortRow}
        render={renderOpts => (
          <TableContainer title={response.title}>
            <Table size="compact">
              {renderHeader(response.header, renderOpts)}
              {renderBody(response.body, renderOpts, tab, repl)}
            </Table>
          </TableContainer>
        )}
      />
    )

    const pagination = needsPagination && (
      <Pagination
        page={page}
        totalItems={rows.length}
        pageSize={this.state.pageSize}
        pageSizes={new Array(Math.min(5, ~~(rows.length / pageSize)))
          .fill(0)
          .map((_, idx) => (idx + 1) * pageSize)
          .concat([rows.length])}
        onChange={pagination => {
          this.setState(pagination)
          focusRepl()
        }}
      />
    )

    if (!needsPagination) {
      return dataTable
    } else {
      const style = { flex: 1, flexDirection: 'column' as const, alignItems: 'stretch' as const }
      return (
        <div className="flex-layout" style={style}>
          {dataTable}
          {pagination}
        </div>
      )
    }
  }
}

export default function renderTable(tab: Tab, repl: REPL, response: KuiTable) {
  return <PaginatedTable tab={tab} repl={repl} response={response} />
}
