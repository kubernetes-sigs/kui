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
const debug = Debug('k8s/view/formatMultiTable')

import drilldown from '@kui-shell/core/webapp/picture-in-picture'
import { getActiveView as getActiveSidecarView } from '@kui-shell/core/webapp/views/sidecar'
import { formatMultiListResult } from '@kui-shell/core/webapp/views/table'

/** this will help us with finding our own view instances */
const attr = 'k8s-table'

export const getActiveView = () => {
  return getActiveSidecarView().querySelector(`[${attr}]`)
}

/**
 * Update table for picture-in-picture style drilldowns
 *
 */
const updateTableForPip = (viewName: string, execOptions) => (table: Array<any>) => {
  debug('pip update for table', table)

  table.forEach(row => {
    if (row.onclick) {
      const command = row.onclick
      row.onclick = (evt: Event) => {
        return drilldown(command, undefined, getActiveView(), viewName, { execOptions })(evt)
      }
    }

    if (row.attributes) {
      row.attributes.forEach(attr => {
        if (attr.onclick) {
          const command = attr.onclick
          attr.onclick = (evt: Event) => {
            return drilldown(command, undefined, getActiveView(), viewName, { execOptions })(evt)
          }
        }
      })
    }
  })
}

/**
 * Return a multi-table view for the given table model
 *
 */
export const formatTable = (model: Array<any>, { usePip = false, viewName = 'previous view', execOptions = {} } = {}): HTMLElement => {
  debug('formatTable', model)

  const resultDomOuter = document.createElement('div')
  if (model.length > 0) {
    const resultDom = document.createElement('div')

    // e.g. establish an attribute [k8s-table="Containers"]
    resultDomOuter.setAttribute(attr, (model[0] && model[0][0] && model[0][0].title) || model[0] && model[0].title)

    // modify onclick links to use the "picture in picture" drilldown module
    if (usePip) {
      debug('pip update')

      if (Array.isArray(model[0])) {
        model.forEach(updateTableForPip(viewName, execOptions))
      } else {
        updateTableForPip(viewName, execOptions)(model)
      }
    }

    resultDomOuter.classList.add('result-vertical')
    resultDomOuter.classList.add('padding-content')
    resultDomOuter.classList.add('scrollable')
    resultDomOuter.classList.add('scrollable-auto')
    resultDomOuter.appendChild(resultDom)

    resultDom.classList.add('result-as-table')
    resultDom.classList.add('result-as-fixed-tables')
    resultDom.classList.add('repl-result')
    resultDom.classList.add('monospace')

    if (Array.isArray(model[0])) {
      formatMultiListResult(model, resultDom)
    } else {
      formatMultiListResult([ model ], resultDom)
            // formatListResult(model).forEach(row => resultDom.appendChild(row));
    }
  }

  return resultDomOuter
}
