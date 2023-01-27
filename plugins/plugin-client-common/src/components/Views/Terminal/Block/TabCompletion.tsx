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

/* eslint-disable @typescript-eslint/no-use-before-define */

import Debug from 'debug'
import React from 'react'
import minimist from 'yargs-parser'

import {
  CompletionResponse,
  typeahead,
  findCompletions as findCompletionsFromRegistrar
} from '@kui-shell/core/mdist/api/TabCompletion'
import { getCurrentTab } from '@kui-shell/core/mdist/api/Tab'
import { _split, Split } from '@kui-shell/core/mdist/api/Exec'

import Button from '../../../spi/Button'
import { InputElement, InputProvider as Input } from './Input'
import '../../../../../web/css/static/TabCompletion.scss'

const debug = Debug('Terminal/Input/TabCompletion')

/** Escape the given string for bash happiness */
const shellescape = (str: string): string => {
  return str.replace(/ /g, '\\ ')
}

/** Ibid, but only escape if the given prefix does not end with a backslash escape */
function shellescapeIfNeeded(str: string, prefix: string, shellEscapeNotNeeded: boolean): string {
  return shellEscapeNotNeeded ? str : prefix.charAt(prefix.length - 1) === '\\' ? str : shellescape(str)
}

/** User has typed `partial`, and we have `completions` to offer them. */
interface Completions {
  partial: string
  shellEscapeNotNeeded?: boolean
  completions: CompletionResponse[]
}

/**
 * Abstract base class to manage Tab Completion state. This includes
 * asynchronously enumerating the `completions` from a starting
 * `partial. Subclasses will handle both rendering of completion
 * results, and also will direct state transitions.
 *
 */
export abstract class TabCompletionState {
  private currentEnumeratorAsync: ReturnType<typeof setTimeout>
  protected readonly lastIdx: number

  public constructor(protected readonly input: Input) {
    debug('tab completion init')

    // remember where the cursor was when the user hit tab
    this.lastIdx = this.input.state.prompt.selectionEnd
  }

  private findCommandCompletions(last: string) {
    return typeahead(last)
  }

  protected async findCompletions(lastIdx = this.input.state.prompt.selectionEnd) {
    const input = this.input
    const { prompt } = this.input.state

    const { A: argv, endIndices } = _split(prompt.value, true, true) as Split
    const options = minimist(argv)

    const toBeCompletedIdx = endIndices.findIndex(idx => idx >= lastIdx) // e.g. git branch f<tab>
    const completingTrailingEmpty = lastIdx > endIndices[endIndices.length - 1] // e.g. git branch <tab>
    if (toBeCompletedIdx >= 0 || completingTrailingEmpty) {
      // trim beginning only; e.g. `ls /tmp/mo\ ` <-- we need that trailing space
      const last = completingTrailingEmpty
        ? ''
        : prompt.value.substring(endIndices[toBeCompletedIdx - 1], lastIdx).replace(/^\s+/, '')

      const commandCompletions = this.findCommandCompletions(prompt.value)
      if (commandCompletions && commandCompletions.length > 0) {
        return { partial: last, completions: commandCompletions, shellEscapeNotNeeded: true }
      }

      // argvNoOptions is argv without the options; we can get
      // this directly from yargs-parser's '_'
      const argvNoOptions = options._.map(_ => _.toString())
      const parsedOptions = Object.assign({}, options, { _: undefined })
      delete parsedOptions._

      // a parsed out version of the command line
      const commandLine = {
        command: prompt.value,
        argv,
        argvNoOptions,
        parsedOptions
      }

      // a specification of what we want to be completed
      const spec = {
        toBeCompletedIdx, // index into argv
        toBeCompleted: last.replace(/\\ /, ' ').replace(/\\$/, '') // how much of that argv has been filled in so far
      }

      return new Promise<Completions>(resolve => {
        if (this.currentEnumeratorAsync) {
          // overruled case 1: after we started the async, we
          // notice that there is an outstanding tab completion
          // request; here we try cancelling it, in the hopes
          // that it hasn't already started its remote fetch;
          // this is request2 overruling request1
          clearTimeout(this.currentEnumeratorAsync)
        }

        const myEnumeratorAsync = global.setTimeout(async () => {
          const completions = await findCompletionsFromRegistrar(input.props.tab || getCurrentTab(), commandLine, spec)

          if (myEnumeratorAsync !== this.currentEnumeratorAsync) {
            // overruled case 2: while waiting to fetch the
            // completions, a second tab completion request was
            // initiated; this is request1 overruling itself,
            // after noticing that a (later) request2 is also in
            // flight --- the rest of this method is
            // synchronous, so this should be the last necessary
            // race check
            return
          }

          if (completions && completions.length > 0) {
            // this.presentEnumeratorSuggestions(lastIdx, last, completions)
            this.currentEnumeratorAsync = undefined
          }
          resolve({ partial: last, completions })
        }, 0)
        this.currentEnumeratorAsync = myEnumeratorAsync
      })
    } else {
      return undefined
    }
  }

