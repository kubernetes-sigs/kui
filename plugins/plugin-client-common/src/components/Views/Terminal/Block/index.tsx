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
import { Events, Tab as KuiTab } from '@kui-shell/core'

import Width from '../../Sidecar/width'
import SplitPosition from '../SplitPosition'
import Input, { InputOptions } from './Input'
import Output from './Output'
import {
  BlockModel,
  isActive,
  isEmpty,
  isFinished,
  isMaximized,
  isOutputOnly,
  isProcessing,
  isReplay,
  isAnnouncement,
  hideOutput,
  hasUUID
} from './BlockModel'
import { MutabilityContext } from '../../../Client/MutabilityContext'

export type BlockViewTraits = {
  /** number of splits currently in this tab */
  nSplits?: number

  isExperimental?: boolean
  isFocused?: boolean
  isWidthConstrained?: boolean

  /** Handler for: User clicked to focus on this block */
  willFocusBlock?: (evt: React.SyntheticEvent) => void

  /** Handler for <li> focus */
  onFocus?: (evt: React.FocusEvent) => void
}

export interface BlockOperationTraits {
  /** Remove the enclosing block */
  willRemove?: (evt: React.SyntheticEvent, idx?: number) => void

  /** Is the block executable? e.g. re-editable and re-runable */
  isExecutable?: boolean
}

type Props = InputOptions & {
  /** block ordinal index */
  idx: number

  /** block ordinal index to be displayed to the user */
  displayedIdx?: number

  /** block model */
  model: BlockModel

  /** tab UUID */
  uuid: string

  /** tab model */
  tab: KuiTab

  noActiveInput?: boolean

  /** Position of the enclosing split. Default: SplitPosition.default */
  splitPosition?: SplitPosition

  noOutput?: boolean
  onOutputRender?: () => void
  willUpdateCommand?: (idx: number, command: string) => void
} & BlockViewTraits

interface State {
  // needed temporarily to make pty/client happy
  _block?: HTMLElement

  /** Is the Input element focused? */
  isFocused: boolean

  /** Does a child want to us to be maximized? */
  isMaximized: boolean
}

export default class Block extends React.PureComponent<Props, State> {
  /** grab a ref to the Input to help with maintaining focus */
  private _input: Input

  public constructor(props: Props) {
    super(props)
    this.state = {
      isFocused: false,
      isMaximized: false
    }
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

  /** Child wants to maximize/restore */
  private willChangeSize(width: Width) {
    this.setState({
      isMaximized: width === Width.Maximized
    })
    setTimeout(() => {
      Events.eventBus.emitTabLayoutChange(this.props.tab.uuid)
      if (this.state._block) {
        this.state._block.scrollIntoView(true)
      }
    })
  }

  private readonly _willChangeSize = this.willChangeSize.bind(this)

  private onOutputRender() {
    if (this.props.onOutputRender) {
      this.props.onOutputRender()
    }

    // oof: this is for bottom input clients... but it messes up
    // notebooks, constantly scrolling to bottom...
    /* if (this.props.noActiveInput && this.state._block) {
      this.state._block.scrollIntoView()
    } */
  }

  private readonly _onOutputRender = this.onOutputRender.bind(this)

  private output() {
    if (isFinished(this.props.model) || isProcessing(this.props.model)) {
      return (
        <Output
          key={isEmpty(this.props.model) ? undefined : this.props.model.execUUID}
          uuid={this.props.uuid}
          tab={this.props.tab}
          idx={this.props.idx}
          model={this.props.model}
          splitPosition={this.props.splitPosition}
          willRemove={this.props.willRemove}
          willChangeSize={this._willChangeSize}
          onRender={this._onOutputRender}
          willUpdateCommand={this.props.willUpdateCommand}
          isWidthConstrained={this.props.isWidthConstrained}
          willFocusBlock={this.props.willFocusBlock}
        />
      )
    }
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
          key={this.props.uuid}
          uuid={this.props.uuid}
          tab={this.props.tab}
          model={this.props.model}
          isExperimental={this.props.isExperimental}
          {...this.props}
          willFocusBlock={this.props.willFocusBlock}
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
    const hideOut = hideOutput(this.props.model)

    return (
      (!this.props.noActiveInput || !isActive(this.props.model)) && (
        <MutabilityContext.Consumer>
          {value => (
            <li
              className={'repl-block ' + (hideOut ? '' : this.props.model.state.toString())}
              data-is-executable={value.executable || undefined}
              data-is-editable={value.editable || undefined}
              data-is-maximized={this.state.isMaximized || isMaximized(this.props.model) || undefined}
              data-is-output-only={isOutputOnly(this.props.model) || undefined}
              data-is-empty={isEmpty(this.props.model) || undefined}
              data-announcement={isAnnouncement(this.props.model) || undefined}
              data-uuid={hasUUID(this.props.model) && this.props.model.execUUID}
              data-scrollback-uuid={this.props.uuid}
              data-input-count={this.props.idx}
              data-is-focused={this.props.isFocused || undefined}
              data-is-replay={isReplay(this.props.model) || undefined}
              ref={c => this.setState({ _block: c })}
              tabIndex={isActive(this.props.model) ? -1 : 1}
              onClick={this.props.willFocusBlock}
              onFocus={this.props.onFocus}
            >
              <React.Fragment>
                {isAnnouncement(this.props.model) || isOutputOnly(this.props.model) ? (
                  this.output()
                ) : isActive(this.props.model) || isEmpty(this.props.model) ? (
                  this.input()
                ) : (
                  <React.Fragment>
                    {this.input()}
                    {!hideOut && this.output()}
                  </React.Fragment>
                )}
              </React.Fragment>
            </li>
          )}
        </MutabilityContext.Consumer>
      )
    )
  }
}
