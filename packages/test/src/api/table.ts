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
import { promiseEach, Table, Tab } from '@kui-shell/core'

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
  cells: ((value: string, rowIdx: number) => void)[]
}

export class TestTable {
  private command: string
  private outputCount: number
  private ctx: Common.ISuite

  public constructor(
    test?: {
      exec?: { command: string; expectTable: Table; validation?: TableValidation }
      drilldown?: { expectTable: Table }
      status?: { expectRow: RowWithBadgeAndMessage[]; command?: string; testName?: string }
      job?: { finalJobCount: number }
    },
    testName?: string
  ) {
    const self = this

    describe(`${testName || 'should test table '} ${process.env.MOCHA_RUN_TARGET ||
      ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))
      self.ctx = this
      self.hasJobs(0)

      if (test) {
        if (test.exec) {
          self.executeAndValidate(test.exec.command, test.exec.expectTable, test.exec.validation)
        }
        if (test.drilldown) {
          self.drilldownFromREPL(test.drilldown.expectTable)
        }
        if (test.status) {
          self.evalStatus(test.status)
        }
        if (test.job) {
          self.hasJobs(test.job.finalJobCount || 0)
        }
      }
    })
  }

  private hasJobs(jobCount: number, _ctx?: Common.ISuite) {
    const ctx = _ctx || this.ctx
    it(`should have ${jobCount} jobs in the tab`, async () => {
      try {
        const watchableJobsRaw = await ctx.app.client.execute(() => {
          const tab = document.querySelector('tab.visible') as Tab
          return tab.state.jobs
        })
        const actualJobCount = watchableJobsRaw.value
        assert.strictEqual(actualJobCount, jobCount)
      } catch (err) {
        await Common.oops(ctx, true)(err)
      }
    })
  }

  public evalStatus(_: {
    expectRow: RowWithBadgeAndMessage[]
    command?: string
    testName?: string
    ctx?: Common.ISuite
  }) {
    const { expectRow, command = this.command, testName, ctx = this.ctx } = _
    const self = this

    it(`${testName || 'should show status badge in row'}`, async () => {
      try {
        const count = command ? await CLI.command(command, ctx.app).then(_ => _.count) : self.outputCount

        await promiseEach(expectRow, async row => {
          const rowSelector = `${Selectors.OUTPUT_N(count)} ${Selectors.BY_NAME(row.name)}`
          ctx.app.client.waitForExist(rowSelector)

          // wait for message
          const messageSelector = `${Selectors.OUTPUT_N(count)} ${Selectors.TABLE_CELL(row.name, 'MESSAGE')}`
          await ctx.app.client.waitForExist(messageSelector)
          await Utils.expectText(ctx.app, row.message)(messageSelector)

          // wait for badge
          const badge = `${rowSelector} badge.${row.badgeCss}`
          await ctx.app.client.waitForExist(badge)
          await Utils.expectText(ctx.app, row.badgeText)(badge)
        })
      } catch (err) {
        await Common.oops(ctx, true)(err)
      }
    })
  }

  /**
   * Execute the table-generating command, and validate the content.
   *
   */
  private executeAndValidate(command: string, expectTable: Table, validation?: TableValidation, _ctx?: Common.ISuite) {
    const ctx = this.ctx || _ctx

    it(`should execute command from test table: ${command}`, () =>
      CLI.command(command, ctx.app)
        .then(
          ReplExpect.okWithCustom({
            selector: Selectors.TABLE_HEADER_CELL(expectTable.header.name)
          })
        )
        .catch(Common.oops(ctx)))

    if (validation) {
      if (validation.cells) {
        expectTable.body.forEach((_, rowIdx) => {
          it(`should validate cells of row ${rowIdx} in test table output: ${command}`, async () => {
            const cellSelector = `${Selectors.OUTPUT_LAST} tbody:nth-child(${rowIdx + 2}) td > .cell-inner`
            const actualCellValues = await ctx.app.client.getText(cellSelector)
            if (Array.isArray(actualCellValues)) {
              actualCellValues.forEach((_, cellIdx) => validation.cells[cellIdx](_, rowIdx))
            } else if (validation.cells.length === 1) {
              // got one cell, expecting one cell
              validation.cells[0](actualCellValues, rowIdx)
            } else {
              const actualCellCount = Array.isArray(actualCellValues) ? actualCellValues.length : 1
              assert.fail(
                `mismatch between expected cell count ${validation.cells.length} and actual cell count ${actualCellCount}`
              )
            }
          })
        })
      }
    }
  }

  /**
   * drilldownFromREPL() drilldowns from the table
   *
   * @param { Table } expectTable is the expected table shown in the REPL
   *
   */
  public drilldownFromREPL(expectTable: Table, _ctx?: Common.ISuite) {
    const ctx = _ctx || this.ctx
    let count = 0

    const clickCell = (cell: string, command: string, prompt: string) => {
      it(`should click to execute from test table: ${command}`, async () => {
        try {
          await ctx.app.client.waitForExist(cell)
          await ctx.app.client.click(cell)
          await CLI.expectInput(prompt, command)(ctx.app)
          count++
        } catch (err) {
          await Common.oops(ctx, true)(err)
        }
      })
    }

    const clickCellSilently = (cell: string, command: string, prompt: string) => {
      it(`should click to silently execute from test table: ${command}`, async () => {
        try {
          await ctx.app.client.waitForExist(cell)
          await new Promise(resolve => setTimeout(resolve, 300))
          await ctx.app.client.click(cell)
          await CLI.expectInput(prompt, '')(ctx.app)
        } catch (err) {
          await Common.oops(ctx, true)(err)
        }
      })
    }

    // For each row, check the first cell
    expectTable.body.forEach(row => {
      const cellSelector = `${Selectors.OUTPUT_N(count)} ${Selectors.TABLE_CELL(row.name, expectTable.header.name)}`
      if (!row.onclickSilence) {
        clickCell(cellSelector, row.onclick, `${Selectors.PROMPT_BLOCK_LAST} input`)
      } else {
        clickCellSilently(cellSelector, row.onclick, Selectors.PROMPT_FINAL)
      }
    })
  }
}
