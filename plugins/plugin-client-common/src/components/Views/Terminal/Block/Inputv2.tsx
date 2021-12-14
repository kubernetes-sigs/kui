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

import Spinner from './Spinner'
import Scalar from '../../../Content/Scalar'
import TwoFaceIcon from '../../../spi/Icons/TwoFaceIcon'
import { MutabilityContext } from '../../../Client/MutabilityContext'

const CodeSnippet = React.lazy(() => import('../../../spi/CodeSnippet'))
const ExpandableSection = React.lazy(() => import('../../../spi/ExpandableSection'))

const strings = i18n('plugin-client-common')

interface Value {
  value: string
  language: string
}

type Props<T1 = any, T2 = any, T3 = any, T4 = any> = Value &
  StreamingProps & {
    className?: string
    tab: Tab

    /** default: true */
    readonly?: boolean

    /** Callback when content changes */
    onContentChange?: (content: string) => void

    /** Output of this Input? */
    response?: KResponse

    /** Update upstream model with a response */
    arg1: T1
    arg2: T2
    arg3: T3
    arg4: T4
    onResponse: (response: KResponse, arg1: T1, arg2: T2, arg3: T3, arg4: T4) => void
  }

type State = Value &
  StreamingState & {
    execution: 'not-yet' | 'processing' | 'done' | 'replayed'
  }

export default class Input<T1, T2, T3, T4> extends StreamingConsumer<Props<T1, T2, T3, T4>, State> {
  public constructor(props: Props<T1, T2, T3, T4>) {
    super(props)
    this.state = Input.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    if (!state || state.value !== props.value || state.language !== props.language) {
      const execUUID = uuid()
      return Object.assign(
        {
          execution: !props.response ? 'not-yet' : (state && state.execution) || 'replayed',
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
      if (this.state.execution === 'processing') {
        return <Spinner />
      } else {
        return <Run onRun={this._onRun} />
      }
    }
  }

  private input() {
    return (
      <div className="repl-input-element-wrapper flex-layout flex-fill kui--inverted-color-context">
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

      const cmdline = this.state.value // .replace(/([^\\])(\n)/g, '$1;\\ $2')
      const response = await this.execWithStream(cmdline)

      this.setState({ execution: 'done' })
      this.props.onResponse(response, this.props.arg1, this.props.arg2, this.props.arg3, this.props.arg4)
    } catch (err) {
      this.props.onResponse(err, this.props.arg1, this.props.arg2, this.props.arg3, this.props.arg4)
    }
  }

  public render() {
    return (
      <MutabilityContext.Consumer>
        {mutability => (
          <li className={'repl-block ' + (this.props.className || '')} data-is-executable={mutability.executable}>
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
        b="Play"
        delay={4000}
        onClick={this.props.onRun}
        classNameB="green-text"
        className="kui--block-action kui--block-action-run"
        title={strings('Execute this command')}
      />
    )
  }
}
