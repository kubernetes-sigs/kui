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

import { Tables } from '@kui-shell/core'

export const firstSeen = 'FIRST SEEN'
const icon1 = 'fa-network'
const icon2 = 'fa-times-circle'
const icon3 = 'fa-question-circle'
const icon4 = 'fa-check-circle'

/**
 * @return a string-formed Date from a gien `minusMillis` milliseconds
 * in the past
 *
 */
function deltaOf(minusMillis = 0) {
  const now = new Date().getTime()
  return new Date(now - minusMillis).toLocaleString()
}

export default (): Tables.Table => ({
  noSort: true,
  header: { name: 'name', attributes: [{ value: 'foo' }, { value: firstSeen }] },
  body: [
    {
      name: 'TestString',
      onclick: `test string`,
      attributes: [{ value: 'foo', fontawesome: icon1 }, { key: firstSeen, value: deltaOf(100) }]
    },
    {
      name: 'TestTable',
      onclick: `test table`,
      attributes: [{ value: 'foo', fontawesome: icon2 }, { key: firstSeen, value: deltaOf(5000) }]
    },
    {
      name: 'TestMMRName',
      onclick: `test mmr name`,
      attributes: [{ value: 'foo', fontawesome: icon3 }, { key: firstSeen, value: deltaOf(10000) }]
    },
    {
      name: 'TestMMRModeSilence',
      onclick: `test mmr mode`,
      onclickSilence: true,
      attributes: [{ value: 'foo', fontawesome: icon4 }, { key: firstSeen, value: deltaOf(30000) }]
    }
  ]
})
