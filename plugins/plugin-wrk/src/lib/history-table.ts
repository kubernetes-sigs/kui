/*
 * Copyright 2017,2019 IBM Corporation
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

import drilldown from '@kui-shell/core/webapp/picture-in-picture'
import { Commands, eventBus, UI } from '@kui-shell/core'

import { all } from './history'
import { prettyUrl } from './util'
import { initUI, response } from './graphics'
import { insertRow, addCell, i18n } from './table'

const viewName = 'Load Test History'

export const list = ({ tab }: Commands.Arguments) => {
  const graphics = initUI({ noChart: true })
  const resp = response(tab, graphics, {
    url: undefined,
    testName: 'Historical',
    defaultMode: 'history'
  })

  // for each historic run...
  const showAll = () => {
    UI.empty(resp.graphics.table)

    // table header row
    const header = addCell(insertRow(resp.graphics.table))
    header('API Host')
    header('Test Name', { css: 'border-right' })
    header(i18n.requestsPerSec)
    header(i18n.latency50)
    header(i18n.latency99)
    header(i18n.latencyMax)

    all() /* .filter(({ apiHost: other }) => apiHost === other) */
      .forEach((run, idx) => {
        const row = insertRow(resp.graphics.table)
        const cell = addCell(row, run)

        // find the max sample in this run, so we can display it in the table
        const max = run.dataset.reduce((max, row) => {
          if (!max || row.requestsPerSec > max.requestsPerSec) {
            return row
          } else {
            return max
          }
        }, undefined)
        const { requestsPerSec, latency50, latency99, latencyMax } = max
        // const { requestsPerSec: maxRPS } = max
        // const { requestsPerSec, latency50, latency99, latencyMax } = run.dataset.find(row => row.requestsPerSec >= 0.8 * maxRPS)
        // const { requestsPerSec, latency50, latency99, latencyMax } = run.dataset.find(row => row.requestsPerSec === maxRPS)

        // the addCell impl requires that the fields be part of the data object...
        run.requestsPerSec = requestsPerSec
        run.latency50 = latency50
        run.latency99 = latency99
        run.latencyMax = latencyMax

        // now we can add the cells to the view
        cell('apiHost', { formatter: prettyUrl })
        cell('testName', { css: 'border-right' })
        cell('requestsPerSec', { css: 'bold' })
        cell('latency50')
        cell('latency99')
        cell('latencyMax')

        row.onclick = () => {
          const container = graphics.container
          const command = `wrk show ${idx}`
          const highlightThis = undefined
          const returnTo = viewName

          return drilldown(tab, command, highlightThis, container, returnTo)(event)
        }
      })
  }
  showAll()
  eventBus.on('/wrk/history/delete', showAll)

  return resp
}
