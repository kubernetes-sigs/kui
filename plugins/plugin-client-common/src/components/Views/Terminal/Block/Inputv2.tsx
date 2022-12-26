/*
 * Copyright 2021 The Kubernetes Authors
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

import Debug from 'debug'
import React from 'react'
import { v4 as uuid } from 'uuid'
import {
  Events,
  KResponse,
  Tab,
  i18n,
  isError,
  isMixedResponse,
  isTable,
  isXtermResponse,
  hasSourceReferences,
  pexecInCurrentTab
} from '@kui-shell/core'

import StreamingConsumer, { StreamingProps, StreamingState } from './StreamingConsumer'

import Timer from './Timer'
import Spinner from './Spinner'
import Status from './CodeBlockStatus'
import { BlockState } from './BlockModel'
import Scalar from '../../../Content/Scalar'
import { MutabilityContext, MutabilityState, MutabilityStateOffline } from '../../../Client/MutabilityContext'

import Tooltip from '../../../spi/Tooltip'
import { SupportedIcon } from '../../../spi/Icons'
import TwoFaceIcon from '../../../spi/Icons/TwoFaceIcon'

import { emitGetCodeBlockReadiness, onCodeBlockReadiness, offCodeBlockReadiness } from './CodeBlockEvents'

import { linkUpdateChannel, linkGetChannel } from '../../../Content/LinkStatus'
import { ProgressStepper, ProgressStep } from '../../../Content/ProgressStepper'

const BadgeUI = React.lazy(() => import('../../../spi/Tag'))
const SourceRef = React.lazy(() => import('../SourceRef'))
const CodeSnippet = React.lazy(() => import('../../../spi/CodeSnippet'))
const ExpandableSection = React.lazy(() => import('../../../spi/ExpandableSection'))

const debug = Debug('plugin-client-common/components/Views/Terminal/Block/CodeBlock')
const strings = i18n('plugin-client-common')

/**
 * Thin wrapper over the Badge component that places the badge in the
 * top left of the surrounding CodeBlock component.
 */
function Badge(props: React.PropsWithChildren<{ position: 'top-left' | 'top-right' }>) {
  return (
    <span className="kui--code-block-actions" data-align={props.position}>
      <BadgeUI>{props.children}</BadgeUI>
    </span>
  )
}

interface Value {
  value: string
  language: string
}

type Props<T1 = any, T2 = any, T3 = any> = Value &
  StreamingProps & {
    id?: string
    className?: string
    tab: Tab

    /** default: true */
    readonly?: boolean

    /** Re-execute the command when events are passed on the given channel */
    watch?: string

    /** A Block identifier, to enable cross-referencing with check lists, etc. */
    blockId?: string

    /** A command line that validates whether this command was successfully issued at some time in the past */
    validate?: string

    /** A command line that undoes the effects of this code block's body */
    cleanup?: string

    /** Is execution of this code block optional? */
    optional?: boolean

    /** Output of this CodeBlock? */
    response?: KResponse

    /** Execution status of the `response` property; this will be `replayed` rather than `done` or `error` if we have only sample output */
    status?: Status

    /** Almost the same as `status`, but this will be `done` or `error`, even when we have only sample output */
    rawStatus?: Status

    /** Execute on mount? */
    executeImmediately?: boolean

    /** Only display output? */
    outputOnly?: boolean

    /** Update upstream model with a response */
    arg1: T1
    arg2?: T2
    arg3?: T3
    onResponse: (status: 'done' | 'error', KResponse, arg1: T1, arg2: T2, arg3: T3) => void
  }

type State = Value &
  StreamingState & {
    /** Have the prereqs been satisfied? */
    ready: boolean

    /** Status of the execution of this code block */
    execution: Status

    /**
     * Whether we have correctly validated that this code block's
     * effects have already been applied to the user's current context.
     *
     */
    validated: boolean

    /** Millis timestamp of the last Run initiation */
    startTime?: number

    /** Millis timestamp of the last Run completion */
    endTime?: number

    /** Any updates flowing *up* from the included CodeSnippet component */
    codeSnippetValue?: string
  }

export default class CodeBlock<T1, T2, T3> extends StreamingConsumer<Props<T1, T2, T3>, State> {
  private mounted = false
  private readonly cleaners: (() => void)[] = []

  public constructor(props: Props<T1, T2, T3>) {
    super(props)
    this.state = CodeBlock.getDerivedStateFromProps(props)
  }

  public componentDidMount() {
    this.mounted = true
    this.initLinkEvents()
    this.initWatchEvents()
    this.initCodeBlockEvents()
    this.doValidate()

    if (this.props.executeImmediately && !this.props.response) {
      setTimeout(this._onRun)
    }
  }

