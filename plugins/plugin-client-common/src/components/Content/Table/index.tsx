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

import React from 'react'
import type { Tab, REPL, Table } from '@kui-shell/core'
import { isWatchable } from '@kui-shell/core/mdist/api/Watch'
import { KuiContext } from '../../../'

const PaginatedTable = React.lazy(() => import('./PaginatedTable'))
const LivePaginatedTable = React.lazy(() => import('./LivePaginatedTable'))

export default function renderTable(
  tab: Tab,
  repl: REPL,
  response: Table,
  paginate: boolean | number = 20,
  toolbars = false,
  asGrid = false,
  onRender?: (hasContent: boolean) => void,
  isWidthConstrained = false
) {
  if (isWatchable(response)) {
    return (
      <React.Suspense fallback={<div />}>
        <KuiContext.Consumer>
          {config => (
            <LivePaginatedTable
              tab={tab}
              repl={repl}
              config={config}
              response={response}
              paginate={paginate}
              title={!config.disableTableTitle}
              toolbars={toolbars}
              asGrid={asGrid}
              onRender={onRender}
              isWidthConstrained={isWidthConstrained}
            />
          )}
        </KuiContext.Consumer>
      </React.Suspense>
    )
  } else {
    return (
      <React.Suspense fallback={<div />}>
        <KuiContext.Consumer>
          {config => {
            return (
              <PaginatedTable
                tab={tab}
                repl={repl}
                config={config}
                response={response}
                paginate={paginate}
                title={!config.disableTableTitle}
                toolbars={toolbars}
                asGrid={asGrid}
                onRender={onRender}
                isWidthConstrained={isWidthConstrained}
              />
            )
          }}
        </KuiContext.Consumer>
      </React.Suspense>
    )
  }
}
