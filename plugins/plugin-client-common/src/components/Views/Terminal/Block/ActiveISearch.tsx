/*
 * Copyright 2021 The Kubernetes Authors
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
import React from 'react'

import { inBrowser, isCursorMovement, HistoryModel, History } from '@kui-shell/core'

import Input from './Input'

const debug = Debug('core-support/history/reverse-i-search')

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
    const className = 'small-right-pad' + (this.reachedTheEnd ? ' alert-pulse' : '')

    if (this.reachedTheEnd) {
      // clear alert-pulse after a second
      setTimeout(
        () =>
          this.input.setState({ isearch: new ActiveISearch(this.input, this.history, this.currentSearchIdx, false) }),
        1000
      )
    }

    return (
      <span className={className}>
        (reverse-i-search
        <span className="sub-text semi-transparent">
          {this.currentSearchIdx === -1 ? '' : ' ' + this.currentSearchIdx.toString()}
        </span>
        ){!this.input.state.prompt.current.value ? '' : '`' + this.input.state.prompt.current.value + '`:'}
      </span>
    )
  }

  private matchedPrefixPart(newValue: string, caretPosition: number) {
    const matchedPrefix = newValue.substring(0, caretPosition - 1)
    return <span className="slightly-deemphasize">{matchedPrefix}</span>
  }

  private matchedSuffixPart(newValue: string, caretPosition: number) {
    const matchedSuffix = newValue.substring(caretPosition + this.input.state.prompt.current.value.length - 1)
    return <span className="slightly-deemphasize">{matchedSuffix}</span>
  }

  private typedPart() {
    // show matched whitespaces with an underscore
    return (
      <strong className="red-text kui--prompt-like">{this.input.state.prompt.current.value.replace(/ /g, '_')}</strong>
    )
  }

  private matchAt(idx = this.currentSearchIdx): string {
    return this.history.line(idx).raw
  }

  public currentMatch(): string {
    if (this.currentSearchIdx === -1) {
      return ''
    } else {
      return this.matchAt()
    }
  }

  public render() {
    if (this.currentSearchIdx < 0) {
      return this.fixedPart()
    } else {
      const newValue = this.currentMatch()
      const caretPosition = newValue.indexOf(this.input.state.prompt.current.value) + 1
      return (
        <React.Fragment>
          {this.fixedPart()}
          {this.matchedPrefixPart(newValue, caretPosition)}
          {this.typedPart()}
          {this.matchedSuffixPart(newValue, caretPosition)}
        </React.Fragment>
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
   * Search command history for a match, skipping over identicals.
   *
   * @param startIdx start searching backwards from here
   * @param userHitCtrlR is this a request to find another match further in the past?
   *
   * @return a command history index, or -1 if not match is found
   *
   */
  private findPrevious(startIdx: number, userHitCtrlR: boolean): number {
    if (startIdx < 0) {
      return -1
    }

    const prompt = this.input.state.prompt.current

    const newSearchIdx = prompt.value ? this.history.findIndex(prompt.value, startIdx) : -1
    if (
      !userHitCtrlR ||
      newSearchIdx < 0 ||
      this.currentSearchIdx < 0 ||
      this.matchAt(newSearchIdx) !== this.matchAt()
    ) {
      return newSearchIdx
    } else {
      // skip this match because it is the same as the current match
      return this.findPrevious(newSearchIdx - 1, userHitCtrlR)
    }
  }

  /**
   * Attempt to initiate or extend a search
   *
   */
  public doSearch(evt: React.KeyboardEvent) {
    // where do we want to start the search? if the user is just
    // typing, then start from the end of history; if the user hit
    // ctrl+r, then they want to search for the next match
    const userHitCtrlR = evt.ctrlKey && evt.key === 'r'
    const startIdx = userHitCtrlR ? this.currentSearchIdx - 1 : undefined
    debug('doSearch', userHitCtrlR, startIdx)

    const prompt = this.input.state.prompt.current
    const newSearchIdx = this.findPrevious(startIdx, userHitCtrlR)
    debug('search index', prompt.value, newSearchIdx)

    if (newSearchIdx > 0) {
      this.input.setState({ isearch: new ActiveISearch(this.input, this.history, newSearchIdx) })
    } else if (userHitCtrlR) {
      // if we found no match, reset the match text, unless the user
      // is using repeated ctrl+R to search backwards; in this case,
      // let's continue to display the previous match if no new match
      // is found
    } else {
      this.input.setState({ isearch: new ActiveISearch(this.input, this.history, newSearchIdx, true) })
    }
  }

  /** fill in the result of a search */
  public completeSearch() {
    debug('completing search')
    this.input.state.prompt.current.value = this.currentMatch()
    this.cancelISearch()
  }
}

/**
 * Listen for ctrl+R
 *
 */
export async function onKeyUp(this: Input, evt: React.KeyboardEvent) {
  const activeSearch = this.state.isearch

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
    if (evt.key === 'r') {
      debug('got ctrl+r')
      if (activeSearch) {
        debug('continuation of existing reverse-i-search')
        activeSearch.doSearch(evt)
      } else {
        debug('new reverse-i-search')
        this.setState({ isearch: new ActiveISearch(this, await History(this.props.tab)) })
      }
    } else if (activeSearch && isCursorMovement(evt.nativeEvent)) {
      activeSearch.completeSearch()
    } else if (activeSearch) {
      // with ctrl key down, let any other keycode result in cancelling the outstanding i-search
      debug('cancel', evt.keyCode)
      activeSearch.cancelISearch()
    }
  } else if (activeSearch && isCursorMovement(evt.nativeEvent)) {
    activeSearch.completeSearch()
  } else if (evt.key === 'Enter' && this.state.isearch) {
    this.state.isearch.completeSearch()
    this.props.tab.REPL.pexec(this.state.isearch.currentMatch() || this.state.prompt.current.value)
  } else if (this.state.isearch && evt.key !== 'Control') {
    evt.preventDefault()
    this.state.isearch.doSearch(evt)
  }
}
