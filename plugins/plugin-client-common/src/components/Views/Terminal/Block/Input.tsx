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
import { Tab as KuiTab, inBrowser } from '@kui-shell/core'
import { dots as spinnerFrames } from 'cli-spinners'

import onPaste from './OnPaste'
import onKeyDown from './OnKeyDown'
import onKeyPress from './OnKeyPress'
import KuiContext from '../../../Client/context'
import { TabCompletionState } from './TabCompletion'
import ActiveISearch, { onKeyUp } from './ActiveISearch'
import { BlockModel, isActive, isProcessing, isFinished, hasCommand, isEmpty, hasUUID, hasValue } from './BlockModel'

import DropDown from '../../../spi/DropDown'

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

  /** Remove the enclosing block */
  willRemove?: () => void

  /** Capture a screenshot of the enclosing block */
  willScreenshot?: () => void

  /** Block is about to lose focus */
  willLoseFocus?: () => void
}

type InputProps = {
  /** number of commands issued; a strictly increasing natural number */
  idx?: number

  /** needed temporarily to make pty/client happy */
  _block?: HTMLElement

  /** tab UUID */
  uuid?: string

  /** for key handlers, which may go away soon */
  tab?: KuiTab

  /** state of the Block, e.g. Processing? Active/accepting input? */
  model?: BlockModel
}

export type Props = InputOptions & InputProps

export interface State {
  /** the execution ID for this prompt, if any */
  execUUID?: string

  /** DOM element for prompt; set via `ref` in render() below */
  prompt?: HTMLInputElement

  /** state of active reverse-i-search */
  isearch?: ActiveISearch

  /** state of tab completion */
  tabCompletion?: TabCompletionState

  /** spinner? */
  spinner?: ReturnType<typeof setInterval>
  spinnerDom?: HTMLSpanElement
}

export abstract class InputProvider<S extends State = State> extends React.PureComponent<Props, S> {
  /** this is what the InputProvider needs to provide, minimially */
  protected abstract input()

  /** rendered to the left of the input element */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected status() {}

  /** the "xxx" part of "xxx >" of the prompt */
  protected promptLeft() {
    return (
      !this.props.noPromptContext && (
        <KuiContext.Consumer>
          {config => !config.noPromptContext && <span className="repl-context">{this.props.model.cwd}</span>}
        </KuiContext.Consumer>
      )
    )
  }

  /** the ">" part of "xxx >" of the prompt */
  protected promptRight() {
    // &#x2771; "heavy right-pointing angle bracket ornament"
    // another option: &#x276f; "heavy right-pointing angle quotation mark ornament"
    return (
      <KuiContext.Consumer>
        {config => <span className="repl-prompt-righty">{config.prompt || '/'}</span>}
      </KuiContext.Consumer>
    )
  }

  protected isearchPrompt() {
    return <div className="repl-prompt">{this.state.isearch.render()}</div>
  }

  protected normalPrompt() {
    return (
      <div className="repl-prompt">
        {this.promptLeft()}
        {this.promptRight()}
      </div>
    )
  }

  /** the "xxx >" prompt part of the input section */
  protected prompt() {
    if (this.state && this.state.isearch && this.state.prompt) {
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

  public render() {
    return (
      <div className={'repl-input' + (this.state && this.state.isearch ? ' kui--isearch-active' : '')}>
        <div className="kui--input-and-context">
          {this.prompt()}
          {this.props.children}
          {this.input()}
          {this.status()}
        </div>
        {this.state && this.state.tabCompletion && this.state.tabCompletion.render()}
      </div>
    )
  }
}

export default class Input extends InputProvider {
  public constructor(props: Props) {
    super(props)

    this.state = {
      execUUID: hasUUID(props.model) && props.model.execUUID,
      prompt: undefined,
      spinner: undefined
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

  private static newSpinner(spinnerDom: HTMLSpanElement) {
    let frame = 0

    return setInterval(function() {
      frame = frame + 1 === spinnerFrames.frames.length ? 0 : frame + 1
      spinnerDom.innerText = spinnerFrames.frames[frame]
    }, spinnerFrames.interval)
  }

  private static updateSpinner(props: Props, state: State) {
    const spinner = isProcessing(props.model)
      ? state.spinner || (state.spinnerDom && Input.newSpinner(state.spinnerDom))
      : undefined
    if (!spinner && state.spinner) {
      clearInterval(state.spinner)
    }

    return spinner
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    const spinner = Input.updateSpinner(props, state)

    if (hasUUID(props.model)) {
      return {
        spinner,
        execUUID: props.model.execUUID
      }
    } else if (state.prompt && isActive(props.model) && state.execUUID !== undefined && !state.isearch) {
      // e.g. terminal has been cleared; we need to excise the current
      // <input/> because react aggressively caches these
      return {
        spinner,
        prompt: undefined,
        execUUID: undefined
      }
    }

    return state
  }

  /** the element that represents the command being/having been/going to be executed */
  protected input() {
    const active = isActive(this.props.model)

    if (active || isProcessing(this.props.model)) {
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
          readOnly={!active}
          placeholder={this.props.promptPlaceholder}
          onBlur={this.props.onInputBlur}
          onFocus={this.props.onInputFocus}
          onMouseDown={this.props.onInputMouseDown}
          onMouseMove={this.props.onInputMouseMove}
          onChange={this.props.onInputChange}
          onClick={this.props.onInputClick}
          onKeyPress={evt => {
            if (kp) kp(evt)
            this.props.onInputKeyPress && this.props.onInputKeyPress(evt)
          }}
          onKeyDown={evt => {
            if (kd) kd(evt)
            this.props.onInputKeyDown && this.props.onInputKeyDown(evt)
          }}
          onKeyUp={evt => {
            if (ku) ku(evt)
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
      const value =
        this.value() ||
        (hasValue(this.props.model)
          ? this.props.model.value
          : hasCommand(this.props.model)
          ? this.props.model.command
          : '')

      return <div className="repl-input-element">{value}</div>
    }
  }

  /** render the time the block started processing */
  private timestamp() {
    if (!isEmpty(this.props.model) && (isProcessing(this.props.model) || isFinished(this.props.model))) {
      return (
        this.props.model.startTime && (
          <span className="kui--repl-block-timestamp kui--repl-block-right-element">
            {this.props.model.startTime.toLocaleTimeString()}
          </span>
        )
      )
    }
  }

  /** spinner for processing blocks */
  private spinner() {
    if (isProcessing(this.props.model)) {
      return (
        <span
          className="kui--repl-block-spinner"
          ref={spinnerDom => {
            this.setState({ spinnerDom })
          }}
        />
      )
    }
  }

  private removeAction() {
    return !this.props.willRemove ? [] : [{ label: 'Remove', handler: () => this.props.willRemove() }]
  }

  private screenshotAction() {
    return !this.props.willScreenshot || inBrowser()
      ? []
      : [
          {
            label: 'Screenshot',
            handler: () => this.props.willScreenshot()
          }
        ]
  }

  /** DropDown menu for completed blocks */
  private dropdown() {
    if (!isActive(this.props.model)) {
      const actions = this.removeAction().concat(this.screenshotAction())
      return (
        <DropDown
          actions={actions}
          className="kui--repl-block-right-element small-left-pad kui--toolbar-button-with-icon"
        />
      )
    }
  }

  /**
   * Status elements associated with the block; even though these
   * pertain to the Output part of a Block, these are currently placed
   * in the Input area.
   *
   */
  protected status() {
    return (
      <span className="repl-prompt-right-elements">
        {this.spinner()}
        {this.timestamp()}
        {this.dropdown()}
      </span>
    )
  }
}
