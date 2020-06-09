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
import { Tab as KuiTab, eventChannelUnsafe } from '@kui-shell/core'

import Input, { InputOptions } from './Input'
import Output from './Output'
import { BlockModel, isActive, isEmpty, isFinished, isProcessing, hasUUID } from './BlockModel'

export type BlockViewTraits = {
  isPinned?: boolean
}

type Props = InputOptions & {
  /** block ordinal index */
  idx: number

  /** block model */
  model: BlockModel

  /** tab UUID */
  uuid: string

  /** tab model */
  tab: KuiTab

  noActiveInput?: boolean

  noOutput?: boolean
  onOutputRender?: (idx: number) => void
} & BlockViewTraits

interface State {
  // needed temporarily to make pty/client happy
  _block?: HTMLElement
}

export default class Block extends React.PureComponent<Props, State> {
  /** grab a ref to the Input to help with maintaining focus */
  private _input: Input

  public constructor(props: Props) {
    super(props)
    this.state = {}
  }

  /** Owner wants us to focus on the current prompt */
  public doFocus() {
    if (this._input) {
      this._input.doFocus()
    }
  }

  public inputValue() {
    return this._input && this._input.value()
  }

  private output() {
    if (isFinished(this.props.model) || isProcessing(this.props.model)) {
      return (
        <Output
          uuid={this.props.uuid}
          tab={this.props.tab}
          model={this.props.model}
          onRender={this.props.onOutputRender && (() => this.props.onOutputRender(this.props.idx))}
          isPinned={this.props.isPinned}
        />
      )
    }
  }

  private willScreenshot() {
    if (this.props.willLoseFocus) {
      this.props.willLoseFocus()
    }

    // async, to allow willLoseFocus() to take affect
    setTimeout(() => {
      const element = this.state._block.querySelector('.kui--screenshotable') || this.state._block
      eventChannelUnsafe.emit('/screenshot/element', element)
    })
  }

  private customInput() {
    if (this.props.children && React.isValidElement(this.props.children)) {
      return React.cloneElement(this.props.children, {
        idx: this.props.idx,
        tab: this.props.tab,
        uuid: this.props.uuid,
        block: this.state._block
      })
    }
  }

  private input() {
    return (
      this.customInput() ||
      (this.state._block && (
        <Input
          key={this.props.idx}
          uuid={this.props.uuid}
          tab={this.props.tab}
          model={this.props.model}
          {...this.props}
          willScreenshot={this.state._block && this.props.willRemove ? () => this.willScreenshot() : undefined}
          _block={this.state._block}
          ref={c => (this._input = c)}
        >
          {this.props.children}
        </Input>
      ))
    )
  }

  /**
   * For Active or Empty blocks, just show the <Input/>, otherwise
   * wrap the <Input/>-<Output/> pair.
   *
   */
  public render() {
    return (
      (!this.props.noActiveInput || !isActive(this.props.model)) && (
        <div
          className={'repl-block ' + this.props.model.state.toString()}
          data-pinned={this.props.isPinned || undefined}
          data-uuid={hasUUID(this.props.model) && this.props.model.execUUID}
          data-input-count={this.props.idx}
          ref={c => this.setState({ _block: c })}
        >
          {isActive(this.props.model) || isEmpty(this.props.model) ? (
            this.input()
          ) : (
            <React.Fragment>
              {this.input()}
              {this.output()}
            </React.Fragment>
          )}
        </div>
      )
    )
  }
}
