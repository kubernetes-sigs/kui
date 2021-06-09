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
import prettyPrintDuration from 'pretty-ms'
import { Tab as KuiTab, doCancel, i18n } from '@kui-shell/core'

import Actions from './Actions'
import onPaste from './OnPaste'
import onKeyDown from './OnKeyDown'
import onKeyPress from './OnKeyPress'
import isInViewport from '../visible'
import KuiContext from '../../../Client/context'
import { Plane as Spinner } from './Spinner'
import { TabCompletionState } from './TabCompletion'
import ActiveISearch, { onKeyUp } from './ActiveISearch'
import whenNothingIsSelected from '../../../../util/selection'
import {
  BlockModel,
  isActive,
  isActiveAndDifferent,
  isProcessing,
  isFinished,
  hasCommand,
  isEmpty,
  hasPipeStages,
  hasStartEvent,
  isWithCompleteEvent,
  isReplay,
  hasUUID,
  hasValue
} from './BlockModel'
import { BlockViewTraits, BlockOperationTraits } from './'

import FancyPipeline from './FancyPipeline'

const Tag = React.lazy(() => import('../../../spi/Tag'))
const SourceRef = React.lazy(() => import('../SourceRef'))
const Icons = React.lazy(() => import('../../../spi/Icons'))

const strings = i18n('plugin-client-common')

export interface InputOptions extends BlockOperationTraits {
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

  /** Capture a screenshot of the enclosing block */
  willScreenshot?: () => void

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
  /** Copy from props; to help with getDerivedStateFromProps */
  model: BlockModel

  /** did user click to re-edit the input? */
  isReEdit?: boolean

  /** the execution ID for this prompt, if any */
  execUUID?: string

  /** DOM element for prompt; set via `ref` in render() below */
  prompt?: HTMLInputElement

  /** state of active reverse-i-search */
  isearch?: ActiveISearch

  /** state of tab completion */
  tabCompletion?: TabCompletionState

  /** durationDom, used for counting up duration while Processing */
  counter?: ReturnType<typeof setInterval>
  durationDom?: HTMLSpanElement

  /** typeahead completion? */
  typeahead?: string
}

export abstract class InputProvider<S extends State = State> extends React.PureComponent<Props, S> {
  /** this is what the InputProvider needs to provide, minimially */
  protected abstract input()

  /** rendered to the left of the input element */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected status() {}

  protected cancelReEdit() {
    this.setState(() => {
      return {
        isReEdit: false
      }
    })
  }

  private readonly _cancelReEdit = this.cancelReEdit.bind(this)

  protected contextContent(
    insideBrackets: React.ReactNode = this.props.displayedIdx || this.props.idx + 1
  ): React.ReactNode {
    return this.state.isReEdit ? (
      <a href="#" className="kui--block-action" title={strings('Cancel edit')} onClick={this._cancelReEdit}>
        <Icons icon="Edit" className="clickable" />
      </a>
    ) : (
      <span className="repl-context-inner">
        {' '}
        {/* Helps with vertical alignment */}
        In[{insideBrackets}]
      </span>
    ) // this.props.model.cwd
  }

  /** the "xxx" part of "xxx >" of the prompt */
  protected promptLeft() {
    return (
      !this.props.noPromptContext && (
        <KuiContext.Consumer>
          {config =>
            !config.noPromptContext &&
            this.props.model && (
              <span className="repl-context" onClick={this.props.willFocusBlock} data-input-count={this.props.idx}>
                {this.contextContent()}
              </span>
            )
          }
        </KuiContext.Consumer>
      )
    )
  }

