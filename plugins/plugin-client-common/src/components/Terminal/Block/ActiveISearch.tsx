/*
 * Copyright 2018, 2020 IBM Corporation
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

import Debug from 'debug'
import * as React from 'react'

import { inBrowser, KeyCodes, isCursorMovement, HistoryModel, History } from '@kui-shell/core'

import Input from './Input'

const debug = Debug('core-support/history/reverse-i-search')

// TODO externalize
const strings = {
  prompt: "(reverse-i-search$1)`$2':"
}

/** state of the reverse-i-search */
export default class ActiveISearch {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly input: Input,
    private readonly history: HistoryModel,
    private readonly currentSearchIdx = -1,
    private readonly reachedTheEnd = false
  ) {}

  private fixedPart() {
    const text = strings.prompt.replace(/\$1/, '').replace(/\$2/, this.input.state.prompt.value)
    const className = 'small-right-pad' + (this.reachedTheEnd ? ' alert-pulse' : '')

    if (this.reachedTheEnd) {
      // clear alert-pulse after a second
      setTimeout(
        () =>
          this.input.setState({ isearch: new ActiveISearch(this.input, this.history, this.currentSearchIdx, false) }),
        1000
      )
    }

    return <span className={className}>{text}</span>
  }

  private matchedPrefixPart(newValue: string, caretPosition: number) {
    const matchedPrefix = newValue.substring(0, caretPosition - 1)
    return <span className="slightly-deemphasize">{matchedPrefix}</span>
  }

  private matchedSuffixPart(newValue: string, caretPosition: number) {
    const matchedSuffix = newValue.substring(caretPosition + this.input.state.prompt.value.length - 1)
    return <span className="slightly-deemphasize">{matchedSuffix}</span>
  }

  private typedPart() {
    // show matched whitespaces with an underscore
    return <strong className="red-text kui--prompt-like">{this.input.state.prompt.value.replace(/ /g, '_')}</strong>
  }

  public currentMatch(): string {
    if (this.currentSearchIdx === -1) {
      return ''
    } else {
      return this.history.line(this.currentSearchIdx).raw
    }
  }

  public render() {
    if (this.currentSearchIdx < 0) {
      return <span className="repl-input-like">{this.fixedPart()}</span>
    } else {
      const newValue = this.currentMatch()
      const caretPosition = newValue.indexOf(this.input.state.prompt.value) + 1
      return (
        <span className="repl-input-like">
          {this.fixedPart()}
          {this.matchedPrefixPart(newValue, caretPosition)}
          {this.typedPart()}
          {this.matchedSuffixPart(newValue, caretPosition)}
        </span>
      )
    }
  }

  /**
   * For various reasons, user has cancelled a reverse-i-search.
   *
   */
  public cancelISearch() {
    this.input.setState({ isearch: undefined })
  }

  /**
   * Attempt to initiate or extend a search
   *
   */
  public doSearch(evt: KeyboardEvent) {
    debug('doSearch', evt)
    // where do we want to start the search? if the user is just
    // typing, then start from the end of history; if the user hit
    // ctrl+r, then they want to search for the next match
    const userHitCtrlR = evt.ctrlKey && evt.code === 'KeyR'
    const startIdx = userHitCtrlR ? this.currentSearchIdx - 1 : -1

    const { prompt } = this.input.state
    const newSearchIdx = prompt.value && this.history.findIndex(prompt.value, startIdx)
    debug('search index', prompt.value, newSearchIdx)

    if (newSearchIdx > 0) {
      this.input.setState({ isearch: new ActiveISearch(this.input, this.history, newSearchIdx) })
    } else if (!userHitCtrlR) {
      // if we found no match, reset the match text, unless the user
      // is using repeated ctrl+R to search backwards; in this case,
      // let's continue to display the previous match if no new match
      // is found
      /* this.placeholderTypedPart.innerText = ''
      this.placeholderMatchedPrefixPart.innerText = ''
      this.placeholderMatchedSuffixPart.innerText = ''
      this.placeholderFixedPart.innerText = strings.prompt.replace(/\$1/, ``).replace(/\$2/, this.prompt.value) */
    } else {
      this.input.setState({ isearch: new ActiveISearch(this.input, this.history, newSearchIdx, true) })
    }
  }

  /** fill in the result of a search */
  public completeSearch() {
    debug('completing search')
    // TODO: this.prompt.value = this.placeholderContentPart.getAttribute('data-full-match')
    this.cancelISearch()
  }
}

/**
 * Listen for ctrl+R
 *
 */
export function onKeyUp(input: Input) {
  return async (evt: KeyboardEvent) => {
    //
    // we want ctrl+R; but if we're in a browser and on linux or
    // windows, then ctrl+R will result in a browser reload :(
    //
    // Note: even if not in a browser (i.e. running in electron mode),
    // on linux and windows we have to be careful not to use the
    // default reload keyboard shortcut; see app/src/main/menu.js
    //
    // re: RUNNING_SHELL_TEST; there seems to be some weird bug here; on linux, the ctrlKey modifier becomes sticky
    if (
      evt.ctrlKey &&
      (process.platform === 'darwin' ||
        /Macintosh/.test(navigator.userAgent) ||
        (!inBrowser() && !process.env.RUNNING_SHELL_TEST) ||
        evt.metaKey)
    ) {
      const activeSearch = input.state.isearch

      if (evt.keyCode === KeyCodes.R) {
        debug('got ctrl+r')
        if (activeSearch) {
          debug('continuation of existing reverse-i-search')
          activeSearch.doSearch(evt)
        } else {
          debug('new reverse-i-search')
          input.setState({ isearch: new ActiveISearch(input, await History(input.props.tab)) })
        }
      } else if (activeSearch && isCursorMovement(evt)) {
        activeSearch.completeSearch()
      } else if (activeSearch) {
        // with ctrl key down, let any other keycode result in cancelling the outstanding i-search
        debug('cancel', evt.keyCode)
        activeSearch.cancelISearch()
      }
    } else if (evt.keyCode === KeyCodes.ENTER && input.state.isearch) {
      input.state.isearch.completeSearch()
      input.props.tab.REPL.pexec(input.state.isearch.currentMatch() || input.state.prompt.value)
    } else if (input.state.isearch && evt.key !== 'Control') {
      evt.preventDefault()
      input.state.isearch.doSearch(evt)
    }
  }
}
