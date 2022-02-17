/*
 * Copyright 2020 The Kubernetes Authors
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

import { Table } from '@kui-shell/core'

import React from 'react'
import { SortByDirection, Thead, Th, Tr } from '@patternfly/react-table'

import { isSortableCol } from './sort'

/**
 * Render the TableHeader part
 *
 */
export default function renderHeader(
  kuiHeader: Table['header'],
  kuiBody: Table['body'],
  isSortable: boolean,
  activeSortIdx: number,
  direction: SortByDirection,
  onSort: (key: string, cidx: number, sortCIdx: number, sortDir: SortByDirection) => void
) {
  const th = (key: string, value: string, cidx: number, outerCSS: string, css?: string) => {
    const dataKey = key || value

    const sortParam =
      isSortable && isSortableCol(dataKey, cidx, kuiBody)
        ? {
            sort: {
              sortBy: { index: activeSortIdx, direction },
              onSort: (_, clickColIdx: number, clickDir: SortByDirection) =>
                onSort(dataKey, cidx, clickColIdx, clickDir),
              columnIndex: cidx
            }
          }
        : {}

    // nowrap seems to be needed to avoid PatternFly using a "truncate"
    // mode; see TableCell, where we set "fitContent" as the modifier
    // for the cells; but that alone seems to cause truncation in the
    // header :( hence this "nowrap". A bit puzzling.
    return (
      <Th
        key={key || value}
        data-key={key || value}
        className={`kui--header-cell ${outerCSS || ''}`}
        modifier="nowrap"
        {...sortParam}
      >
        {css ? <span className={css}>{value}</span> : value}
      </Th>
    )
  }

  return (
    <Thead>
      <Tr>
        {th(kuiHeader.key, kuiHeader.name, 0, kuiHeader.outerCSS, kuiHeader.css)}
        {kuiHeader.attributes.map((attr, cidx) => th(attr.key, attr.value, cidx + 1, attr.outerCSS, attr.css))}
      </Tr>
    </Thead>
  )
}
