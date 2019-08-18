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

const actionName = `activation-grid-${uuid()}` // some unique name
// const actionName2 = `activation-grid-${uuid()}` // some unique name
// const packageName = 'ppp'
const N = 1 // number of activation batches to fetch
const randomGarbage = `activation-grid-garbage-${uuid()}` // some unique name

describe('grid visualization', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const invoke = (inputValue, name = actionName, packageName?) => {
    // action bombs with negative numbers
    const expectedStruct = inputValue < 0 ? { error: 'bomb!' } : { x: inputValue }
    const fullName = packageName ? `${packageName}/${name}` : name

    it(`should invoke ${fullName} with -p x ${inputValue}`, () =>
      cli
        .do(`wsk action invoke ${fullName} -p x ${inputValue}`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(name))
        .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
        .then(ui.expectStruct(expectedStruct))
        .catch(common.oops(this)))
  }
  const notbomb = (name?, packageName?) => invoke(+1, name, packageName)
  // const bomb = (name, packageName) => invoke(-1, name, packageName)

  const verifyGrid = (expectedCount, expectedErrorCount, name = actionName, expectedTotalCount) => app =>
    Promise.resolve()
      .then(() => {
        // expected number of success cells?
        if (expectedTotalCount === undefined || expectedTotalCount !== 0) {
          // if we're waiting for cells, wait for at least one cell to appear before we do the validation checks on the counts
          const selector = `${ui.selectors.SIDECAR_CUSTOM_CONTENT} .grid .grid-cell`
          console.error(`Waiting for ${selector}`)
          return app.client.waitForExist(selector, 5000)
        }
      })
      .then(() =>
        app.client.elements(
          `${ui.selectors.SIDECAR_CUSTOM_CONTENT} .grid[data-action-name="${name}"] .grid-cell.is-failure-false`
        )
      )
      .then(elements => assert.strictEqual(elements.value.length, expectedCount)) // .elements() returns a WebElements structure, with a .value[] field

      // expected number of failure cells?
      .then(() =>
        app.client.elements(
          `${ui.selectors.SIDECAR_CUSTOM_CONTENT} .grid[data-action-name="${name}"] .grid-cell.is-failure-true`
        )
      )
      .then(elements => assert.strictEqual(elements.value.length, expectedErrorCount))

      // expected total number of cells for the entire view?
      .then(() => {
        if (expectedTotalCount) {
          return app.client
            .elements(`${ui.selectors.SIDECAR_CUSTOM_CONTENT} .grid .grid-cell.grid-cell-occupied`)
            .then(elements => assert.strictEqual(elements.value.length, expectedTotalCount))
        }
      })

  const openGridExpectCountOf = (expectedCount, expectedErrorCount, cmd, name = actionName, expectedTotalCount?) => {
    const once = (iter, resolve, reject) =>
      cli.do(cmd, this.app).then(_ => {
        if (expectedCount === 0 && expectedErrorCount === 0) {
          return cli
            .expectError(404)(_)
            .then(resolve, reject)
        } else {
          return cli
            .expectOK(_)
            .then(sidecar.expectOpen)
            .then(verifyGrid(expectedCount, expectedErrorCount, name, expectedTotalCount))
            .then(resolve)
            .catch(err => {
              if (iter < 10) {
                console.error('retry!')
                setTimeout(() => once(iter + 1, resolve, reject), 1000)
              } else {
                return common.oops(this)(err)
              }
            })
        }
      })

    it(`open activation grid, with name=${name} ${cmd} ec=${expectedCount} eec=${expectedErrorCount} etc=${expectedTotalCount}`, () => {
      return new Promise((resolve, reject) => once(0, resolve, reject))
    })
  }

  it(`should create an action ${actionName} that bombs if the input value is negative`, () =>
    cli
      .do(`let ${actionName} = ({x}) => x<0 ? {error:'bomb!'} : {x: x}`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .catch(common.oops(this)))

  // invoke with positive number, expect count of 1 in the table
  notbomb()
  openGridExpectCountOf(1, 0, `grid --batches ${N}`)
  openGridExpectCountOf(1, 0, `grid --batches ${N} ${actionName}`, actionName, 1)
  openGridExpectCountOf(0, 0, `grid --batches ${N} ${randomGarbage}`, actionName, 0) // expect 0 cells, for a random action name
  openGridExpectCountOf(0, 0, `grid --batches ${N} ${randomGarbage}`, randomGarbage, 0) // either way, there should be nothing

  it('should fail with a bad this query', () =>
    cli
      .do('grid --this', this.app)
      .then(cli.expectError(498))
      .catch(common.oops(this)))

  it('should fail with a bad last query', () =>
    cli
      .do('grid --last', this.app)
      .then(cli.expectError(498))
      .catch(common.oops(this)))

  const icon = `${ui.selectors.SIDECAR} .sidecar-header-icon-wrapper .sidecar-header-icon`

  //
  // time range queries
  //
  const whens = ['week', 'month', 'year']
  const intervals = ['this', 'last']
  const days = ['today', 'yesterday']
  days.forEach(day => {
    it(`should show ${day}`, () =>
      cli
        .do(`grid --${day}`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(() => this.app.client.waitForText(icon))
        .catch(common.oops(this)))
  })
  whens.forEach(when => {
    intervals.forEach(interval => {
      it(`should show ${interval} ${when}`, () =>
        cli
          .do(`grid --${interval} ${when}`, this.app)
          .then(cli.expectOK)
          .then(sidecar.expectOpen)
          .then(() => this.app.client.waitForText(icon))
          .catch(common.oops(this)))
    })
  })

  /** switch between tabs */
  const switchTo = (tab: string) => {
    const button = ui.selectors.SIDECAR_MODE_BUTTON(tab)

    it(`should switch to ${tab}`, () =>
      this.app.client
        .waitForVisible(button)
        .then(() => this.app.client.waitForEnabled(button))
        .then(() =>
          this.app.client.waitUntil(async () => {
            try {
              await this.app.client.click(button)
              await this.app.client.waitUntil(async () => {
                try {
                  const text = await this.app.client.getText(icon)
                  return new RegExp(tab, 'i').test(text)
                } catch (err) {
                  return false
                }
              })

              const b1 = ui.selectors.SIDECAR_MODE_BUTTON('zoom-in')
              const b2 = ui.selectors.SIDECAR_MODE_BUTTON('outliers')

              if (tab === 'grid') {
                await Promise.all([this.app.client.waitForVisible(b1), this.app.client.waitForVisible(b2, 10000, true)])
              } else if (tab === 'summary') {
                await Promise.all([this.app.client.waitForVisible(b2), this.app.client.waitForVisible(b1, 10000, true)])
              }

              return true
            } catch (err) {
              return false
            }
          })
        )
        .catch(common.oops(this)))
  }
  const switcheroo = () => {
    switchTo('summary')
    // switchTo('grid')
    // switchTo('summary')
    // switchTo('timeline')
    // switchTo('grid')
  }

  switcheroo()

  // activation list, click on activationId and action name; the latter should open the grid
  // !!! DISABLED TEST: horrible bug in electron 4.0.5, spectron 4.1.0... the elements to be clicked spazz to the left
  /* it(`should find an activation of ${actionName} in activation list`, () => cli.do('$ list', this.app)
    .then(cli.expectOKWithCustom({ passthrough: true }))
    .then(async N => {
      const row = `${ui.selectors.OUTPUT_N(N)} .log-line[data-name="${actionName}"]`
      const activationIdSelector = `${row} .activationId .clickable`
      const actionNameSelector = `${row} .entity-name .clickable`

      await new Promise(resolve => setTimeout(resolve, 2000))

      // first click on activationId, and expect sidecar to be showing that activation
      return this.app.client.getText(activationIdSelector)
        .then(activationId => this.app.client.waitForVisible(activationIdSelector)
          .then(() => this.app.client.waitForEnabled(activationIdSelector))
          .then(() => this.app.client.click(activationIdSelector))
          .then(() => new Promise(resolve => setTimeout(resolve, 20000000)))
          .then(() => this.app)
          .then(sidecar.expectOpen)
          .then(sidecar.expectShowing(actionName, activationId)))
      // now click on the action name, and expect grid
        .then(() => this.app.client.waitForVisible(actionNameSelector))
        .then(() => this.app.client.waitForEnabled(actionNameSelector))
        .then(() => this.app.client.click(actionNameSelector))
        .then(() => this.app)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(actionName))
        .then(() => this.app.client.waitForText(icon))
    })
     .catch(common.oops(this))) */

  // invoke again with positive, and then look for a count of 2
  notbomb()
  openGridExpectCountOf(0, 0, `wsk grid --batches ${N} ${randomGarbage}`, randomGarbage, 0) // expect 0 cells, for a random action name
  openGridExpectCountOf(2, 0, `wsk grid --batches ${N}`)

  // this test suite is too flakey against IBM CLoud Functions, as activation records may only become visible way in the future
  /*
  notbomb()
  openGridExpectCountOf(3, 0, `grid --batches ${N} ${actionName}`, actionName, 3)

  // invoke again with positive, and then look for a count of 3
  notbomb()
  openGridExpectCountOf(4, 0, `grid --batches ${N}`)
  openGridExpectCountOf(0, 0, `wsk grid --batches ${N} ${randomGarbage}`, randomGarbage, 0) // expect 0 cells, for a random action name
  bomb()
  openGridExpectCountOf(4, 1, `wsk activation grid --batches ${N} ${actionName}`, actionName, 5)

  // invoke again with negative, and then look for a count of 4, and error rate of 0.25
  bomb()
  openGridExpectCountOf(4, 2, `grid --batches ${N}`)
  openGridExpectCountOf(0, 0, `grid --batches ${N} ${randomGarbage}`, randomGarbage, 0)

  switcheroo()

  // click on grid cell
  openGridExpectCountOf(4, 2, `grid --batches ${N} ${actionName}`)
  it('should drill down to activation when grid cell is clicked', () => this.app.client.getAttribute(`${ui.selectors.SIDECAR_CUSTOM_CONTENT} .grid:first-child`, 'data-action-name')
    .then(actionName => this.app.client.click(`${ui.selectors.SIDECAR_CUSTOM_CONTENT} .grid-cell:first-child`)
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .then(() => this.app.client.click(ui.selectors.SIDECAR_BACK_BUTTON))
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(verifyGrid(4, 2)))
    .catch(common.oops(this)))
*/
  /* const tableTest = (iter, resolve, reject) => cli.do(`table ${actionName}`, this.app)
        .then(cli.expectOK)
          .then(sidecar.expectOpen)
          .then(() => this.app.client.click(`${ui.selectors.SIDECAR_CUSTOM_CONTENT} tr[data-action-name="${actionName}"] .cell-label.clickable`))
          .then(() => this.app)
          .then(sidecar.expectOpen)
          .then(verifyGrid(4, 2))
          .then(resolve)
          .catch(err => {
              if (iter < 10) {
                  console.error('retry in tableTest')
                  setTimeout(() => tableTest(iter + 1, resolve, reject), 1000)
              } else {
                  return common.oops(this)(err)
              }
          });
    it(`should open table view, click on table row, and observe switch to grid view actionName=${actionName}`, () => new Promise((resolve, reject) => tableTest(0, resolve, reject))) */
  /*
  it(`should create a second action ${actionName2} that bombs if the input value is negative`, () => cli.do(`let ${actionName2} = ({x}) => x<0 ? {error:'bomb!'} : {x: x}`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName2))
    .catch(common.oops(this)))

  notbomb(actionName2)
  openGridExpectCountOf(1, 0, `grid --batches ${N}`, actionName2)
  openGridExpectCountOf(0, 0, `grid --batches ${N} ${randomGarbage}`, randomGarbage, 0)

  bomb(actionName2)
  openGridExpectCountOf(1, 1, `grid --batches ${N}`, actionName2)
  openGridExpectCountOf(0, 0, `grid --batches ${N} ${randomGarbage}`, randomGarbage, 0)

  openGridExpectCountOf(1, 1, `grid --batches ${N}`, actionName2)
  openGridExpectCountOf(0, 0, `grid --batches ${N} ${randomGarbage}`, randomGarbage, 0)

  switcheroo()

  // purposefully reuse actionName2, but within a package
  it(`should create a packaged action ${packageName}/${actionName2} that bombs if the input value is negative`, () => cli.do(`let ${packageName}/${actionName2} = ({x}) => x<0 ? {error:'bomb!'} : {x: x}`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName2, undefined, undefined, packageName))
    .catch(common.oops(this)))

  // invoke not-packed actionName2 again, and packaged
  // actionName2. open grid filtering just to packaged actionName2,
  // and expect 1 success cell
  notbomb(actionName2, packageName)
  notbomb(actionName2)
  openGridExpectCountOf(3, 1, `grid --batches 2`, actionName2) // it was 1,1 last time, and we did one notbomb against actionName2 and one against packaged actionName2, hence 3,1
  openGridExpectCountOf(2, 1, `grid --batches 2 ${actionName2}`, actionName2) // it was 1,1 last time, and we did one notbomb, so expect 2,1 now
  notbomb(actionName2, packageName)
  openGridExpectCountOf(2, 0, `grid --batches 2 ${packageName}/${actionName2}`, actionName2) // we've done two notbombs against the packaged actionName2, hence 2,0

  it('should open grid as timeline with grid --timeline', () => cli.do('grid --timeline', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should open grid as timeline with grid -t', () => cli.do('grid -t', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should open grid as timeline with grid -t, then switch to summary', () => cli.do('grid -t', this.app)
    .then(cli.expectOK)
    .then(() => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('summary')))
    .then(() => this.app.client.waitUntil(() => {
      return this.app.client.getText('.sidecar-header-icon')
        .then(txt => txt.toLowerCase() === 'summary')
    }))
    .catch(common.oops(this))) */
})
