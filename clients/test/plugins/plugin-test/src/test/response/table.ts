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

/** test table, validate its cells and drilldown from the rows */
new TestTable('should test table with dilldown', {
  exec: {
    command: 'test table',
    expectTable: {
      header: expectHeaderText,
      body: expectRow
    },
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
  },
  drilldown: {
    expectTable: {
      header: expectHeaderText,
      body: expectRow
    }
  }
}).run()

/** test table with poll watcher that doesn't have termination state */
new TestTable('should test table with poller', {
  exec: {
    command: 'test table --watch=poll',
    expectTable: {
      header: expectHeaderText,
      body: expectRow.slice(0, 1)
    }
  },
  drilldown: {
    expectTable: {
      header: expectHeaderText,
      body: expectRow.slice(0, 1)
    }
  },
  job: { finalJobCount: 1 }
}).run()

/** test table with poll watcher with final state, and the job will be collected in final state */
new TestTable('should test table with status, poller and final-state', {
  status: {
    command: 'test table --watch=poll --final-state=2',
    expectRow: [
      { name: 'foo1', badgeCss: 'green-background', badgeText: 'Running', message: 'should create a new row' }
    ],
    statusDescription: 'should poll for a deleted Row'
  }
}).run()

/** test table with push watcher, and the final status badge and message are correct */
new TestTable('should test table with status and pusher', {
  status: {
    statusDescription: 'should create a new row',
    command: 'test table --watch=push --sequence=createRow1',
    expectRow: [
      { name: 'foo1', badgeCss: 'green-background', badgeText: 'Running', message: 'should create a new row' }
    ]
  }
}).run()

/** test table with push watcher, and the final status badge and message are correct */
new TestTable('should test table with status and pusher', {
  status: {
    statusDescription: 'should terminate the row',
    command: 'test table --watch=push --sequence=terminateRow1',
    expectRow: [
      { name: 'foo1', badgeCss: 'yellow-background', badgeText: 'Terminating', message: 'should terminate the row' }
    ]
  }
}).run()

/** test table with push watcher, and the final status badge and message are correct */
new TestTable('should test table with status and pusher', {
  status: {
    statusDescription: 'should delete the row',
    command: 'test table --watch=push --sequence=deleteRow1',
    expectRow: [{ name: 'foo1', badgeCss: 'red-background', badgeText: 'Offline', message: 'should terminate the row' }]
  }
}).run()

/** test table with push watcher, and the final status badge and message are correct */
new TestTable('should test table with status and pusher', {
  status: {
    statusDescription: 'should delete the row',
    command: 'test table --watch=push --sequence=deleteRow1',
    expectRow: [{ name: 'foo1', badgeCss: 'red-background', badgeText: 'Offline', message: 'should terminate the row' }]
  }
}).run()

/** test table with push watcher, and the final status badge and message are correct */
new TestTable('should test table with status and pusher', {
  status: {
    statusDescription: 'should activate the deleted row',
    command: 'test table --watch=push --sequence=activateRow1',
    expectRow: [
      { name: 'foo1', badgeCss: 'green-background', badgeText: 'Running', message: 'should activate the deleted row' }
    ]
  }
}).run()

/** test table with push watcher, and the final status badge and message are correct */
new TestTable('should test table with status and pusher', {
  status: {
    statusDescription: 'should terminate the row again',
    command: 'test table --watch=push --sequence=terminateRow1Again',
    expectRow: [
      {
        name: 'foo1',
        badgeCss: 'yellow-background',
        badgeText: 'Terminating',
        message: 'should terminate the row again'
      }
    ]
  }
}).run()

/** test table with push watcher, and the final status badge and message are correct */
new TestTable('should test table with status and pusher', {
  status: {
    statusDescription: 'should delete the row again',
    command: 'test table --watch=push --sequence=deleteRow1Again',
    expectRow: [
      { name: 'foo1', badgeCss: 'red-background', badgeText: 'Offline', message: 'should terminate the row again' }
    ]
  }
}).run()

/** test table with push watcher, and the final status badge and message are correct */
new TestTable('should test table with status and pusher', {
  status: {
    statusDescription: 'should create the second row',
    command: 'test table --watch=push --sequence=createRow2',
    expectRow: [
      { name: 'foo2', badgeCss: 'green-background', badgeText: 'Running', message: 'should create the second row' }
    ]
  }
}).run()

/** test table with push watcher, and the final status badge and message are correct */
new TestTable('should test table with status and pusher', {
  status: {
    statusDescription: 'should activate the first row again',
    command: 'test table --watch=push --sequence=activeRow1Again',
    expectRow: [
      {
        name: 'foo1',
        badgeCss: 'green-background',
        badgeText: 'Running',
        message: 'should activate the first row again'
      }
    ]
  }
}).run()
