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
import { Events, Streamable, Tab, pexecInCurrentTab } from '@kui-shell/core'

import Scalar from '../../../Content/Scalar'
const Ansi = React.lazy(() => import('../../../Content/Scalar/Ansi'))

export interface StreamingProps {
  tab: Tab
}

export interface StreamingState {
  execUUID: string
  nStreamingOutputs: number
}

export default abstract class StreamingConsumer<
  P extends StreamingProps = StreamingProps,
  S extends StreamingState = StreamingState
> extends React.PureComponent<P, S> {
  protected readonly nope = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private _streamingOutput: Streamable[] = []
  private _streamingConsumer = this.streamingConsumer.bind(this)

  protected static initStreamingState(execUUID: string): StreamingState {
    return {
      execUUID,
      nStreamingOutputs: 0
    }
  }

  protected hasStreamingOutput() {
    return this.state.nStreamingOutputs > 0
  }

  /** Accept one part of streaming output */
  protected async streamingConsumer(part: Streamable) {
    const { tab } = this.props
    const { execUUID } = this.state

    // done with this part... not done with all parts
    const done = () => {
      // this.props.onRender()
      Events.eventChannelUnsafe.emit(`/command/stdout/done/${tab.uuid}/${execUUID}`)
    }

    // part === null: the controller wants to clear any prior output
    if (part === null) {
      this._streamingOutput = []
      done()
      return {
        // remove all output
        nStreamingOutputs: 0
      }
    } else {
      this._streamingOutput.push(Buffer.isBuffer(part) ? part.toString() : part)

      // use setTimeout to introduce hysteresis, so we aren't
      // forcing a react re-render for a bunch of tiny streaming
      // updates
      setTimeout(() => {
        this.setState({
          nStreamingOutputs: this._streamingOutput.length
        })
        setTimeout(done, 10)
      }, 10)
    }
  }

  /** Render the streaming output */
  protected streamingOutput() {
    if (this.hasStreamingOutput()) {
      if (this._streamingOutput.every(_ => typeof _ === 'string')) {
        const combined = this._streamingOutput.join('')
        return (
          <React.Suspense fallback={<div />}>
            <Ansi>{combined}</Ansi>
          </React.Suspense>
        )
      }

      // onRender={this._onRender}
      //                willChangeSize={this.props.willChangeSize}
      //              willUpdateCommand={this._willUpdateCommand}
      //            isWidthConstrained={this.props.isWidthConstrained}
      return this._streamingOutput.map((part, idx) => (
        <React.Suspense fallback={<div />} key={idx}>
          <Scalar response={part} tab={this.props.tab} willChangeSize={this.nope} execUUID={this.state.execUUID} />
        </React.Suspense>
      ))
    }
  }

  /** Wrap the execution of the given `cmdline` with handling of streaming output */
  protected async execWithStream(cmdline: string) {
    const streamingChannel = `/command/stdout/${this.props.tab.uuid}/${this.state.execUUID}`

    try {
      Events.eventChannelUnsafe.on(streamingChannel, this._streamingConsumer)
      return await pexecInCurrentTab(cmdline, undefined, false, true, this.state.execUUID)
    } finally {
      Events.eventChannelUnsafe.off(streamingChannel, this._streamingConsumer)
    }
  }
}
