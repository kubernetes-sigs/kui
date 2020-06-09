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

import * as React from 'react'
import { Tab, REPL, Table, isWatchable } from '@kui-shell/core'
import { KuiContext } from '../../../'

import PaginatedTable from './PaginatedTable'
import LivePaginatedTable from './LivePaginatedTable'

export default function renderTable(
  tab: Tab,
  repl: REPL,
  response: Table,
  paginate: boolean | number = 20,
  toolbars = false,
  asGrid = false,
  onRender?: (hasContent: boolean) => void
) {
  if (isWatchable(response)) {
    return (
      <KuiContext.Consumer>
        {config => (
          <LivePaginatedTable
            tab={tab}
            repl={repl}
            response={response}
            paginate={paginate}
            title={!config.disableTableTitle}
            toolbars={toolbars}
            asGrid={asGrid}
            onRender={onRender}
          />
        )}
      </KuiContext.Consumer>
    )
  } else {
    return (
      <KuiContext.Consumer>
        {config => {
          return (
            <PaginatedTable
              tab={tab}
              repl={repl}
              response={response}
              paginate={paginate}
              title={!config.disableTableTitle}
              toolbars={toolbars}
              asGrid={asGrid}
            />
          )
        }}
      </KuiContext.Consumer>
    )
  }
}
