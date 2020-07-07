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

import { Row as KuiRow, Tab, REPL } from '@kui-shell/core'

import * as React from 'react'
import { DataTableCustomRenderProps, TableBody, TableRow, TableCell } from 'carbon-components-react'

import Markdown from '../Markdown'
import renderCell from './TableCell'
import { NamedDataTableRow } from './kui2carbon'

/**
 * Render the TableBody part
 *
 * @param offset offset into the kuiBody model
 *
 */
export default function renderBody(
  kuiBody: KuiRow[],
  justUpdated: Record<string, boolean>, // rowKey index
  renderOpts: DataTableCustomRenderProps<NamedDataTableRow>,
  tab: Tab,
  repl: REPL,
  offset: number,
  footerLines: string[]
) {
  return (
    <TableBody>
      {renderOpts.rows
        .map((row, ridx) => {
          const kuiRow = kuiBody[offset + ridx]
          const updated = justUpdated[kuiRow.rowKey || kuiRow.name]

          return (
            <TableRow
              key={row.id}
              {...renderOpts.getRowProps({
                row,
                'data-name': kuiBody[offset + ridx].name
              })}
            >
              {row.cells.map(renderCell(kuiRow, updated, tab, repl))}
            </TableRow>
          )
        })
        .concat(
          (footerLines || []).map((footer, idx) => (
            <TableRow key={`footer-${idx}`} className="kui--data-table-footer-messages kui--inverted-color-context">
              <TableCell colSpan={999} className="kui--data-table-footer-message">
                <Markdown source={footer} noExternalLinks />
              </TableCell>
            </TableRow>
          ))
        )}
    </TableBody>
  )
}
