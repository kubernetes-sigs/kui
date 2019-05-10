/*
 * Copyright 2019 IBM Corporation
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

export class Row {
  attributes?: Cell[]
  name: string
  type?: string
  packageName?: string
  prettyType?: string
  watch?: any
  fontawesome?: string
  fontawesomeCSS?: string
  setSelected?: () => void
  setUnselected?: () => void
  nameCss?: any
  key?: string
  prettyName?: string
  fullName?: string
  kind?: string
  prettyKind?: string
  status?: string
  version?: string
  prettyVersion?: string
  beforeAttributes?: Cell[]
  rowCSS?: string | Array<string>
  onclick?: any
  css?: string
  outerCSS?: string

  constructor (row: Row) {
    Object.assign(this, row)
  }
}

export class Cell {
  value: string
  valueDom?: Node[] | Node
  css?: string
  outerCSS?: string
  onclick?: any
  key?: string
  watch?: any
  watchLimit?: number
  fontawesome?: string[] | string
  tag?: string
  tagClass?: string
  innerClassName?: string
  className?: string
  parent?: HTMLElement

  constructor (cell: Cell) {
    Object.assign(this, cell)
  }
}

export interface Button {
  name: string
  fontawesome: string
  balloon?: string
  onclick: (evt: Event) => void | string
}

export interface Footer {
  leftButtons: Button[]
}

export enum TableStyle {
 Light,
 Medium,
 Heavy
}

export class Table {
  body: Row[]
  type?: string
  style?: TableStyle
  header?: Row
  footer?: Footer
  noSort?: boolean
  noEntityColors?: boolean
  title?: string
  flexWrap?: number | boolean
  tableCSS?: string
  fontawesome?: string
  fontawesomeCSS?: string
  fontawesomeBalloon?: string

  constructor (table: Table) {
    Object.assign(this, table)
  }
}

export function isTable (model: any): model is Table {
  return model !== undefined && (model instanceof Table || (model as Table).body !== undefined)
}

export function isMultiTable (model: any) {
  return model !== undefined && Array.isArray(model) && model.length > 0 && model.filter(m => !isTable(m)).length === 0
}

export class Icon {
  fontawesome: string
  onclick?: (evt: Event) => void
  balloon?: string
  balloonLength?: string
  balloonPos?: string

  constructor (icon: Icon) {
    Object.assign(this, icon)
  }
}
