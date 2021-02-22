/*
 * Copyright 2017 The Kubernetes Authors
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

import { Common, CLI, Keys, ReplExpect, Selectors } from '@kui-shell/test'

Common.localDescribe('Text search', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // 2 matches test
  it('should add grumble to the repl', () =>
    CLI.command('grumble', this.app)
      .then(ReplExpect.error(127))
      .catch(Common.oops(this, true)))
  it('should add another grumble to the repl', () =>
    CLI.command('grumble', this.app)
      .then(ReplExpect.error(127))
      .catch(Common.oops(this, true)))
  it('should add bojangles to the repl', () =>
    CLI.command('bojangles', this.app)
      .then(ReplExpect.error(127))
      .catch(Common.oops(this, true)))

  it('should open the search bar when cmd+f is pressed', async () => {
    await this.app.client.keys([Keys.ctrlOrMeta, 'f'])
    await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed())

    await this.app.client.waitUntil(
      async () => {
        return this.app.client.$('#search-input').then(_ => _.isFocused())
      },
      { timeout: CLI.waitTimeout }
    )
  })

  xit('should not close the search bar if pressing esc outside of search input', async () => {
    await this.app.client.$(Selectors.CURRENT_PROMPT_BLOCK).then(_ => _.click())
    await this.app.client.keys(Keys.ESCAPE)
    await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed())
  })

  xit('should focus on search input when search input is pressed', async () => {
    await this.app.client.waitUntil(
      async () => {
        await this.app.client.$('#search-input').then(_ => _.click())
        const hasFocus = await this.app.client.$('#search-input').then(_ => _.isFocused())
        return hasFocus
      },
      { timeout: CLI.waitTimeout }
    )
  })

  it('should close the search bar via ctrl+f', async () => {
    await this.app.client.keys(['NULL', Keys.ctrlOrMeta, 'f'])
    await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed({ timeout: 20000, reverse: true }))
  })

  // re-open, so that we can test the close button
  // !!! Notes: some odd chrome or chromedriver bugs: if you click on
  // the close button, then chrome/chromedriver/whatever refuses to
  // accept any input; both setValue on the INPUT and the ctrlOrMeta+F
  // fail
  /* it('should open the search bar when cmd+f is pressed', async () => {
    await this.app.client.keys([Keys.ctrlOrMeta, 'f'])
    await this.app.client.waitForVisible('#search-bar')
  })

  it('should close the search bar if clicking the close button', async () => {
    await new Promise(resolve => setTimeout(resolve, 5000))
    await this.app.client.click('#search-close-button')
    await this.app.client.waitForVisible('#search-bar', 2000, true) // reverse: true
    await this.app.client.waitUntil(async () => {
      const hasFocus = await this.app.client.hasFocus(ui.Selectors.CURRENT_PROMPT)
      return hasFocus
    })
  }) */

  const type = async (text: string) => {
    await this.app.client.execute(
      (text: string) =>
        navigator.clipboard.writeText(text).then(() => {
          document.execCommand('paste')
        }),
      text
    )

    let idx = 0
    await this.app.client.waitUntil(
      async () => {
        const actualText = await this.app.client.$('#search-input').then(_ => _.getValue())
        console.error('3T', actualText)

        if (++idx > 5) {
          console.error(`still waiting for search result actualText=${actualText} expectedText=${text}`)
        }

        return actualText === text
      },
      { timeout: CLI.waitTimeout }
    )
  }

  const waitForSearchFoundText = async (searchFoundText: string) => {
    let idx = 0
    await this.app.client.waitUntil(
      async () => {
        await this.app.client.$('#search-found-text').then(_ => _.waitForExist())
        const txt = await this.app.client.$('#search-found-text').then(_ => _.getText())

        if (++idx > 5) {
          console.error(`still waiting for search result actualText=${txt} expectedText=${searchFoundText}`)
        }

        console.error('4a', txt)
        return txt === searchFoundText
      },
      { timeout: CLI.waitTimeout }
    )
  }

  const findMatch = (typeText: string, searchFoundText: string) => {
    it(`should find ${searchFoundText} for ${typeText}`, async () => {
      try {
        console.error('1', typeText)
        await this.app.client.waitUntil(
          async () => {
            await this.app.client.keys(['NULL', Keys.ctrlOrMeta, 'f'])
            console.error('1a')
            await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed({ timeout: 4000 }))
            return true
          },
          { timeout: CLI.waitTimeout }
        )

        console.error('2')
        await this.app.client.waitUntil(() => this.app.client.$('#search-input').then(_ => _.isFocused()), {
          timeout: CLI.waitTimeout
        })

        console.error('3')
        await type(typeText)

        console.error('4', searchFoundText)
        await waitForSearchFoundText(searchFoundText)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  findMatch('grumble', '4 matches') // two executions plus two 'Command not found: grumble' matches, and no tab title match!

  // 1 match test
  it('should close the search bar via ctrl+f', () =>
    this.app.client
      .keys(['NULL', Keys.ctrlOrMeta, 'f'])
      .then(() => this.app.client.$('#search-bar'))
      .then(_ => _.waitForDisplayed({ timeout: 2000, reverse: true }))
      .catch(Common.oops(this, true)))

  findMatch('bojangles', '2 matches') // one execution, plus one "Command not found: bojangles" match (not with carbon themes: plus one tab title match)

  // no matches test
  it('should close the search bar via ctrl+f', async () => {
    return this.app.client
      .keys(['NULL', Keys.ctrlOrMeta, 'f'])
      .then(() => this.app.client.$('#search-bar'))
      .then(_ => _.waitForDisplayed({ timeout: 2000, reverse: true }))
      .catch(Common.oops(this, true))
  })
  // re-open, so that we can test entering text and hitting enter
  it('should find nothing when searching for waldo', () =>
    this.app.client
      .keys(['NULL', Keys.ctrlOrMeta, 'f'])
      .then(() => this.app.client.$('#search-bar'))
      .then(_ => _.waitForDisplayed())
      .then(() =>
        this.app.client.waitUntil(() => this.app.client.$('#search-input').then(_ => _.isFocused()), {
          timeout: CLI.waitTimeout
        })
      )
      .then(async () => {
        console.error('5')
        await type(`waldo`)

        console.error('6')
        await waitForSearchFoundText('No matches')
      })
      .catch(Common.oops(this, true)))

  // paste test; reload first to start with a clean slate in the text search box
  it('should reload the app', () => Common.refresh(this))
  it('should paste into the text search box', async () => {
    return this.app.client
      .keys(['NULL', Keys.ctrlOrMeta, 'f'])
      .then(() => this.app.client.$('#search-bar'))
      .then(_ => _.waitForDisplayed())
      .then(() =>
        this.app.client.waitUntil(() => this.app.client.$('#search-input').then(_ => _.isFocused()), {
          timeout: CLI.waitTimeout
        })
      )
      .then(() => this.app.electron.clipboard.writeText('grumble'))
      .then(() => this.app.client.execute(() => document.execCommand('paste')))
      .then(() => this.app.client.$('#search-input'))
      .then(_ => _.getValue())
      .then(actual => assert.strictEqual(actual, 'grumble')) // paste made it to #search-input?
      .catch(Common.oops(this, true))
  })
})