  public componentWillUnmount() {
    this.mounted = false
    this.cleaners.forEach(_ => _())
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.validate !== this.props.validate) {
      this.doValidate()
    }
  }

  private doValidate() {
    if (this.props.blockId && this.props.validate) {
      setTimeout(async () => {
        try {
          // .toString() in case of e.g. `validate: true` which yaml
          // parsers pass to us as a boolean
          this.emitLinkStatus('processing')
          await pexecInCurrentTab(this.props.validate.toString(), undefined, true, true)
          this.emitLinkStatus('done')

          if (this.mounted) {
            this.setState({ validated: true })
          }
        } catch (err) {
          this.emitLinkStatus('not-yet')
          if (this.mounted) {
            this.setState({ validated: false })
          }
        }
      }, 1000)
    }
  }

  /**
   * Re-execute command upon receipt of an event on the specified
   * `this.props.watch` channel.
   *
   */
  private readonly onWatchEvent = () => this._onRun()

  /** Is this code block ready for execution? E.g. perhaps the prereqs have yet to be satisfied. */
  private readonly _updateReadiness = (ready: boolean) => {
    if (this.mounted) {
      this.setState({ ready })
    }
  }

  /** Is this code block ready for execution? E.g. perhaps the prereqs have yet to be satisfied. */
  private initCodeBlockEvents() {
    onCodeBlockReadiness(this.props.blockId, this._updateReadiness)
    this.cleaners.push(() => offCodeBlockReadiness(this.props.blockId, this._updateReadiness))

    emitGetCodeBlockReadiness(this.props.blockId, this._updateReadiness)
  }

  private initWatchEvents() {
    if (this.props.watch) {
      const channels = this.props.watch.split(/\s*,\s*/)
      debug(
        `initializing code block watch events on ${channels.length} channel${
          channels.length === 1 ? '' : 's'
        }: ${channels}`
      )

      channels.forEach(channel => {
        Events.eventChannelUnsafe.on(channel, this.onWatchEvent)
        this.cleaners.push(() => Events.eventChannelUnsafe.off(channel, this.onWatchEvent))
      })
    }
  }

  private emitLinkStatus(execution = this.state.execution) {
    Events.eventChannelUnsafe.emit(
      linkUpdateChannel(this.props.blockId),
      execution === 'not-yet' || execution === 'replayed'
        ? [0, 0, 0] // indicates nothing has happened yet, in this session
        : execution === 'processing'
        ? [0, 0, 1]
        : execution === 'error'
        ? [0, 1, 0]
        : [1, 0, 0],
      this.props.blockId
    )
  }

  private initLinkEvents() {
    if (this.props.blockId) {
      const get = linkGetChannel(this.props.blockId)
      const emit = this.emitLinkStatus.bind(this)
      Events.eventChannelUnsafe.on(get, emit)
      this.cleaners.push(() => Events.eventChannelUnsafe.off(get, emit))
    }
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    const usePropsValue = !state || !state.codeSnippetValue

    if (!usePropsValue && state && state.codeSnippetValue) {
      return Object.assign(state, {
        value: state.codeSnippetValue
      })
    } else if (!state || state.value !== props.value || state.language !== props.language) {
      const execUUID = uuid()
      return Object.assign(
        {
          ready: true,
          execution: props.status || 'not-yet',
          value: usePropsValue ? props.value : state.codeSnippetValue || state.value,
          language: props.language,
          validated: false
        },
        StreamingConsumer.initStreamingState(execUUID)
      )
    } else {
      return state
    }
  }

  /** Are we in the middle of an execution of this code block? */
  private get isExecutionInProgress() {
    return this.state.execution === 'processing' && this.state.startTime && !this.state.endTime
  }

  private get isExecutedSuccessfullyOrValidated() {
    return this.state.validated || this.state.execution === 'done'
  }

  /** UI to denote duration of the current Run */
  private timer() {
    return (
      <Badge position="top-right">
        <Timer startTime={this.state.startTime} endTime={this.state.endTime} status={this.state.execution} />
      </Badge>
    )
  }

  /** UI to denote the execution status of this code block */
  private status() {
    const execution = this.state.validated ? 'done' : this.state.execution

    if (execution === 'done' || execution === 'error') {
      return (
        <div className="kui--code-block-actions flex-layout" data-align="top-left">
          <ProgressStepper className="kui--code-block-status">
            <ProgressStep title="" defaultStatus={execution === 'done' ? 'success' : 'error'} />
          </ProgressStepper>
        </div>
      )
    } else if (this.props.optional) {
      return <Badge position="top-left">{strings('Optional')}</Badge>
    }
  }

  private actions(showAsExecutable: boolean, butUseSampleOutputOnRun: boolean) {
    if (this.props.readonly !== true && showAsExecutable) {
      if (this.state.execution === 'processing') {
        return <Spinner />
      } else {
        return (
          <React.Fragment>
            {this.props.cleanup && this.isExecutedSuccessfullyOrValidated && <Cleanup onCleanup={this._onCleanup} />}
            <Run
              ready={this.state.ready}
              optional={this.props.optional}
              execution={this.state.execution}
              onRun={butUseSampleOutputOnRun ? this._onRunUsingSampleOutput : this._onRun}
            />
          </React.Fragment>
        )
      }
    }
  }

  /** Updates coming from the CodeSnippet component */
  private readonly onContentChange = (codeSnippetValue: string) => {
    if (this.mounted) {
      this.setState({ codeSnippetValue })
    }
  }

  private input(showAsExecutable: boolean, butUseSampleOutputOnRun: boolean) {
    return (
      <div className="repl-input-element-wrapper flex-layout flex-fill kui--inverted-color-context kui--relative-positioning">
        <div className="flex-fill">
          <CodeSnippet
            wordWrap="on"
            value={this.state.value}
            language={this.state.language}
            onContentChange={this.onContentChange}
            readonly={this.props.readonly !== false}
            tabUUID={this.props.tab ? this.props.tab.uuid : undefined}
          />
        </div>
        {this.timer()}
        {this.status()}
        {this.actions(showAsExecutable, butUseSampleOutputOnRun)}
      </div>
    )
  }

  private sourceRef() {
    return (
      this.props.response &&
      isTable(this.props.response) &&
      hasSourceReferences(this.props.response) && <SourceRef tab={this.props.tab} response={this.props.response} />
    )
  }

  /**
   * If we have a command line e.g. `echo hi; echo ho`, then it would
   * be nice to smash these into a single group, so that they are
   * rendered as if they were executed together. See "semicolons
   * between commands and escape newlines" below for why this isn't
   * the case without some fixups here.
   *
   */
  private combineContiguousXtermResponses() {
    if (!isMixedResponse(this.props.response)) {
      return this.props.response
    } else {
      return this.props.response.reduce((A, res) => {
        if (A.length === 0) {
          A.push(res)
        } else {
          const prev = A[A.length - 1]
          if (isXtermResponse(prev) && isXtermResponse(res)) {
            // then we have two consecutive XtermResponses; smash them
            // together
            prev.rows = prev.rows.concat(res.rows)

            if (prev.code === 0) {
              // conservatively take non-zero exit codes over zero
              // exit codes
              prev.code = res.code
            }
          } else {
            A.push(res)
          }
        }

        return A
      }, [])
    }
  }

  private nonstreamingOutput() {
    const response = this.combineContiguousXtermResponses()

    return (
      this.state.execution !== 'processing' &&
      this.props.response && (
        <Scalar tab={this.props.tab} execUUID={this.state.execUUID} response={response} willChangeSize={this.nope} />
      )
    )
  }

  private get hasOutput() {
    return this.props.response || this.hasStreamingOutput()
  }

  private output(mutability: MutabilityState) {
    const content = this.hasOutput && (
      <MutabilityContext.Provider value={this.showingReplayedOutput ? MutabilityStateOffline : mutability}>
        <div className="repl-output repl-result-has-content">
          <div className="result-vertical">
            <div className="repl-result">
              {this.state.execution === 'processing' && this.streamingOutput()}
              {this.nonstreamingOutput()}
            </div>
          </div>
        </div>
      </MutabilityContext.Provider>
    )

    return this.state.execution !== 'replayed'
      ? content
      : content && (
          <ExpandableSection
            className="kui--sample-output"
            showMore={strings('Show Sample Output')}
            showLess={strings('Hide Sample Output')}
          >
            {content}
          </ExpandableSection>
        )
  }

  /**
   * We are in offline mode, we have sample output, and the user
   * clicked the Run button. We only need to shift to showing the
   * original status of the code block execution.
   */
  private readonly _onRunUsingSampleOutput = () => {
    if (this.props.response && this.mounted) {
      this.setState({ execution: this.props.rawStatus })
    }
  }

  private async onRun(cmdline: string) {
    if (!this.mounted) {
      return
    }

    try {
      this.setState({ execution: 'processing', startTime: Date.now(), endTime: null })
      this.emitLinkStatus('processing')

      // semicolons between commands and escape newlines
      const cleanedUpCmdline = cmdline
        .replace(/^\s*#.*$/gm, '') // strip comments
        .replace(/([^\\])(;?)\n/g, (_, p1, p2) => `${p1}${p2 || ';'} `) // newline->semi (don't add semi when not needed)
        .replace(/&;/g, '&') // oof, correct for &; as just &

      const response = await this.execWithStream(cleanedUpCmdline)
      const endTime = Date.now()

      const execution = isXtermResponse(response)
        ? response.code === 0
          ? 'done'
          : 'error'
        : isError(response)
        ? 'error'
        : isMixedResponse(response)
        ? response.find(_ => (isXtermResponse(_) && _.code !== 0) || isError(_))
          ? 'error'
          : 'done'
        : 'done'
      this.setState({ execution, endTime })

      this.props.onResponse(execution, response, this.props.arg1, this.props.arg2, this.props.arg3)
      this.emitLinkStatus(execution)
    } catch (err) {
      this.setState({ execution: 'error', endTime: Date.now() })
      this.props.onResponse('error', err, this.props.arg1, this.props.arg2, this.props.arg3)
      this.emitLinkStatus('error')
    }
  }

  private readonly _onRun = () => {
    this.onRun(this.state.value)
  }

  private readonly _onCleanup = async () => {
    if (this.mounted) {
      await this.onRun(this.props.cleanup)
      this.setState({ validated: false, execution: 'not-yet' })
    }
  }

  private responseStatus() {
    if (this.state.execution === 'not-yet') {
      return BlockState.Empty
    } else if (this.state.execution === 'processing') {
      return BlockState.Processing
    } else if (this.state.execution === 'error') {
      return BlockState.Error
    } else {
      return BlockState.ValidResponse
    }
  }

  private get outputOnly() {
    return this.props.outputOnly === true
  }

  /** Extract any data- properties from Props */
  private dataProps() {
    return Object.entries(this.props)
      .filter(([key]) => /^data-/.test(key))
      .reduce((M, [key, value]) => {
        M[key] = value
        return M
      }, {})
  }

  private get showingReplayedOutput() {
    return !!(this.state.execution === 'replayed' && this.hasOutput)
  }

  public render() {
    return (
      <MutabilityContext.Consumer>
        {mutability => {
          const showAsExecutable = this.showingReplayedOutput || mutability.executable || undefined
          const butUseSampleOutputOnRun = !mutability.executable

          return (
            <li
              id={this.props.id}
              className={`repl-block ${this.responseStatus()} ${this.props.className || ''}`}
              data-is-executable={showAsExecutable}
              data-is-output-only={this.outputOnly || undefined}
              data-is-ready={this.state.ready || undefined}
              data-is-optional={this.props.optional || undefined}
              data-is-validated={this.state.validated || undefined}
              data-is-sample-output={(this.hasOutput && this.state.execution === 'replayed') || undefined}
              {...this.dataProps()}
            >
              {!this.outputOnly && this.input(showAsExecutable, butUseSampleOutputOnRun)}
              {!this.outputOnly && this.sourceRef()}
              {this.output(mutability)}
            </li>
          )
        }}
      </MutabilityContext.Consumer>
    )
  }
}

