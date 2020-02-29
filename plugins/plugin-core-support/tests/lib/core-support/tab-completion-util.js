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

const expectArray = (expected /*: string[] */) => (actual /*: string | string[] */) => {
  const act = (Array.isArray(actual) ? actual : [actual]).map(_ => _.replace(/\n/g, ''))
  return Util.expectArray(expected)(act)
}

exports.tabby = (ctx, partial, full, expectOK = true) =>
  ctx.app.client
    .waitForExist(Selectors.CURRENT_PROMPT_BLOCK, CLI.waitTimeout)
    .then(() => ctx.app.client.getAttribute(Selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
    .then(count => parseInt(count, 10))
    .then(count =>
      ctx.app.client
        .setValue(Selectors.CURRENT_PROMPT, partial)
        .then(() => ctx.app.client.waitForValue(Selectors.PROMPT_N(count), partial))
        .then(() => ctx.app.client.setValue(Selectors.CURRENT_PROMPT, `${partial}${Keys.TAB}`))
        .then(() => ctx.app.client.waitForValue(Selectors.PROMPT_N(count), full))
    )
    .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
    .then(() => CLI.command('', ctx.app)) // "enter" to complete the repl
    .then(data => {
      if (expectOK) {
        return ReplExpect.okWithAny(data)
      } else {
        return ctx.app
      }
    })
    .catch(Common.oops(ctx, true))

exports.tabbyWithOptions = (
  ctx,
  partial,
  expected,
  full,
  { click = undefined, nTabs = undefined, expectOK = true, expectedPromptAfterTab = undefined } = {}
) => {
  return ctx.app.client
    .waitForExist(Selectors.CURRENT_PROMPT_BLOCK)
    .then(() => ctx.app.client.getAttribute(Selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
    .then(count => parseInt(count, 10))
    .then(count =>
      ctx.app.client
        .setValue(Selectors.CURRENT_PROMPT, partial)
        .then(() => ctx.app.client.waitForValue(Selectors.PROMPT_N(count), partial))
        .then(() => ctx.app.client.setValue(Selectors.CURRENT_PROMPT, `${partial}${Keys.TAB}`))
        .then(() => {
          if (expectedPromptAfterTab) {
            return ctx.app.client.waitForValue(Selectors.PROMPT_N(count), expectedPromptAfterTab)
          }
        })
        .then(() => {
          if (!expected) {
            // then we expect non-visibility of the tab-completion popup
            // console.error('Expecting non-existence of popup')
            return ctx.app.client
              .waitForVisible(
                `${Selectors.PROMPT_BLOCK_N(count)} .kui--tab-completions .kui--tab-completions--option a`,
                10000,
                true
              )
              .then(() => {
                // great, the tab completion popup does not exist; early exit
                const err = new Error()
                err['failedAsExpected'] = true
                throw err
              })
          } else {
            const selector = `${Selectors.PROMPT_BLOCK_N(count)} .kui--tab-completions .kui--tab-completions--option a`
            // console.error('Expecting existence of popup', selector)
            return ctx.app.client.waitForVisible(selector, 10000)
          }
        })
        .then(() =>
          ctx.app.client.getText(
            `${Selectors.PROMPT_BLOCK_N(count)} .kui--tab-completions .kui--tab-completions--option a`
          )
        )
        .then(expectArray(expected))
        // .then(() => { console.error('Got expected options') })
        .then(() => {
          if (click !== undefined) {
            // click on a row
            const selector = `${Selectors.PROMPT_BLOCK_N(
              count
            )} .kui--tab-completions .kui--tab-completions--option[data-value="${expected[click].replace(
              /\\/g,
              '\\\\'
            )}"] a`
            // console.error('clicking', click, selector)
            return ctx.app.client.waitForVisible(selector, 10000).then(() => ctx.app.client.click(selector))
          } else {
            // otherwise hit tab a number of times, to cycle to the desired entry
            // console.error('tabbing', nTabs)
            return exports.doTimes(nTabs, () => ctx.app.client.keys('Tab')).then(() => ctx.app.client.keys('Enter'))
          }
        })
        .then(() =>
          ctx.app.client.waitForVisible(`${Selectors.PROMPT_BLOCK_N(count)} .kui--tab-completions`, 8000, true)
        ) // wait for non-existence of the temporary
        .then(() => ctx.app.client.waitForValue(Selectors.PROMPT_N(count), full))
    )
    .then(() => CLI.command('', ctx.app))
    .then(data => {
      if (expectOK) {
        return ReplExpect.okWithAny(data)
      } else {
        return ctx.app
      }
    })
    .catch(err =>
      ctx.app.client
        .keys(Keys.ctrlC) // clear the line
        .then(() => Common.oops(ctx)(err))
    )
}

exports.tabbyWithOptionsThenCancel = (ctx, partial, expected) =>
  ctx.app.client
    .waitForExist(Selectors.CURRENT_PROMPT_BLOCK)
    .then(() => ctx.app.client.getAttribute(Selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
    .then(count => parseInt(count, 10))
    .then(count =>
      ctx.app.client
        .setValue(Selectors.CURRENT_PROMPT, partial)
        .then(() => ctx.app.client.waitForValue(Selectors.PROMPT_N(count), partial))
        .then(() => ctx.app.client.setValue(Selectors.CURRENT_PROMPT, `${partial}${Keys.TAB}`))
        .then(() =>
          ctx.app.client.waitForVisible(
            `${Selectors.PROMPT_BLOCK_N(count)} .kui--tab-completions .kui--tab-completions--option a`
          )
        )
        .then(() =>
          ctx.app.client.getText(
            `${Selectors.PROMPT_BLOCK_N(count)} .kui--tab-completions .kui--tab-completions--option`
          )
        )
        .then(expectArray(expected))
        .then(() => ctx.app.client.keys('ffffff')) // type something random
        .then(() =>
          ctx.app.client.waitForVisible(`${Selectors.PROMPT_BLOCK_N(count)} .kui--tab-completions`, 20000, true)
        )
    ) // wait for non-existence of the temporary
    .then(() => ctx.app.client.keys(Keys.ctrlC)) // clear the line
    .catch(Common.oops(ctx, true))
