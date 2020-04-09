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
import { Tab as KuiTab } from '@kui-shell/core'

import onPaste from './OnPaste'
import onKeyDown from './OnKeyDown'
import onKeyPress from './OnKeyPress'
import { TabCompletionState } from './TabCompletion'
import ActiveISearch, { onKeyUp } from './ActiveISearch'
import { BlockModel, isActive, isProcessing, isFinished, hasCommand, isEmpty, hasUUID, hasValue } from './BlockModel'

export interface InputOptions {
  /** Optional: placeholder value for prompt */
  promptPlaceholder?: string // was: from '@kui-shell/client/config.d/style.json'

  /** Optional: do not display prompt context, e.g. current working directory */
  noPromptContext?: boolean

  /** Optional: onChange handler */
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void

  /** Optional: onClick handler */
  onInputClick?: (event: React.MouseEvent<HTMLInputElement>) => void

  /** Optional: onKeyDown handler */
  onInputKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void

  /** Optional: onKeyPress handler */
  onInputKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void

  /** Optional: onKeyUp handler */
  onInputKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void

  /** Optional: onMouseDown handler */
  onInputMouseDown?: (event: React.MouseEvent<HTMLInputElement>) => void

  /** Optional: onMouseMove handler */
  onInputMouseMove?: (event: React.MouseEvent<HTMLInputElement>) => void

  /** Optional: onBlur handler */
  onInputBlur?: (event: React.FocusEvent<HTMLInputElement>) => void

  /** Optional: onFocus handler */
  onInputFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
}

type Props = InputOptions & {
  /** needed temporarily to make pty/client happy */
  _block: HTMLElement

  /** for key handlers, which may go away soon */
  tab: KuiTab

  /** state of the Block, e.g. Processing? Active/accepting input? */
  model: BlockModel
}

interface State {
  /** the execution ID for this prompt, if any */
  execUUID?: string

  /** DOM element for prompt; set via `ref` in render() below */
  prompt?: HTMLInputElement

  /** state of active reverse-i-search */
  isearch?: ActiveISearch

  /** state of tab completion */
  tabCompletion?: TabCompletionState
}

