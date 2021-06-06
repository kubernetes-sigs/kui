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

import { i18n, Table, Tab, REPL } from '@kui-shell/core'

import React from 'react'
import { Tbody, Tr, Td } from '@patternfly/react-table'
import { EmptyState, EmptyStateVariant, Bullseye, Title, EmptyStateIcon } from '@patternfly/react-core'
import { SearchIcon } from '@patternfly/react-icons'

import renderCell from './TableCell'
import KuiConfiguration from '../../Client/KuiConfiguration'

const strings = i18n('plugin-client-common')

/**
 * Render the TableBody part
 *
 * @param offset offset into the kuiTable.body model
 *
 */
export default function renderBody(
  kuiTable: Table,
  justUpdated: Record<string, boolean>, // rowKey index
  tab: Tab,
  repl: REPL,
  offset: number,
  config: KuiConfiguration
) {
  const emptyState = () => {
    return (
      <Tr>
        <Td data-is-empty={true} colSpan={kuiTable.header ? kuiTable.header.attributes.length + 1 : 0}>
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={SearchIcon} />
              <Title headingLevel="h2" size="lg">
                {strings('No results found')}
              </Title>
            </EmptyState>
          </Bullseye>
        </Td>
      </Tr>
    )
  }
  return (
    <Tbody>
      {kuiTable.body.length === 0
        ? emptyState()
        : kuiTable.body.map((kuiRow, ridx) => {
            const updated = justUpdated[kuiRow.rowKey || kuiRow.name]
            const cell = renderCell(kuiTable, kuiRow, updated, tab, repl, config)

            const key = kuiRow.key || (kuiTable.header ? kuiTable.header.key || kuiTable.header.name : undefined)

            return (
              <Tr key={ridx} data-row-key={kuiRow.rowKey} data-name={kuiTable.body[offset + ridx].name}>
                {cell(key, kuiRow.name, undefined, kuiRow.outerCSS, kuiRow.css, kuiRow.onclick, 0)}
                {kuiRow.attributes &&
                  kuiRow.attributes.map((attr, idx) =>
                    cell(attr.key, attr.value, attr.tag, attr.outerCSS, attr.css, attr.onclick, idx + 1)
                  )}
              </Tr>
            )
          })}
    </Tbody>
  )
}
