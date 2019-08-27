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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import * as Debug from 'debug'

import eventBus from '@kui-shell/core/core/events'
import * as historyModel from '@kui-shell/core/models/history'
import {
  Tab,
  getTabFromTarget,
  getBlockOfPrompt,
  getCurrentPrompt,
  getCurrentPromptLeft
} from '@kui-shell/core/webapp/cli'
import { keys, isCursorMovement } from '@kui-shell/core/webapp/keys'
import { inBrowser } from '@kui-shell/core/core/capabilities'
import { inBottomInputMode } from '@kui-shell/core/core/settings'

const debug = Debug('core-support/history/reverse-i-search')

interface KeyboardEventPlusPlus extends KeyboardEvent {
  inputType: string
}

// TODO externalize
const strings = {
  prompt: "(reverse-i-search$1)`$2': "
}

/** state of the reverse-i-search */
class ActiveISearch {
  private isSearchActive = true

  private readonly tab: Tab

  private readonly currentOnKeypress: (evt: KeyboardEvent) => void

  private readonly currentOnInput: (evt: KeyboardEvent) => void

  private currentSearchIdx = -1

  private readonly placeholder: HTMLElement

  private readonly placeholderFixedPart: HTMLElement

  private readonly placeholderContentPart: HTMLElement

  private readonly placeholderTypedPart: HTMLElement

  private readonly placeholderMatchedPrefixPart: HTMLElement

  private readonly placeholderMatchedSuffixPart: HTMLElement

  private readonly prompt: HTMLInputElement

  private readonly promptLeft: Element

  constructor(tab: Tab) {
    this.tab = tab
    this.prompt = getCurrentPrompt(tab)
    this.promptLeft = getCurrentPromptLeft(tab)

    this.placeholder = document.createElement('span')
    this.placeholderFixedPart = document.createElement('span')
    this.placeholderFixedPart.innerText = strings.prompt.replace(/\$1/, '').replace(/\$2/, this.prompt.value)
    this.placeholder.appendChild(this.placeholderFixedPart)
    this.placeholder.classList.add('repl-temporary')
    this.placeholder.classList.add('normal-text')
    this.placeholderFixedPart.classList.add('smaller-text')
    this.placeholderFixedPart.classList.add('small-right-pad')
    this.promptLeft.appendChild(this.placeholder)

    getBlockOfPrompt(this.prompt).classList.add('using-custom-prompt')

    //    this.prompt.style.opacity = '0'
    //    this.prompt.style.width = '0'

    this.placeholderContentPart = document.createElement('span') // container for Typed and Matched
    this.placeholderTypedPart = document.createElement('span') // what the user has typed; e.g. "is" in "history"
    this.placeholderMatchedPrefixPart = document.createElement('span') // what was matched, but not typed; e.g. "h" in "history"
    this.placeholderMatchedSuffixPart = document.createElement('span') // what was matched, but not typed; e.g. "tory" in "history"
    this.placeholderContentPart.appendChild(this.placeholderMatchedPrefixPart)
    this.placeholderContentPart.appendChild(this.placeholderTypedPart)
    this.placeholderContentPart.appendChild(this.placeholderMatchedSuffixPart)
    this.placeholderContentPart.classList.add('repl-input-like')
    this.placeholder.appendChild(this.placeholderContentPart)

    this.placeholderTypedPart.classList.add('red-text')
    this.placeholderMatchedPrefixPart.classList.add('slightly-deemphasize')
    this.placeholderMatchedSuffixPart.classList.add('slightly-deemphasize')

    this.currentOnInput = this.prompt.oninput
    this.prompt.oninput = this.doSearch.bind(this)
    this.currentOnKeypress = this.prompt.onkeypress
    this.prompt.onkeypress = this.maybeComplete.bind(this)
  }

  /**
   * For various reasons, user has cancelled a reverse-i-search.
   *
   */
  cancelISearch(evt?: KeyboardEvent) {
    const isCtrlC = evt && evt.keyCode === keys.C && evt.ctrlKey
    this.tab['_kui_active_i_search'] = undefined

    if (this.isSearchActive) {
      this.isSearchActive = false

      if (!isCtrlC || inBottomInputMode) {
        getBlockOfPrompt(this.prompt).classList.remove('using-custom-prompt')
        if (this.placeholder.parentNode) {
          this.placeholder.parentNode.removeChild(this.placeholder)
        }
        this.prompt.onkeypress = this.currentOnKeypress
        this.prompt.oninput = this.currentOnInput
        this.prompt.focus()
      }
    }
  }