export default class Input extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      execUUID: hasUUID(props.model) && props.model.execUUID,
      prompt: undefined
    }
  }

  /** @return the value of the prompt */
  public value() {
    return this.state.prompt && this.state.prompt.value
  }

  /** Owner wants us to focus on the current prompt */
  public doFocus() {
    if (this.state.prompt) {
      this.state.prompt.focus()
    }
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    if (hasUUID(props.model)) {
      return {
        execUUID: props.model.execUUID
      }
    } else if (state.prompt && isActive(props.model) && state.execUUID !== undefined && !state.isearch) {
      // e.g. terminal has been cleared; we need to excise the current
      // <input/> because react aggressively caches these
      return {
        prompt: undefined,
        execUUID: undefined
      }
    }

    return state
  }

  /** the "xxx" part of "xxx >" of the prompt */
  private promptLeft() {
    return !this.props.noPromptContext && <span className="repl-context">{this.props.model.cwd}</span>
  }

  /** the ">" part of "xxx >" of the prompt */
  private promptRight() {
    // &#x2771; "heavy right-pointing angle bracket ornament"
    // another option: &#x276f; "heavy right-pointing angle quotation mark ornament"
    return <span className="repl-prompt-righty">&#x276f;</span>
  }

  private isearchPrompt() {
    return <div className="repl-prompt">{this.state.isearch.render()}</div>
  }

  private normalPrompt() {
    return (
      <div className="repl-prompt">
        {this.promptLeft()}
        {this.promptRight()}
      </div>
    )
  }

  /** the "xxx >" prompt part of the input section */
  private prompt() {
    if (this.state.isearch && this.state.prompt) {
      try {
        return this.isearchPrompt()
      } catch (err) {
        console.error('error rendering i-search', err)
        return this.normalPrompt()
      }
    } else {
      return this.normalPrompt()
    }
  }

  /** the element that represents the command being/having been/going to be executed */
  private input() {
    const active = this.state.prompt !== undefined && isActive(this.props.model)

    if (active) {
      setTimeout(() => this.state.prompt.focus())

      const kp = active && !this.state.isearch ? onKeyPress.bind(this) : undefined
      const kd = active && !this.state.isearch ? onKeyDown.bind(this) : undefined
      const ku = active ? onKeyUp.bind(this) : undefined
      const op =
        active && !this.state.isearch ? evt => onPaste(evt.nativeEvent, this.props.tab, this.state.prompt) : undefined

      return (
        <input
          type="text"
          autoFocus
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          autoCapitalize="off"
          className={'repl-input-element' + (this.state.isearch ? ' repl-input-hidden' : '')}
          aria-label="Command Input"
          tabIndex={1}
          placeholder={this.props.promptPlaceholder}
          onBlur={this.props.onInputBlur}
          onFocus={this.props.onInputFocus}
          onMouseDown={this.props.onInputMouseDown}
          onMouseMove={this.props.onInputMouseMove}
          onChange={this.props.onInputChange}
          onClick={this.props.onInputClick}
          onKeyPress={evt => {
            kp(evt)
            this.props.onInputKeyPress && this.props.onInputKeyPress(evt)
          }}
          onKeyDown={evt => {
            kd(evt)
            this.props.onInputKeyDown && this.props.onInputKeyDown(evt)
          }}
          onKeyUp={evt => {
            ku(evt)
            this.props.onInputKeyUp && this.props.onInputKeyUp(evt)
          }}
          onPaste={op}
          ref={c => {
            if (c && !this.state.prompt) {
              c.value = hasValue(this.props.model) ? this.props.model.value : ''
              this.setState({ prompt: c })
            }
          }}
        />
      )
    } else {
      return (
        <input
          type="text"
          autoFocus
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          autoCapitalize="off"
          className="repl-input-element"
          aria-label="Command Input"
          readOnly
          tabIndex={-1}
          onClick={evt => evt.stopPropagation() /* accordion... */}
          ref={c => {
            if (c && !this.state.prompt) {
              c.value = hasValue(this.props.model)
                ? this.props.model.value
                : hasCommand(this.props.model)
                ? this.props.model.command
                : ''
              this.setState({ prompt: c })
            }
          }}
        />
      )
    }
  }

  /** a status icon, e.g. spinner, "ok" check mark, etc. */
  private statusIcon() {
    try {
      if (!isEmpty(this.props.model) && (isProcessing(this.props.model) || isFinished(this.props.model))) {
        // "true" means a blank response; don't display any statusIcon bits in this case
        // also don't display statusIcon bits for "active" blocks, i.e. those accepting Input
        return (
          <span className="bx--inline-loading__text">
            {this.props.model.startTime && this.props.model.startTime.toLocaleTimeString()}
          </span>
        )
        /*        return (
          <div className={isProcessing(this.props.model) ? 'fade-in2' : undefined}>
            <Loading
              status={isProcessing(this.props.model) ? 'active' : isOk(this.props.model) ? 'finished' : 'error'}
              successDelay={1000}
              description={this.props.model.startTime && this.props.model.startTime.toLocaleTimeString()}
            />
          </div>
        ) */
      }
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Status elements associated with the block; even though these
   * pertain to the Output part of a Block, these are currently placed
   * in the Input area.
   *
   */
  private status() {
    return (
      <span className="repl-prompt-right-elements">
        <div className="repl-prompt-right-element-status-icon deemphasize">{this.statusIcon()}</div>
      </span>
    )
  }

  public render() {
    return (
      <div className="repl-input">
        <div style={{ flex: 1 }}>
          <div className="kui--input-and-context">
            {this.prompt()}
            {this.props.children}
            {this.input()}
            {this.status()}
          </div>
          {this.state.tabCompletion && this.state.tabCompletion.render()}
        </div>
      </div>
    )
  }
}
