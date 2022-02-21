/*
 * Copyright 2022 The Kubernetes Authors
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

import { REPL, Row, isTable } from '@kui-shell/core'

import { CodeBlockResponse } from '.'

function isPrefetchable(row: Row): boolean {
  return row.onclickIdempotent && !!row.onclick
}

export default function prefetchTableRows(responses: CodeBlockResponse[], repl: REPL): Promise<CodeBlockResponse[]> {
  return Promise.all(
    responses.map(async _ => {
      if (_ && isTable(_.response) && _.response.body.length > 0 && _.response.body.find(isPrefetchable)) {
        return Object.assign({}, _, {
          response: Object.assign({}, _.response, {
            body: await Promise.all(
              _.response.body.map(async row => {
                if (isPrefetchable(row)) {
                  try {
                    // great! this row has prefetchable content, let's try
                    // doing so now
                    return Object.assign({}, row, {
                      onclickPrefetch: await repl.pexec(row.onclick, { quiet: true, echo: false, noHistory: true })
                    })
                  } catch (err) {
                    console.error('Error prefetching row drilldown', row, err)
                  }
                }

                // fall-through: return unmodified row content
                return row
              })
            )
          })
        })
      } else {
        return _
      }
    })
  )
}