  /** User has typed another key, while a tab completion is active */
  public key(event: KeyboardEvent) {
    const key = event.key
    if (key === 'Escape' || key === 'Control' || key === 'Meta') {
      this.done()
    } else {
      if (
        key === 'Tab' &&
        this.input.state.prompt &&
        this.input.state.prompt.value.length > 0 &&
        !this.input.state.tabCompletion
      ) {
        // Swallow any Tab keys if we are currently presenting a set
        // of completions. This is so we can redirect those keys
        // instead to tab through the completions
        event.stopPropagation()
        event.preventDefault()
      }
      // async to make sure prompt updates occur
      setTimeout(() => this.again(key === 'Tab'))
    }
  }

  /** Perform a state update to reflect the new set of Completions. */
  protected update(spec: Completions, prefillPartialMatches: boolean) {
    const { completions } = spec

    if (!completions || completions.length === 0 || (!prefillPartialMatches && !spec.partial)) {
      // if either (no completions) or (completions, but no partial matches)
      this.done()
    } else if (completions.length === 1 && prefillPartialMatches) {
      new TabCompletionStateWithSingleSuggestion(this.input, completions[0], spec.shellEscapeNotNeeded).render()
      this.done()
    } else {
      this.input.setState({
        tabCompletion: new TabCompletionStateWithMultipleSuggestions(this.input, spec, prefillPartialMatches)
      })
    }
  }

  /** Is the new set of Completions worth a re-render? */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected willUpdate(completions: Completions, prefillPartialMatches: boolean): boolean {
    return !!completions
  }

  /**
   * Respond to additional input.
   *
   * @param prefillPartialMatches Update the prompt with partial matches?
   */
  private async again(prefillPartialMatches: boolean) {
    const completions = await this.findCompletions()
    if (this.willUpdate(completions, prefillPartialMatches)) {
      // avoid flicker; we are using a PureComponent, so need to manage this ourselves
      this.update(completions, prefillPartialMatches)
    }
  }

  /** Terminate this tab completion */
  public done() {
    this.input.setState({ tabCompletion: undefined })
  }

  public abstract render(): false | React.ReactElement
}

/**
 * TabCompletion initial state, before we have enumerated the possibilities.
 *
 */
class TabCompletionInitialState extends TabCompletionState {
  public constructor(input: Input) {
    super(input)
    this.init()
  }

  private async init() {
    const completions = await this.findCompletions()
    if (this.willUpdate(completions, true)) {
      this.update(completions, true)
    }
  }

  public render() {
    return false as const
  }
}

/**
 * Update the prompt value. Note that `prompt.value = newValue` will
 * not trigger onChange events, so a bit of round-about is needed.
 *
 */
