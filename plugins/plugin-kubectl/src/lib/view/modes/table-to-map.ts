/*
 * Copyright 2019 IBM Corporation
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

/**
 * Turn a one-row Table into a Map
 *
 */
export default function toMap(table: Table): Record<string, string> {
  return table.body.reduce((map, row) => {
    map[row.key] = row.name

    row.attributes.forEach(({ key, value }) => {
      map[key] = value
    })

    return map
  }, {} as Record<string, string>)
}
