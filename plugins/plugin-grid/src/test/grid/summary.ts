/*
 * Copyright 2017 IBM Corporation
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
import { v4 as uuid } from 'uuid'
import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, sidecar } = ui

const actionName = `activation-table-${uuid()}` // some unique name

/* const parsesAsInteger = str => {
  try {
    parseInt(str)
    return true
  } catch (e) {
    return false
  }
} */
/* const isInteger = str => typeof str === 'number' || parsesAsInteger(str) */

const _openTableExpectCountOf = function(ctx, expectedCount, expectedErrorRate, cmd) {
  const view = `${ui.selectors.SIDECAR_CUSTOM_CONTENT} .activation-viz-plugin`
  const row = `${view} tr[data-action-name="${actionName}"]`
  const successCell = `${row} .cell-successes.cell-hide-when-outliers-shown`
  const failureCell = `${row} .cell-failures.cell-hide-when-outliers-shown`
  const medianDot = `${row} .stat-median-dot`
  const focusLabel = `${view} .table-header .x-axis-focus-label`
  const outliersButton = ui.selectors.SIDECAR_MODE_BUTTON('outliers')
  const outlierDots = `${view} .outlier-dot`

  const once = (iter, resolve, reject) =>
    cli
      .do(cmd, ctx.app)
      .then(cli.expectOKWithCustom({ passthrough: true }))
      .then(N => {
        // we'll return this N at the end; this is the data-input-count of the prompt that executed our cmd
        return (
          ctx.app.client
            .scroll(row)
            .then(() => ctx.app.client.getText(successCell))
            .then(actualCount => assert.strictEqual(parseInt(actualCount, 10), expectedCount))

            .then(() => ctx.app.client.getAttribute(failureCell, 'data-failures'))
            .then(actualErrorRate => assert.strictEqual(parseInt(actualErrorRate, 10), expectedErrorRate))

            // hover over a bar, expect focus labels
            .then(() => ctx.app.client.moveToObject(medianDot, 1, 1))
            .then(() => ctx.app.client.waitForVisible(focusLabel))

            // click outliers button
            .then(() => {
              if (expectedCount > 8) {
                return ctx.app.client.click(outliersButton).then(() => ctx.app.client.waitForVisible(outlierDots))
              }
            })

            /* .then(() => ctx.app.client.getAttribute(`${ui.selectors.SIDECAR_CUSTOM_CONTENT} tr[data-action-name="${actionName}"] .cell-stat`, 'data-value'))
                  .then(stats => assert.equal(stats.length, 5) && stats.reduce((okSoFar,stat) => ok && isInteger(stat), true)) */

            // return the repl prompt count
            .then(() => resolve(N))
        )
      })
      .catch(err => {
        if (iter < 10) {
          if (err.type !== 'NoSuchElement') {
            console.error(err)
          }
          setTimeout(() => once(iter + 1, resolve, reject), 2000)
        } else {
          return common.oops(ctx)(err)
        }
      })

  return new Promise((resolve, reject) => setTimeout(() => once(0, resolve, reject), 2000))
}
export const openTableExpectCountOf = function(ctx, expectedCount, expectedErrorRate, cmd) {
  it(`open activation table, with ${cmd}`, () => _openTableExpectCountOf(ctx, expectedCount, expectedErrorRate, cmd))
}

