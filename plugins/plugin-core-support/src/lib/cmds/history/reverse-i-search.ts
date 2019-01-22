/*
 * Copyright 2018 IBM Corporation
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

import * as Debug from 'debug'
const debug = Debug('core-support/history/reverse-i-search')

import * as historyModel from '@kui-shell/core/models/history'
import { getCurrentBlock, getCurrentPrompt, getCurrentPromptLeft } from '@kui-shell/core/webapp/cli'
import { keys } from '@kui-shell/core/webapp/keys'
import { inBrowser } from '@kui-shell/core/core/capabilities'

// TODO externalize
const strings = {
  prompt: '(reverse-i-search$1):`$2\' '
}

/**
 * Listen for ctrl+R, with a fail-safe try/catch
 *
 */
export default () => {
  try {
    registerListener()
  } catch (err) {
    // console.error('Not running in electron environment')
    debug('Not running in electron environment')
  }
}

/**
 * Listen for ctrl+R
 *
 */
function registerListener () {
  if (typeof document === 'undefined') {
    // fail-safe, in case we have no DOM
    return
  }

  /** state of the reverse-i-search */
  let isSearchActive = false
  let currentOnKeypress
  let currentOnInput
  let currentSearchIdx = -1
  let placeholder
  let placeholderFixedPart
  let placeholderContentPart
  let placeholderTypedPart
  let placeholderMatchedPrefixPart
  let placeholderMatchedSuffixPart
  let promptLeft

  /**
   * For various reasons, user has cancelled a reverse-i-search.
   *
   */
  const cancelISearch = () => {
    if (isSearchActive) {
      isSearchActive = false
      currentSearchIdx = -1

      const prompt = getCurrentPrompt()
      prompt.onkeypress = currentOnKeypress
      prompt.oninput = currentOnInput
      getCurrentBlock().classList.remove('using-custom-prompt')
      if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder)
      }
      prompt.focus()

      prompt.style.opacity = '1'
      prompt.style.width = 'auto'
    }
  }

  /**
   * Attempt to initiate or extend a search
   *
   */
  function doSearch (evt) {
    debug('doSearch', evt)

    if (evt.inputType === 'deleteContentBackward') {
      // if the user hits Backspace, reset currentSearchIdx
      // TODO confirm that this is the behavior of bash
      currentSearchIdx = -1
      placeholderFixedPart.innerText = strings.prompt.replace(/\$1/, ``).replace(/\$2/, this.value)
    }

    // where do we want to start the search? if the user is just
    // typing, then start from the end of history; if the user hit
    // ctrl+r, then they want to search for the next match
    const userHitCtrlR = evt.ctrlKey && evt.code === 'KeyR'
    const startIdx = userHitCtrlR ? currentSearchIdx - 1 : -1

    const newSearchIdx = this.value && historyModel.findIndex(this.value, startIdx)
    debug('search index', this.value, newSearchIdx)

    if (newSearchIdx > 0) {
      currentSearchIdx = newSearchIdx

      placeholderFixedPart.innerText = strings.prompt.replace(/\$1/, ` ${newSearchIdx}`).replace(/\$2/, this.value)

      const newValue = historyModel.lines[currentSearchIdx].raw
      debug('newValue', newValue)
      const caretPosition = newValue.indexOf(this.value) + 1
      debug('caretPosition', caretPosition)

      const matchedPrefix = newValue.substring(0, caretPosition - 1)
      const matchedSuffix = newValue.substring(caretPosition + this.value.length - 1)
      debug('matchedPrefix', matchedPrefix, newValue, caretPosition)
      debug('matchedSuffix', matchedSuffix)
      placeholderTypedPart.innerText = this.value.replace(/ /g, '_') // show matched whitespaces with an underscore
      placeholderMatchedPrefixPart.innerText = matchedPrefix
      placeholderMatchedSuffixPart.innerText = matchedSuffix
      placeholderContentPart.setAttribute('data-full-match', newValue)
    } else if (!userHitCtrlR) {
      // if we found no match, reset the match text, unless the user
      // is using repeated ctrl+R to search backwards; in this case,
      // let's continue to display the previous match if no new match
      // is found
      placeholderTypedPart.innerText = ''
      placeholderMatchedPrefixPart.innerText = ''
      placeholderMatchedSuffixPart.innerText = ''
      placeholderFixedPart.innerText = strings.prompt.replace(/\$1/, ``).replace(/\$2/, this.value)
    } else {
      placeholderFixedPart.classList.add('alert-pulse')
      setTimeout(() => placeholderFixedPart.classList.remove('alert-pulse'), 1000)
    }
  }

  /**
   * User hits enter while in i-search mode
   *
   */
  function maybeComplete (evt) {
    if (isSearchActive) {
      if (evt.keyCode === keys.ENTER) {
        debug('completing search')
        getCurrentPrompt().value = placeholderContentPart.getAttribute('data-full-match')
        cancelISearch()
      }
    }
  }

  /**
   * Listen for ctrl+r
   *
   */
  document.getElementsByTagName('body')[0].addEventListener('keyup', evt => {
    //
    // we want ctrl+R; but if we're in a browser and on linux or
    // windows, then ctrl+R will result in a browser reload :(
    //
    // Note: even if not in a browser (i.e. running in electron mode),
    // on linux and windows we have to be careful not to use the
    // default reload keyboard shortcut; see app/src/main/menu.js
    //
    // re: RUNNING_SHELL_TEST; there seems to be some weird bug here; on linux, the ctrlKey modifier becomes sticky
    if (evt.ctrlKey && (process.platform === 'darwin' || ((!inBrowser() && !process.env.RUNNING_SHELL_TEST) || evt.metaKey))) {
      if (evt.keyCode === keys.R) {
        debug('got ctrl+r')
        promptLeft = getCurrentPromptLeft()
        const prompt = getCurrentPrompt()

        if (isSearchActive) {
          debug('continuation of existing reverse-i-search')
          doSearch.call(prompt, evt) // we use .call to establish our own 'this'
        } else {
          debug('new reverse-i-search')
          isSearchActive = true

          placeholder = document.createElement('span')
          placeholderFixedPart = document.createElement('span')
          placeholderFixedPart.innerText = strings.prompt.replace(/\$1/, '').replace(/\$2/, ``)
          placeholder.appendChild(placeholderFixedPart)
          placeholder.classList.add('repl-temporary')
          placeholder.classList.add('normal-text')
          placeholderFixedPart.classList.add('smaller-text')
          promptLeft.appendChild(placeholder)
          getCurrentBlock().classList.add('using-custom-prompt')

          prompt.style.opacity = '0'
          prompt.style.width = '0'

          placeholderContentPart = document.createElement('span') // container for Typed and Matched
          placeholderTypedPart = document.createElement('span') // what the user has typed; e.g. "is" in "history"
          placeholderMatchedPrefixPart = document.createElement('span') // what was matched, but not typed; e.g. "h" in "history"
          placeholderMatchedSuffixPart = document.createElement('span') // what was matched, but not typed; e.g. "tory" in "history"
          placeholderContentPart.appendChild(placeholderMatchedPrefixPart)
          placeholderContentPart.appendChild(placeholderTypedPart)
          placeholderContentPart.appendChild(placeholderMatchedSuffixPart)
          placeholderContentPart.classList.add('repl-input-like')
          placeholder.appendChild(placeholderContentPart)

          placeholderTypedPart.classList.add('red-text')
          placeholderMatchedPrefixPart.classList.add('slightly-deemphasize')
          placeholderMatchedSuffixPart.classList.add('slightly-deemphasize')

          currentOnInput = prompt.oninput
          prompt.oninput = doSearch
          currentOnKeypress = prompt.onkeypress
          prompt.onkeypress = maybeComplete
        }
      } else {
        // with ctrl key down, let any other keycode result in cancelling the outstanding i-search
        debug('cancel', evt.keyCode)
        cancelISearch()
      }
    }
  })
}