  /** the ">" part of "xxx >" of the prompt */
  protected promptRight() {
    // &#x2771; "heavy right-pointing angle bracket ornament"
    // another option: &#x276f; "heavy right-pointing angle quotation mark ornament"
    const active = this.props.model && isActive(this.props.model)
    return (
      <KuiContext.Consumer>
        {config => (
          <span className="repl-prompt-righty">
            {config.prompt === 'CWD' ? (
              <span className="clickable" onClick={() => this.props.tab.REPL.pexec(`ls ${this.props.model.cwd}`)}>
                {active && '['}
                {this.props.model.cwd}
                {active && ']'}
              </span>
            ) : (
              config.prompt || (this.props.isPartOfMiniSplit ? '\u276f' : '/')
            )}
          </span>
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
        {config => (
          <div
            className="repl-context"
            data-custom-prompt={!!config.prompt || undefined}
            onClick={this.props.willFocusBlock}
            data-input-count={this.props.idx}
          >
            {config.prompt ? <div className="repl-prompt">{this.promptRight()}</div> : this.contextContent()}
          </div>
        )}
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

  public render() {
    return (
      <React.Suspense fallback={<div />}>
        <div className={'repl-input' + (this.state && this.state.isearch ? ' kui--isearch-active' : '')}>
          {this.prompt()}
          <div className="kui--input-and-context">
            {this.props.children}
            {this.input()}
            {this.status()}
          </div>
          {this.state && this.state.tabCompletion && this.state.tabCompletion.render()}
        </div>
        <SourceRef
          tab={this.props.tab}
          isWidthConstrained={this.props.isWidthConstrained}
          model={this.props.model}
          isPartOfMiniSplit={this.props.isPartOfMiniSplit}
        />
      </React.Suspense>
    )
  }
}

export default class Input extends InputProvider {
  public constructor(props: Props) {
    super(props)

    this.state = {
      model: props.model,
      isReEdit: false,
      execUUID: hasUUID(props.model) ? props.model.execUUID : undefined,
      prompt: undefined
    }
  }

  /** @return the current value of the prompt */
  public value() {
    return this.state.prompt && this.state.prompt.value
  }

  /** @return the value to be added to the prompt */
  protected static valueToBeDisplayed(props: Props) {
    return hasValue(props.model) ? props.model.value : hasCommand(props.model) ? props.model.command : ''
  }

  /** Owner wants us to focus on the current prompt */
  public doFocus() {
    if (this.props.isFocused && this.state.prompt && document.activeElement !== this.state.prompt) {
      setTimeout(() => this.state.prompt.focus(), 50)
    }
  }

  protected contextContent() {
    return super.contextContent(
      this.showSpinnerInContext() && isProcessing(this.props.model) ? this.spinner() : undefined
    )
  }

  private static newCountup(startTime: number, durationDom: HTMLSpanElement) {
    return setInterval(() => {
      const millisSinceStart = (~~(Date.now() - startTime) / 1000) * 1000
      if (millisSinceStart > 0) {
        durationDom.innerText = prettyPrintDuration(millisSinceStart)
      }
    }, 1000)
  }

  private static updateCountup(props: Props, state: State) {
    const counter = isProcessing(props.model)
      ? state.counter || (state.durationDom && Input.newCountup(props.model.startTime, state.durationDom))
      : undefined
    if (!counter && state.counter) {
      clearInterval(state.counter)
    }

    return counter
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    const counter = Input.updateCountup(props, state)

    if (hasUUID(props.model)) {
      return {
        model: props.model,
        counter,
        execUUID: props.model.execUUID
      }
    } else if (state.prompt && isActive(props.model) && state.execUUID !== undefined && !state.isearch) {
      // e.g. terminal has been cleared; we need to excise the current
      // <input/> because react aggressively caches these
      return {
        model: props.model,
        counter,
        prompt: undefined,
        execUUID: undefined
      }
    } else if (isActiveAndDifferent(props.model, state.model)) {
      return {
        model: props.model,
        prompt: undefined,
        counter: 0,
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
    if (c && (!this.state.prompt || this.state.isReEdit)) {
      c.value = hasValue(this.props.model)
        ? this.props.model.value
        : hasCommand(this.props.model)
        ? this.props.model.command
        : ''
      this.setState({ prompt: c })

      if (this.props.isFocused && document.activeElement !== c) {
        c.focus()
      }
    } else if (c && this.props.isFocused && isInViewport(c)) {
      c.focus()
    }
  }

  private readonly _onRef = this.onRef.bind(this)

  private willFocusBlock(evt: React.SyntheticEvent<HTMLInputElement>) {
    if (this.props.willFocusBlock) {
      this.props.willFocusBlock(evt)
    }
  }

  /** This is the onFocus property of the active prompt */
  private readonly _onFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
    this.props.onInputFocus && this.props.onInputFocus(evt)
    this.willFocusBlock(evt)
  }

  /** This is the onBLur property of the active prompt */
  private readonly _onBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
    this.props.onInputBlur && this.props.onInputBlur(evt)

    const valueNotChanged =
      hasCommand(this.props.model) && this.state.prompt && this.props.model.command === this.state.prompt.value

    this.setState(curState => {
      if (curState.isReEdit && valueNotChanged) {
        return {
          isReEdit: false,
          prompt: undefined
        }
      }
    })
  }

  /** This is the onClick property of the prompt for Active blocks */
  private readonly _onClickActive = (evt: React.MouseEvent<HTMLInputElement>) => {
    this.props.onInputClick && this.props.onInputClick(evt)
    this.willFocusBlock(evt)
  }

  /** This is the onClick property of the prompt for Finished blocks */
  private readonly _onClickFinished = whenNothingIsSelected((evt: React.MouseEvent<HTMLInputElement>) => {
    this.willFocusBlock(evt)
    this.setState(curState => {
      if (!curState.isReEdit) {
        return {
          isReEdit: true
        }
      }
    })
  })

  /** For Processing blocks, we use an overlay <input/> element. We need to manage focus, since it has pointer-events: none */
  private readonly _restoreFocusToOverlayInput = whenNothingIsSelected((evt: React.SyntheticEvent) => {
    ;(evt.currentTarget.querySelector('.kui--invisible-overlay') as HTMLInputElement).focus()
  })

  /** This is the input overlay for Processing blocks */
  private inputOverlayForProcessingBlocks(value: string) {
    return (
      <input
        className="kui--invisible-overlay"
        readOnly
        onKeyDown={evt => {
          if (evt.key === 'c' && evt.ctrlKey) {
            doCancel(this.props.tab, this.props._block, value)
          }
        }}
        ref={c => c && c.focus()}
      />
    )
  }

  /** the element that represents the command being/having been/going to be executed */
  protected input() {
    const active = isActive(this.props.model) || this.state.isReEdit

    if (active) {
      if (this.state.prompt) {
        if (this.props.isFocused) {
          if (document.activeElement !== this.state.prompt) {
            setTimeout(() => {
              if (isInViewport(this.state.prompt) && this.props.isFocused) {
                this.state.prompt.focus()
              }
            })
          }
        } else {
          // @starpit 20210128; i think this is leftover from earlier buggier days
          // keeping around, commented out, for a bit just in case
          // setTimeout(() => this.state.prompt.scrollIntoView(), 10)
        }
      }

      return (
        <div
          className="repl-input-element-wrapper flex-layout flex-fill"
          data-is-reedit={this.state.isReEdit || undefined}
        >
          <input
            type="text"
            autoFocus={this.props.isFocused && isInViewport(this.props._block)}
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            autoCapitalize="off"
            className={'repl-input-element' + (this.state.isearch ? ' repl-input-hidden' : '')}
            aria-label="Command Input"
            tabIndex={1}
            data-scrollback-uuid={this.props.uuid}
            data-input-count={this.props.idx}
            onBlur={this._onBlur}
            onFocus={this._onFocus}
            onMouseDown={this.props.onInputMouseDown}
            onMouseMove={this.props.onInputMouseMove}
            onChange={this.props.onInputChange}
            onClick={this._onClickActive}
            onKeyPress={this._onKeyPress}
            onKeyDown={this._onKeyDown}
            onKeyUp={this._onKeyUp}
            onPaste={this._onPaste}
            ref={this._onRef}
          />
          {this.state.typeahead && <span className="kui--input-typeahead">{this.state.typeahead}</span>}
        </div>
      )
    } else {
      const value = Input.valueToBeDisplayed(this.props)
      const isInProgress = isProcessing(this.props.model)

      // for Processing or Done blocks, render the value as a plain div
      // for Processing, though, we will need an inputOverlay... to capture ctrl+c
      return (
        <div
          data-input-count={this.props.idx}
          className="repl-input-element-wrapper flex-layout flex-fill"
          onClick={isInProgress ? this._restoreFocusToOverlayInput : this._onClickFinished}
        >
          {this.fancyValue(value)}
          {value.length === 0 && <span className="kui--repl-input-element-nbsp">&nbsp;</span>}
          {isInProgress && this.inputOverlayForProcessingBlocks(value)}
          {this.inputStatus(value)}
        </div>
      )
    }
  }

  /**
   * Turn the value part of the input into a fancier form,
   * e.g. rendering pipelines or command names in a better way.
   *
   */
  private fancyValue(value: string) {
    if (isWithCompleteEvent(this.props.model) && hasPipeStages(this.props.model)) {
      return <FancyPipeline REPL={this.props.tab.REPL} {...this.props.model.completeEvent.pipeStages} />
    } else if (hasStartEvent(this.props.model) && hasPipeStages(this.props.model)) {
      return <FancyPipeline REPL={this.props.tab.REPL} {...this.props.model.startEvent.pipeStages} />
    } else {
      return <span className="repl-input-element flex-fill">{value}</span>
    }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  /** render a tag for experimental command */
  private experimentalTag() {
    if (this.props.isExperimental) {
      return (
        <span className="kui--repl-block-right-element left-pad kui--repl-block-experimental-tag-wrapper">
          <Tag spanclassname="kui--repl-block-experimental-tag" title={strings('HoverExperimentalTag')} type="warning">
            {strings('ExperimentalTag')}
          </Tag>
        </span>
      )
    }
  }

  /** render the time the block started processing */
  private timestamp() {
    if (!isEmpty(this.props.model) && (isProcessing(this.props.model) || isFinished(this.props.model))) {
      const replayed = isReplay(this.props.model)
      const completed = this.props.model.startTime && isWithCompleteEvent(this.props.model)
      const showingDate = !replayed && completed && !this.props.isWidthConstrained
      const duration =
        !replayed &&
        isWithCompleteEvent(this.props.model) &&
        this.props.model.completeEvent.completeTime &&
        prettyPrintDuration(this.props.model.completeEvent.completeTime - this.props.model.startTime)
      const noParen = !showingDate || !duration
      const openParen = noParen ? '' : '('
      const closeParen = noParen ? '' : ')'

      // re: key... when the block changes from Processing to Input, we get an insertBefore error from React.
      return (
        this.props.model.startTime && (
          <span
            className="kui--repl-block-timestamp kui--repl-block-right-element"
            key={isProcessing(this.props.model).toString()}
          >
            {showingDate && new Date(this.props.model.startTime).toLocaleTimeString()}
            <span className="small-left-pad sub-text" ref={c => this.setState({ durationDom: c })}>
              {openParen}
              {duration}
              {closeParen}
            </span>
          </span>
        )
      )
    }
  }

  /** spinner for processing blocks */
  private spinner() {
    return (
      <span className="kui--repl-block-spinner">
        <Spinner />
      </span>
    )
  }

  /** error icon for error blocks */
  /* private errorIcon() {
    if (isOops(this.props.model)) {
      return <Icons className="kui--repl-block-error-icon" icon="Error" data-mode="error" />
    }
  } */

  /** DropDown menu for completed blocks */
  private actions(command: string) {
    if ((isFinished(this.props.model) || isProcessing(this.props.model)) && !!this.props.tab && !!this.props.model) {
      return <Actions command={command} idx={this.props.idx} {...this.props} />
    }
  }

  /**
   * Status elements associated with the block as a whole; even though
   * these also pertain to the Output part of a Block, these are
   * currently housed in this Input component.
   *
   */
  protected status() {
    return <span className="repl-prompt-right-elements">{/* this.errorIcon() */}</span>
  }

  /** Should we show the spinner in the In[...] context area, or in the [<input/> ...] area? */
  private showSpinnerInContext() {
    return !this.props.isPartOfMiniSplit && !this.props.isWidthConstrained
  }

  /** Status elements placed in with <input> part of the block */
  protected inputStatus(input: string) {
    return (
      <React.Fragment>
        <span className="repl-prompt-right-elements">
          {this.experimentalTag()}
          {!this.showSpinnerInContext() && isProcessing(this.props.model) && this.spinner()}
          {this.timestamp()}
        </span>
        {this.actions(input)}
      </React.Fragment>
    )
  }
}
