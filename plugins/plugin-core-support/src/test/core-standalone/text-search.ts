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
    await this.app.client.keys([Keys.ctrlOrMeta, 'F'])
    await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed({ timeout: CLI.waitTimeout }))

    await this.app.client.waitUntil(
      async () => {
        return this.app.client.$('#search-bar input').then(_ => _.isFocused())
      },
      { timeout: CLI.waitTimeout }
    )
  })

  it('should not close the search bar if pressing esc outside of search bar', async () => {
    await this.app.client.$(Selectors.CURRENT_PROMPT_BLOCK).then(_ => _.click())
    await this.app.client.keys(Keys.ESCAPE)
    await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed({ timeout: 3000 }))
  })

  it('should focus on search bar when search bar is pressed', async () => {
    await this.app.client.$('#search-bar').then(_ => _.click())
    await this.app.client.waitUntil(
      async () => {
        const hasFocus = await this.app.client.$('#search-bar input').then(_ => _.isFocused())
        return hasFocus
      },
      { timeout: 3000 }
    )
  })

  const closeSearchBar = async () => {
    await this.app.client.keys([Keys.ctrlOrMeta, 'F'])
    await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed({ timeout: 3000, reverse: true }))
  }

  it('should close the search bar via ctrl+f', async () => {
    closeSearchBar()
  })

  /*
  ####################################################################################
  # THE FOLLOWING ARE ALL MATCHING TESTS. WE TEST IF THE NUMBER OF MATCHES OF A 
  # PARTICULAR INPUT MATCHES THAT OUTPUTTED ON THE SEARCH BAR 
  ####################################################################################
  */
  const type = async (text: string) => {
    // deleting any existing text in search bar input field
    await this.app.client.$('#search-bar input').then(_ => _.setValue(''))
    // pasting the input text into the search bar input field
    await this.app.client.$('#search-bar input').then(_ => _.setValue(text))
    // making sure the word in the input field is the same word we want to search for
    await this.app.client.waitUntil(
      async () => {
        const actualText = await this.app.client.$('#search-bar input').then(_ => _.getValue())
        return actualText === text
      },
      { timeout: 3000 }
    )
  }

  const findMatch = (typeText: string, searchFoundText: string) => {
    it(`should find ${searchFoundText} matches for ${typeText}`, async () => {
      try {
        // opening the search bar
        await this.app.client.waitUntil(
          async () => {
            await this.app.client.keys([Keys.ctrlOrMeta, 'F'])
            await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed({ timeout: 3000 }))
            return this.app.client.$('#search-bar input').then(_ => _.isFocused())
          },
          { timeout: CLI.waitTimeout }
        )
        // typing the word to find matches for into the search bar
        await type(typeText)
        // finding number of matches
        await this.app.client.waitUntil(
          async () => {
            await this.app.client.$('#search-bar input').then(_ => _.waitForExist({ timeout: 3000 }))
            const txt = await this.app.client.$('#search-bar').then(_ => _.getText())
            return txt === searchFoundText
          },
          { timeout: 3000 }
        )
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  // 4 match test: two executions plus two 'Command not found: grumble' matches
  findMatch('grumble', '4')

  // 1 match test: one execution plus one 'Command not found: bojangles' match
  closeSearchBar()
  findMatch('bojangles', '2')

  // no matches test
  closeSearchBar()
  findMatch('waldo', '0')

  // ############### !!!!!!!!!!!!!!!!!!!! TODO: test entering text and hitting enter !!!!!!!!!!!!!!!!!!!! ###############

  // paste test; reload first to start with a clean slate in the text search box
  it('should reload the app', () => Common.refresh(this))

  // testing paste and making sure nothing else in Kui intercepts the paste
  it('should paste into the text search box', async () => {
    // open the search bar and focus it
    await this.app.client.keys([Keys.ctrlOrMeta, 'F'])
    await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed({ timeout: CLI.waitTimeout }))
    await this.app.client.waitUntil(
      async () => {
        return this.app.client.$('#search-bar input').then(_ => _.isFocused())
      },
      { timeout: CLI.waitTimeout }
    )

    // write text using electron
    await this.app.electron.clipboard.writeText('grumble')
    await this.app.client.execute(() => document.execCommand('paste'))

    // get text from the search bar
    const actualText = await this.app.client.$('#search-bar input').then(_ => _.getValue())
    return actualText === 'grumble'
  })

  /*
  ####################################################################################
  # TESTING THE CLOSE BUTTON 
  ####################################################################################
  */
  it('should close the search bar if clicking the close button', async () => {
    await this.app.client.$('#search-bar button').then(_ => _.click())
    await this.app.client.waitUntil(async () => {
      // checking that search bar isn't displayed
      const displayResults = await this.app.client
        .$('#search-bar')
        .then(_ => _.waitForDisplayed({ timeout: 3000, reverse: true }))
      // open the search bar and focus it
      await this.app.client.keys([Keys.ctrlOrMeta, 'F'])
      await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed({ timeout: CLI.waitTimeout }))
      await this.app.client.waitUntil(
        async () => {
          return this.app.client.$('#search-bar input').then(_ => _.isFocused())
        },
        { timeout: CLI.waitTimeout }
      )
      // checking that there's no text in the input field after it's been closed
      const textInSearchBar = await this.app.client.$('#search-bar input').then(_ => _.getValue())
      return textInSearchBar === '' && displayResults
    })
  })
})
