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

import { Table } from '@kui-shell/core'

import React from 'react'
import { Thead, Th, Tr } from '@patternfly/react-table'

function th(key: string, value: string, outerCSS: string, css?: string) {
  return (
    <Th key={key || value} data-key={key || value} className={`kui--header-cell ${outerCSS || ''}`}>
      {css ? <span className={css}>{value}</span> : value}
    </Th>
  )
}

/**
 * Render the TableHeader part
 *
 */
export default function renderHeader(kuiHeader: Table['header']) {
  // isSortable: cidx > 0 || kuiHeader.isSortable,
  return (
    <Thead>
      <Tr>
        {th(kuiHeader.key, kuiHeader.name, kuiHeader.outerCSS, kuiHeader.css)}
        {kuiHeader.attributes.map(attr => th(attr.key, attr.value, attr.outerCSS, attr.css))}
      </Tr>
    </Thead>
  )
}
