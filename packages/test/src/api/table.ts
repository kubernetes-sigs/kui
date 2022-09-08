/*
 * Copyright 2019 The Kubernetes Authors
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
import { Table, Row, Util } from '@kui-shell/core'

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
  hasGridButton?: boolean
  hasSequenceButton?: boolean
  cells?: ((value: string, rowIdx: number) => void)[]
  asGrid?: boolean
  switchToSequence?: boolean
  bars?: string[]
  switchToList?: boolean
}

interface Tests {
  exec?: { command: string; expectTable: Table; validation?: TableValidation }
  drilldown?: { expectTable: Table }
  status?: { expectRow: RowWithBadgeAndMessage[]; command: string; statusDescription?: string }
}

export class TestTable {
  private testName: string // used in mocha suite description
  private outputCount: number
  private ctx: Common.ISuite
  private tests: Tests
  private cmdIdx: number

  public constructor(testName?: string, tests?: Tests) {
    this.testName = testName || 'should test table'
    this.tests = tests
  }

  /** new TestTable().run() will start a mocha test suite */
  public run() {
    const self = this // eslint-disable-line @typescript-eslint/no-this-alias
    describe(`${this.testName} ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      self.ctx = this

      // execute the tests accordingly
      if (self.tests) {
        const { exec, drilldown, status } = self.tests

        if (exec) {
          self.executeAndValidate(exec.command, exec.expectTable, exec.validation)
        }
        if (drilldown) {
          self.drilldownFromTable(drilldown.expectTable)
        }
        if (status) {
          self.evalStatus(status)
        }
      }
    })
  }

  public evalStatus(_: {
    expectRow: RowWithBadgeAndMessage[]
    command: string
    statusDescription?: string
    ctx?: Common.ISuite
  }) {
    const { expectRow, command, statusDescription, ctx = this.ctx } = _
    const self = this // eslint-disable-line @typescript-eslint/no-this-alias

    it(`${statusDescription || 'should show status badge in row'}`, async () => {
      try {
        const count = command ? await CLI.command(command, ctx.app).then(_ => _.count) : self.outputCount

        await Util.promiseEach(expectRow, async row => {
          const rowSelector = `${Selectors.OUTPUT_N(count)} ${Selectors.BY_NAME(row.name)}`
          await (await ctx.app.client.$(rowSelector)).waitForExist()

          // wait for message
          const messageSelector = `${Selectors.OUTPUT_N(count)} ${Selectors.TABLE_CELL(row.name, 'MESSAGE')}`
          await (await ctx.app.client.$(messageSelector)).waitForExist()
          await Utils.expectText(ctx.app, row.message)(messageSelector)

          // wait for badge
          const badge = `${rowSelector} [data-tag="badge"].${row.badgeCss}`
          await (await ctx.app.client.$(badge)).waitForExist()
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
    const self = this // eslint-disable-line @typescript-eslint/no-this-alias

    it(`should execute command from test table: ${command}`, () =>
      CLI.command(command, ctx.app)
        .then(res => {
          self.cmdIdx = res.count
          return res
        })
        .then(async res => {
          await res.app.client
            .$(Selectors.TABLE_TITLE(res.count - 1))
            .then(_ => _.waitForExist({ timeout: CLI.waitTimeout, reverse: true }))

          if (validation) {
            if (validation.hasGridButton) {
              await res.app.client.$(Selectors.TABLE_SHOW_AS_GRID(res.count)).then(_ => _.waitForDisplayed())
            }

            if (validation.asGrid) {
              await res.app.client.$(Selectors.TABLE_AS_GRID(res.count)).then(_ => _.waitForDisplayed())
            }

            if (validation.hasSequenceButton) {
              await res.app.client.$(Selectors.TABLE_SHOW_AS_SEQUENCE(res.count)).then(_ => _.waitForDisplayed())
            }

            if (validation.switchToSequence) {
              await res.app.client.$(Selectors.TABLE_SHOW_AS_SEQUENCE(res.count)).then(async _ => {
                await _.waitForDisplayed()
                await _.click()
              })
              await res.app.client.$(Selectors.TABLE_AS_SEQUENCE(res.count)).then(_ => _.waitForDisplayed())

              if (validation.bars) {
                await Util.promiseEach(validation.bars, async width => {
                  res.app.client.waitUntil(async () => {
                    return res.app.client
                      .$(Selectors.TABLE_AS_SEQUENCE_BAR_WIDTH(res.count, width))
                      .then(_ => _.isDisplayed())
                  })
                })
              }
            }

            if (validation.switchToList) {
              await res.app.client.$(Selectors.TABLE_SHOW_AS_LIST(res.count)).then(async _ => {
                await _.waitForDisplayed()
                await _.click()
              })
              await res.app.client.$(Selectors.TABLE_AS_LIST(res.count)).then(_ => _.waitForDisplayed())
            }
          }

          return res
        })
        .then(
          ReplExpect.okWithCustom({
            selector: Selectors.TABLE_HEADER_CELL(expectTable.header.name)
          })
        )
        .catch(Common.oops(ctx, true)))

    if (validation) {
      if (validation.cells) {
        expectTable.body.forEach((_, rowIdx) => {
          it(`should validate cells of row ${rowIdx} in test table output: ${command}`, async () => {
            const cellSelector = `${Selectors.OUTPUT_LAST} tbody tr:nth-child(${rowIdx + 1}) td > .cell-inner`
            const cells = await ctx.app.client.$$(cellSelector)
            if (cells.length > 1) {
              ;(await Promise.all(cells.map(_ => _.getText()))).forEach((_, cellIdx) =>
                validation.cells[cellIdx](_, rowIdx)
              )
            } else if (validation.cells.length === 1 && cells.length === 1) {
              // got one cell, expecting one cell
              validation.cells[0](await cells[0].getText(), rowIdx)
            } else {
              const actualCellCount = cells.length
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
   * drilldownFromTable() drilldowns from the table
   *
   * @param { Table } expectTable is the expected table shown in the REPL
   *
   */
  public drilldownFromTable(expectTable: Table, _ctx?: Common.ISuite) {
    const ctx = _ctx || this.ctx
    const self = this // eslint-disable-line @typescript-eslint/no-this-alias

    const clickCell = (row: Row, command: string) => {
      it(`should click to execute from test table: ${command}`, async () => {
        try {
          // work around tooltips not going away when clicking on
          // consecutive/nearby table rows in sequence
          await ctx.app.client.$(Selectors.STATUS_STRIPE).then(_ => _.moveTo())
          await new Promise(resolve => setTimeout(resolve, 1000))

          const cell = await ctx.app.client.$(
            `${Selectors.OUTPUT_N(self.cmdIdx)} ${Selectors.TABLE_CELL(row.name, expectTable.header.name)}`
          )
          await cell.waitForExist({ timeout: 10000 })
          await cell.scrollIntoView()
          await cell.moveTo()
          await cell.waitForClickable({ timeout: 10000 })
          await cell.click()

          // expect 2 splits in total
          await ReplExpect.splitCount(2)(ctx.app)
        } catch (err) {
          await Common.oops(ctx, true)(err)
        }
      })
    }

    // For each row, check the first cell
    expectTable.body.forEach(row => {
      clickCell(row, row.onclick)
    })
  }
}
