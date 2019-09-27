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

const { Common, CLI, Keys, ReplExpect, Selectors, Util } = require('@kui-shell/test')
const fs = require('fs')

const { openSync, closeSync } = fs

/** touch the given filepath */
exports.touch = filepath => {
  closeSync(openSync(filepath, 'w'))
}

/** execute the given async task n times */
exports.doTimes = (n, task) => {
  if (n > 0) {
    return task().then(() => exports.doTimes(n - 1, task))
  } else {
    return Promise.resolve()
  }
}

exports.tabby = (app, partial, full, expectOK = true) =>
  app.client
    .waitForExist(Selectors.CURRENT_PROMPT_BLOCK)
    .then(() => app.client.getAttribute(Selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
    .then(count => parseInt(count, 10))
    .then(count =>
      app.client
        .setValue(Selectors.CURRENT_PROMPT, partial)
        .then(() => app.client.waitForValue(Selectors.PROMPT_N(count), partial))
        .then(() => app.client.setValue(Selectors.CURRENT_PROMPT, `${partial}${Keys.TAB}`))
        .then(() => app.client.waitForValue(Selectors.PROMPT_N(count), full))
    )
    .then(() => new Promise(resolve => setTimeout(resolve, 500)))
    .then(() => CLI.command('', app)) // "enter" to complete the repl
    .then(data => {
      if (expectOK) {
        return ReplExpect.okWithAny(data)
      } else {
        return app
      }
    })
    .catch(Common.oops(app))

exports.tabbyWithOptions = (
  app,
  partial,
  expected,
  full,
  { click = undefined, nTabs = undefined, expectOK = true, expectedPromptAfterTab = undefined } = {}
) => {
  return app.client
    .waitForExist(Selectors.CURRENT_PROMPT_BLOCK)
    .then(() => app.client.getAttribute(Selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
    .then(count => parseInt(count, 10))
    .then(count =>
      app.client
        .setValue(Selectors.CURRENT_PROMPT, partial)
        .then(() => app.client.waitForValue(Selectors.PROMPT_N(count), partial))
        .then(() => app.client.setValue(Selectors.CURRENT_PROMPT, `${partial}${Keys.TAB}`))
        .then(() => {
          if (expectedPromptAfterTab) {
            return app.client.waitForValue(Selectors.PROMPT_N(count), expectedPromptAfterTab)
          }
        })
        .then(() => {
          if (!expected) {
            // then we expect non-visibility of the tab-completion popup
            // console.error('Expecting non-existence of popup')
            return app.client
              .waitForVisible(`${Selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .clickable`, 10000, true)
              .then(() => {
                // great, the tab completion popup does not exist; early exit
                const err = new Error()
                err['failedAsExpected'] = true
                throw err
              })
          } else {
            const selector = `${Selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .clickable`
            // console.error('Expecting existence of popup', selector)
            return app.client.waitForVisible(selector, 10000)
          }
        })
        .then(() => app.client.getText(`${Selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .clickable`))
        .then(Util.expectArray(expected))
        // .then(() => { console.error('Got expected options') })
        .then(() => {
          if (click !== undefined) {
            // click on a row
            const selector = `${Selectors.PROMPT_BLOCK_N(
              count
            )} .tab-completion-temporary .tab-completion-option[data-value="${expected[click].replace(
              /\\/g,
              '\\\\'
            )}"] .clickable`
            // console.error('clicking', click, selector)
            return app.client.waitForVisible(selector, 10000).then(() => app.client.click(selector))
          } else {
            // otherwise hit tab a number of times, to cycle to the desired entry
            // console.error('tabbing', nTabs)
            return exports.doTimes(nTabs, () => app.client.keys('Tab')).then(() => app.client.keys('Enter'))
          }
        })
        .then(() =>
          app.client.waitForVisible(`${Selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary`, 8000, true)
        ) // wait for non-existence of the temporary
        .then(() => app.client.waitForValue(Selectors.PROMPT_N(count), full))
    )
    .then(() => CLI.command('', app))
    .then(data => {
      if (expectOK) {
        return ReplExpect.okWithAny(data)
      } else {
        return app
      }
    })
    .catch(err =>
      app.client
        .keys(Keys.ctrlC) // clear the line
        .then(() => Common.oops(app)(err))
    )
}

exports.tabbyWithOptionsThenCancel = (app, partial, expected) =>
  app.client
    .waitForExist(Selectors.CURRENT_PROMPT_BLOCK)
    .then(() => app.client.getAttribute(Selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
    .then(count => parseInt(count, 10))
    .then(count =>
      app.client
        .setValue(Selectors.CURRENT_PROMPT, partial)
        .then(() => app.client.waitForValue(Selectors.PROMPT_N(count), partial))
        .then(() => app.client.setValue(Selectors.CURRENT_PROMPT, `${partial}${Keys.TAB}`))
        .then(() =>
          app.client.waitForVisible(`${Selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .clickable`)
        )
        .then(() => app.client.getText(`${Selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary .clickable`))
        .then(Util.expectArray(expected))
        .then(() => app.client.keys('ffffff')) // type something random
        .then(() =>
          app.client.waitForVisible(`${Selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary`, 20000, true)
        )
    ) // wait for non-existence of the temporary
    .then(() => app.client.keys(Keys.ctrlC)) // clear the line
    .catch(Common.oops(app))
