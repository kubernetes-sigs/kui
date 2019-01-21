/*
 * Copyright 2017-18 IBM Corporation
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

import * as common from '@kui/core/tests/lib/common'
import * as ui from '@kui/core/tests/lib/ui'
import * as openwhisk from '@kui/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, keys, selectors, sidecar } = ui

/** execute the given async task n times */
const doTimes = (n, task) => {
  if (n > 0) {
    return task().then(() => doTimes(n - 1, task))
  } else {
    return Promise.resolve()
  }
}

describe('Tab completion', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const tabby = (app, partial, full, expectOK = true) => app.client.waitForExist(ui.selectors.CURRENT_PROMPT_BLOCK)
    .then(() => app.client.getAttribute(ui.selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
    .then(count => parseInt(count, 10))
    .then(count => app.client.setValue(ui.selectors.CURRENT_PROMPT, partial)
      .then(() => app.client.waitForValue(ui.selectors.PROMPT_N(count), partial))
      .then(() => app.client.setValue(ui.selectors.CURRENT_PROMPT, `${partial}${keys.TAB}`))
      .then(() => app.client.waitForValue(ui.selectors.PROMPT_N(count), full)))
    .then(() => new Promise(resolve => setTimeout(resolve, 500)))
    .then(() => cli.do('', app)) // "enter" to complete the repl
    .then(data => {
      if (expectOK) {
        return cli.expectOKWithAny(data)
      } else {
        return app
      }
    })
    .catch(common.oops(this))

  const tabbyWithOptions = (app, partial, expected?, full?, { click = undefined, nTabs = undefined, expectOK = true, iter = 0, expectedPromptAfterTab = undefined } = {}) => {
    return app.client.waitForExist(ui.selectors.CURRENT_PROMPT_BLOCK)
      .then(() => app.client.getAttribute(ui.selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
      .then(count => parseInt(count, 10))
      .then(count => app.client.setValue(ui.selectors.CURRENT_PROMPT, partial)
        .then(() => app.client.waitForValue(ui.selectors.PROMPT_N(count), partial))
        .then(() => app.client.setValue(ui.selectors.CURRENT_PROMPT, `${partial}${keys.TAB}`))
        .then(() => {
          if (expectedPromptAfterTab) {
            return app.client.waitForValue(ui.selectors.PROMPT_N(count), expectedPromptAfterTab)
          }
        })
        .then(() => {
          if (!expected) {
            // then we expect non-visibility of the tab-completion popup
            // console.error('Expecting non-existence of popup')
            return app.client.waitForVisible(`${ui.selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .clickable`, 10000, true)
              .then(() => {
                // great, the tab completion popup does not exist; early exit
                const err = new Error()
                err['failedAsExpected'] = true
                throw err
              })
          } else {
            const selector = `${ui.selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .clickable`
            // console.error('Expecting existence of popup', selector)
            return app.client.waitForVisible(selector, 10000)
          }
        })
        .then(() => app.client.getText(`${ui.selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .clickable`))
        .then(ui.expectArray(expected))
        // .then(() => { console.error('Got expected options') })
        .then(() => {
          if (click !== undefined) {
            // click on a row
            const selector = `${ui.selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .tab-completion-option[data-value="${expected[click]}"] .clickable`
            // console.error('clicking', click, selector)
            return app.client.waitForVisible(selector, 10000)
              .then(() => app.client.click(selector))
          } else {
            // otherwise hit tab a number of times, to cycle to the desired entry
            // console.error('tabbing', nTabs)
            return doTimes(nTabs, () => app.client.keys('Tab'))
              .then(() => app.client.keys('Enter'))
          }
        })
        .then(() => app.client.waitForVisible(`${ui.selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary`, 8000, true)) // wait for non-existence of the temporary
        .then(() => app.client.waitForValue(ui.selectors.PROMPT_N(count), full)))
      .then(() => cli.do('', app))
      .then(data => {
        if (expectOK) {
          return cli.expectOKWithAny(data)
        } else {
          return app
        }
      })
      .catch(err => this.app.client.execute('repl.doCancel()') // clear the line
        .then(() => common.oops(this)(err)))
  }

  const tabbyWithOptionsThenCancel = (app, partial, expected) => app.client.waitForExist(ui.selectors.CURRENT_PROMPT_BLOCK)
    .then(() => app.client.getAttribute(ui.selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
    .then(count => parseInt(count, 10))
    .then(count => app.client.setValue(ui.selectors.CURRENT_PROMPT, partial)
      .then(() => app.client.waitForValue(ui.selectors.PROMPT_N(count), partial))
      .then(() => app.client.setValue(ui.selectors.CURRENT_PROMPT, `${partial}${keys.TAB}`))
      .then(() => app.client.waitForVisible(`${ui.selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .clickable`))
      .then(() => app.client.getText(`${ui.selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .clickable`))
      .then(ui.expectArray(expected))
      .then(() => app.client.keys('ffffff')) // type something random
      .then(() => app.client.waitForVisible(`${ui.selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary`, 20000, true))) // wait for non-existence of the temporary
    .then(() => this.app.client.execute('repl.doCancel()')) // clear the line
    .catch(common.oops(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should create an action foo', () => cli.do('let foo = x=>x', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should create an action foo2', () => cli.do('let foo2 = x=>x', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should create an action bar', () => cli.do('let bar = x=>x', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should create an action foofoo/yum', () => cli.do('let foofoo/yum = x=>x', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  // expect b to autocomplete with only tab, since we only have one action starting with b
  it('should tab complete action get bar', () => tabby(this.app, 'action get b', 'action get bar'))
  it('should tab complete action invoke bar', () => tabby(this.app, 'action invoke b', 'action invoke bar'))
  it('should tab complete invoke bar', () => tabby(this.app, 'invoke b', 'invoke bar'))
  it('should tab complete async bar', () => tabby(this.app, 'async b', 'async bar'))

  it('should tab complete action foo2 with options', () => tabbyWithOptions(this.app, 'action get f',
    ['foofoo/yum', 'foo2', 'foo'],
    'action get foo2',
    { click: 1,
      expectedPromptAfterTab: 'action get foo' })
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo2'))
    .catch(common.oops(this)))

  it('should tab complete action foo with options (no prefix)', () => tabbyWithOptions(this.app, 'action get ',
    ['foofoo/yum', 'bar', 'foo2', 'foo'],
    'action get foo',
    { click: 3 })
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .catch(common.oops(this)))

  it('should not tab complete action without trailing whitespace', () => tabbyWithOptions(this.app, 'action get')
    .catch(err => {
      if (!err.failedAsExpected) {
        throw err
      } else {
        return this.app.client.execute('repl.doCancel()') // clear the line
      }
    }))

  it('should create a trigger', () => cli.do('wsk trigger create ttt', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should fire trigger with autocomplete', () => tabby(this.app, 'wsk trigger fire t', 'wsk trigger fire ttt'))

  it('should get package foofoo with autocomplete', () => tabby(this.app, 'wsk package get f', 'wsk package get foofoo')
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foofoo'))
    .catch(common.oops(this)))

  it('should auto complete wsk command', () => tabby(this.app, 'ws', 'wsk', false))
  it('should auto complete wsk rules command', () => tabby(this.app, 'wsk rul', 'wsk rules', false))
  it('should auto complete wsk triggers command', () => tabby(this.app, 'wsk trig', 'wsk triggers', false))

  it('should tab complete wsk action', () => tabbyWithOptions(this.app, 'wsk ac',
    ['wsk action', 'wsk activations'],
    'wsk actions',
    { click: 0, expectOK: false }))
})
