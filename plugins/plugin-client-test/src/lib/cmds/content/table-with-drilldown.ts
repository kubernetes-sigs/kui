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
  statusColumnIdx: 1,
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
    },
    {
      name: 'test 22',
      attributes: [{ value: 'foo' }, { value: '22000' }]
    },
    {
      name: 'test 23',
      attributes: [{ value: 'foo' }, { value: '23000' }]
    },
    {
      name: 'test 24',
      attributes: [{ value: 'foo' }, { value: '24000' }]
    },
    {
      name: 'test 25',
      attributes: [{ value: 'foo' }, { value: '25000' }]
    },
    {
      name: 'test 26',
      attributes: [{ value: 'foo' }, { value: '26000' }]
    },
    {
      name: 'test 27',
      attributes: [{ value: 'foo' }, { value: '27000' }]
    },
    {
      name: 'test 28',
      attributes: [{ value: 'foo' }, { value: '28000' }]
    },
    {
      name: 'test 29',
      attributes: [{ value: 'foo' }, { value: '29000' }]
    },
    {
      name: 'test 30',
      attributes: [{ value: 'foo' }, { value: '30000' }]
    },
    {
      name: 'test 31',
      attributes: [{ value: 'foo' }, { value: '31000' }]
    },
    {
      name: 'test 32',
      attributes: [{ value: 'foo' }, { value: '32000' }]
    },
    {
      name: 'test 33',
      attributes: [{ value: 'foo' }, { value: '33000' }]
    },
    {
      name: 'test 34',
      attributes: [{ value: 'foo' }, { value: '34000' }]
    },
    {
      name: 'test 35',
      attributes: [{ value: 'foo' }, { value: '35000' }]
    },
    {
      name: 'test 36',
      attributes: [{ value: 'foo' }, { value: '36000' }]
    },
    {
      name: 'test 37',
      attributes: [{ value: 'foo' }, { value: '37000' }]
    },
    {
      name: 'test 38',
      attributes: [{ value: 'foo' }, { value: '38000' }]
    },
    {
      name: 'test 39',
      attributes: [{ value: 'foo' }, { value: '39000' }]
    },
    {
      name: 'test 40',
      attributes: [{ value: 'foo' }, { value: '40000' }]
    },
    {
      name: 'test 41',
      attributes: [{ value: 'foo' }, { value: '41000' }]
    },
    {
      name: 'test 42',
      attributes: [{ value: 'foo' }, { value: '42000' }]
    },
    {
      name: 'test 43',
      attributes: [{ value: 'foo' }, { value: '43000' }]
    },
    {
      name: 'test 44',
      attributes: [{ value: 'foo' }, { value: '44000' }]
    },
    {
      name: 'test 45',
      attributes: [{ value: 'foo' }, { value: '45000' }]
    },
    {
      name: 'test 46',
      attributes: [{ value: 'foo' }, { value: '46000' }]
    },
    {
      name: 'test 47',
      attributes: [{ value: 'foo' }, { value: '47000' }]
    },
    {
      name: 'test 48',
      attributes: [{ value: 'foo' }, { value: '48000' }]
    },
    {
      name: 'test 49',
      attributes: [{ value: 'foo' }, { value: '49000' }]
    },
    {
      name: 'test 50',
      attributes: [{ value: 'foo' }, { value: '50000' }]
    }
  ]
})

export const sequenceDiagram = (): Table => {
  return {
    title: 'noTitle',
    statusColumnIdx: 1,
    startColumnIdx: 1,
    completeColumnIdx: 2,
    breadcrumbs: [{ label: 'noBreadcrumb' }],
    noSort: true,
    header: { name: 'Name', attributes: [{ value: 'Status' }, { value: 'Start' }, { value: 'End' }] },
    body: [
      {
        name: 'test 1',
        attributes: [
          { value: 'Running', css: 'green-background', tag: 'badge' },
          { value: 'Mon Aug 10 2020 15:10:58' },
          { value: 'Mon Aug 10 2020 15:13:13' }
        ]
      },
      {
        name: 'test 2',
        attributes: [
          { value: 'Running', css: 'green-background', tag: 'badge' },
          { value: 'Mon Aug 10 2020 15:10:30' },
          { value: 'Mon Aug 10 2020 15:13:52' }
        ]
      },
      {
        name: 'test 3',
        attributes: [
          { value: 'Error', css: 'red-background', tag: 'badge' },
          { value: 'Mon Aug 10 2020 15:10:23' },
          { value: 'Mon Aug 10 2020 15:14:19 ' }
        ]
      },
      {
        name: 'test 4',
        onclickSilence: true,
        attributes: [
          { value: 'Running', css: 'green-background', tag: 'badge' },
          { value: 'Mon Aug 10 2020 15:10:08' },
          { value: 'Mon Aug 10 2020 15:13:38' }
        ]
      },
      {
        name: 'test 5',
        onclick: `test string`,
        attributes: [
          { value: 'Error', css: 'red-background', tag: 'badge' },
          { value: 'Mon Aug 10 2020 15:10:28' },
          { value: 'Mon Aug 10 2020 15:14:26 ' }
        ]
      }
    ]
  }
}
