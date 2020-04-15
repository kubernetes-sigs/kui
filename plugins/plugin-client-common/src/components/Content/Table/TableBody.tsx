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
import { DataTableCustomRenderProps, TableBody, TableRow } from 'carbon-components-react'

import renderCell from './TableCell'

/**
 * Render the TableBody part
 *
 * @param offset offset into the kuiBody model
 *
 */
export default function renderBody(
  kuiBody: KuiRow[],
  renderOpts: DataTableCustomRenderProps,
  tab: Tab,
  repl: REPL,
  offset: number
) {
  return (
    <TableBody>
      {renderOpts.rows.map((row, ridx) => (
        <TableRow
          key={row.id}
          {...renderOpts.getRowProps({
            row,
            'data-name': kuiBody[offset + ridx].name
          })}
        >
          {row.cells.map(renderCell(kuiBody[offset + ridx], row, renderOpts, tab, repl))}
        </TableRow>
      ))}
    </TableBody>
  )
}
