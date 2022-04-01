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
import { Tab as KuiTab, doCancel, i18n, isTable, hasSourceReferences } from '@kui-shell/core'

import Timer from './Timer'
import Actions from './Actions'
import Spinner from './Spinner'
import onPaste from './OnPaste'
import onKeyDown from './OnKeyDown'
import onKeyPress from './OnKeyPress'
import isInViewport from '../visible'
import KuiContext from '../../../Client/context'
import { TabCompletionState } from './TabCompletion'
import ActiveISearch, { onKeyUp } from './ActiveISearch'
import whenNothingIsSelected from '../../../../util/selection'
import { endsWithBackSlash, includesBachSlash, isMultiLineHereDoc } from '../../util/multiline-input'
import {
  BlockModel,
  isActive,
  isActiveAndDifferent,
  isBeingRerun,
  isProcessingOrBeingRerun as isProcessing,
  isFinished,
  isOk,
  isOops,
  hasCommand,
  isEmpty,
  hasStartEvent,
  isWithCompleteEvent,
  isReplay,
  hasBeenRerun,
  hasUUID,
  hasValue
} from './BlockModel'
import { BlockViewTraits, BlockOperationTraits } from './'

import FancyPipeline from './FancyPipeline'
import { MutabilityContext } from '../../../Client/MutabilityContext'

const Tag = React.lazy(() => import('../../../spi/Tag'))
const TextArea = React.lazy(() => import('../../../spi/TextArea'))
const SourceRef = React.lazy(() => import('../SourceRef'))
const Icons = React.lazy(() => import('../../../spi/Icons'))

const strings = i18n('plugin-client-common')

export type InputElement = HTMLInputElement | HTMLTextAreaElement

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
  onInputBlur?: (event: React.FocusEvent<InputElement>) => void

  /** Optional: onFocus handler */
  onInputFocus?: (event: React.FocusEvent<InputElement>) => void

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

export function isHTMLInputElement(element: InputElement): element is HTMLInputElement {
  const input = element as HTMLInputElement
  return input && input.tagName === 'INPUT'
}

export function isHTMLTextAreaElement(element: InputElement): element is HTMLTextAreaElement {
  const input = element as HTMLTextAreaElement
  return input && input.tagName === 'TEXTAREA'
}

/**
 * This helps to work around React swallowing change events when
 * setting value via ref; e.g.
 *
 *   element.value='foo'.
 *   element.dispatchEvent(new Event('input', { bubbles: true }))
 *
 */
function setNativeValue(element: HTMLElement, value: string) {
  const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {}
  const prototype = Object.getPrototypeOf(element)
  const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {}

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value)
  } else if (valueSetter) {
    valueSetter.call(element, value)
  } else {
    throw new Error('The given element does not have a value setter')
  }
}

export type Props = InputOptions & InputProps & BlockViewTraits
type PropsInternal = React.PropsWithChildren<Props>

export interface State {
  /** Copy from props; to help with getDerivedStateFromProps */
  model: BlockModel

  /** is the input in multi-line mode? if true, use text area rather than in-line input */
  multiline?: boolean

  /** did user paste multiline texts */
  pasteMultiLineTexts?: string

  /** did user click to re-edit the input? */
  isReEdit?: boolean

  /** the execution ID for this prompt, if any */
  execUUID?: string

  /** DOM element for prompt; set via `ref` in render() below */
  prompt?: InputElement

  /** state of active reverse-i-search */
  isearch?: ActiveISearch

  /** state of tab completion */
  tabCompletion?: TabCompletionState

  /** typeahead completion? */
  typeahead?: string
}

export abstract class InputProvider<S extends State = State> extends React.PureComponent<PropsInternal, S> {
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

