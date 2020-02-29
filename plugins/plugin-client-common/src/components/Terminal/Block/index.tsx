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
import { AccordionItem } from 'carbon-components-react'
import { Tab as KuiTab } from '@kui-shell/core'

import Input from './Input'
import Output from './Output'
import { BlockModel, isActive, isEmpty, isFinished, isProcessing, hasUUID } from './BlockModel'

interface Props {
  idx: number
  tab: KuiTab
  model: BlockModel

  noActiveInput?: boolean
  noPromptContext?: boolean

  noOutput?: boolean
  onOutputRender?: (idx: number) => void
}

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

  private output() {
    if (isFinished(this.props.model) || isProcessing(this.props.model)) {
      return (
        <Output
          tab={this.props.tab}
          model={this.props.model}
          onRender={this.props.onOutputRender && (() => this.props.onOutputRender(this.props.idx))}
        />
      )
    }
  }

  private input() {
    return (
      this.state._block && (
        <Input
          key={this.props.idx}
          tab={this.props.tab}
          model={this.props.model}
          noPromptContext={this.props.noPromptContext}
          _block={this.state._block}
          ref={c => (this._input = c)}
        />
      )
    )
  }

  /**
   * For Active or Empty blocks, just show the <Input/>, otherwise
   * wrap the <Input/>-<Output/> pair around an <AccordionItem/>
   *
   * Notes: if you attempt to use an <AccordionItem/> for the Active
   * state, you may find that hitting return for command execution
   * percolates till a click on the accordion, thus collapsing it; the
   * net result is all valid, except that the accordion is closed when
   * the command execution completes. I can't replicate this at human
   * speed, but the tests trigger it. Furtheermore, it is important to
   * do this for Empty as well as Active, so that e.g. typing
   * "foo<Ctrl+c>" results in preservation of the aborted "foo" text;
   * i.e. we need to keep the same <Input/> instance for this
   * Active-to-Empty state transition, otherwise React will re-render
   * a new <Input/> element, thus losing the input.value of the
   * <input> element that underlies <Input/>.
   *
   */
  public render() {
    return (
      (!this.props.noActiveInput || !isActive(this.props.model)) && (
        <div
          className={'repl-block kui--screenshotable ' + this.props.model.state.toString()}
          data-uuid={hasUUID(this.props.model) && this.props.model.execUUID}
          data-input-count={this.props.idx}
          ref={c => this.setState({ _block: c })}
        >
          {isActive(this.props.model) || isEmpty(this.props.model) ? (
            this.input()
          ) : (
            <AccordionItem
              open
              onKeyDown={event => event.stopPropagation()}
              onClick={event => event.stopPropagation()}
              iconDescription=""
              title={this.input()}
            >
              {this.output()}
            </AccordionItem>
          )}
        </div>
      )
    )
  }
}