function setPromptValue(prompt: InputElement, newValue: string, selectionStart: number) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  nativeInputValueSetter.call(prompt, newValue)

  prompt.selectionStart = selectionStart
  prompt.selectionEnd = selectionStart

  setTimeout(() => prompt.dispatchEvent(new Event('change', { bubbles: true })))
}

/**
 * TabCompletion in a state where we have exactly one completion to offer the user.
 *
 */
class TabCompletionStateWithSingleSuggestion extends TabCompletionState {
  public constructor(
    input: Input,
    private readonly completion: CompletionResponse,
    private readonly shellEscapeNotNeeded: boolean
  ) {
    super(input)
  }

  public render() {
    const lastIdx = this.lastIdx
    const prompt = this.input.state.prompt

    const prefix = prompt.value.slice(0, lastIdx)
    const suffix = prompt.value.slice(lastIdx)

    const extra =
      typeof this.completion === 'string'
        ? shellescapeIfNeeded(this.completion, prefix, this.shellEscapeNotNeeded)
        : shellescapeIfNeeded(this.completion.completion, prefix, this.shellEscapeNotNeeded) +
          (this.completion.addSpace ? ' ' : '')

    const newValue = prefix + extra + suffix
    const selectionStart = lastIdx + extra.length
    setPromptValue(prompt, newValue, selectionStart)
    prompt.focus()

    // nothing to render in the tab completion portion of the UI.
    return false as const
  }
}

/**
 * TabCompletion in a state where we have more than one completion to offer the user.
 *
 */
class TabCompletionStateWithMultipleSuggestions extends TabCompletionState {
  private readonly completions: Completions

  public constructor(input: Input, completions: Completions, private readonly prefillPartialMatches: boolean) {
    super(input)

    const longestPrefix = TabCompletionStateWithMultipleSuggestions.findLongestPrefixMatch(completions)
    if (longestPrefix && prefillPartialMatches) {
      // update the prompt directly; is this dangerous? to sidestep react?
      const prompt = this.input.state.prompt
      const lastIdx = this.lastIdx
      const prefix = prompt.value.slice(0, lastIdx)
      const suffix = prompt.value.slice(lastIdx)
      const extra = shellescape(longestPrefix)

      const newValue = prefix + extra + suffix
      const selectionStart = lastIdx + extra.length
      setPromptValue(prompt, newValue, selectionStart)

      const prefixed = completions.completions.map(_ => {
        if (typeof _ === 'string') {
          return _.slice(longestPrefix.length)
        } else {
          return Object.assign({}, _, {
            completion: _.completion.slice(longestPrefix.length)
          })
        }
      })

      // add longestPrefix to partial, and strip longestPrefix off the completions
      this.completions = { partial: completions.partial + longestPrefix, completions: prefixed }
    } else {
      this.completions = completions
    }
  }

  /** User has selected one of the N completions. Transition to a SingleSuggestion state. */
  private completeWith(idx: number) {
    this.input.setState({
      tabCompletion: new TabCompletionStateWithSingleSuggestion(
        this.input,
        this.completions.completions[idx],
        this.completions.shellEscapeNotNeeded
      )
    })
  }

  private renderOneCompletion(completion: CompletionResponse, idx: number) {
    let value: string
    let preText: string
    let postText: string

    if (typeof completion === 'string') {
      value = this.completions.partial + completion
      preText = this.completions.partial
      postText = completion
    } else {
      if (completion.label) {
        value = completion.label
        preText = completion.label.replace(completion.completion, '')
        postText = completion.completion
      } else {
        value = this.completions.partial + completion.completion
        preText = this.completions.partial
        postText = completion.completion
      }
    }

    return (
      <div className="kui--tab-completions--option" key={idx} data-value={value}>
        <Button isSmall tabIndex={1} onClick={() => this.completeWith(idx)}>
          <React.Fragment>
            <span className="kui--tab-completions--option-partial">{preText}</span>
            <span className="kui--tab-completions--option-completion">{postText}</span>
          </React.Fragment>
        </Button>
      </div>
    )
  }

