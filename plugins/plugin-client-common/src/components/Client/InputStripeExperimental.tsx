/*
 * Copyright 2020 The Kubernetes Authors
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

import { eventBus } from '@kui-shell/core/mdist/api/Events'
import { Tab as KuiTab } from '@kui-shell/core/mdist/api/Tab'

import Block from '../Views/Terminal/Block'
import BlockModel, { Active } from '../Views/Terminal/Block/BlockModel'

import '../../../web/css/static/InputStripeExperimental.scss'

interface Props {
  tab?: KuiTab

  /** tab uuid; this is grafted in for you, by TabContent */
  uuid?: string
}

interface StyleRange {
  style: string
  text: string
}

interface State {
  idx: number
  model: BlockModel

  inputCells: string[]
  inputRanges: StyleRange[]
  inputSelectionStart: number
  inputSelectionEnd: number
}

const blank = '\u00a0'

const enum ParseState {
  Default,
  InWhitespace,
  InDash,
  InDoubleDash,
  InDashValue
}

export default class InputStripe extends React.PureComponent<Props, State> {
  private _caret: HTMLSpanElement
  private _caretBlinker: ReturnType<typeof setInterval>

  private _focusElement: HTMLDivElement

  public constructor(props: Props) {
    super(props)

    eventBus.onCommandComplete(this.props.uuid, this.onOutputRender.bind(this))

    this.state = {
      idx: 0,
      model: Active(),
      inputCells: [],
      inputRanges: [],
      inputSelectionStart: 0,
      inputSelectionEnd: 0
    }
  }

  /** Parse out the given command line into StyleRanges */
  private parse(line: string): { inputCells: string[]; inputRanges: StyleRange[] } {
    const inputCells = line.split('').map(_ => (_ === ' ' ? blank : _))
    const inputRanges: StyleRange[] = []

    let currentStyle = { style: '', text: '' }
    inputRanges.push(currentStyle)

    let state = ParseState.Default
    for (let idx = 0; idx < inputCells.length; idx++) {
      const char = inputCells[idx]

      if (state === ParseState.InWhitespace && char === '-') {
        // Default -> InDash
        state = ParseState.InDash
        currentStyle = { style: 'kui--input-stripe-dash-region-key', text: char }
        inputRanges.push(currentStyle)
      } else if (state === ParseState.InDash && char === '-') {
        // InDash -> InDoubleDash
        state = ParseState.InDoubleDash
        currentStyle.text += char
      } else if (state === ParseState.InDash || (state === ParseState.InDoubleDash && char === '=')) {
        // InDash -> InDashValue
        // InDoubleDash= -> InDashValue
        currentStyle.text += char
        state = ParseState.InDashValue
        currentStyle = { style: 'kui--input-stripe-dash-region-value', text: '' }
        inputRanges.push(currentStyle)
      } else if (char === blank && (state === ParseState.InDoubleDash || state === ParseState.InDashValue)) {
        // InDoubleDash | InDashValue -> Default
        state = ParseState.Default
        currentStyle = { style: '', text: char }
        inputRanges.push(currentStyle)
      } else {
        // stay
        currentStyle.text += char

        if (state === ParseState.Default && char === blank) {
          state = ParseState.InWhitespace
        } else if (state === ParseState.InWhitespace && char !== blank) {
          state = ParseState.Default
        }
      }
    }

    return { inputCells, inputRanges }
  }

  /** Command has completed in our tab */
  private onOutputRender() {
    this.setState(curState => ({
      idx: curState.idx + 1,
      model: Active(),
      inputCells: [],
      inputRanges: [],
      inputSelectionStart: 0,
      inputSelectionEnd: 0
    }))
  }

  /** Underlying Input element has changed content */
  private onInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { inputCells, inputRanges } = this.parse(event.currentTarget.value)

    this.setState({
      inputCells,
      inputRanges,
      inputSelectionStart: event.currentTarget.selectionStart,
      inputSelectionEnd: event.currentTarget.selectionEnd
    })
  }

  /** User has clicked on the underlying Input element */
  private onInputClick(event: React.MouseEvent<HTMLInputElement>): void {
    this.setState({
      inputSelectionStart: event.currentTarget.selectionStart,
      inputSelectionEnd: event.currentTarget.selectionEnd
    })
  }

  /** onKeyUp in the underlying Input element */
  private onInputKeyUp(event: React.KeyboardEvent<HTMLInputElement>): void {
    this.setState({
      inputSelectionStart: event.currentTarget.selectionStart,
      inputSelectionEnd: event.currentTarget.selectionEnd
    })
  }

  /** onMouseDown in the underlying Input element */
  private onInputMouseDown(event: React.MouseEvent<HTMLInputElement>): void {
    this.setState({
      inputSelectionStart: event.currentTarget.selectionStart,
      inputSelectionEnd: event.currentTarget.selectionEnd
    })
  }

  /** onBlur in the underlying Input element */
  private onInputBlur() {
    if (this._focusElement) {
      this._focusElement.removeAttribute('data-focused')
    }
  }

  /** onFocus in the underlying Input element */
  private onInputFocus() {
    if (this._focusElement) {
      this._focusElement.setAttribute('data-focused', 'data-focused')
    }
  }

  /** Render the typed characters */
  private typedCharacters() {
    return (
      <div className="kui--input-stripe-custom-input repl-input-like">
        {this.state.inputRanges.map((_, idx) => {
          return (
            <span key={idx} className={_.style}>
              {_.text}
            </span>
          )
        })}
      </div>
    )
  }

  private underlayFill() {
    const start = this.state.inputSelectionStart

    return Array(start)
      .fill(0)
      .map((_, idx) => (
        <span className="kui--input-stripe-underlay-filler" key={idx}>
          {this.state.inputCells[idx]}
        </span>
      ))
  }

  private underlaySelection() {
    const start = this.state.inputSelectionStart
    const end = this.state.inputSelectionEnd

    return Array(end - start)
      .fill(0)
      .map((_, idx) => (
        <span key={start + idx} className="kui--input-stripe-selection-range">
          &nbsp;
        </span>
      ))
  }

  private initCaret(c: HTMLSpanElement) {
    this._caret = c

    if (this._caretBlinker) {
      clearInterval(this._caretBlinker)
    }
    this._caretBlinker = setInterval(() => {
      if (this._caret) {
        this._caret.classList.toggle('kui--input-stripe-caret-on')
      }
    }, 750)
  }

  private underlayCaret() {
    return (
      <span className="kui--input-stripe-caret" ref={c => this.initCaret(c)}>
        &nbsp;
      </span>
    )
  }

  private underlay() {
    return (
      <div className="kui--input-stripe-custom-underlay repl-input-like" ref={c => (this._focusElement = c)}>
        {this.underlayFill()}
        {this.underlaySelection()}
        {this.underlayCaret()}
      </div>
    )
  }

  public render() {
    return (
      <div className="kui--input-stripe repl">
        <Block
          idx={this.state.idx}
          uuid={this.props.uuid}
          tab={this.props.tab}
          model={this.state.model}
          noOutput
          noPromptContext
          onInputBlur={this.onInputBlur.bind(this)}
          onInputFocus={this.onInputFocus.bind(this)}
          onInputClick={this.onInputClick.bind(this)}
          onInputChange={this.onInputChange.bind(this)}
          onInputKeyUp={this.onInputKeyUp.bind(this)}
          onInputMouseDown={this.onInputMouseDown.bind(this)}
          onInputMouseMove={this.onInputMouseDown.bind(this)}
        >
          {this.underlay()}
          {this.typedCharacters()}
        </Block>
      </div>
    )
  }
}
