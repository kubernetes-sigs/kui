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

import React from 'react'
import prettyPrintDuration from 'pretty-ms'
import { Td } from '@patternfly/react-table'
import {
  Table as KuiTable,
  Cell as KuiCell,
  Row as KuiRow,
  Tab,
  REPL,
  eventBus,
  pexecInCurrentTab
} from '@kui-shell/core'

import Icons from '../../spi/Icons'
const Markdown = React.lazy(() => import('../Markdown'))
import ErrorCell from './ErrorCell'
import whenNothingIsSelected from '../../../util/selection'

export type CellOnClickHandler = (evt: React.MouseEvent) => void

function XOR(a: boolean, b: boolean) {
  return (a || b) && !(a && b)
}

/**
 * Generate an onclick handler for a cell
 *
 */
export function onClickForCell(
  row: KuiRow,
  tab: Tab,
  repl: REPL,
  cell?: KuiCell,
  opts?: Pick<KuiTable, 'drilldownTo'> & { selectRow?: () => void }
): CellOnClickHandler {
  const { drilldownTo = 'side-split', selectRow = () => undefined } = opts || {}

  const handler = cell && cell.onclick ? cell.onclick : row.onclick
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
    const opts = { tab }
    if (!row.onclickExec || row.onclickExec === 'pexec') {
      return whenNothingIsSelected((evt: React.MouseEvent) => {
        evt.stopPropagation()
        selectRow()
        if (drilldownTo === 'side-split' && !XOR(evt.metaKey, !!process.env.KUI_SPLIT_DRILLDOWN)) {
          pexecInCurrentTab(`split --ifnot is-split --cmdline "${handler}"`, undefined, false, true)
        } else {
          repl.pexec(handler, opts)
        }
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
  return function KuiTableCell(
    key: string,
    value: string,
    tag: string,
    outerCSS: string,
    css: string,
    onclick: KuiRow['onclick'],
    cidx: number
  ) {
    // className for the td
    const cellClassName =
      cidx === 0
        ? 'entity-name ' + (outerCSS || '')
        : (/NAME/i.test(key) ? 'kui--entity-name-secondary ' : /STATUS/i.test(key) ? 'kui--status-cell' : '') +
          (outerCSS || '')

    const outerClassName = 'cell-inner ' + (css || '') + (onclick ? ' clickable' : '')

    // the text value of the cell
    const valueDom = cidx > 0 && kuiRow.attributes[cidx - 1] && kuiRow.attributes[cidx - 1].valueDom
    const title =
      (cidx - 1 === table.durationColumnIdx || cidx - 1 === table.coldStartColumnIdx) && value
        ? prettyPrintDuration(parseInt(value, 10))
        : value
    const innerText = valueDom || title

    const { attributes = [] } = kuiRow
    return (
      <Td
        key={cidx}
        className={cellClassName}
        onClick={onClickForCell(kuiRow, tab, repl, attributes[cidx - 1], table)}
        modifier={!/NAME|NAMESPACE/i.test(key) ? 'fitContent' : undefined}
      >
        <span data-key={key} data-value={value} data-tag={tag} className={outerClassName}>
          {tag === 'badge' && (
            <span
              key={css /* force restart of animation if color changes */}
              title={title}
              className={css || 'kui--status-unknown'}
              data-tag="badge-circle"
              data-just-updated={justUpdated || undefined}
            >
              {/red-background/.test(css) ? <ErrorCell /> : undefined}
            </span>
          )}
          <span className="kui--cell-inner-text">
            {cidx === 0 && kuiRow.fontawesome === 'fas fa-check' ? (
              <Icons icon="Checkmark" />
            ) : table.markdown ? (
              <Markdown nested source={title} />
            ) : (
              innerText
            )}
          </span>
        </span>
      </Td>
    )
  }
}
