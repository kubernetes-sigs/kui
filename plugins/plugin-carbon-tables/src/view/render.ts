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

import { render as ReactDomRender } from 'react-dom'
import { Tab, REPL, Table as KuiTable, KuiComponent } from '@kui-shell/core'

import renderTable from './LivePaginatedTable'

/** import the kui theme alignment */
import '../../web/css/static/carbon-kui-theme-alignment.css'

/**
 * Format the table view
 *
 */
export function doReact(tab: Tab, repl: REPL, response: KuiTable) {
  // Note: the wrapper is needed to get React events to work; it seems
  // not to work with a DocumentFragment
  const wrapper = document.createElement('div') // <-- temporarily wrap for React
  ReactDomRender(renderTable(tab, repl, response), wrapper)

  const content = document.createDocumentFragment()
  content.appendChild(wrapper.firstElementChild) // <-- then unwrap
  return content
}

/**
 * Render the table, then return a KuiComponent
 *
 */
export default function render(entity: KuiTable, tab: Tab, repl: REPL): KuiComponent {
  return {
    apiVersion: 'kui-shell/component/v1' as const,
    spec: {
      content: doReact(tab, repl, entity)
    }
  }
}
