/*
 * Copyright 2019 The Kubernetes Authors
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

export interface LabelValue {
  label: string
}

export type FormMap = Record<string, number | string | LabelValue>

export function capitalize(str: string) {
  return str === 'IP' ? str : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Turn a one-row Table into a Map
 *
 */
export default function toMap(table: Table): FormMap {
  return table.body.reduce((map, row) => {
    map[capitalize(row.key)] = row.name

    row.attributes.forEach(({ key, value }) => {
      map[capitalize(key)] = value
    })

    return map
  }, {} as Record<string, string>)
}
