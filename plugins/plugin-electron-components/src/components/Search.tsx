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
import { SearchInput } from '@patternfly/react-core'
// import { i18n } from '@kui-shell/core'
import { FoundInPageResult } from 'electron'

import '../../web/scss/components/Search/Search.scss'

// const strings = i18n('plugin-client-common', 'search')

type Props = {}

interface State {
  isActive: boolean
  result: FoundInPageResult
}

export default class Search extends React.Component<Props, State> {
  // to help with focus
  private _input: HTMLInputElement

  public constructor(props: Props) {
    super(props)

    this.stopFindInPage() // <-- failsafe, in case of bugs; electron seems to persist this
    this.initEvents()

    this.state = {
      isActive: false,
      result: undefined
    }
  }

  /** stop findInPage, and clear selections in page */
  private async stopFindInPage() {
    return import('electron').then(async ({ remote }) => {
      // note: with 'clearSelection', the focus of the input is very
      // odd; it is focused, but typing text does nothing until some
      // global refresh occurs. maybe this is just a bug in electron 6?
      await remote.getCurrentWebContents().stopFindInPage('activateSelection')
    })
  }

  private initEvents() {
    document.body.addEventListener('keydown', evt => {
      if (
        !evt.defaultPrevented &&
        evt.code === 'KeyF' &&
        ((evt.ctrlKey && process.platform !== 'darwin') || evt.metaKey)
      ) {
        if (this.state.isActive && document.activeElement !== this._input) {
          this.doFocus()
        } else {
          this.setState(curState => {
            const isActive = !curState.isActive
            if (!isActive) {
              this.stopFindInPage()
            }

            return { isActive, result: undefined }
          })
        }
      }
    })
  }

  private readonly _onChange = this.onChange.bind(this)

  private async onChange() {
    if (this._input) {
      if (this._input.value.length === 0) {
        await this.stopFindInPage()
        this.setState({ result: undefined })
      } else {
        const { remote } = await import('electron')
        // Registering a callback handler
        remote.getCurrentWebContents().once('found-in-page', async (event: Event, result: FoundInPageResult) => {
          this.setState(curState => {
            if (curState.isActive) {
              this.hack()
              return { result }
            }
          })
        })
        // this is where we call the electron API to initiate a new find
        remote.getCurrentWebContents().findInPage(this._input.value)
      }
    }
  }

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

  private onClear = async () => {
    await this.stopFindInPage()
    if (this._input) {
      this._input.value = ''
    }
    this.setState({
      result: undefined,
      isActive: false
    })
  }

  private readonly _onClear = this.onClear.bind(this)

  private readonly _onRef = (c: HTMLInputElement) => {
    if (c) {
      this._input = c
      this.doFocus()
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
          resultsCount={this.state.result && (this.state.result.matches - 1).toString()}
          ref={this._onRef}
        />
      )
    }
  }
}
