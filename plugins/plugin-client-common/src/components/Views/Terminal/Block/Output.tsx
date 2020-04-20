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
  isHTML,
  isTable,
  eventChannelUnsafe,
  Tab as KuiTab,
  Stream,
  Streamable
} from '@kui-shell/core'

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
  isOops
} from './BlockModel'

import Scalar from '../../../Content/Scalar/'

const okString = i18n('plugin-client-common')('ok')

interface Props {
  /** tab UUID */
  uuid: string

  /** for key handlers, which may go away soon */
  tab: KuiTab

  model: ProcessingBlock | FinishedBlock
  onRender: () => void
}

interface State {
  isResultRendered: boolean

  streamingOutput: Streamable[]
  streamingConsumer: Stream
}

export default class Output extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const streamingConsumer = this.streamingConsumer.bind(this)
    const tabUUID = props.uuid

    if (isProcessing(props.model)) {
      eventChannelUnsafe.on(`/command/stdout/${tabUUID}/${props.model.execUUID}`, streamingConsumer)
    }

    this.state = {
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
    if (isFinished(props.model) && !state.isResultRendered) {
      const tabUUID = props.uuid

      if (!isEmpty(props.model)) {
        eventChannelUnsafe.off(`/command/stdout/${tabUUID}/${props.model.execUUID}`, state.streamingConsumer)
      }

      if (!isEmpty(props.model) && !isCancelled(props.model)) {
        props.onRender()
      }

      return {
        isResultRendered: true,
        streamingConsumer: undefined
      }
    } else {
      return state
    }
  }

  private stream() {
    if (this.state.streamingOutput.length > 0) {
      return (
        <div className="repl-result-like result-vertical" data-stream>
          {this.state.streamingOutput.map((part, idx) => (
            <Scalar key={idx} tab={this.props.tab} response={part} />
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
            <Scalar tab={this.props.tab} response={this.props.model.response} />
          )}
        </div>
      )
    }
  }

  private cursor() {
    if (isProcessing(this.props.model)) {
      return (
        <div className="repl-result-spinner">
          <div className="repl-result-spinner-inner"></div>
        </div>
      )
    }
  }

  private isShowingSomethingInTerminal(block: BlockModel): block is FinishedBlock {
    if (isFinished(block) && !isCancelled(block) && !isEmpty(block)) {
      const { response } = block
      return (
        isHTML(response) ||
        (typeof response === 'string' && response.length > 0) ||
        (isTable(response) && response.body.length > 0) ||
        this.state.streamingOutput.length > 0
      )
    } else {
      return false
    }
  }

  private ok(hasContent: boolean) {
    if (isOk(this.props.model)) {
      const okMessage = hasContent ? '' : okString
      return <div className="ok">{okMessage}</div>
    }
  }

  public render() {
    const hasContent = this.isShowingSomethingInTerminal(this.props.model)

    return (
      <div
        className={'repl-output result-vertical kui--screenshotable' + (hasContent ? ' repl-result-has-content' : '')}
      >
        {this.stream()}
        {this.result()}
        {this.cursor()}
        {this.ok(hasContent)}
      </div>
    )
  }
}
