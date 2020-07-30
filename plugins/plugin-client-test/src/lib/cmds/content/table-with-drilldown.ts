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

export const firstSeen = 'FIRST SEEN'

export default (): Table => ({
  title: 'noTitle',
  statusColumnIdx: 2,
  breadcrumbs: [{ label: 'noBreadcrumb' }],
  noSort: true,
  header: { name: 'NAME', attributes: [{ value: 'FOO' }, { value: firstSeen }] },
  body: [
    {
      name: 'TestString',
      onclick: `test string`,
      attributes: [{ value: 'foo' }, { key: firstSeen, value: '5', css: 'green-background', tag: 'badge' }]
    },
    {
      name: 'TestTable',
      onclick: `test table`,
      attributes: [{ value: 'foo' }, { key: firstSeen, value: '5', css: 'green-background', tag: 'badge' }]
    },
    {
      name: 'TestMMRName',
      onclick: `test mmr name`,
      attributes: [{ value: 'foo' }, { key: firstSeen, value: '5', css: 'green-background', tag: 'badge' }]
    },
    {
      name: 'TestMMRModeSilence',
      onclick: `test mmr mode`,
      onclickSilence: true,
      attributes: [{ value: 'foo' }, { key: firstSeen, value: '5', css: 'green-background', tag: 'badge' }]
    }
  ]
})

export const durationTable = (): Table => ({
  title: 'noTitle',
  durationColumnIdx: 1,
  breadcrumbs: [{ label: 'noBreadcrumb' }],
  noSort: true,
  header: { name: 'Name', attributes: [{ value: 'Foo' }, { value: 'Duration' }] },
  body: [
    {
      name: 'test 1',
      attributes: [{ value: 'foo' }, { value: '1000' }]
    },
    {
      name: 'test 2',
      attributes: [{ value: 'foo' }, { value: '2000' }]
    },
    {
      name: 'test 3',
      attributes: [{ value: 'foo' }, { value: '3000' }]
    },
    {
      name: 'test 4',
      onclickSilence: true,
      attributes: [{ value: 'foo' }, { value: '4000' }]
    },
    {
      name: 'test 5',
      onclick: `test string`,
      attributes: [{ value: 'foo' }, { value: '5000' }]
    },
    {
      name: 'test 6',
      attributes: [{ value: 'foo' }, { value: '6000' }]
    },
    {
      name: 'test 7',
      attributes: [{ value: 'foo' }, { value: '7000' }]
    },
    {
      name: 'test 8',
      attributes: [{ value: 'foo' }, { value: '8000' }]
    },
    {
      name: 'test 9',
      attributes: [{ value: 'foo' }, { value: '9000' }]
    },
    {
      name: 'test 10',
      attributes: [{ value: 'foo' }, { value: '10000' }]
    },
    {
      name: 'test 11',
      attributes: [{ value: 'foo' }, { value: '11000' }]
    },
    {
      name: 'test 12',
      attributes: [{ value: 'foo' }, { value: '12000' }]
    },
    {
      name: 'test 13',
      attributes: [{ value: 'foo' }, { value: '13000' }]
    },
    {
      name: 'test 14',
      attributes: [{ value: 'foo' }, { value: '14000' }]
    },
    {
      name: 'test 15',
      attributes: [{ value: 'foo' }, { value: '15000' }]
    },
    {
      name: 'test 16',
      attributes: [{ value: 'foo' }, { value: '16000' }]
    },
    {
      name: 'test 17',
      attributes: [{ value: 'foo' }, { value: '17000' }]
    },
    {
      name: 'test 18',
      attributes: [{ value: 'foo' }, { value: '18000' }]
    },
    {
      name: 'test 19',
      attributes: [{ value: 'foo' }, { value: '19000' }]
    },
    {
      name: 'test 20',
      attributes: [{ value: 'foo' }, { value: '20000' }]
    },
    {
      name: 'test 21',
      attributes: [{ value: 'foo' }, { value: '21000' }]
    }
  ]
})
