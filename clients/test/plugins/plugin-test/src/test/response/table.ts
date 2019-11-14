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