  /**
   * Attempt to initiate or extend a search
   *
   */
  doSearch(evt: KeyboardEventPlusPlus) {
    debug('doSearch', evt)

    if (evt.inputType === 'deleteContentBackward') {
      // if the user hits Backspace, reset currentSearchIdx
      // TODO confirm that this is the behavior of bash
      this.currentSearchIdx = -1
      this.placeholderFixedPart.innerText = strings.prompt.replace(/\$1/, ``).replace(/\$2/, this.prompt.value)
    }

    // where do we want to start the search? if the user is just
    // typing, then start from the end of history; if the user hit
    // ctrl+r, then they want to search for the next match
    const userHitCtrlR = evt.ctrlKey && evt.code === 'KeyR'
    const startIdx = userHitCtrlR ? this.currentSearchIdx - 1 : -1

    const newSearchIdx = this.prompt.value && historyModel.findIndex(this.prompt.value, startIdx)
    debug('search index', this.prompt.value, newSearchIdx)

    if (newSearchIdx > 0) {
      this.currentSearchIdx = newSearchIdx

      this.placeholderFixedPart.innerText = strings.prompt
        .replace(/\$1/, '') // ` ${newSearchIdx}`
        .replace(/\$2/, this.prompt.value)

      const newValue = historyModel.lines[this.currentSearchIdx].raw
      debug('newValue', newValue)
      const caretPosition = newValue.indexOf(this.prompt.value) + 1
      debug('caretPosition', caretPosition)

      const matchedPrefix = newValue.substring(0, caretPosition - 1)
      const matchedSuffix = newValue.substring(caretPosition + this.prompt.value.length - 1)
      debug('matchedPrefix', matchedPrefix, newValue, caretPosition)
      debug('matchedSuffix', matchedSuffix)
      this.placeholderTypedPart.innerText = this.prompt.value.replace(/ /g, '_') // show matched whitespaces with an underscore
      this.placeholderMatchedPrefixPart.innerText = matchedPrefix
      this.placeholderMatchedSuffixPart.innerText = matchedSuffix
      this.placeholderContentPart.setAttribute('data-full-match', newValue)
    } else if (!userHitCtrlR) {
      // if we found no match, reset the match text, unless the user
      // is using repeated ctrl+R to search backwards; in this case,
      // let's continue to display the previous match if no new match
      // is found
      this.placeholderTypedPart.innerText = ''
      this.placeholderMatchedPrefixPart.innerText = ''
      this.placeholderMatchedSuffixPart.innerText = ''
      this.placeholderFixedPart.innerText = strings.prompt.replace(/\$1/, ``).replace(/\$2/, this.prompt.value)
    } else {
      this.placeholderFixedPart.classList.add('alert-pulse')
      setTimeout(() => this.placeholderFixedPart.classList.remove('alert-pulse'), 1000)
    }
  }

  /** fill in the result of a search */
  completeSearch() {
    debug('completing search')
    this.prompt.value = this.placeholderContentPart.getAttribute('data-full-match')
    this.cancelISearch()
  }

  /**
   * User hits enter while in i-search mode
   *
   */
  maybeComplete(evt: KeyboardEvent) {
    if (this.isSearchActive) {
      if (evt.keyCode === keys.ENTER) {
        this.completeSearch()
        this.prompt.dispatchEvent(new KeyboardEvent(evt.type, evt))
      }
    }
  }
}

/**
 * Listen for ctrl+R
 *
 */
function registerListener() {
  if (typeof document === 'undefined') {
    // fail-safe, in case we have no DOM
    return
  }

  if (inBottomInputMode) {
    eventBus.on('/core/cli/install-block', (tab: Tab) => {
      const activeSearch: ActiveISearch = tab['_kui_active_i_search']
      if (activeSearch) {
        activeSearch.cancelISearch()
      }
    })
  }

  /**
   * Listen for ctrl+r
   *
   */
  document.getElementsByTagName('body')[0].addEventListener('keyup', (evt: KeyboardEvent) => {
    //
    // we want ctrl+R; but if we're in a browser and on linux or
    // windows, then ctrl+R will result in a browser reload :(
    //
    // Note: even if not in a browser (i.e. running in electron mode),
    // on linux and windows we have to be careful not to use the
    // default reload keyboard shortcut; see app/src/main/menu.js
    //
    // re: RUNNING_SHELL_TEST; there seems to be some weird bug here; on linux, the ctrlKey modifier becomes sticky
    if (!document.activeElement.classList.contains('repl-input-element')) {
      // if we aren't focused on a repl input, don't bother
    } else if (
      evt.ctrlKey &&
      (process.platform === 'darwin' ||
        /Macintosh/.test(navigator.userAgent) ||
        ((!inBrowser() && !process.env.RUNNING_SHELL_TEST) || evt.metaKey))
    ) {
      const tab = getTabFromTarget(evt.srcElement)
      const activeSearch: ActiveISearch = tab['_kui_active_i_search']

      if (evt.keyCode === keys.R) {
        debug('got ctrl+r')
        if (activeSearch) {
          debug('continuation of existing reverse-i-search')
          activeSearch.doSearch(evt as KeyboardEventPlusPlus)
        } else {
          debug('new reverse-i-search')
          tab['_kui_active_i_search'] = new ActiveISearch(tab)
        }
      } else if (activeSearch && isCursorMovement(evt)) {
        activeSearch.completeSearch()
      } else if (activeSearch) {
        // with ctrl key down, let any other keycode result in cancelling the outstanding i-search
        debug('cancel', evt.keyCode)
        activeSearch.cancelISearch(evt)
      }
    }
  })
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
