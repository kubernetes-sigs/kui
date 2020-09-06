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
import { basename } from 'path'
import { dots as spinnerFrames } from 'cli-spinners'
import {
  Tab as KuiTab,
  inBrowser,
  doCancel,
  i18n,
  isTable,
  hasSourceReferences,
  eventBus,
  getPrimaryTabId
} from '@kui-shell/core'

import onPaste from './OnPaste'
import onKeyDown from './OnKeyDown'
import onKeyPress from './OnKeyPress'
import KuiContext from '../../../Client/context'
import { TabCompletionState } from './TabCompletion'
import ActiveISearch, { onKeyUp } from './ActiveISearch'
import {
  BlockModel,
  isActive,
  isProcessing,
  isFinished,
  hasCommand,
  isEmpty,
  isWithCompleteEvent,
  hasUUID,
  hasValue
} from './BlockModel'
import { BlockViewTraits } from './'

import Tag from '../../../spi/Tag'
import ExpandableSection from '../../../spi/ExpandableSection'
import DropDown, { DropDownAction } from '../../../spi/DropDown'

const SimpleEditor = React.lazy(() => import('../../../Content/Editor/SimpleEditor'))

const strings = i18n('plugin-client-common')
const strings2 = i18n('plugin-client-common', 'screenshot')

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

  /** Navigation controller */
  navigateTo?(dir: 'first' | 'last' | 'previous' | 'next'): void
}

type InputProps = {
  /** Block ordinal */
  idx?: number

  /** Block ordinal to be displayed to user */
  displayedIdx?: number

  /** needed temporarily to make pty/client happy */
  _block?: HTMLElement

  /** tab UUID */
  uuid?: string

  /** for key handlers, which may go away soon */
  tab?: KuiTab

  /** state of the Block, e.g. Processing? Active/accepting input? */
  model?: BlockModel

  /** is the command experimental? */
  isExperimental?: boolean
}

export type Props = InputOptions & InputProps & BlockViewTraits

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

  /** typeahead completion? */
  typeahead?: string
}

export abstract class InputProvider<S extends State = State> extends React.PureComponent<Props, S> {
  /** this is what the InputProvider needs to provide, minimially */
  protected abstract input()

  /** rendered to the left of the input element */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected status() {}

  protected contextContent(
    insideBrackets: React.ReactNode = this.props.displayedIdx || this.props.idx + 1
  ): React.ReactNode {
    return <React.Fragment>In[{insideBrackets}]</React.Fragment> // this.props.model.cwd
  }

