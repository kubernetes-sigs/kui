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

import * as assert from 'assert'
import { Tables } from '@kui-shell/core'
import { promiseEach } from '@kui-shell/core/util/async'

import * as Common from './common'
import * as CLI from './cli'
import * as ReplExpect from './repl-expect'
import * as Selectors from './selectors'
import * as Utils from './util'

interface RowWithBadgeAndMessage {
  name: string // row name
  badgeCss: string
  badgeText: string
  message: string
}

interface TableValidation {
  validation: {
    cells: ((value: string, rowIdx: number) => void)[]
  }
}

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
   * statusBadge() starts a Mocha Test Suite
   * statusBadge() executes `command` in REPL and checks the table status badges are rendered correctly
   *
   * @param { RowWithBadgeAndMessage } expectRow is the expected rows shown in the REPL
   *
   */
  public statusBadge(testVariations: { testName: string; command: string; expectRow: RowWithBadgeAndMessage[] }[]) {
    describe(`show table status ${this.testName || ''}${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      testVariations.forEach(test => {
        const command = test.command
        const expectRow = test.expectRow

        it(`${test.testName || 'should show status badge in row'}`, async () => {
          try {
            const { app, count } = await CLI.command(command, this.app)

            await promiseEach(expectRow, async row => {
              const rowSelector = `${Selectors.OUTPUT_N(count)} ${Selectors.BY_NAME(row.name)}`
              this.app.client.waitForExist(rowSelector)

              // wait for message
              const messageSelector = `${Selectors.OUTPUT_N(count)} ${Selectors.TABLE_CELL(row.name, 'MESSAGE')}`
              await app.client.waitForExist(messageSelector)
              await Utils.expectText(app, row.message)(messageSelector)

              // wait for badge
              const badge = `${rowSelector} badge.${row.badgeCss}`
              await app.client.waitForExist(badge)
              await Utils.expectText(app, row.badgeText)(badge)
            })
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })
      })
    })
  }

  /**
   * Execute the table-generating command, and validate the content.
   *
   */
  private executeAndValidate(ctx: Common.ISuite, expectTable: Tables.Table, validation?: TableValidation) {
    const command = this.command

    it(`should execute command from test table: ${this.command}`, () =>
      CLI.command(command, ctx.app)
        .then(
          ReplExpect.okWithCustom({
            selector: Selectors.TABLE_HEADER_CELL(expectTable.header.name)
          })
        )
        .catch(Common.oops(ctx)))

    if (validation) {
      if (validation.validation.cells) {
        expectTable.body.forEach((_, rowIdx) => {
          it(`should validate cells of row ${rowIdx} in test table output: ${this.command}`, async () => {
            const cellSelector = `${Selectors.OUTPUT_LAST} tbody:nth-child(${rowIdx + 2}) td > .cell-inner`
            const actualCellValues = await ctx.app.client.getText(cellSelector)
            if (Array.isArray(actualCellValues)) {
              actualCellValues.forEach((_, cellIdx) => validation.validation.cells[cellIdx](_, rowIdx))
            } else if (validation.validation.cells.length === 1) {
              // got one cell, expecting one cell
              validation.validation.cells[0](actualCellValues, rowIdx)
            } else {
              const actualCellCount = Array.isArray(actualCellValues) ? actualCellValues.length : 1
              assert.fail(
                `mismatch between expected cell count ${validation.validation.cells.length} and actual cell count ${actualCellCount}`
              )
            }
          })
        })
      }
    }
  }

  /**
   * drilldownFromREPL() starts a Mocha Test Suite
   * drilldownFromREPL() executes `command` in REPL and drilldown from the table
   *
   * @param { Tables.Table } expectTable is the expected table shown in the REPL
   *
   */
  public drilldownFromREPL(expectTable: Tables.Table, validation?: TableValidation) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    describe(`drilldown from test table in REPL ${this.testName || ''}${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      const clickCell = (cell: string, command: string, replIndex: number, prompt: string) => {
        it(`should click to execute from test table: ${command}`, async () => {
          try {
            await this.app.client.waitForExist(cell)
            await this.app.client.click(cell)
            await CLI.expectInput(prompt, command)(this.app)
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })
      }

      const clickCellSilently = (cell: string, command: string, prompt: string) => {
        it(`should click to silently execute from test table: ${command}`, async () => {
          try {
            await this.app.client.waitForExist(cell)
            await new Promise(resolve => setTimeout(resolve, 300))
            await this.app.client.click(cell)
            await CLI.expectInput(prompt, '')(this.app)
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })
      }

      /* Here comes the tests */
      self.executeAndValidate(this, expectTable, validation)

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
