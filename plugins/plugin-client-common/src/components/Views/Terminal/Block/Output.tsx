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

import {
  i18n,
  isCodedError,
  isCommentaryResponse,
  isHTML,
  isReactResponse,
  isMarkdownResponse,
  isMixedResponse,
  isTable,
  eventChannelUnsafe,
  Tab as KuiTab,
  Stream,
  Streamable
} from '@kui-shell/core'

import { BlockViewTraits } from './'

import {
  BlockModel,
  ProcessingBlock,
  FinishedBlock,
  hasUUID,
  isFinished,
  isProcessing,
  isOk,
  isCancelled,
  isEmpty,
  isPresentedElsewhere,
  isOops
} from './BlockModel'

import Scalar from '../../../Content/Scalar/'
import Else from './Else'

const strings = i18n('plugin-client-common')

type Props = {
  /** tab UUID */
  uuid: string

  /** for key handlers, which may go away soon */
  tab: KuiTab

  /** Block ordinal */
  idx: number

  /** Block ordinal to be displayed to user */
  displayedIdx?: number

  model: ProcessingBlock | FinishedBlock
  onRender: () => void
} & BlockViewTraits

interface State {
  alreadyListen: boolean
  assertHasContent?: boolean
  isResultRendered: boolean

  streamingOutput: Streamable[]
  streamingConsumer: Stream
}

export default class Output extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const streamingConsumer = this.streamingConsumer.bind(this)

    this.state = {
      alreadyListen: false,
      isResultRendered: false,
      streamingOutput: [],
      streamingConsumer
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async streamingConsumer(part: Streamable) {
    if (hasUUID(this.props.model)) {
      this.setState(curState => ({
        streamingOutput: curState.streamingOutput.concat([part])
      }))
      this.props.onRender()
      eventChannelUnsafe.emit(`/command/stdout/done/${this.props.uuid}/${this.props.model.execUUID}`)
    }
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    if (isProcessing(props.model) && !state.alreadyListen) {
      const tabUUID = props.uuid
      eventChannelUnsafe.on(`/command/stdout/${tabUUID}/${props.model.execUUID}`, state.streamingConsumer)
      return {
        alreadyListen: true,
        isResultRendered: false,
        streamingOutput: []
      }
    } else if (isFinished(props.model) && !state.isResultRendered) {
      const tabUUID = props.uuid

      if (!isEmpty(props.model)) {
        eventChannelUnsafe.off(`/command/stdout/${tabUUID}/${props.model.execUUID}`, state.streamingConsumer)
      }

      if (!isEmpty(props.model) && !isCancelled(props.model)) {
        props.onRender()
      }

      return {
        alreadyListen: false,
        isResultRendered: true
      }
    } else {
      return state
    }
  }

  private onRender(assertHasContent: boolean): void {
    if (this.props.onRender) {
      this.props.onRender()
    }
    this.setState({ assertHasContent })
  }

  private stream() {
    if (this.state.streamingOutput.length > 0) {
      return (
        <div className="repl-result-like result-vertical" data-stream>
          {this.state.streamingOutput.map((part, idx) => (
            <Scalar
              key={idx}
              tab={this.props.tab}
              response={part}
              prefersTerminalPresentation={this.props.prefersTerminalPresentation}
              isPartOfMiniSplit={this.props.isPartOfMiniSplit}
              isWidthConstrained={this.props.isWidthConstrained}
              onRender={this.onRender.bind(this)}
            />
          ))}
        </div>
      )
    }
  }

  private result() {
    if (isProcessing(this.props.model)) {
      return <div className="repl-result" />
    } else if (isEmpty(this.props.model)) {
      // no result to display for these cases
      return <React.Fragment />
    } else {
      const statusCode = isOops(this.props.model)
        ? isCodedError(this.props.model.response)
          ? this.props.model.response.code || this.props.model.response.statusCode
          : 500
        : isFinished(this.props.model)
        ? 0
        : undefined

      return (
        <div className={'repl-result' + (isOops(this.props.model) ? ' oops' : '')} data-status-code={statusCode}>
          {isCancelled(this.props.model) ? (
            <React.Fragment />
          ) : (
            <Scalar
              tab={this.props.tab}
              response={this.props.model.response}
              prefersTerminalPresentation={this.props.prefersTerminalPresentation}
              isPartOfMiniSplit={this.props.isPartOfMiniSplit}
              isWidthConstrained={this.props.isWidthConstrained}
              onRender={this.onRender.bind(this)}
            />
          )}
        </div>
      )
    }
  }

  private cursor() {
    /* if (isProcessing(this.props.model)) {
      return (
        <div className="repl-result-spinner">
          <div className="repl-result-spinner-inner"></div>
        </div>
      )
    } */
  }

  private isShowingSomethingInTerminal(block: BlockModel): block is FinishedBlock {
    if (isFinished(block) && !isCancelled(block) && !isEmpty(block)) {
      const { response } = block
      return (
        isCommentaryResponse(response) ||
        isReactResponse(response) ||
        isHTML(response) ||
        isMarkdownResponse(response) ||
        (typeof response === 'string' && response.length > 0) ||
        isTable(response) ||
        isMixedResponse(response) ||
        this.state.streamingOutput.length > 0
      )
    } else {
      return false
    }
  }

  private ok(hasContent: boolean) {
    if (isOk(this.props.model)) {
      if (hasContent) {
        return <div className="ok" />
      } else if (isPresentedElsewhere(this.props.model)) {
        // Else signifies where the content is presented,
        // and provides ways to re-interact with the content if it's gone
        return (
          <React.Fragment>
            <Else block={this.props.model} />
            <span className="ok" />
          </React.Fragment>
        )
      } else {
        return <div className="ok">{strings('ok')}</div>
      }
    }
  }

  private ctx(/* insideBrackets: React.ReactNode = this.props.displayedIdx || this.props.idx + 1 */) {
    // return <span className="repl-context">Out[{insideBrackets}]</span>
  }

  public render() {
    const hasContent =
      this.state.assertHasContent !== undefined
        ? this.state.assertHasContent
        : this.isShowingSomethingInTerminal(this.props.model)

    return (
      <div className={'repl-output ' + (hasContent ? ' repl-result-has-content' : '')}>
        {!this.props.isPartOfMiniSplit && isFinished(this.props.model) && this.ctx()}
        <div className="result-vertical">
          {this.stream()}
          {this.result()}
          {this.cursor()}
          {this.ok(hasContent)}
        </div>
      </div>
    )
  }
}
