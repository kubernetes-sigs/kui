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

  /*
  ####################################################################################
  # TESTING BASIC FUNCTIONALITIES: OPEN/CLOSE VIA CMD+F, FOCUS ON/OFF SEARCHBAR
  ####################################################################################
  */
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
        return await this.app.client.$('#search-bar input').then(_ => _.isFocused())
      },
      { timeout: 3000 }
    )
  })

  it('should close the search bar via ctrl+f', async () => {
    await this.app.client.keys([Keys.ctrlOrMeta, 'F'])
    await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed({ timeout: 3000, reverse: true }))
  })

  /*
  ####################################################################################
  # THE FOLLOWING ARE MATCHING TESTS. WE TEST IF THE NUMBER OF MATCHES OF A 
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
            const totalMatches = txt.substring(txt.indexOf('/') + 1)
            await this.app.client
              .$('#search-bar .pf-c-search-input__clear .pf-c-button.pf-m-plain')
              .then(_ => _.click())
            return totalMatches === searchFoundText
          },
          { timeout: 3000 }
        )
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  // 5 match test: two executions plus two 'Command not found: grumble' matches
  findMatch('grumble', '5')

  // 3 match test: one execution plus one 'Command not found: bojangles' match
  findMatch('bojangles', '3')

  // no matches test  ############### !!!!!!!! TODO: fix logic of no matches !!!!!!!!!! ###############
  findMatch('waldo', '1')

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
  # TESTING VISIBILITY OF RESULTS COUNTER, NAVIGATION ARROWS, AND CLOSE BUTTON
  ####################################################################################
  */
  it('should not display results counter when search bar is opened and input field is empty', async () => {
    // closing search bar and clearing text from input field
    await this.app.client.$('#search-bar .pf-c-search-input__clear .pf-c-button.pf-m-plain').then(_ => _.click())
    // open the search bar
    await this.app.client.keys([Keys.ctrlOrMeta, 'F'])
    await this.app.client.$('#search-bar').then(_ => _.waitForDisplayed({ timeout: CLI.waitTimeout }))
    await this.app.client.waitUntil(
      async () => {
        return this.app.client.$('#search-bar input').then(_ => _.isFocused())
      },
      { timeout: CLI.waitTimeout }
    )
    // make sure results counter is not displayed
    await this.app.client
      .$('#search-bar .pf-c-search-input__count')
      .then(_ => _.waitForDisplayed({ timeout: 3000, reverse: true }))
  })

  it('should not display navigation arrows when search bar is opened and input field is empty', async () => {
    // make sure navigation arrows are not displayed
    await this.app.client
      .$('#search-bar button:nth-child(1)')
      .then(_ => _.waitForDisplayed({ timeout: 3000, reverse: true }))
    await this.app.client
      .$('#search-bar button:nth-child(2)')
      .then(_ => _.waitForDisplayed({ timeout: 3000, reverse: true }))
  })

  it('should not display close button when search bar is opened and input field is empty', async () => {
    // make sure close button is not displayed
    await this.app.client
      .$('#search-bar .pf-c-search-input__clear .pf-c-button.pf-m-plain')
      .then(_ => _.waitForDisplayed({ timeout: 3000, reverse: true }))
  })

  it('should add text to CLI, then focus on search bar and add text to input field', async () => {
    // adding text to CLI for later search
    await CLI.command('searching', this.app)
      .then(ReplExpect.error(127))
      .catch(Common.oops(this, true))
    // clicking on search bar to focus it
    await this.app.client.$('#search-bar').then(_ => _.click())
    await this.app.client.waitUntil(
      async () => {
        return this.app.client.$('#search-bar input').then(_ => _.isFocused())
      },
      { timeout: 7000 }
    )
    // adding text to search bar input field
    await type('searching')
  })

  it('should display results counter when search bar input field has text', async () => {
    // make sure results counter is displayed
    await this.app.client.$('#search-bar .pf-c-search-input__count').then(_ => _.waitForDisplayed({ timeout: 3000 }))
  })

  it('should display navigation arrows when search bar input field has text', async () => {
    // make sure navigation arrows are displayed
    await this.app.client.$('#search-bar button:nth-child(1)').then(_ => _.waitForDisplayed({ timeout: 3000 }))
    await this.app.client.$('#search-bar button:nth-child(2)').then(_ => _.waitForDisplayed({ timeout: 3000 }))
  })

  it('should display close button when search bar input field has text', async () => {
    // make sure close button is is displayed
    await this.app.client
      .$('#search-bar .pf-c-search-input__clear .pf-c-button.pf-m-plain')
      .then(_ => _.waitForDisplayed({ timeout: 3000 }))
  })

  /*
  ####################################################################################
  # TESTING NAVIGATION BUTTONS
  ####################################################################################
  */
  it('should increase result count when "NEXT" navigation arrow is pressed', async () => {
    // getting old result count
    const resultCount = await this.app.client.$('#search-bar').then(_ => _.getText())
    const oldResult = resultCount.substring(0, resultCount.indexOf('/'))
    // clicking the NEXT arrow once
    await this.app.client.$('#search-bar button:nth-child(2)').then(_ => _.click())
    // getting the new result count
    const newCount = await this.app.client.$('#search-bar').then(_ => _.getText())
    const curResultCount = newCount.substring(0, newCount.indexOf('/'))
    // checking that the result count increased by one
    const oldResultCount = parseInt(oldResult) + 1
    return curResultCount === oldResultCount.toString()
  })

  it('should decrease result count when "PREVIOUS" navigation arrow is pressed', async () => {
    // getting old result count
    const resultCount = await this.app.client.$('#search-bar').then(_ => _.getText())
    const oldResult = resultCount.substring(0, resultCount.indexOf('/'))
    // clicking the PREVIOUS arrow once
    await this.app.client.$('#search-bar button:nth-child(1)').then(_ => _.click())
    // getting the new result count
    const newCount = await this.app.client.$('#search-bar').then(_ => _.getText())
    const curResultCount = newCount.substring(0, newCount.indexOf('/'))
    // checking that the result count decreased by one
    const oldResultCount = parseInt(oldResult) - 1
    return curResultCount === oldResultCount.toString()
  })

  it('should do nothing if on last result and "NEXT" navigation arrow is pressed', async () => {
    // getting current result count and total matches
    const resultCount = await this.app.client.$('#search-bar').then(_ => _.getText())
    const curResult = parseInt(resultCount.substring(0, resultCount.indexOf('/')))
    const totalMatches = parseInt(resultCount.substring(resultCount.indexOf('/') + 1))

    // navigating to the last result
    let iter = curResult
    while (iter !== totalMatches) {
      // clicking the NEXT arrow as many times as it takes to get to last result
      await this.app.client.$('#search-bar button:nth-child(2)').then(_ => _.click())
      const tmp = await this.app.client.$('#search-bar').then(_ => _.getText())
      iter = parseInt(tmp.substring(0, tmp.indexOf('/')))
    }

    // try clicking the NEXT arrow once
    await this.app.client.$('#search-bar button:nth-child(2)').then(_ => _.click())

    // getting the current result after clicking the arrow
    const newCount = await this.app.client.$('#search-bar').then(_ => _.getText())
    const newResult = parseInt(newCount.substring(0, newCount.indexOf('/')))

    // checking that the result count has not changed
    return iter === newResult
  })

  it('should do nothing if on first result and "PREVIOUS" navigation arrow is pressed', async () => {
    // getting current result count
    const resultCount = await this.app.client.$('#search-bar').then(_ => _.getText())
    const curResult = parseInt(resultCount.substring(0, resultCount.indexOf('/')))

    // navigating to the first result
    let iter = curResult
    while (iter !== 1) {
      // clicking the PREVIOUS arrow as many times as it takes to get to last result
      await this.app.client.$('#search-bar button:nth-child(1)').then(_ => _.click())
      const tmp = await this.app.client.$('#search-bar').then(_ => _.getText())
      iter = parseInt(tmp.substring(0, tmp.indexOf('/')))
    }

    // try clicking the PREVIOUS arrow once
    await this.app.client.$('#search-bar button:nth-child(1)').then(_ => _.click())

    // getting the current result after clicking the arrow
    const newCount = await this.app.client.$('#search-bar').then(_ => _.getText())
    const newResult = parseInt(newCount.substring(0, newCount.indexOf('/')))

    // checking that the result has not changed
    return iter === newResult
  })

  /*
  ####################################################################################
  # TESTING THE CLOSE BUTTON 
  ####################################################################################
  */
  it('should close the search bar if clicking the close button', async () => {
    await this.app.client.$('#search-bar .pf-c-search-input__clear .pf-c-button.pf-m-plain').then(_ => _.click())
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
      return textInSearchBar === '' && !!displayResults
    })
  })
})
