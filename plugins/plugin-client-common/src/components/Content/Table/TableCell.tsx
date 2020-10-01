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
import * as prettyPrintDuration from 'pretty-ms'
import { TableCell, DataTableCell } from 'carbon-components-react'
import { Table as KuiTable, Cell as KuiCell, Row as KuiRow, Tab, REPL, eventBus } from '@kui-shell/core'

import Markdown from '../Markdown'
import ErrorCell from './ErrorCell'
import whenNothingIsSelected from '../../../util/selection'

/**
 * Generate an onclick handler for a cell
 *
 */
export function onClickForCell(
  row: KuiRow,
  tab: Tab,
  repl: REPL,
  cell?: KuiCell,
  selectRow: () => void = () => undefined
) {
  const handler = cell ? cell.onclick : row.onclick
  if (handler === false) {
    return () => handler
  } else if (typeof handler === 'function') {
    return whenNothingIsSelected((evt: React.MouseEvent) => {
      evt.stopPropagation()
      selectRow()
      handler()
    })
  } else if (handler && handler.startEvent && handler.completeEvent) {
    return whenNothingIsSelected((evt: React.MouseEvent) => {
      evt.stopPropagation()
      selectRow()
      eventBus.emitCommandStart(handler.startEvent)
      eventBus.emitCommandComplete(handler.completeEvent)
    })
  } else if (handler) {
    const opts = { tab, echo: !row.onclickSilence }
    if (!row.onclickExec || row.onclickExec === 'pexec') {
      return whenNothingIsSelected((evt: React.MouseEvent) => {
        evt.stopPropagation()
        selectRow()
        repl.pexec(handler, opts)
      })
    } else {
      return whenNothingIsSelected((evt: React.MouseEvent) => {
        evt.stopPropagation()
        selectRow()
        repl.qexec(handler, undefined, undefined, { tab })
      })
    }
  }
}

/**
 * Render a TableCell part
 *
 */
export default function renderCell(table: KuiTable, kuiRow: KuiRow, justUpdated: boolean, tab: Tab, repl: REPL) {
  return function KuiTableCell(cell: DataTableCell, cidx: number) {
    // e.g. is this a badge/status-like cell?
    const tag = cidx > 0 && kuiRow.attributes[cidx - 1].tag

    // column key
    const key = cidx > 0 && kuiRow.attributes[cidx - 1].key

    // className for the td
    const cellClassName =
      cidx === 0
        ? 'entity-name ' + (kuiRow.outerCSS || '')
        : (key === 'NAME' ? 'kui--entity-name-secondary ' : key === 'STATUS' ? 'kui--status-cell' : '') +
          (kuiRow.attributes[cidx - 1].outerCSS || '')

    const outerClassName =
      'cell-inner ' +
      (cidx === 0
        ? (kuiRow.css || '') + (kuiRow.onclick ? ' clickable' : '')
        : (kuiRow.attributes[cidx - 1].css || '') + (kuiRow.attributes[cidx - 1].onclick ? ' clickable' : ''))

    const css = cidx > 0 ? kuiRow.attributes[cidx - 1].css : undefined

    // the text value of the cell
    const valueDom = kuiRow.attributes[cidx - 1] && kuiRow.attributes[cidx - 1].valueDom
    const innerText =
      valueDom ||
      ((cidx - 1 === table.durationColumnIdx || cidx - 1 === table.coldStartColumnIdx) && cell.value
        ? prettyPrintDuration(parseInt(cell.value, 10))
        : cell.value)

    return (
      <TableCell
        key={cell.id}
        className={cellClassName}
        onClick={onClickForCell(kuiRow, tab, repl, kuiRow.attributes[cidx - 1])}
      >
        <span
          data-key={cidx === 0 ? kuiRow.key : kuiRow.attributes[cidx - 1].key}
          data-value={cell.value}
          data-tag={tag}
          className={outerClassName}
        >
          {tag === 'badge' && (
            <span
              key={css /* force restart of animation if color changes */}
              title={innerText}
              className={css || 'kui--status-unknown'}
              data-tag="badge-circle"
              data-just-updated={justUpdated || undefined}
            >
              {/red-background/.test(css) ? <ErrorCell /> : undefined}
            </span>
          )}
          <span className="kui--cell-inner-text">{table.markdown ? <Markdown source={innerText} /> : innerText}</span>
        </span>
      </TableCell>
    )
  }
}
