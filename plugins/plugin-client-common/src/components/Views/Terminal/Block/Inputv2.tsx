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
import { KResponse, Tab, i18n } from '@kui-shell/core'

import StreamingConsumer, { StreamingProps, StreamingState } from './StreamingConsumer'

import Scalar from '../../../Content/Scalar'
import TwoFaceIcon from '../../../spi/Icons/TwoFaceIcon'
import { MutabilityContext } from '../../../Client/MutabilityContext'

const CodeSnippet = React.lazy(() => import('../../../spi/CodeSnippet'))

const strings = i18n('plugin-client-common')

interface Value {
  value: string
  language: string
}

type Props = Value &
  StreamingProps & {
    tab: Tab

    /** default: true */
    readonly?: boolean

    /** Callback when content changes */
    onContentChange?: (content: string) => void

    /** Output of this Input? */
    response?: KResponse

    /** Update upstream model with a response */
    onResponse: (response: KResponse) => void
  }

type State = Value &
  StreamingState & {
    processing: boolean
  }

export default class Input extends StreamingConsumer<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = Input.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    if (!state || state.value !== props.value || state.language !== props.language) {
      const execUUID = uuid()
      return Object.assign(
        {
          processing: false,
          value: props.value,
          language: props.language
        },
        StreamingConsumer.initStreamingState(execUUID)
      )
    } else {
      return state
    }
  }

  private actions() {
    if (this.props.readonly !== true) {
      return <Run onRun={this._onRun} />
    }
  }

  private input() {
    return (
      <div className="repl-input-element-wrapper flex-layout flex-fill">
        <div className="flex-fill">
          <CodeSnippet
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

  private nonstreamingOutput() {
    return (
      !this.state.processing &&
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
    return (
      (this.props.response || this.hasStreamingOutput()) && (
        <div className="repl-output repl-result-has-content">
          <div className="result-vertical">
            <div className="repl-result">
              {this.state.processing && this.streamingOutput()}
              {this.nonstreamingOutput()}
            </div>
          </div>
        </div>
      )
    )
  }

  private readonly _onRun = async () => {
    try {
      // semicolons between commands and escape newlines
      this.setState({ processing: true })

      const cmdline = this.state.value // .replace(/([^\\])(\n)/g, '$1;\\ $2')
      const response = await this.execWithStream(cmdline)

      this.setState({ processing: false })
      this.props.onResponse(response)
    } catch (err) {
      this.props.onResponse(err)
    }
  }

  public render() {
    return (
      <MutabilityContext.Consumer>
        {value => (
          <li className="repl-block" data-is-executable={value.executable}>
            {this.input()}
            {this.output()}
          </li>
        )}
      </MutabilityContext.Consumer>
    )
  }
}

interface RunProps {
  onRun: () => void | Promise<void>
}

class Run extends React.PureComponent<RunProps> {
  public render() {
    return (
      <TwoFaceIcon
        a="Play"
        b="At"
        delay={4000}
        onClick={this.props.onRun}
        classNameB="green-text"
        className="kui--block-action"
        title={strings('Execute this command')}
      />
    )
  }
}
