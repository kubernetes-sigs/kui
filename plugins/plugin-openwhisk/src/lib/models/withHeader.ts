/*
 * Copyright 2017-2018 IBM Corporation
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

import { DefaultExecOptions, ExecOptions } from '@kui-shell/core/models/execOptions'
import { Table, Row } from '@kui-shell/core/webapp/models/table'

/**
 * Maybe add a header row for tables. If this is a nested call,
 * i.e. some other plugin is calling us for the data rather than the
 * model, make sure not to add a header --- unless that other plugin
 * actually wants us to add the header (showHeader).
 *
 */
export default (rows: Row[], execOptions: ExecOptions = new DefaultExecOptions()): Table => {
  if (rows.length === 0 || (!execOptions.showHeader && (execOptions.nested || rows[0].type === 'activations'))) {
    return { body: rows }
  } else {
    const cell = (value, outerCSS = '') => [{ value, outerCSS: `header-cell ${outerCSS}` }]
    const maybeCell = (field: string, value: string, outerCSS?: string) => (rows[0][field] ? cell(value, outerCSS) : [])

    const type = rows[0].prettyType || rows[0].type
    const kind = type === 'actions' ? maybeCell('type', 'kind', 'entity-kind') : []
    const active = type === 'rules' ? cell('status') : []
    const version =
      type === 'rules' ? cell('rule', 'hide-with-sidecar') : maybeCell('version', 'version', 'hide-with-sidecar')

    const header: Row = {
      type,
      name: 'name',
      onclick: false,
      outerCSS: 'header-cell',
      attributes: kind.concat(active).concat(version)
    }

    return { header, body: rows, title: rows[0].prettyType || type, noSort: true }
  }
}
