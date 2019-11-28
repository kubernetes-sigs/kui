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

/**
 * This file tests "test table" command that expects a table response
 *
 * See the command implementation in: plugin-test/src/lib/cmds/table.ts
 *
 */

import * as assert from 'assert'
import { TestTable } from '@kui-shell/test'
import { firstSeen } from '../../lib/cmds/content/table-with-drilldown'

const test = new TestTable({
  command: 'test table'
})

/** is millisecond delta, e.g. "100ms" */
const deltaPlaceholder = '' // <-- the test rig doesn't care about this value
const isDelta = /^\d+(.\d+)?[m]?s$/

const expectHeaderText = { name: 'NAME', attributes: [{ value: 'FOO' }, { value: firstSeen.toUpperCase() }] }

const firstCol = ['TestString', 'TestTable', 'TestMMRName', 'TestMMRModeSilence']
const expectRow = [
  { name: firstCol[0], onclick: `test string`, attributes: [{ value: 'foo' }, { value: deltaPlaceholder }] },
  { name: firstCol[1], onclick: `test table`, attributes: [{ value: 'foo' }, { value: deltaPlaceholder }] },
  { name: firstCol[2], onclick: `test mmr name`, attributes: [{ value: 'foo' }, { value: deltaPlaceholder }] },
  {
    name: firstCol[3],
    onclick: `test mmr mode`,
    onclickSilence: true,
    attributes: [{ value: 'foo' }, { value: deltaPlaceholder }]
  }
]

const testPoll = new TestTable({
  command: 'test table --watch=poll'
})

test.drilldownFromREPL(
  {
    header: expectHeaderText,
    body: expectRow
  },
  {
    validation: {
      cells: [
        (value: string, rowIdx: number) => {
          assert.strictEqual(value, firstCol[rowIdx])
        },
        (value: string) => {
          assert.strictEqual(value, '') // we expect an icon, no text
        },
        (value: string) => {
          assert.ok(isDelta.test(value), `value should have [nnn]ms pattern ${value}`)
        }
      ]
    }
  }
)

testPoll.drilldownFromREPL({
  header: expectHeaderText,
  body: expectRow.slice(0, 1)
})

const testPush = new TestTable({
  command: 'test table --watch=push'
})

testPush.statusBadge([
  {
    testName: 'should create a new row',
    command: 'test table --watch=push --final-state=createRow1',
    expectRow: [
      { name: 'foo1', badgeCss: 'green-background', badgeText: 'Running', message: 'should create a new row' }
    ]
  },
  {
    testName: 'should terminate the row',
    command: 'test table --watch=push --final-state=terminateRow1',
    expectRow: [
      { name: 'foo1', badgeCss: 'yellow-background', badgeText: 'Terminating', message: 'should terminate the row' }
    ]
  },
  {
    testName: 'should delete the row',
    command: 'test table --watch=push --final-state=deleteRow1',
    expectRow: [{ name: 'foo1', badgeCss: 'red-background', badgeText: 'Offline', message: 'should terminate the row' }]
  },
  {
    testName: 'should activate the deleted row',
    command: 'test table --watch=push --final-state=activateRow1',
    expectRow: [
      { name: 'foo1', badgeCss: 'green-background', badgeText: 'Running', message: 'should activate the deleted row' }
    ]
  },
  {
    testName: 'should terminate the row again',
    command: 'test table --watch=push --final-state=terminateRow1Again',
    expectRow: [
      {
        name: 'foo1',
        badgeCss: 'yellow-background',
        badgeText: 'Terminating',
        message: 'should terminate the row again'
      }
    ]
  },
  {
    testName: 'should delete the row again',
    command: 'test table --watch=push --final-state=deleteRow1Again',
    expectRow: [
      { name: 'foo1', badgeCss: 'red-background', badgeText: 'Offline', message: 'should terminate the row again' }
    ]
  },
  {
    testName: 'should create the second row',
    command: 'test table --watch=push --final-state=createRow2',
    expectRow: [
      { name: 'foo2', badgeCss: 'green-background', badgeText: 'Running', message: 'should create the second row' }
    ]
  },
  {
    testName: 'should activate the first row again',
    command: 'test table --watch=push --final-state=activeRow1Again',
    expectRow: [
      {
        name: 'foo1',
        badgeCss: 'green-background',
        badgeText: 'Running',
        message: 'should activate the first row again'
      }
    ]
  }
])
