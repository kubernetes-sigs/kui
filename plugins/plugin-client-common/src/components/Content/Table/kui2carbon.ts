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

import { Row as KuiRow, Table as KuiTable } from '@kui-shell/core'
import { DataTableHeader, DataTableRow } from 'carbon-components-react'

export interface NamedDataTableRow extends DataTableRow {
  NAME: string
  rowKey: string
  justUpdated: boolean
}

export function kuiHeaderFromBody(body: KuiTable['body']): KuiTable['header'] {
  if (body.length > 0) {
    const attributes = (body[0].attributes || []).map(({ key, value }) => ({
      key: key || value,
      value: key || value
    }))
    return { key: body[0].key, name: body[0].name, attributes }
  }
}

/** attempt to infer header model from body model */
function headerFromBody(table: KuiTable) {
  if (table.body.length > 0) {
    const attrs = (table.body[0].attributes || []).map(({ key, value }) => ({
      key: key || value,
      header: key || value
    }))
    const headers = [{ key: 'Name', header: 'Name' }, ...attrs]
    table.header = {
      name: 'Name',
      attributes: attrs.map(({ key }) => ({ key, value: key }))
    }
    return headers
  } else {
    return []
  }
}

/**
 * Schema-align a Kui header model to one that works with the Carbon
 * DataTable.
 *
 */
export function kuiHeader2carbonHeader(header: KuiRow): DataTableHeader[] {
  return [{ key: header.key || header.name, header: header.name }].concat(
    header.attributes.map(({ key, value }, cidx) => ({ key: `${key || value}-${cidx}`, header: value }))
  )
}

/**
 * Schema-align a KuiRow model to one that works with the Carbon
 * DataTable.
 *
 */
export function kuiRow2carbonRow(headers: DataTableHeader[], justUpdated = false) {
  return (row: KuiRow, ridx: number): NamedDataTableRow => {
    const isSelected = row.rowCSS ? row.rowCSS.includes('selected-row') : false

    const rowData = { id: ridx.toString(), rowKey: row.rowKey || row.name, isSelected, NAME: '', justUpdated }
    rowData[headers[0].key] = row.name

    if (!row.key) {
      row.key = headers[0].key
    }

    if (!row.attributes) row.attributes = []
    row.attributes.forEach((attr, cidx) => {
      const kkey = attr.key || headers[cidx + 1] ? headers[cidx + 1].key : undefined
      if (!attr.key && kkey) {
        attr.key = kkey
      }
      rowData[kkey] = attr.value
    })

    if (!rowData.NAME) {
      const nameColumnIdx = headers.findIndex(_ => /Name/i.test(_.key))
      if (nameColumnIdx >= 0) {
        rowData.NAME = nameColumnIdx === 0 ? row.name : row.attributes[nameColumnIdx - 1].value
      }
    }

    return rowData
  }
}

/**
 * Align the KuiTable model to something more convenient for Carbon
 * Components.
 *
 */
export default function kui2carbon(
  response: KuiTable
): { headers: DataTableHeader[]; rows: NamedDataTableRow[]; footer: string[] } {
  // align header model
  const headers = !response.header ? headerFromBody(response) : kuiHeader2carbonHeader(response.header)

  // align body model
  const rows = response.body.map(kuiRow2carbonRow(headers))

  return { headers, rows, footer: response.footer }
}
