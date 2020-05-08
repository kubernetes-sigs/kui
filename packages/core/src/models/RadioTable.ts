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

import { KResponse } from './command'
import CellShould from './CellShould'

interface RadioTable {
  apiVersion: 'kui-shell/v1'
  kind: 'RadioTable'

  title: string
  header: RadioTableRow
  body: (RadioTableRow & Selectable)[]

  defaultSelectedIdx: number
}

export interface RadioTableRow {
  name?: string
  cells: RadioTableCell[]
}

export interface Selectable {
  onSelect: () => Promise<void>
}

export type RadioTableCell =
  | string
  | {
      key?: string
      value: string

      /** optional hints to improve rendering of the cells */
      hints?: CellShould | CellShould[]
    }

export function isRadioTable(response: KResponse): response is RadioTable {
  if (typeof response === 'object') {
    const table = response as RadioTable
    return table.apiVersion === 'kui-shell/v1' && table.kind === 'RadioTable'
  } else {
    return false
  }
}

export default RadioTable
