/*
 * Copyright 2018-19 IBM Corporation
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

import * as Debug from 'debug'

import { Tab, Tables } from '@kui-shell/core'
import drilldown from '@kui-shell/core/webapp/picture-in-picture'
import { getActiveView as getActiveSidecarView } from '@kui-shell/core/webapp/views/sidecar'

const debug = Debug('k8s/view/formatMultiTable')

/** this will help us with finding our own view instances */
const attr = 'k8s-table'

export const getActiveView = (tab: Tab) => {
  return getActiveSidecarView(tab).querySelector(`[${attr}]`)
}

/**
 * Update table for picture-in-picture style drilldowns
 *
 */
const updateTableForPip = (tab: Tab, viewName: string, execOptions) => (table: Tables.Table) => {
  debug('pip update for table', table)

  table.body.forEach(row => {
    if (row.onclick) {
      const command = row.onclick
      debug('command', command)
      row.onclick = (evt: Event) => {
        return drilldown(tab, command, undefined, getActiveView(tab), viewName, { execOptions })(evt)
      }
    }

    if (row.attributes) {
      row.attributes.forEach(attr => {
        if (attr.onclick) {
          const command = attr.onclick
          attr.onclick = (evt: Event) => {
            return drilldown(tab, command, undefined, getActiveView(tab), viewName, { execOptions })(evt)
          }
        }
      })
    }
  })
}

/**
 * Return a table view for the given table model
 *
 */
export const formatTable = (
  tab: Tab,
  model: Tables.Table | Tables.MultiTable,
  { usePip = false, viewName = 'previous view', execOptions = {} } = {}
): HTMLElement => {
  debug('formatTable model', model)

  const resultDomOuter = document.createElement('div')

  if (Tables.isTable(model) || Tables.isMultiTable(model)) {
    const resultDom = document.createElement('div')

    // e.g. establish an attribute [k8s-table="Containers"]
    resultDomOuter.setAttribute(attr, Tables.isTable(model) ? model.title : model.tables.map(m => m.title).join(' '))

    // modify onclick links to use the "picture in picture" drilldown module
    if (usePip) {
      debug('pip update')
      if (Tables.isTable(model)) {
        updateTableForPip(tab, viewName, execOptions)(model)
      } else {
        model.tables.forEach(updateTableForPip(tab, viewName, execOptions))
      }
    }

    resultDomOuter.classList.add('result-vertical')
    resultDomOuter.classList.add('scrollable')
    resultDomOuter.classList.add('scrollable-auto')
    resultDomOuter.appendChild(resultDom)

    resultDom.classList.add('result-as-table')
    // resultDom.classList.add('result-as-fixed-tables')
    resultDom.classList.add('repl-result')
    resultDom.classList.add('monospace')

    if (Tables.isTable(model)) {
      Tables.format(tab, model, resultDom)
    } else {
      resultDom.classList.add('result-as-multi-table')
      model.tables.forEach(m => Tables.format(tab, m, resultDom))
    }
  }

  return resultDomOuter
}
