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
  eventBus,
  internalFormat,
  internalRender,
  getTabId,
  Tab as KuiTab,
  Stream,
  Streamable
} from '@kui-shell/core'

import {
  BlockModel,
  ProcessingBlock,
  FinishedBlock,
  isFinished,
  isProcessing,
  isOk,
  isCancelled,
  isEmpty,
  isOops
} from './BlockModel'

const okString = i18n('plugin-client-common')('ok')

interface Props {
  tab: KuiTab
  model: ProcessingBlock | FinishedBlock
  onRender: () => void
}

interface State {
  streamDom: HTMLDivElement
  resultDom: HTMLDivElement
  isResultRendered: boolean
  streamingConsumer: Stream
}

export default class Output extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const streamingConsumer = this.streamingConsumer.bind(this)
    const tabUUID = getTabId(props.tab)

    if (isProcessing(props.model)) {
      eventBus.on(`/command/stdout/${tabUUID}/${props.model.execUUID}`, streamingConsumer)
    }

    this.state = {
      streamDom: undefined,
      resultDom: undefined,
      isResultRendered: false,
      streamingConsumer
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async streamingConsumer(response: Streamable) {
    if (this.state.streamDom) {
      await internalFormat(this.props.tab, response, this.state.streamDom)
    }
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    if (isFinished(props.model) && state.resultDom && !state.isResultRendered) {
      const tabUUID = getTabId(props.tab)

      if (isProcessing(props.model)) {
        eventBus.off(`/command/stdout/${tabUUID}/${props.model.execUUID}`, state.streamingConsumer)
      }

      if (!isEmpty(props.model) && !isCancelled(props.model)) {
        internalRender(props.tab, state.resultDom)(props.model.response).then(() => props.onRender())
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
    return <div className="repl-result-like" data-stream ref={c => this.setState({ streamDom: c })} />
  }

  private result() {
    const statusCode = isOops(this.props.model)
      ? isCodedError(this.props.model.response)
        ? this.props.model.response.code || this.props.model.response.statusCode
        : 500
      : isFinished(this.props.model)
      ? 0
      : undefined

    return (
      <div
        className={'repl-result' + (isOops(this.props.model) ? ' oops' : '')}
        data-status-code={statusCode}
        ref={c => this.setState({ resultDom: c })}
      />
    )
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
        this.state.streamDom.children.length > 0 ||
        this.state.resultDom.children.length > 0 ||
        isHTML(response) ||
        (typeof response === 'string' && response.length > 0) ||
        (isTable(response) && response.body.length > 0)
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
      <div className={'repl-output result-vertical' + (hasContent ? ' repl-result-has-content' : '')}>
        {this.stream()}
        {this.result()}
        {this.cursor()}
        {this.ok(hasContent)}
      </div>
    )
  }
}
