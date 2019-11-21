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
import { TestTable } from '@kui-shell/test'

const test = new TestTable({
  command: 'test table'
})

const expectHeaderText = { name: 'NAME', attributes: [{ value: 'FOO' }, { value: 'BAR' }] }

const expectRow = [
  { name: 'TestString', onclick: `test string`, attributes: [{ value: 'foo' }, { value: 'bar' }] },
  { name: 'TestTable', onclick: `test table`, attributes: [{ value: 'foo' }, { value: 'bar' }] },
  { name: 'TestMMRName', onclick: `test mmr name`, attributes: [{ value: 'foo' }, { value: 'bar' }] },
  {
    name: 'TestMMRModeSilence',
    onclick: `test mmr mode`,
    onclickSilence: true,
    attributes: [{ value: 'foo' }, { value: 'bar' }]
  }
]

test.drilldownFromREPL({
  header: expectHeaderText,
  body: expectRow
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
