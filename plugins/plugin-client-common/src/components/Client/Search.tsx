/*
 * Copyright 2020 IBM Corporation
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

import * as React from 'react'
import { inElectron, i18n } from '@kui-shell/core'
import { Event, FoundInPageResult } from 'electron'
import { Search as CarbonSearch } from 'carbon-components-react'

import '../../../web/css/static/Search.scss'

const strings = i18n('plugin-client-common', 'search')

type Props = {}

interface State {
  isActive: boolean
  result: FoundInPageResult
}

export default class Search extends React.PureComponent<Props, State> {
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

  private initEvents() {
    document.body.addEventListener('keydown', evt => {
      if (
        !evt.defaultPrevented &&
        evt.code === 'KeyF' &&
        ((evt.ctrlKey && process.platform !== 'darwin') || evt.metaKey)
      ) {
        if (this.state.isActive && !!this._input && document.activeElement !== this._input) {
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

  /** stop findInPage, and clear selections in page */
  private async stopFindInPage() {
    return import('electron').then(async ({ remote }) => {
      // note: with 'clearSelection', the focus of the input is very
      // odd; it is focused, but typing text does nothing until some
      // global refresh occurs. maybe this is just a bug in electron 6?
      await remote.getCurrentWebContents().stopFindInPage('activateSelection')
    })
  }

  /* public componentDidCatch(error, errorInfo) {
    console.error('!!!!EEE', error, errorInfo)
  }  */

  private async onChange() {
    if (this._input) {
      if (this._input.value.length === 0) {
        await this.stopFindInPage()
        this.setState({ result: undefined })
      } else {
        const { remote } = await import('electron')

        remote.getCurrentWebContents().once('found-in-page', async (event: Event, result: FoundInPageResult) => {
          this.setState(curState => {
            if (curState.isActive) {
              this.hack()
              return { result }
            }
          })
        })

        remote.getCurrentWebContents().findInPage(this._input.value)
      }
    }
  }

  /**
   * This bit of ugliness works around us not using a proper
   * webview to encapsulate the <input> element; without this
   * encapsulation, chrome does some funky things with
   * focus. For example, when there is no text found, the
   * input element oddly ... maintains focus but is not
   * typeable until a global refresh. Weird. This also has the
   * nice side-effect of (albeit with a small visual glitch)
   * having no yellow/red highlight text around the text
   * inside the input element.
   *
   */
  private hack() {
    const v = this._input.value
    this._input.value = ''
    this._input.value = v
    this._input.focus()
  }

  private doFocus(search?: CarbonSearch) {
    if (!!search && !!search['input'] && typeof search['input'].focus === 'function') {
      if (!this._input) {
        this._input = search['input']
      }
    }

    if (this.state.isActive && this._input) {
      this._input.focus()
    }
  }

  /** Summarize results of find, e.g. "3 of 3" */
  private matchCount() {
    const { result } = this.state
    if (result) {
      // exclude the text search itself; TODO move the input element to a webview
      const N = result.matches - 1
      const text = N === 0 ? strings('noMatches') : N === 1 ? strings('1Match') : strings('nMatches', N)

      // re: id: text-search test needs this
      return (
        <span id="search-found-text" className="kui--search-match-count sub-text even-smaller-text nowrap">
          {text}
        </span>
      )
    }
  }

  public render() {
    if (!this.state.isActive || !inElectron()) {
      this._input = undefined
      return <React.Fragment />
    } else {
      // re: id, text-search test needs this
      return (
        <div className="kui--search flex-layout" id="search-bar">
          <CarbonSearch
            id="search-input"
            placeHolderText={strings('placeHolderText')}
            small
            labelText="Search"
            onChange={this.onChange.bind(this)}
            ref={this.doFocus.bind(this)}
          />
          {this.matchCount()}
        </div>
      )
    }
  }
}
