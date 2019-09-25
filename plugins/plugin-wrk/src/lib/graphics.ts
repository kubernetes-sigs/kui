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

import { UI } from '@kui-shell/core'
import { addNameToSidecarHeader, getSidecar } from '@kui-shell/core/webapp/views/sidecar'

import * as chart from './chart'
import { prettyUrl } from './util'
import { init as initTable } from './table'

const viewName = 'Load Tester'

export interface Graphics {
  container: HTMLElement
  table?: Element
}

/**
 * Initialize the UI
 *
 */
export const initUI = ({
  noTable = false,
  noChart = false,
  container = document.createElement('div')
} = {}): Graphics => {
  const graphics: Graphics = { container, table: undefined }

  container.style.flex = '1'
  container.style.display = 'flex'
  container.style.minWidth = '0' // avoid nested flexbox resizing issues. https://github.com/chartjs/Chart.js/issues/4156
  container.style.flexDirection = 'column'

  if (!noChart) {
    const chart = (graphics['chart'] = document.createElement('div'))
    container.appendChild(chart)
    chart.style.flex = '3'
    chart.style.marginTop = '2em'
    chart.style.position = 'relative' // chartjs responsive resizing needs this
  }

  if (!noTable) {
    graphics.table = initTable(container) // initialize the table dom
  }

  return graphics
}

/**
 * Form the response to the REPL
 *
 */
export const response = (tab: UI.Tab, graphics, { url, testName, defaultMode = 'last', label = 'Last Run' }) => {
  setTimeout(() => chart.init(graphics), 650)

  addNameToSidecarHeader(getSidecar(tab), viewName, `${testName} on ${prettyUrl(url)}`)

  return {
    type: 'custom',
    graphics: graphics,
    content: graphics.container,
    modes: [
      {
        mode: 'last',
        label,
        defaultMode: defaultMode === 'last',
        command: () => 'wrk last',
        echo: true,
        noHistory: false
      },
      {
        mode: 'history',
        defaultMode: defaultMode === 'history',
        command: () => 'wrk history',
        echo: true,
        noHistory: false
      }
    ]
  }
}