  /** the "xxx" part of "xxx >" of the prompt */
  protected promptLeft() {
    return (
      !this.props.noPromptContext && (
        <KuiContext.Consumer>
          {config =>
            !config.noPromptContext && this.props.model && <span className="repl-context">{this.contextContent()}</span>
          }
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
        {config => (
          <span className="repl-prompt-righty">{config.prompt || (this.props.isPartOfMiniSplit ? '\u276f' : '/')}</span>
        )}
      </KuiContext.Consumer>
    )
  }

  protected isearchPrompt() {
    return <div className="repl-prompt">{this.state.isearch.render()}</div>
  }

  protected normalPrompt() {
    return (
      <KuiContext.Consumer>
        {config =>
          config.prompt ? (
            <div className="repl-prompt">{this.promptRight()}</div>
          ) : (
            <div className="repl-context">{this.contextContent()}</div>
          )
        }
      </KuiContext.Consumer>
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

  protected sourceRef() {
    const { model } = this.props

    if (model && isWithCompleteEvent(model) && isTable(model.response) && hasSourceReferences(model.response)) {
      const sourceRef = model.response.kuiSourceRef
      return (
        <div className="repl-input-sourceref">
          <div className="repl-context"></div>
          <div className="flex-layout flex-fill">
            {sourceRef.templates.map((_, idx) => {
              const name = basename(_.filepath)
              return (
                <ExpandableSection
                  key={idx}
                  className="flex-fill"
                  showMore={strings('Show X', name)}
                  showLess={strings('Hide X', name)}
                  onToggle={() => eventBus.emitTabLayoutChange(getPrimaryTabId(this.props.tab))}
                >
                  <SimpleEditor
                    tabUUID={getPrimaryTabId(this.props.tab)}
                    content={_.data}
                    contentType={_.contentType}
                    className="kui--source-ref-editor kui--inverted-color-context"
                    fontSize={12}
                  />
                </ExpandableSection>
              )
            })}
          </div>
        </div>
      )
    }

    // if (this.state.sourceRef) {
    //      return 'hi'
    //    }
  }

  public render() {
    return (
      <React.Fragment>
        <div className={'repl-input' + (this.state && this.state.isearch ? ' kui--isearch-active' : '')}>
          {this.prompt()}
          <div className="kui--input-and-context">
            {this.props.children}
            {this.input()}
            {this.status()}
          </div>
          {this.state && this.state.tabCompletion && this.state.tabCompletion.render()}
        </div>
        {this.sourceRef()}
      </React.Fragment>
    )
  }
}

export default class Input extends InputProvider {
  public constructor(props: Props) {
    super(props)

    this.state = {
      execUUID: hasUUID(props.model) ? props.model.execUUID : undefined,
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
    if (this.props.isFocused && this.state.prompt) {
      this.state.prompt.focus()
    }
  }

  protected contextContent() {
    return super.contextContent(isProcessing(this.props.model) ? this.spinner() : undefined)
  }

  private static newSpinner(spinnerDom: HTMLSpanElement) {
    let frame = 0

    spinnerDom.innerText = spinnerFrames.frames[frame++]
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

  private onKeyPress(evt: React.KeyboardEvent<HTMLInputElement>) {
    if (!this.state.isearch) {
      onKeyPress.bind(this)(evt)
    }
    this.props.onInputKeyPress && this.props.onInputKeyPress(evt)
  }

  private readonly _onKeyPress = this.onKeyPress.bind(this)

  private onKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    if (!this.state.isearch) {
      onKeyDown.bind(this)(evt)
    }
    this.props.onInputKeyDown && this.props.onInputKeyDown(evt)
  }

  private readonly _onKeyDown = this.onKeyDown.bind(this)

  private onKeyUp(evt: React.KeyboardEvent<HTMLInputElement>) {
    onKeyUp.bind(this)(evt)
    this.props.onInputKeyUp && this.props.onInputKeyUp(evt)
  }

  private readonly _onKeyUp = this.onKeyUp.bind(this)

  private onPaste(evt: React.ClipboardEvent) {
    if (!this.state.isearch) {
      onPaste(evt.nativeEvent, this.props.tab, this.state.prompt)
    }
  }

  private readonly _onPaste = this.onPaste.bind(this)

  private onRef(c: HTMLInputElement) {
    if (c && !this.state.prompt) {
      c.value = hasValue(this.props.model) ? this.props.model.value : ''
      this.setState({ prompt: c })
    } else if (c && this.props.isFocused) {
      c.focus()
    }
  }

  private readonly _onRef = this.onRef.bind(this)

  /** the element that represents the command being/having been/going to be executed */
  protected input() {
    const active = isActive(this.props.model)

    if (active) {
      if (this.props.isFocused && this.state.prompt) {
        this.state.prompt.focus()
      }

      return (
        <React.Fragment>
          <input
            type="text"
            autoFocus={this.props.isFocused}
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            autoCapitalize="off"
            className={
              'repl-input-element-wrapper repl-input-element' + (this.state.isearch ? ' repl-input-hidden' : '')
            }
            aria-label="Command Input"
            tabIndex={1}
            placeholder={this.props.promptPlaceholder}
            onBlur={this.props.onInputBlur}
            onFocus={this.props.onInputFocus}
            onMouseDown={this.props.onInputMouseDown}
            onMouseMove={this.props.onInputMouseMove}
            onChange={this.props.onInputChange}
            onClick={this.props.onInputClick}
            onKeyPress={this._onKeyPress}
            onKeyDown={this._onKeyDown}
            onKeyUp={this._onKeyUp}
            onPaste={this._onPaste}
            ref={this._onRef}
          />
          {this.state.typeahead && <span className="kui--input-typeahead">{this.state.typeahead}</span>}
        </React.Fragment>
      )
    } else {
      const value =
        this.value() ||
        (hasValue(this.props.model)
          ? this.props.model.value
          : hasCommand(this.props.model)
          ? this.props.model.command
          : '')

      if (isProcessing(this.props.model)) {
        // for processing blocks, we still need an input, albeit
        // readOnly, to handle ctrl+C
        return (
          <span className="repl-input-element-wrapper flex-layout flex-fill">
            <input
              className="repl-input-element"
              readOnly
              value={value}
              onKeyDown={evt => {
                if (evt.key === 'c' && evt.ctrlKey) {
                  doCancel(this.props.tab, this.props._block)
                }
              }}
              ref={c => c && c.focus()}
            />
            {this.inputStatus(value)}
          </span>
        )
      } else {
        // for "done" blocks, render the value as a plain div
        return (
          <div className="repl-input-element-wrapper flex-layout flex-fill">
            <span className="repl-input-element flex-fill">{value}</span>
            {this.inputStatus(value)}
          </div>
        )
      }
    }
  }

  /** render a tag for experimental command */
  private experimentalTag() {
    if (this.props.isExperimental) {
      return (
        <Tag
          spanclassname="kui--repl-block-experimental-tag kui--repl-block-right-element kui--inverted-color-context"
          title={strings('HoverExperimentalTag')}
          type="warning"
        >
          {strings('ExperimentalTag')}
        </Tag>
      )
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
    return (
      <span
        className="kui--repl-block-spinner"
        ref={spinnerDom => {
          this.setState({ spinnerDom })
        }}
      />
    )
  }

  /** error icon for error blocks */
  private errorIcon() {
    /* if (isOops(this.props.model)) {
      return <Icons className="kui--repl-block-error-icon" icon="Error" data-mode="error" />
    } */
  }

  private rerunAction(command: string): DropDownAction[] {
    return [
      {
        label: strings('Rerun'),
        handler: () =>
          hasUUID(this.props.model)
            ? this.props.tab.REPL.pexec(command, { execUUID: this.props.model.execUUID })
            : this.props.tab.REPL.pexec(command)
      }
    ]
  }

  private copyAction(command: string): DropDownAction[] {
    return [
      {
        label: strings('Copy'),
        handler: () => navigator.clipboard.writeText(command)
      }
    ]
  }

  private removeAction(): DropDownAction[] {
    return !this.props.willRemove
      ? []
      : [
          {
            label: strings('Remove'),
            handler: () => this.props.willRemove()
          }
        ]
  }

  private screenshotAction(): DropDownAction[] {
    return !this.props.willScreenshot || inBrowser()
      ? []
      : [
          {
            label: strings2('Screenshot'),
            handler: () => this.props.willScreenshot()
          }
        ]
  }

  /** DropDown menu for completed blocks */
  private dropdown(command: string) {
    if (!isActive(this.props.model)) {
      const actions = this.screenshotAction().concat(
        this.copyAction(command),
        this.rerunAction(command),
        this.removeAction()
      )
      return (
        <DropDown
          actions={actions}
          className="kui--repl-block-right-element kui--toolbar-button-with-icon"
          onClose={this.props.willLoseFocus}
        />
      )
    }
  }

  /** Close button. Only for pinned blocks for now. */
  /* private close() {
    return (
      this.props.willRemove &&
      this.props.isPinned && (
        <a
          href="#"
          onClick={this.props.willRemove}
          className="kui--repl-block-right-element kui--toolbar-button-with-icon kui--pinned-close-button"
          title={strings('Close watcher')}
        >
          <Icons icon="WindowClose" />
        </a>
      )
    )
  } */

  /**
   * Status elements associated with the block as a whole; even though
   * these also pertain to the Output part of a Block, these are
   * currently housed in this Input component.
   *
   */
  protected status() {
    return (
      <span className="repl-prompt-right-elements">
        {this.errorIcon()}
        {/* this.close() */}
      </span>
    )
  }

  /** Status elements placed in with <input> part of the block */
  protected inputStatus(input: string) {
    return (
      <React.Fragment>
        {this.experimentalTag()}
        {this.timestamp()}
        {this.dropdown(input)}
      </React.Fragment>
    )
  }
}