  protected contextContent(insideBrackets: React.ReactNode = this.idx): React.ReactNode {
    return this.state.isReEdit ? (
      <a href="#" className="kui--block-action" title={strings('Cancel edit')} onClick={this._cancelReEdit}>
        <Icons icon="Edit" className="clickable" />
      </a>
    ) : (
      <span className="repl-context-inner">
        {' '}
        {/* Helps with vertical alignment */}[{insideBrackets}]
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
              config.prompt || '/'
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

  private sourceRef() {
    return (
      this.props.model &&
      isWithCompleteEvent(this.props.model) &&
      isTable(this.props.model.response) &&
      hasSourceReferences(this.props.model.response) && (
        <SourceRef
          tab={this.props.tab}
          isWidthConstrained={this.props.isWidthConstrained}
          response={this.props.model.response}
        />
      )
    )
  }

  protected get promptValue() {
    return hasValue(this.props.model)
      ? this.props.model.value
      : hasCommand(this.props.model)
      ? this.props.model.command
      : ''
  }

  protected get idx() {
    return this.props.displayedIdx || this.props.idx + 1
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
        {this.sourceRef()}
      </React.Suspense>
    )
  }
}

export default class Input extends InputProvider {
  public constructor(props: PropsInternal) {
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
  protected static valueToBeDisplayed(props: PropsInternal) {
    return !isBeingRerun(props.model) && hasValue(props.model)
      ? props.model.value
      : hasCommand(props.model)
      ? props.model.command
      : ''
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

  public static getDerivedStateFromProps(props: PropsInternal, state: State) {
    if (hasUUID(props.model)) {
      return {
        model: props.model,
        execUUID: props.model.execUUID
      }
    } else if (state.prompt && isActive(props.model) && state.execUUID !== undefined && !state.isearch) {
      // e.g. terminal has been cleared; we need to excise the current
      // <input/> because react aggressively caches these
      return {
        model: props.model,
        prompt: undefined,
        execUUID: undefined
      }
    } else if (isActiveAndDifferent(props.model, state.model)) {
      return {
        model: props.model,
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
      onPaste.bind(this)(evt.nativeEvent, this.props.tab, this.state.prompt)
    }
  }

  private readonly _onPaste = this.onPaste.bind(this)

  private onTextAreaRef(c: HTMLTextAreaElement) {
    if (c && (!this.state.prompt || isHTMLInputElement(this.state.prompt) || this.state.isReEdit)) {
      let value = this.promptValue

      if (isHTMLInputElement(this.state.prompt)) {
        if (endsWithBackSlash(this.state.prompt.value)) {
          value += `${this.state.prompt.value}\n`
        } else if (this.state.pasteMultiLineTexts) {
          value += `${this.state.prompt.value}${this.state.pasteMultiLineTexts}`
        } else {
          value += this.state.prompt.value
        }

        setNativeValue(c, value) // see the comment on the function; React swallows the event otherwise
        c.dispatchEvent(new Event('input', { bubbles: true })) // to get TextArea to adjust its height
      }

      this.setState({ prompt: c })

      if (this.props.isFocused && document.activeElement !== c) {
        c.focus()
      }
    } else if (c && this.props.isFocused && isInViewport(c)) {
      c.focus()
    }
  }

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

  private willFocusBlock(evt: React.SyntheticEvent<InputElement>) {
    if (this.props.willFocusBlock) {
      this.props.willFocusBlock(evt)
    }
  }

  /** This is the onFocus property of the active prompt */
  private readonly _onFocus = (evt: React.FocusEvent<InputElement>) => {
    this.props.onInputFocus && this.props.onInputFocus(evt)
    this.willFocusBlock(evt)
  }

  /** This is the onBLur property of the active prompt */
  private readonly _onBlur = (evt: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          isReEdit: true,
          multiline:
            hasCommand(this.props.model) &&
            (includesBachSlash(this.props.model.command) || isMultiLineHereDoc(this.props.model.command))
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

  /** if in multi-line mode, render text area */
  protected multilineInput() {
    return (
      <div
        className="repl-input-element-wrapper flex-layout flex-fill"
        data-is-reedit={this.state.isReEdit || undefined}
      >
        <TextArea
          autoResize
          autoFocus={this.props.isFocused && isInViewport(this.props._block)}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          autoCapitalize="off"
          className={'repl-input-element' + (this.state.isearch ? ' repl-input-hidden' : '') + ' repl-textarea'}
          aria-label="Command Input"
          tabIndex={1}
          data-scrollback-uuid={this.props.uuid}
          data-input-count={this.props.idx}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          onKeyPress={this._onKeyPress}
          onKeyDown={this._onKeyDown}
          innerRef={
            this.onTextAreaRef.bind(
              this
            ) /* DO NOT MEMOIZE THIS; see https://github.com/kubernetes-sigs/kui/issues/7648 */
          }
        />
        {this.state.typeahead && <span className="kui--input-typeahead">{this.state.typeahead}</span>}
      </div>
    )
  }

  /** if not in multi-line mode, render an inline input */
  protected inlineInput() {
    return (
      <div
        className="repl-input-element-wrapper flex-layout flex-fill"
        data-is-reedit={this.state.isReEdit || undefined}
        key={this.state.execUUID}
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
          ref={this.onRef.bind(this) /* DO NOT MEMOIZE THIS; see https://github.com/kubernetes-sigs/kui/issues/7648 */}
        />
        {this.state.typeahead && <span className="kui--input-typeahead">{this.state.typeahead}</span>}
      </div>
    )
  }

  /** @return the UI for the input part of Finished blocks (i.e. those not processing or active) */
  private inputForFinishedBlock() {
    const value = Input.valueToBeDisplayed(this.props)
    const isInProgress = isProcessing(this.props.model)

    // for Processing or Done blocks, render the value as a plain div
    // for Processing, though, we will need an inputOverlay... to capture ctrl+c
    return (
      <MutabilityContext.Consumer>
        {mutability => (
          <div
            data-input-count={this.props.idx}
            className={'repl-input-element-wrapper flex-layout flex-fill'}
            onClick={
              isInProgress ? this._restoreFocusToOverlayInput : mutability.editable ? this._onClickFinished : undefined
            }
          >
            {this.fancyValue(value)}
            {value.length === 0 && <span className="kui--repl-input-element-nbsp">&nbsp;</span>}
            {isInProgress && this.inputOverlayForProcessingBlocks(value)}
            {this.inputStatus(value)}
          </div>
        )}
      </MutabilityContext.Consumer>
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

      return this.state.multiline ? this.multilineInput() : this.inlineInput()
    } else {
      return this.inputForFinishedBlock()
    }
  }

  /**
   * Turn the value part of the input into a fancier form,
   * e.g. rendering pipelines or command names in a better way.
   *
   */
  private fancyValue(value: string) {
    if (
      !isBeingRerun(this.props.model) &&
      isWithCompleteEvent(this.props.model) &&
      this.props.model.completeEvent.pipeStages !== undefined
    ) {
      return <FancyPipeline REPL={this.props.tab.REPL} {...this.props.model.completeEvent.pipeStages} />
    } else if (hasStartEvent(this.props.model) && this.props.model.startEvent.pipeStages !== undefined) {
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
        <span
          className="kui--repl-block-right-element left-pad kui--repl-block-experimental-tag-wrapper"
          key="experimental-tag"
        >
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
      const replayedAndNotRerun =
        isReplay(this.props.model) && !hasBeenRerun(this.props.model) && !isBeingRerun(this.props.model)
      const completed =
        this.props.model.startTime && isWithCompleteEvent(this.props.model) && !isBeingRerun(this.props.model)
      const showingDate = !replayedAndNotRerun && completed && !this.props.isWidthConstrained

      const status = isProcessing(this.props.model)
        ? 'processing'
        : isOk(this.props.model)
        ? 'done'
        : isOops(this.props.model)
        ? 'error'
        : 'not-yet'

      const { startTime } = this.props.model
      const endTime =
        isWithCompleteEvent(this.props.model) &&
        !isBeingRerun(this.props.model) &&
        this.props.model.completeEvent.completeTime

      return (
        <Timer
          key="timer"
          innerClassName="small-left-pad sub-text"
          className="kui--repl-block-timestamp kui--repl-block-right-element"
          status={status}
          endTime={endTime}
          startTime={startTime}
          showDate={showingDate}
        />
      )
    }
  }

  /** spinner for processing blocks */
  private spinner() {
    return <Spinner key="spinner" />
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
    return !this.props.isWidthConstrained
  }

  /** Experimental tag, timestamp, etc. */
  private rightElements() {
    const children = [
      this.experimentalTag(),
      !this.showSpinnerInContext() && isProcessing(this.props.model) && this.spinner(),
      this.timestamp()
    ].filter(_ => _)

    if (children.length > 0) {
      return <span className="repl-prompt-right-elements">{children}</span>
    }
  }

  /** Status elements placed in with <input> part of the block */
  protected inputStatus(input: string) {
    return (
      <React.Fragment>
        {this.rightElements()}
        {this.actions(input)}
      </React.Fragment>
    )
  }
}
