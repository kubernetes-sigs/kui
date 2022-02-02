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

import React from 'react'
import { TableRowProps, TableCellProps } from 'react-markdown/lib/ast-to-react'
import { TableComposable, Thead, Tbody, Th, Tr, Td } from '@patternfly/react-table'

export function table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <TableComposable variant="compact" className={props.className + ' kui--table-like'}>
      {props.children}
    </TableComposable>
  )
}

export function thead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <Thead className={props.className}>{props.children}</Thead>
}

export function tbody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <Tbody className={props.className}>{props.children}</Tbody>
}

export function tr(props: TableRowProps) {
  return <Tr className={props.className}>{props.children}</Tr>
}

export function th(props: TableCellProps) {
  // hmm, without modifier=wrap, PatternFly (or is it electron
  // 13?)... if the td content is narrower than the th content, they
  // seem to favor favor ellipsis for that wider column header. This
  // looks especially bad if the td content is quite narrow.
  return (
    <Th className={props.className} modifier="wrap">
      {props.children}
    </Th>
  )
}

export function td(props: TableCellProps) {
  return <Td className={props.className}>{props.children}</Td>
}
