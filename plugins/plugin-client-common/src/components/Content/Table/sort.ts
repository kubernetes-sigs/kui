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

/* const byte = 1
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

function sortBySize(cellA: string, cellB, dir: number): number {
  return (toSize(cellA) - toSize(cellB)) * dir
}

function sortRowWithDir(cellA: string, cellB: string, key: string, state: DataTableSortState): number {
  const dir = state === 'ASC' ? 1 : state === 'NONE' ? 0 : -1

  if (key === 'SIZE') {
    return sortBySize(cellA, cellB, dir)
  } else {
    return cellA.localeCompare(cellB) * dir
  }
}

export default function sortRow(cellA: string, cellB: string, data: SortRowData): number {
  return sortRowWithDir(cellA, cellB, data.key, data.sortDirection)
}
*/
