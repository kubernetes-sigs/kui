/*
 * Copyright 2020 The Kubernetes Authors
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

import Debug from 'debug'
import React from 'react'
import prettyPrintDuration from 'pretty-ms'
import { Td } from '@patternfly/react-table/dist/esm/components/TableComposable'

import type { ExecOptions, Table as KuiTable, Cell as KuiCell, Row as KuiRow, Tab, REPL } from '@kui-shell/core'

import { isHeadless } from '@kui-shell/core/mdist/api/Capabilities'
import { split, pexecInCurrentTab } from '@kui-shell/core/mdist/api/Exec'

import Icons from '../../spi/Icons'
import Tooltip from '../../spi/Tooltip'
import tooltipContent, { tooltipProps } from './Tooltip'
const Markdown = React.lazy(() => import('../Markdown'))
import ErrorCell from './ErrorCell'
import whenNothingIsSelected from '../../../util/selection'

import { MutabilityContext, MutabilityState } from '../../Client/MutabilityContext'

export type CellOnClickHandler = (evt: React.MouseEvent) => void

const debug = Debug('plugin-client-common/Content/Table/TableCell')

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
  opts?: Pick<KuiTable, 'drilldownTo'> & { selectRow?: () => void },
  mutability?: MutabilityState
): CellOnClickHandler {
  const { selectRow = () => undefined } = opts || {}

  // precedence order of drilldownTo protocol, with a default to drill down to a side split
  const drilldownTo = (cell && cell.drilldownTo) || row.drilldownTo || (opts && opts.drilldownTo) || 'side-split'

  let handler = cell && cell.onclick ? cell.onclick : row.onclick
  if (handler === false) {
    return () => handler
  } else if (typeof handler === 'function') {
    return whenNothingIsSelected((evt: React.MouseEvent) => {
      evt.stopPropagation()
      selectRow()
      handler()
      return false
    })
  } else if (handler) {
    const opts: ExecOptions = { tab }
    if (!row.onclickExec || row.onclickExec === 'pexec') {
      return whenNothingIsSelected(async (evt: React.MouseEvent) => {
        evt.stopPropagation()
        selectRow()

        if (mutability && !mutability.executable && row.onclickIdempotent && row.onclickPrefetch) {
          // we have prefetched content! and this client doesn't allow command execution, so use it
          opts.masquerade = row.onclick
          opts.data = row.onclickPrefetch
          handler = 'replay-content'
          debug('Implementing table cell drilldown with replayed content', row.onclick)
        }

        if (drilldownTo === 'side-split' && !XOR(evt.metaKey, !!process.env.KUI_SPLIT_DRILLDOWN)) {
          pexecInCurrentTab(`split --ifnot is-split --cmdline "${handler}"`, undefined, false, true, undefined, {
            masquerade: opts.masquerade,
            data: opts.data
          })
        } else if (!isHeadless() && drilldownTo === 'new-window') {
          const { ipcRenderer } = await import('electron')
          ipcRenderer.send(
            'synchronous-message',
            JSON.stringify({
              operation: 'new-window',
              argv: split(handler)
            })
          )
        } else {
          repl.pexec(handler, opts)
        }
        return false
      })
    } else {
      return whenNothingIsSelected((evt: React.MouseEvent) => {
        evt.stopPropagation()
        selectRow()
        repl.qexec(handler, undefined, undefined, { tab })
        return false
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

    const outerClassName = 'display-inline-block cell-inner ' + (css || '') + (onclick ? ' clickable' : '')

    // the text value of the cell
    const valueDom = cidx > 0 && kuiRow.attributes[cidx - 1] && kuiRow.attributes[cidx - 1].valueDom
    const title =
      (cidx - 1 === table.durationColumnIdx ||
        cidx - 1 === table.coldStartColumnIdx ||
        cidx - 1 === table.queueingDelayColumnIdx) &&
      value
        ? prettyPrintDuration(parseInt(value, 10))
        : value
    const innerText = valueDom || title

    const innerSpan = (
      <span className="kui--cell-inner-text">
        {cidx === 0 && kuiRow.fontawesome === 'fas fa-check' ? (
          <Icons icon="Checkmark" />
        ) : table.markdown ? (
          <Markdown nested source={title} />
        ) : (
          innerText
        )}
      </span>
    )

    const innerSpanWithTooltip =
      cidx === 0 && table.title ? (
        <Tooltip markdown={tooltipContent(table.title, kuiRow.name)} {...tooltipProps}>
          {innerSpan}
        </Tooltip>
      ) : (
        innerSpan
      )

    const { attributes = [] } = kuiRow
    // re: OBJECT, see https://github.com/IBM/kui/issues/6831
    return (
      <MutabilityContext.Consumer key={cidx}>
        {mutability => (
          <Td
            className={cellClassName}
            modifier={
              /OBJECT/i.test(key) || /MESSAGE/i.test(key)
                ? 'wrap'
                : /STATUS/i.test(key)
                ? 'nowrap'
                : !/NAME|NAMESPACE/i.test(key)
                ? 'fitContent'
                : undefined
            }
          >
            <div
              data-key={key}
              data-value={value}
              data-tag={tag}
              className={outerClassName}
              onClick={onclick ? onClickForCell(kuiRow, tab, repl, attributes[cidx - 1], table, mutability) : undefined}
            >
              {tag === 'badge' && (
                <Tooltip content={title}>
                  <span
                    key={css /* force restart of animation if color changes */}
                    className={css || 'kui--status-unknown'}
                    data-tag="badge-circle"
                    data-just-updated={justUpdated || undefined}
                  >
                    {/red-background/.test(css) ? <ErrorCell /> : undefined}
                  </span>
                </Tooltip>
              )}
              {innerSpanWithTooltip}
            </div>
          </Td>
        )}
      </MutabilityContext.Consumer>
    )
  }
}