  /** Helper for `willUpdate` */
  private eq(c1: CompletionResponse, c2: CompletionResponse): boolean {
    return (
      (typeof c1 === 'string' && typeof c2 === 'string' && c1 === c2) ||
      (typeof c1 !== 'string' && typeof c2 !== 'string' && c1.completion === c2.completion)
    )
  }

  /** Since we use a React.PureComponent, we will need to manage the `willUpdate` lifecycle. */
  protected willUpdate(completions: Completions, prefillPartialMatches: boolean): boolean {
    return (
      this.prefillPartialMatches !== prefillPartialMatches ||
      (!!this.completions.completions && !completions.completions) ||
      (!this.completions.completions && !!completions.completions) ||
      this.completions.completions.length !== completions.completions.length ||
      !(
        this.completions.completions.length === completions.completions.length &&
        this.completions.completions.every((_, idx) => this.eq(_, completions.completions[idx]))
      )
    )
  }

  /**
   * Maybe this just reflects our lack of appreciation for css
   * grid-layout... but for now, we hack it to estimate the width of
   * the columns in the grid-layout we generate.
   *
   */
  private estimateGridColumnWidth() {
    const longest = this.completions.completions
      .map(completion =>
        typeof completion === 'string'
          ? this.completions.partial + completion
          : completion.label || this.completions.partial + completion.completion
      )
      .reduce(
        (soFar, str) => {
          if (str.length > soFar.max) {
            return { max: str.length, str }
          } else {
            return soFar
          }
        },
        { max: 0, str: '' }
      )

    // add some em-sized spaces for good measure
    let ex = 0
    let em = 2 // <-- for good measure
    for (let idx = 0; idx < longest.str.length; idx++) {
      const char = longest.str.charAt(idx)
      if (char === 'm') em++
      else ex++
    }

    return { ex, em }
  }

  /** User has typed xxxx, and we have completions xxxx1 and xxxx2. Update state to reflect the xxxx partial completion */
  private static findLongestPrefixMatch(ccc: Completions) {
    const completions = ccc.completions.map(_ => (typeof _ === 'string' ? _ : _.completion))

    const shortest = completions.reduce(
      (minLength: false | number, completion) =>
        !minLength ? completion.length : Math.min(minLength, completion.length),
      false
    )

    if (shortest !== false) {
      for (let idx = 0; idx < shortest; idx++) {
        const char = completions[0].charAt(idx)

        for (let jdx = 1; jdx < completions.length; jdx++) {
          const other = completions[jdx].charAt(idx)
          if (char !== other) {
            if (idx > 0) {
              // then we found some common prefix
              return completions[0].slice(0, idx)
            } else {
              return
            }
          }
        }
      }
    }
  }

  /** Generate content to fill in the tab completion part of the Input component */
  public render() {
    const { ex, em } = this.estimateGridColumnWidth()

    // we're adding content to the bottom of the Terminal; make sure it's visible
    setTimeout(() => this.input.state.prompt.scrollIntoView(), 5)

    return (
      <div
        className="kui--tab-completions grid-layout"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(calc(${ex}ex + ${em}em), auto))` }}
      >
        {this.completions.completions.map((_, idx) => this.renderOneCompletion(_, idx))}
      </div>
    )
  }
}

/**
 * User has hit Tab in an Input component. Should we initialize a tab completion state?
 *
 */
export default function startTabCompletion(input: Input, evt: KeyboardEvent) {
  if (input.state.prompt && input.state.prompt.value.length === 0) {
    debug('ignoring tab completion for empty prompt') // <-- no, the Input prompt is empty
    return
  } else {
    debug('capturing tab event for tab completion')
    evt.preventDefault()
  }

  input.setState({ tabCompletion: new TabCompletionInitialState(input) }) // <-- yes, initialize!
}
