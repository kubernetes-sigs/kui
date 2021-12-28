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

import Spinner from './Spinner'
import { BlockState } from './BlockModel'
import Scalar from '../../../Content/Scalar'
import TwoFaceIcon from '../../../spi/Icons/TwoFaceIcon'
import { MutabilityContext } from '../../../Client/MutabilityContext'

import { linkUpdateChannel, linkGetChannel } from '../../../Content/LinkStatus'
import { ProgressStepper, ProgressStep } from '../../../Content/ProgressStepper'

const SourceRef = React.lazy(() => import('../SourceRef'))
const CodeSnippet = React.lazy(() => import('../../../spi/CodeSnippet'))
const ExpandableSection = React.lazy(() => import('../../../spi/ExpandableSection'))

const strings = i18n('plugin-client-common')

interface Value {
  value: string
  language: string
}

type Status = 'not-yet' | 'processing' | 'done' | 'error' | 'replayed'

type Props<T1 = any, T2 = any, T3 = any> = Value &
  StreamingProps & {
    className?: string
    tab: Tab

    /** default: true */
    readonly?: boolean

    /** Callback when content changes */
    onContentChange?: (content: string) => void

    /** A Block identifier, to enable cross-referencing with check lists, etc. */
    blockId?: string

    /** A command line that validates whether this command was successfully issued at some time in the past */
    validate?: string

    /** Output of this Input? */
    response?: KResponse

    /** Execution status of the `response` property */
    status?: Status

    hasBeenExecuted?: boolean

    /** Update upstream model with a response */
    arg1: T1
    arg2: T2
    arg3: T3
    onResponse: (status: 'done' | 'error', KResponse, blockId: string, arg1: T1, arg2: T2, arg3: T3) => void
  }

type State = Value &
  StreamingState & {
    /** Status of the execution of this code block */
    execution: Status

    /**
     * Whether we have correctly validated that this code block's
     * effects have already been applied to the user's current context.
     *
     */
    validated: boolean
  }

export default class Input<T1, T2, T3> extends StreamingConsumer<Props<T1, T2, T3>, State> {
  private readonly cleaners: (() => void)[] = []

  public constructor(props: Props<T1, T2, T3>) {
    super(props)
    this.state = Input.getDerivedStateFromProps(props)
  }

  public componentDidMount() {
    this.initLinkEvents()
  }

  public componentWillUnmount() {
    this.cleaners.forEach(_ => _())
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
        : [1, 0, 0]
    )
  }

  private initLinkEvents() {
    if (this.props.blockId) {
      const get = linkGetChannel(this.props.blockId)
      const emit = this.emitLinkStatus.bind(this)
      Events.eventChannelUnsafe.on(get, emit)
      this.cleaners.push(() => Events.eventChannelUnsafe.off(get, emit))

      if (this.props.validate) {
        setTimeout(async () => {
          try {
            emit('processing')
            await pexecInCurrentTab(this.props.validate, undefined, true, true)
            emit('done')
            this.setState({ validated: true })
          } catch (err) {
            emit('not-yet')
            this.setState({ validated: false })
          }
        }, 1000)
      }
    }
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    if (!state || state.value !== props.value || state.language !== props.language) {
      const execUUID = uuid()
      return Object.assign(
        {
          execution: props.status || 'not-yet',
          value: props.value,
          language: props.language,
          validated: false
        },
        StreamingConsumer.initStreamingState(execUUID)
      )
    } else {
      return state
    }
  }

  /** UI to denote the execution status of this code block */
  private status() {
    const execution = this.state.validated ? 'done' : this.state.execution

    if (execution === 'done' || execution === 'error') {
      return (
        <div className="kui--code-block-actions flex-layout" data-align="top-right">
          <ProgressStepper className="kui--code-block-status">
            <ProgressStep title="" defaultStatus={execution === 'done' ? 'success' : 'error'} />
          </ProgressStepper>
        </div>
      )
    }
  }

  private actions() {
    if (this.props.readonly !== true) {
      if (this.state.execution === 'processing') {
        return <Spinner />
      } else {
        return <Run execution={this.state.execution} onRun={this._onRun} />
      }
    }
  }

  private input() {
    return (
      <div className="repl-input-element-wrapper flex-layout flex-fill kui--inverted-color-context kui--relative-positioning">
        {this.status()}
        <div className="flex-fill">
          <CodeSnippet
            wordWrap="on"
            tabUUID={this.props.tab ? this.props.tab.uuid : undefined}
            value={this.state.value}
            language={this.state.language}
            onContentChange={this.props.onContentChange}
          />
        </div>
        {this.actions()}
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

  private nonstreamingOutput() {
    return (
      this.state.execution !== 'processing' &&
      this.props.response && (
        <Scalar
          tab={this.props.tab}
          execUUID={this.state.execUUID}
          response={this.props.response}
          willChangeSize={this.nope}
        />
      )
    )
  }

  private output() {
    const content = (this.props.response || this.hasStreamingOutput()) && (
      <div className="repl-output repl-result-has-content">
        <div className="result-vertical">
          <div className="repl-result">
            {this.state.execution === 'processing' && this.streamingOutput()}
            {this.nonstreamingOutput()}
          </div>
        </div>
      </div>
    )

    return this.state.execution !== 'replayed' ? (
      content
    ) : (
      <ExpandableSection showMore={strings('Show Sample Output')} showLess={strings('Hide Sample Output')}>
        {content}
      </ExpandableSection>
    )
  }

  private readonly _onRun = async () => {
    try {
      // semicolons between commands and escape newlines
      this.setState({ execution: 'processing' })
      this.emitLinkStatus('processing')

      const cmdline = this.state.value.replace(/([^\\])(\n)/g, '$1; ').replace(/&;/g, '&')
      const response = await this.execWithStream(cmdline)

      const execution = isXtermResponse(response)
        ? response.code === 0
          ? 'done'
          : 'error'
        : isError(response)
        ? 'error'
        : isMixedResponse(response)
        ? response.find(_ => isXtermResponse(_) && _.code !== 0)
          ? 'error'
          : 'done'
        : 'done'
      this.setState({ execution })

      this.props.onResponse(execution, response, this.props.blockId, this.props.arg1, this.props.arg2, this.props.arg3)
      this.emitLinkStatus(execution)
    } catch (err) {
      this.setState({ execution: 'error' })
      this.props.onResponse('error', err, this.props.blockId, this.props.arg1, this.props.arg2, this.props.arg3)
      this.emitLinkStatus('error')
    } finally {
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

  public render() {
    const dataProps = Object.entries(this.props)
      .filter(([key]) => /^data-/.test(key))
      .reduce((M, [key, value]) => {
        M[key] = value
        return M
      }, {})

    return (
      <MutabilityContext.Consumer>
        {mutability => (
          <li
            className={`repl-block ${this.responseStatus()} ${this.props.className || ''}`}
            data-is-executable={mutability.executable}
            {...dataProps}
          >
            {this.input()}
            {this.sourceRef()}
            {this.output()}
          </li>
        )}
      </MutabilityContext.Consumer>
    )
  }
}

interface RunProps {
  execution: State['execution']
  onRun: () => void | Promise<void>
}

class Run extends React.PureComponent<RunProps> {
  public render() {
    return (
      <TwoFaceIcon
        a="Play"
        b="Play"
        delay={4000}
        onClick={this.props.onRun}
        classNameB="green-text"
        className="kui--block-action kui--block-action-run"
        title={strings(this.props.execution === 'done' ? 'Re-execute this command' : 'Execute this command')}
      />
    )
  }
}
