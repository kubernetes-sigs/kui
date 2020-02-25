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
import { Tab as KuiTab, onPaste } from '@kui-shell/core'
import { InlineLoading as Loading } from 'carbon-components-react'

import onKeyDown from './OnKeyDown'
import onKeyPress from './OnKeyPress'
import { BlockModel, isActive, isOk, isProcessing, isFinished, hasCommand, isEmpty, hasUUID } from './BlockModel'

import { promptPlaceholder } from '@kui-shell/client/config.d/style.json'

import ActiveISearch, { onKeyUp } from './ActiveISearch'

interface Props {
  // needed temporarily to make pty/client happy
  _block: HTMLElement

  // for listen, which may go away soon
  tab: KuiTab

  model: BlockModel
}

interface State {
  onKeyDown: (evt: KeyboardEvent) => void
  onKeyPress: (evt: KeyboardEvent) => void
  onKeyUp: (evt: KeyboardEvent) => void

  /** the execution ID for this prompt, if any */
  execUUID?: string

  /** DOM element for prompt; set via `ref` in render() below */
  prompt?: HTMLInputElement

  /** state of active reverse-i-search */
  isearch?: ActiveISearch
}

export default class Input extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      onKeyDown: undefined,
      onKeyPress: undefined,
      onKeyUp: onKeyUp(this),
      execUUID: hasUUID(props.model) && props.model.execUUID,
      prompt: undefined
    }
  }

  /** Owner wants us to focus on the current prompt */
  public doFocus() {
    if (this.state.prompt) {
      this.state.prompt.focus()
    }
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    if (state.prompt && isActive(props.model) && !state.onKeyPress) {
      return {
        onKeyPress: onKeyPress(props.tab, props._block, state.prompt),
        onKeyDown: onKeyDown(props.tab, props._block, state.prompt)
      }
    } else if (hasUUID(props.model)) {
      return {
        execUUID: props.model.execUUID
      }
    } else if (state.prompt && isActive(props.model) && state.execUUID !== undefined && !state.isearch) {
      // e.g. terminal has been cleared; we need to excise the current
      // <input/> because react aggressively caches these
      return {
        prompt: undefined,
        onKeyDown: undefined,
        onKeyPress: undefined,
        execUUID: undefined
      }
    }

    return state
  }

  /** the "xxx" part of "xxx >" of the prompt */
  private promptLeft() {
    return <span className="repl-context">{this.props.model.cwd}</span>
  }

  /** the ">" part of "xxx >" of the prompt */
  private promptRight() {
    return (
      <span className="repl-prompt-righty">
        {/* a right chevron */}
        <i>&#x276f;</i>
      </span>
    )
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

      const kp = active && !this.state.isearch ? evt => this.state.onKeyPress(evt.nativeEvent) : undefined
      const kd = active && !this.state.isearch ? evt => this.state.onKeyDown(evt.nativeEvent) : undefined
      const ku = active ? evt => this.state.onKeyUp(evt.nativeEvent) : undefined
      const op = active && !this.state.isearch ? evt => onPaste(evt.nativeEvent) : undefined

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
          placeholder={promptPlaceholder}
          onKeyPress={kp}
          onKeyDown={kd}
          onKeyUp={ku}
          onPaste={op}
          ref={c => {
            if (c && !this.state.prompt) {
              c.value = ''
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
          value={hasCommand(this.props.model) ? this.props.model.command : ''}
          tabIndex={-1}
          placeholder={promptPlaceholder}
          ref={c => {
            if (c && !this.state.prompt) {
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
          <div className={isProcessing(this.props.model) ? 'fade-in2' : undefined}>
            <Loading
              status={isProcessing(this.props.model) ? 'active' : isOk(this.props.model) ? 'finished' : 'error'}
              successDelay={1000}
              description={this.props.model.startTime && this.props.model.startTime.toLocaleTimeString()}
            />
          </div>
        )
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
        {this.prompt()}
        {this.input()}
        {this.status()}
      </div>
    )
  }
}
