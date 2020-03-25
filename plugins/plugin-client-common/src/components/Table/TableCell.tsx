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

import { Cell as KuiCell, Row as KuiRow, Tab, REPL } from '@kui-shell/core'

import * as React from 'react'
import {
  DataTableRow,
  DataTableCell,
  DataTableCustomRenderProps,
  TableCell,
  TableSelectRow
} from 'carbon-components-react'

/**
 * Generate an onclick handler for a cell
 *
 */
function onClickForCell(row: KuiRow, tab: Tab, repl: REPL, cell?: KuiCell, selectRow: () => void = () => undefined) {
  const handler = cell ? cell.onclick : row.onclick
  if (typeof handler === 'function') {
    return () => {
      selectRow()
      handler()
    }
  } else {
    const opts = { tab, echo: !row.onclickSilence }
    if (!row.onclickExec || row.onclickExec === 'pexec') {
      return () => {
        selectRow()
        repl.pexec(handler, opts)
      }
    } else {
      return () => {
        selectRow()
        repl.qexec(handler, undefined, undefined, { tab })
      }
    }
  }
}

/**
 * Render a TableCell part
 *
 */
export default function renderCell(
  kuiRow: KuiRow,
  row: DataTableRow,
  { getSelectionProps, radio, selectRow }: DataTableCustomRenderProps,
  tab: Tab,
  repl: REPL
) {
  return (cell: DataTableCell, cidx: number) => {
    if (cidx === 0 && radio) {
      return (
        <TableSelectRow
          {...getSelectionProps({
            row,
            key: row.id,
            className: kuiRow.outerCSS + ' not-a-name radio-button-width',
            onClick: onClickForCell(kuiRow, tab, repl, undefined, () => selectRow(row.id))
          })}
        />
      )
    } else {
      return (
        <TableCell
          key={cell.id}
          className={
            cidx === 0
              ? 'entity-name ' + (kuiRow.outerCSS || '')
              : (kuiRow.attributes[cidx - 1].key === 'NAME' ? 'entity-name-secondary ' : '') +
                kuiRow.attributes[cidx - 1].outerCSS
          }
          onClick={onClickForCell(kuiRow, tab, repl, kuiRow.attributes[cidx - 1])}
        >
          <span
            data-key={cidx === 0 ? kuiRow.key : kuiRow.attributes[cidx - 1].key}
            data-value={cell.value}
            data-tag={cidx > 0 && kuiRow.attributes[cidx - 1].tag}
            className={
              'cell-inner ' +
              (cidx === 0
                ? (kuiRow.css || '') + (kuiRow.onclick ? ' clickable' : '')
                : (kuiRow.attributes[cidx - 1].css || '') + (kuiRow.attributes[cidx - 1].onclick ? ' clickable' : ''))
            }
          >
            {(kuiRow.attributes[cidx - 1] && kuiRow.attributes[cidx - 1].valueDom) || cell.value}
          </span>
        </TableCell>
      )
    }
  }
}
