/*
 * Copyright 2017-19 IBM Corporation
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

import { Graphics } from './graphics'

import * as parseDuration from 'parse-duration'
import * as prettyPrintDuration from 'pretty-ms'

export const i18n = {
  requestsPerSec: 'REQUESTS PER SECOND',
  latency50: 'p50',
  latency90: 'p90',
  latency99: 'p99',
  latencyMin: 'MIN',
  latencyMax: 'MAX',
  non2xx3xx: 'Errors'
}

/** latency formatter, using wrk's output */
const formatter = x => prettyPrintDuration(~~parseDuration(x))

export const addCell = (row: HTMLElement, rowData?) => (field, { css = undefined, formatter = x => x } = {}) => {
  const cell = document.createElement('span')
  row.appendChild(cell)

  if (rowData) {
    // then this is a normal data row
    const value = formatter(rowData[field])
    cell.innerHTML = value === undefined ? '' : value
  } else {
    // otherwise, we're adding the header row
    cell.innerText = exports.i18n[field] || field
    cell.classList.add('header-cell')
    // cell.style.fontFamily = 'var(--font-sans-serif)'
  }

  if (css) {
    cell.className = css
  }
}

/**
 * Insert a row in the given table
 *
 */
export const insertRow = table => {
  const row = document.createElement('div')
  const rowInner = document.createElement('div')

  row.classList.add('entity')
  rowInner.classList.add('entity-attributes')
  table.appendChild(row)
  row.appendChild(rowInner)

  return rowInner
}

/**
 * Add a row to the table
 *
 */
export const addRow = (graphics: Graphics) => (rowData?) => {
  const row = insertRow(graphics.table)
  if (!rowData) {
    // header row
    row.classList.add('header-row')
  }

  const add = addCell(row, rowData)

  add('requestsPerSec', {
    css: 'border-right header-cell',
    formatter: x => ~~x
  })
  add('latencyMin', { formatter })
  add('latency50', { formatter })
  add('latency90', { formatter })
  add('latency99', { formatter })
  add('latencyMax', { formatter })
  add('non2xx3xx', { formatter: x => x })

  /* add('disparity', {
    formatter: disp => !disp ? '-'
      : `<span style='padding:0.4285em 0'>` + disp.explanation.map(_ => {
  // format the disparity explanation: `key (covers%)`
        return `<div><span>${_.key}</span><span class='deemphasize'> ${prettyPrintDuration(_.slow)} (${(100 * _.covers).toFixed(1)}%)</span></div>`
      }).join('') + '</span>'
  }) */
}

/**
 * Create a table view
 *
 */
export const init = (container: Element): Element => {
  const tableOuter = document.createElement('div')
  const table = document.createElement('div')

  tableOuter.style.flex = '2'
  tableOuter.style.marginTop = '1em'
  // tableOuter.style.display = 'flex'
  tableOuter.style.flexDirection = 'column'
  tableOuter.style.alignItems = 'center'
  tableOuter.style.justifyContent = 'center'
  tableOuter.style.fontFamily = 'var(--font-monospace)'
  tableOuter.style.overflowY = 'auto'
  tableOuter.classList.add('result-as-table')
  tableOuter.classList.add('result-vertical')
  table.classList.add('repl-result')
  table.classList.add('result-table')
  table.style.width = '100%'
  table.style.borderLeft = 'none'
  table.style.borderRight = 'none'

  container.appendChild(tableOuter)
  tableOuter.appendChild(table)

  return table
}