describe('summary visualization', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const invoke = (inputValue = 1) => {
    // action bombs with negative numbers
    const expectedStruct = inputValue < 0 ? { error: 'bomb!' } : { x: inputValue }

    it('should invoke the action with explicit action name', () =>
      cli
        .do(`wsk action invoke ${actionName} -p x ${inputValue}`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(actionName))
        .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
        .then(ui.expectStruct(expectedStruct))
        .catch(common.oops(this)))
  }
  const notbomb = () => invoke(+1)
  const bomb = () => invoke(-1)

  /* const openSplitTableExpectCountsOf = (expectedCountA, expectedErrorRateA,
                                          expectedCountB, expectedErrorRateB,
                                          cmd) => {
        it(`open activation table, with ${cmd}`, () => cli.do(cmd, this.app)
            .then(cli.expectOK)
           .then(sidecar.expectOpen)

           .then(() => this.app.client.getText(`${ui.selectors.SIDECAR_CUSTOM_CONTENT} tr[data-action-name="${actionName} v0.0.1"] .cell-count`))
           .then(actualCountA => assert.equal(actualCountA, expectedCountA))
           .then(() => this.app.client.getAttribute(`${ui.selectors.SIDECAR_CUSTOM_CONTENT} tr[data-action-name="${actionName} v0.0.1"] .cell-errorRate`, 'data-value'))
           .then(actualErrorRateA => assert.equal(actualErrorRateA, expectedErrorRateA))

           .then(() => this.app.client.getText(`${ui.selectors.SIDECAR_CUSTOM_CONTENT} tr[data-action-name="${actionName} v0.0.2"] .cell-count`))
           .then(actualCountB => assert.equal(actualCountB, expectedCountB))
           .then(() => this.app.client.getAttribute(`${ui.selectors.SIDECAR_CUSTOM_CONTENT} tr[data-action-name="${actionName} v0.0.2"] .cell-errorRate`, 'data-value'))
           .then(actualErrorRateB => assert.equal(actualErrorRateB, expectedErrorRateB))
           .catch(common.oops(this)))
    } */

  it(`should create the action that bombs if the input value is negative ${actionName}`, () =>
    cli
      .do(`let ${actionName} = ({x}) => x<0 ? {error:'bomb!'} : {x: x}`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .catch(common.oops(this)))

  // invoke with positive number, expect count of 1 in the table
  notbomb()
  openTableExpectCountOf(this, 1, 0, 'summary')
  openTableExpectCountOf(this, 1, 0, 'summary --batches 10')

  // invoke again with positive, and then look for a count of 2
  notbomb()
  openTableExpectCountOf(this, 2, 0, 'summary')
  openTableExpectCountOf(this, 2, 0, 'summary --batches 10')

  // invoke again with positive, and then look for a count of 3
  notbomb()
  openTableExpectCountOf(this, 3, 0, 'summary')
  openTableExpectCountOf(this, 3, 0, 'summary --batches 10')

  // invoke again with negative, and then look for a count of 4, and error rate of 0.25
  bomb()
  openTableExpectCountOf(this, 3, 1, 'summary')
  openTableExpectCountOf(this, 3, 1, 'summary --batches 10')

  // this test is too flakey against IBM CLoud Functions, as activation records may only become visible way in the future
  /*
  it('should open table, click on a failure cell, and show grid', () => _openTableExpectCountOf(this, 3, 1, 'summary --batches 10')
    .then(() => `${ui.selectors.SIDECAR_CUSTOM_CONTENT} tr[data-action-name="${actionName}"] .cell-errors`) // the failure cell for the action's row
    .then(selector => this.app.client.scroll(selector)
      .then(this.app.client.click(selector)))
    .then(() => this.app)
    .then(sidecar.expectOpen)
    .then(sidecar.expectMode('grid'))
    .catch(common.oops(this)))

  // force a version update
  it('should create the action that bombs if the input value is negative', () => cli.do(`let ${actionName} = ({x}) => x<0 ? {error:'bomb!'} : {x: x}`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName))
    .catch(common.oops(this)))

  notbomb()
  notbomb()
  notbomb()
  bomb()
  bomb()
  bomb()
  openTableExpectCountOf(this, 6, 4, `summary ${actionName}`) // 10 total activations, 4 of which failed
  */
  /* openSplitTableExpectCountsOf(4, 0.25, // the previous version counts should not be changed from when we last checked
                                 6, 0.5,  // we've made 6 invocations against the new version, 3 of which failed
                                 `summary -a --split --name ${actionName}`) */
  /*
  it(`should load test ${actionName}`, () => cli.do(`lt ${actionName}`, this.app)
    .catch(common.oops(this)))

  openTableExpectCountOf(this, 46, 4, `summary ${actionName}`) // 46 successful activations, 4 of which failed

  // finally, test error handling: delete action, open summary,
  // click on the action name, except the summary to still be there
  it(`should delete ${actionName}`, () => cli.do(`wsk action delete ${actionName}`, this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should open table, click on the deleted action, and still show table view', () => _openTableExpectCountOf(this, 46, 4, `summary ${actionName}`)
    .then(N => {
      // N is the data-input-count of the block that executed the command
      const selector = `${ui.selectors.SIDECAR_CUSTOM_CONTENT} tr[data-action-name="${actionName}"] .cell-label .clickable` // the name cell for the deleted action
      return this.app.client.scroll(selector)
        .then(this.app.client.click(selector)) // click on it
        .then(count => ({ app: this.app, count: N + 1 })) // the command+1 had better have a 404
        .then(cli.expectError(404)) // the repl should report the action not found error
    })
    .then(() => this.app.client.waitUntil(() => {
      return sidecar.expectOpen(this.app)
        .then(sidecar.expectMode('summary')) // and the summary had better still be open
    }))
    .catch(common.oops(this))) */
})
