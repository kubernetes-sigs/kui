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
import { Tab as KuiTab, onPaste, onKeyDown, onKeyPress } from '@kui-shell/core'
import { InlineLoading as Loading } from 'carbon-components-react'

import { BlockModel, isActive, isOk, isProcessing, isFinished, hasCommand, isEmpty, hasUUID } from './BlockModel'

import { promptPlaceholder } from '@kui-shell/client/config.d/style.json'

interface Props {
  // needed temporarily to make pty/client happy
  _block: HTMLElement

  // for listen, which may go away soon
  tab: KuiTab

  model: BlockModel
}

interface State {
  onKeyPress: (evt: KeyboardEvent) => void
  onKeyDown: (evt: KeyboardEvent) => void
  execUUID: string
  prompt?: HTMLInputElement
}

export default class Input extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      onKeyPress: undefined,
      onKeyDown: undefined,
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
    } else if (state.prompt && isActive(props.model) && state.execUUID !== undefined) {
      // e.g. terminal has been cleared; we need to excise the current
      // <input/> because react aggressively caches these
      return {
        prompt: undefined,
        onKeyPress: undefined,
        onKeyDown: undefined,
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

  /** the "xxx >" prompt part of the input section */
  private prompt() {
    return (
      <div className="repl-prompt">
        {this.promptLeft()}
        {this.promptRight()}
      </div>
    )
  }

  /** the element that represents the command being/having been/going to be executed */
  private input() {
    const active = this.state.prompt !== undefined && isActive(this.props.model)

    if (active) {
      setTimeout(() => this.state.prompt.focus())

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
          tabIndex={1}
          placeholder={promptPlaceholder}
          onKeyPress={active ? evt => this.state.onKeyPress(evt.nativeEvent) : undefined}
          onKeyDown={active ? evt => this.state.onKeyDown(evt.nativeEvent) : undefined}
          onPaste={active ? evt => onPaste(evt.nativeEvent) : undefined}
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
