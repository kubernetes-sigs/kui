/*
 * Copyright 2021 The Kubernetes Authors
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

import { Row, Table } from '@kui-shell/core'
import { SortByDirection } from '@patternfly/react-table'

const byte = 1
const kilobyte = 1024 * byte
const megabyte = 1024 * kilobyte
const gigabyte = 1024 * megabyte
const terabyte = 1024 * gigabyte
const petabyte = 1024 * terabyte
const exabyte = 1024 * petabyte
const sizes = { B: byte, K: kilobyte, M: megabyte, G: gigabyte, T: terabyte, P: petabyte, E: exabyte }

function toSize(val: string): number {
  const last = val.charAt(val.length - 1)
  const mult = sizes[last] || exabyte

  return mult * parseInt(val.slice(0, val.length - 2), 10)
}

function sortBySize(rowA: Row, rowB: Row, cidx: number, dir: number): number {
  const cellA = rowA.attributes[cidx - 1].value
  const cellB = rowB.attributes[cidx - 1].value

  return (toSize(cellA) - toSize(cellB)) * dir
}

function sortRowWithDir(rowA: Row, rowB: Row, key: string, cidx: number, direction: SortByDirection): number {
  const dir = direction === 'asc' ? 1 : -1
  if (key === 'SIZE') {
    return sortBySize(rowA, rowB, cidx, dir)
  } else {
    const isName = key === 'NAME'
    const valA = isName ? rowA.name : rowA.attributes[cidx - 1].value
    const valB = isName ? rowB.name : rowB.attributes[cidx - 1].value
    return valA.localeCompare(valB) * dir
  }
}

export default function sortRow(rowA: Row, rowB: Row, key: string, cidx: number, direction: SortByDirection): number {
  return sortRowWithDir(rowA, rowB, key.toUpperCase(), cidx, direction)
}

/**
 * The logic here: don't bother sorting for 1-entry tables, or for
 * columns with all the same value.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isSortableCol(key: string, cidx: number, kuiBody: Table['body']) {
  if (kuiBody.length <= 1) {
    return false
  } else {
    if (cidx === 0) {
      const val0 = kuiBody[0].name
      return !kuiBody.every(_ => _.name === val0)
    } else {
      const val0 = kuiBody[0].attributes[cidx - 1].value
      return !kuiBody.every(_ => _.attributes[cidx - 1].value === val0)
    }
  }
}
