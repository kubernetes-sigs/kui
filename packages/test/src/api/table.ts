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

import * as Common from './common'
import * as CLI from './cli'
import * as ReplExpect from './repl-expect'
import * as Selectors from './selectors'

export class TestTable {
  public command: string
  public testName: string

  /**
   * new TestTable() instantiates a class of multi-model-response tests
   * @param test includes: command and testName
   * @param { string } command is the command needs to be executed
   * @param { string } testName (optional) helps with filtering the Mocha Test Suites by description
   *
   */
  public constructor(test: { command: string; testName?: string }) {
    this.command = test.command
    this.testName = test.testName
  }

  /**
   * drilldownFromREPL() starts a Mocha Test Suite
   * drilldownFromREPL() executes `command` in REPL and drilldown from the table
   *
   * @param { Tables.Table } expectTable is the expected table shown in the REPL
   *
   */
  public drilldownFromREPL(expectTable: Tables.Table) {
    const command = this.command

    describe(`drilldown from table in REPL ${this.testName || ''}${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      const executeTheCommand = () => {
        it(`should execute: ${command}`, () =>
          CLI.command(command, this.app)
            .then(
              ReplExpect.okWithCustom({
                selector: Selectors.TABLE_CELL(expectTable.body[0].name, expectTable.header.name)
              })
            )
            .catch(Common.oops(this)))
      }

      const clickCell = (cell: string, command: string, replIndex: number, prompt: string) => {
        it(`should click to execute: ${command}`, async () => {
          try {
            await this.app.client.waitForExist(cell)
            await this.app.client.click(cell)
            await ReplExpect.ok({ app: this.app, count: replIndex })
            await CLI.expectInput(prompt, command)(this.app)
          } catch (err) {
            await Common.oops(this, true)
          }
        })
      }

      const clickCellSilently = (cell: string, command: string, prompt: string) => {
        it(`should click to silently execute: ${command}`, async () => {
          try {
            await this.app.client.waitForExist(cell)
            await this.app.client.click(cell)
            await CLI.expectInput(prompt, '')(this.app)
          } catch (err) {
            await Common.oops(this, true)
          }
        })
      }

      /* Here comes the tests */
      executeTheCommand()

      // For each row, check the first cell
      expectTable.body.forEach((row, rowIndex) => {
        const cell = `${Selectors.OUTPUT_N(0)} ${Selectors.TABLE_CELL(row.name, expectTable.header.name)}`
        const replIndexAfterClick = rowIndex + 1

        if (!row.onclickSilence) {
          clickCell(cell, row.onclick, replIndexAfterClick, Selectors.PROMPT_N(replIndexAfterClick))
        } else {
          clickCellSilently(cell, row.onclick, Selectors.PROMPT_N(replIndexAfterClick))
        }
      })
    })
  }
}
