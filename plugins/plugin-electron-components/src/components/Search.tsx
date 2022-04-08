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

import React from 'react'
import { FoundInPageResult, FindInPageOptions } from 'electron'

import '../../web/scss/components/Search/Search.scss'

const SearchInput = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.SearchInput })))

type Props = {}

interface State {
  isActive: boolean
  result: FoundInPageResult
  currentMatchIdx: number // currentMatchIdx will always start at 1 and be at least 1 because the text in the search bar itself counts as a find.
}

export default class Search extends React.Component<Props, State> {
  // to help with focus
  private _input: HTMLInputElement

  public constructor(props: Props) {
    super(props)

    this.state = {
      isActive: false,
      result: undefined,
      currentMatchIdx: 1
    }
  }

  /** stop findInPage, and clear selections in page */
  private async stopFindInPage() {
    const { getCurrentWebContents } = await import('@electron/remote')
    // note: with 'clearSelection', the focus of the input is very
    // odd; it is focused, but typing text does nothing until some
    // global refresh occurs. maybe this is just a bug in electron 6?
    await getCurrentWebContents().stopFindInPage('activateSelection')
  }

  private readonly onKeydown = (evt: KeyboardEvent) => {
    if (
      !evt.defaultPrevented &&
      evt.code === 'KeyF' &&
      ((evt.ctrlKey && process.platform !== 'darwin') || evt.metaKey)
    ) {
      if (this.state.isActive && document.activeElement !== this._input) {
        this.doFocus()
      } else {
        this.findInPage() // allows for search to be reinitiated when the search bar is reopened

        const isActive = !this.state.isActive
        if (!isActive) {
          this.stopFindInPage()
        }

        this.setState(() => ({ isActive, result: undefined }))
      }
    }
  }

  public componentDidMount() {
    this.stopFindInPage() // <-- failsafe, in case of bugs; electron seems to persist this
    document.body.addEventListener('keydown', this.onKeydown)
  }

  public componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeydown)
  }

  private _onChange = this.onChange.bind(this)
  private async onChange() {
    if (this._input) {
      if (this._input.value.length === 0) {
        await this.stopFindInPage()
        this.setState({ result: undefined })
      } else {
        this.findInPage()
      }
    }
  }

  private async findInPage(options?: FindInPageOptions) {
    if (!this._input || !this._input.value) {
      // protect against: "Error: Could not call remote method
      // 'findInPage'. Check that the method signature is
      // correct. Underlying error: Error: Must provide a non-empty
      // search contentUnderlying stack: Error: Must provide a
      // non-empty search content"
      return
    }

    const { getCurrentWebContents } = await import('@electron/remote')
    // Registering a callback handler
    getCurrentWebContents().once('found-in-page', async (event: Event, result: FoundInPageResult) => {
      if (this.state.isActive) {
        // we only need hack if we're doing a find as the user is typing and the options is defined for the converse
        if (!options) {
          this.hack()
        }
      }
      this.setState(() => ({ result }))
    })
    // this is where we call the electron API to initiate a new find
    getCurrentWebContents().findInPage(this._input.value, options)
  }

  /** findInPage api seems to result in a loss of focus */
  private hack() {
    const v = this._input.value
    this._input.value = ''
    this._input.value = v
    this._input.focus()
  }

  private doFocus() {
    if (this.state.isActive && this._input) {
      this._input.focus()
    }
  }

  private readonly _onClear = this.onClear.bind(this)
  private async onClear() {
    await this.stopFindInPage()
    if (this._input) {
      this._input.value = ''
    }

    this.setState({
      result: undefined,
      isActive: false,
      currentMatchIdx: 1
    })
  }

  private readonly _onNext = this.onNext.bind(this)
  private async onNext() {
    // if statement blocks user from pressing next arrow if already on last result
    if (this.state.currentMatchIdx < this.state.result.matches) {
      await this.findInPage({ forward: true, findNext: false })

      this.setState(prevState => {
        const newCurrentResult = prevState.currentMatchIdx + 1
        return {
          currentMatchIdx: newCurrentResult <= prevState.result.matches ? newCurrentResult : prevState.result.matches
        }
      })
    }
  }

  private readonly _onPrevious = this.onPrevious.bind(this)
  private async onPrevious() {
    // if statement blocks user from pressing previous arrow if already on first result
    if (this.state.currentMatchIdx > this.state.result.matches - this.state.result.matches + 1) {
      await this.findInPage({ forward: false, findNext: false })

      this.setState(prevState => {
        const newCurrentResult = prevState.currentMatchIdx - 1
        return { currentMatchIdx: newCurrentResult > 0 ? newCurrentResult : 1 }
      })
    }
  }

  private readonly _onRef = (c: HTMLInputElement) => {
    if (c) {
      this._input = c
      this.doFocus()
    }
  }

  private resultsRender() {
    if (this.state.currentMatchIdx && this.state.result) {
      const curResultDisplay = this.state.currentMatchIdx.toString()
      const totalResult = this.state.result.matches.toString()
      return curResultDisplay + '/' + totalResult
    }
  }

  public render() {
    if (!this.state.isActive) {
      return <React.Fragment />
    } else {
      return (
        <SearchInput
          id="search-bar"
          className="kui--search"
          placeholder="Find by name"
          value={this._input && this._input.value}
          aria-label="Search"
          onChange={this._onChange}
          onClear={this._onClear}
          spellCheck={false}
          resultsCount={this.resultsRender()}
          onNextClick={this._onNext}
          onPreviousClick={this._onPrevious}
          ref={this._onRef}
        />
      )
    }
  }
}
