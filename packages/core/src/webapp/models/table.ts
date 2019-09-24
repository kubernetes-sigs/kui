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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { Watchable } from './basicModels'
import { sortBody } from '../views/table'
import { Entity } from '../../models/entity'

export class Row {
  attributes?: Cell[]

  name: string

  nameDom?: Element

  type?: string

  packageName?: string

  prettyType?: string

  fontawesome?: string

  fontawesomeCSS?: string

  setSelected?: () => void

  setUnselected?: () => void

  nameCss?: string | string[]

  key?: string

  prettyName?: string

  fullName?: string

  kind?: string

  prettyKind?: string

  status?: string

  version?: string

  prettyVersion?: string

  beforeAttributes?: Cell[]

  rowCSS?: string | string[]

  onclickExec?: 'pexec' | 'qexec'

  onclick?: any // eslint-disable-line @typescript-eslint/no-explicit-any

  css?: string

  outerCSS?: string

  done?: boolean

  constructor(row: Row) {
    Object.assign(this, row)
  }
}

export class Cell {
  value: string

  valueDom?: Node[] | Node

  css?: string

  outerCSS?: string

  onclick?: any // eslint-disable-line @typescript-eslint/no-explicit-any

  key?: string

  fontawesome?: string[] | string

  tag?: string

  tagClass?: string

  innerClassName?: string

  className?: string

  parent?: HTMLElement

  constructor(cell: Cell) {
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

  constructor(table: Table) {
    Object.assign(this, table)
  }
}

export interface WatchableTable extends Table, Watchable {}

export function isTable(model: Entity): model is Table {
  return (
    model !== undefined && (model instanceof Table || ((model as Table).body && Array.isArray((model as Table).body)))
  )
}

export interface MultiTable {
  tables: Table[]
}

export function isMultiTable(model: Entity): model is MultiTable {
  return (
    model !== undefined &&
    (model as MultiTable).tables !== undefined &&
    Array.isArray((model as MultiTable).tables) &&
    (model as MultiTable).tables.length >= 1 &&
    (model as MultiTable).tables.filter(table => !isTable(table)).length === 0
  )
}

export type WatchableMultiTable = MultiTable & Watchable

export function formatWatchableTable(model: Table | MultiTable, watch: Watchable) {
  if (isTable(model) || isMultiTable(model)) {
    return Object.assign(model, watch)
  } else {
    // TODO: we might need to consider the variance of model, throw error for now
    throw new Error('models other than table(s) are not supported in watch mode yet')
  }
}

export class Icon {
  fontawesome: string

  onclick?: (evt: Event) => void

  balloon?: string

  balloonLength?: string

  balloonPos?: string

  constructor(icon: Icon) {
    Object.assign(this, icon)
  }
}

interface RowUpdate {
  model: Row
  updateIndex: number
}

interface RowInsertion {
  model: Row
  insertBeforeIndex: number
}

interface RowDeletion {
  model: Row
  deleteIndex: number
}

export interface RowDiff {
  rowUpdate: RowUpdate[]
  rowDeletion: RowDeletion[]
  rowInsertion: RowInsertion[]
}

/**
 * diff two rows model
 * @param refreshRows is the rows model returned by refreshing
 */
export function diffTableRows(existingRows: Row[], refreshRows: Row[]): RowDiff {
  // find rows in the existing rows but not in the refreshed rows
  const rowDeletion: RowDeletion[] = existingRows
    .map((row, index) => {
      return { deleteIndex: index, model: row }
    })
    .filter(_ => !refreshRows.find(row => row.name === _.model.name))

  // find the rows whose name appear in both the existing and refreshed rows, but are different in nature
  const rowUpdate: RowUpdate[] = refreshRows
    .filter(row => existingRows.some(_ => _.name === row.name))
    .map(row => {
      const index = existingRows.findIndex(_ => _.name === row.name)
      const doUpdate = JSON.stringify(row) !== JSON.stringify(existingRows[index])
      if (doUpdate) return { updateIndex: index, model: row }
    })
    .filter(x => x)

  // find the rows which are not in the existing rows, to get the insertion index, first concat with the existing rows, then sort
  const rowInsertion: RowInsertion[] = sortBody(
    refreshRows.filter(row => !existingRows.some(_ => _.name === row.name)).concat(existingRows)
  )
    .map((row, index) => {
      return { insertBeforeIndex: index + 1, model: row }
    })
    .filter(row => !existingRows.some(_ => _.name === row.model.name))

  return { rowUpdate, rowDeletion, rowInsertion }
}
