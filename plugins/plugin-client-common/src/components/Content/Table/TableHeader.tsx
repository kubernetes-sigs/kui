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

import { Row as KuiRow } from '@kui-shell/core'

import React from 'react'
import { DataTableCustomRenderProps, TableHead, TableRow, TableHeader } from 'carbon-components-react'

/**
 * Render the TableHeader part
 *
 */
export default function renderHeader(kuiHeader: KuiRow, { getHeaderProps, headers }: DataTableCustomRenderProps) {
  return (
    <TableHead>
      <TableRow>
        {headers.map((header, cidx) => {
          const outerCSS = cidx === 0 ? kuiHeader.outerCSS : kuiHeader.attributes[cidx - 1].outerCSS
          const css = cidx === 0 ? kuiHeader.css : kuiHeader.attributes[cidx - 1].css

          return (
            <TableHeader
              key={header.key}
              {...getHeaderProps({
                header,
                'data-key': header.key,
                // isSortable: isSortable,
                className: `kui--header-cell ${outerCSS || ''}`
              })}
            >
              {css ? <span className={css}>{header.header}</span> : header.header}
            </TableHeader>
          )
        })}
      </TableRow>
    </TableHead>
  )
}