abstract class ActionButton<Props> extends React.PureComponent<Props> {
  protected abstract get icon(): SupportedIcon
  protected abstract get onClick(): () => void
  protected abstract get tooltip(): string
  protected abstract get className(): string

  protected classNameOf(cls: string) {
    return `kui--block-action ${cls}`
  }

  public render() {
    return (
      <div className="flex-layout">
        <Tooltip content={this.tooltip} position="bottom-end">
          <TwoFaceIcon
            a={this.icon}
            b="Checkmark"
            delay={4000}
            onClick={this.onClick}
            classNameB="green-text"
            className={this.className}
          />
        </Tooltip>
      </div>
    )
  }
}

/** The Code Block Trash button */
class Cleanup extends ActionButton<{ onCleanup: () => void }> {
  private readonly _className = this.classNameOf('kui--block-action-cleanup')

  protected get className() {
    return this._className
  }

  protected get tooltip() {
    return 'Clean up the effects of this code block'
  }

  protected get icon(): SupportedIcon {
    return 'Trash'
  }

  protected get onClick() {
    return this.props.onCleanup
  }
}

type RunProps = Pick<Props, 'optional'> &
  Pick<State, 'execution' | 'ready'> & {
    onRun: () => void | Promise<void>
  }

/** The Code Block Run button */
class Run extends ActionButton<RunProps> {
  private readonly _className = this.classNameOf('kui--block-action-run')

  protected get className() {
    return this._className
  }

  protected get tooltip() {
    return strings(
      !this.props.ready && this.props.execution !== 'done' && this.props.execution !== 'error'
        ? 'Execute with caution! The pre-requisites for this code block have not yet been satisfied.'
        : this.props.execution === 'done'
        ? 'Re-execute this command'
        : this.props.optional
        ? 'Execution of this command is optional'
        : 'Execute this command'
    )
  }

  protected get icon(): SupportedIcon {
    return 'Play'
  }

  protected get onClick() {
    return this.props.onRun
  }
}
