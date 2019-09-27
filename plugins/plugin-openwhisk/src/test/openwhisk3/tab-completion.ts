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

import { Application } from 'spectron'

import { Common, CLI, Keys, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

/** execute the given async task n times */
const doTimes = (n: number, task: () => Promise<void>) => {
  if (n > 0) {
    return task().then(() => doTimes(n - 1, task))
  } else {
    return Promise.resolve()
  }
}

const waitForValue = (app: Application, selector: string, expected: string) => {
  return app.client.waitUntil(async () => {
    await app.client.waitForValue(selector)
    const actual = await app.client.getValue(selector)
    return actual === expected
  })
}

describe('Tab completion openwhisk', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  const tabby = (app: Application, partial: string, full: string, expectOK = true) =>
    app.client
      .waitForExist(Selectors.CURRENT_PROMPT_BLOCK)
      .then(() => app.client.getAttribute(Selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
      .then(count => parseInt(count, 10))
      .then(count =>
        app.client
          .setValue(Selectors.CURRENT_PROMPT, partial)
          .then(() => waitForValue(app, Selectors.PROMPT_N(count), partial))
          .then(() => app.client.setValue(Selectors.CURRENT_PROMPT, `${partial}${Keys.TAB}`))
          .then(() => waitForValue(app, Selectors.PROMPT_N(count), full))
      )
      .then(() => new Promise(resolve => setTimeout(resolve, 500)))
      .then(() => CLI.command('', app)) // "enter" to complete the repl
      .then(async data => {
        if (expectOK) {
          const res = await data
          return ReplExpect.okWithAny(res)
        } else {
          return Promise.resolve(app)
        }
      })
      .catch(Common.oops(this))

  const tabbyWithOptions = (
    app: Application,
    partial: string,
    expected?: string[],
    full?: string,
    { click = undefined, nTabs = undefined, expectOK = true, expectedPromptAfterTab = undefined } = {}
  ) => {
    return app.client
      .waitForExist(Selectors.CURRENT_PROMPT_BLOCK)
      .then(() => app.client.getAttribute(Selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
      .then(count => parseInt(count, 10))
      .then(count =>
        app.client
          .setValue(Selectors.CURRENT_PROMPT, partial)
          .then(() => waitForValue(app, Selectors.PROMPT_N(count), partial))
          .then(() => app.client.setValue(Selectors.CURRENT_PROMPT, `${partial}${Keys.TAB}`))
          .then(() => {
            if (expectedPromptAfterTab) {
              return waitForValue(app, Selectors.PROMPT_N(count), expectedPromptAfterTab)
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
              )} .tab-completion-temporary .tab-completion-option[data-value="${expected[click]}"] .clickable`
              // console.error('clicking', click, selector)
              return app.client.waitForVisible(selector, 10000).then(() => app.client.click(selector))
            } else {
              // otherwise hit tab a number of times, to cycle to the desired entry
              // console.error('tabbing', nTabs)
              return doTimes(nTabs, async () => {
                await app.client.keys('Tab')
              }).then(() => app.client.keys('Enter'))
            }
          })
          .then(() =>
            app.client.waitForVisible(`${Selectors.PROMPT_BLOCK_N(count)} .tab-completion-temporary`, 8000, true)
          ) // wait for non-existence of the temporary
          .then(() => waitForValue(app, Selectors.PROMPT_N(count), full))
      )
      .then(() => CLI.command('', app))
      .then(async data => {
        if (expectOK) {
          const res = await data
          return ReplExpect.okWithAny(res)
        } else {
          return app
        }
      })
      .catch(async err => {
        await this.app.client.keys(Keys.ctrlC) // clear the line
        if (!err['failedAsExpected']) {
          return Common.oops(this)(err)
        }
      })
  }

  it('should create an action foo', () =>
    CLI.command('let foo = x=>x', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should create an action foo2', () =>
    CLI.command('let foo2 = x=>x', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should create an action bar', () =>
    CLI.command('let bar = x=>x', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should create an action foofoo/yum', () =>
    CLI.command('let foofoo/yum = x=>x', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  // expect b to autocomplete with only tab, since we only have one action starting with b
  it('should tab complete action get bar', () => tabby(this.app, 'wsk action get b', 'wsk action get bar'))
  it('should tab complete action invoke bar', () => tabby(this.app, 'wsk action invoke b', 'wsk action invoke bar'))
  it('should tab complete invoke bar', () => tabby(this.app, 'wsk action invoke b', 'wsk action invoke bar'))
  it('should tab complete async bar', () => tabby(this.app, 'wsk action async b', 'wsk action async bar'))

  it('should tab complete action foo2 with options', async () => {
    await tabbyWithOptions(this.app, 'wsk action get f', ['foofoo/yum', 'foo2', 'foo'], 'wsk action get foo2', {
      click: 1,
      expectedPromptAfterTab: 'wsk action get foo'
    })

    return Promise.resolve(this.app)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo2'))
      .catch(Common.oops(this))
  })

  it('should tab complete action foo with options (no prefix)', async () => {
    await tabbyWithOptions(this.app, 'wsk action get ', ['foofoo/yum', 'bar', 'foo2', 'foo'], 'wsk action get foo', {
      click: 3
    })

    return Promise.resolve(this.app)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .catch(Common.oops(this))
  })

  it('should not tab complete action without trailing whitespace', async () => {
    try {
      await tabbyWithOptions(this.app, 'wsk action get')
    } catch (err) {
      if (!err.failedAsExpected) {
        throw err
      } else {
        return this.app.client.keys(Keys.ctrlC) // clear the line
      }
    }
  })

  it('should create a trigger', () =>
    CLI.command('wsk trigger create ttt', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should fire trigger with autocomplete', () => tabby(this.app, 'wsk trigger fire t', 'wsk trigger fire ttt'))

  it('should get package foofoo with autocomplete', async () => {
    await tabby(this.app, 'wsk package get f', 'wsk package get foofoo')

    return Promise.resolve(this.app)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foofoo'))
      .catch(Common.oops(this))
  })

  it('should auto complete wsk command', () => tabby(this.app, 'ws', 'wsk', false))
  it('should auto complete wsk rules command', () => tabby(this.app, 'wsk rul', 'wsk rules', false))
  it('should auto complete wsk triggers command', () => tabby(this.app, 'wsk trig', 'wsk triggers', false))

  it('should tab complete wsk action', () =>
    tabbyWithOptions(this.app, 'wsk ac', ['wsk action', 'wsk activations'], 'wsk actions ', {
      click: 0,
      expectOK: false
    }))
})
