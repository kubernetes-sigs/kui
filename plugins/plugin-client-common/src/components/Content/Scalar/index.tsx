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
import {
  isAbortableResponse,
  isMessageWithUsageModel,
  isMessageWithCode,
  CommandCompleteEvent,
  KResponse,
  getPrimaryTabId,
  i18n,
  isCommentaryResponse,
  isMarkdownResponse,
  isMultiModalResponse,
  isNavResponse,
  isReactResponse,
  isRadioTable,
  isRandomErrorResponse1,
  isRandomErrorResponse2,
  isTable,
  isMixedResponse,
  isXtermResponse,
  isStatusModel,
  isUsageError,
  Util
} from '@kui-shell/core'

const Ansi = React.lazy(() => import('./Ansi'))
const Commentary = React.lazy(() => import('../Commentary'))
import HTMLDom from './HTMLDom' // !! DO NOT MAKE LAZY. See https://github.com/IBM/kui/issues/6758
const XtermDom = React.lazy(() => import('./XtermDom'))
import renderTable from '../Table'
const Markdown = React.lazy(() => import('../Markdown'))
import { KuiContext } from '../../../'
const RadioTableSpi = React.lazy(() => import('../../spi/RadioTable'))
import { Maximizable } from '../../Views/Sidecar/width'
import LocationProps from '../../Views/Sidecar/Location'
import { BlockViewTraits } from '../../Views/Terminal/Block'
import { isError } from '../../Views/Terminal/Block/BlockModel'
const TopNavSidecar = React.lazy(() => import('../../Views/Sidecar/TopNavSidecarV2'))
const LeftNavSidecar = React.lazy(() => import('../../Views/Sidecar/LeftNavSidecarV2'))
const StatusVisualizer = React.lazy(() => import('../StatusVisualizer'))

const strings = i18n('plugin-client-common', 'errors')

type Props = Maximizable &
  BlockViewTraits &
  LocationProps & {
    response: KResponse | Error
    completeEvent?: CommandCompleteEvent
    onRender?: (hasContent: boolean) => void
    willRemove?: () => void
    willUpdateCommand?: (command: string) => void
  }

interface State {
  catastrophicError: Error
}

/**
 * Component that renders a "ScalarResponse", which is a command
 * response that doesn't require any particularly special
 * interpretation or visualization of the inner structure --- i.e. a
 * response that is suitable for rendering directly in the Terminal.
 *
 */
export default class Scalar extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = Scalar.getDerivedStateFromProps()
  }

  public static getDerivedStateFromProps() {
    return {
      catastrophicError: undefined
    }
  }

  public static getDerivedStateFromError(error) {
    return { catastrophicError: error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('catastrophic error in Scalar', error, errorInfo)
  }

  private onRender(hasContent: boolean | 'undefined' = true) {
    if (this.props.onRender) {
      setTimeout(() => this.props.onRender(hasContent === 'undefined' ? undefined : hasContent), 0)
    }
  }

  private readonly _onRender = this.onRender.bind(this)

  private renderResponse(response: Props['response']) {
    const { tab } = this.props

    if (typeof response === 'boolean') {
      // !!! intentionally quoted and not false, Output.tsx uses
      // !!! assertHasContent !== undefined
      this.onRender('undefined')
      return <React.Fragment />
    } else if (typeof response === 'number') {
      this.onRender()
      return <pre>{response}</pre>
    } else if (isUsageError(response)) {
      // hopefully we can do away with this shortly
      this.onRender()
      if (typeof response.raw === 'string') {
        return <pre>{response.raw}</pre>
      } else if (isMessageWithUsageModel(response.raw) || isMessageWithCode(response.raw)) {
        return <pre>{response.raw.message}</pre>
      } else {
        return <HTMLDom content={response.raw} />
      }
    } else if (isXtermResponse(response)) {
      this.onRender()
      return <XtermDom response={response} />
    } else if (isStatusModel(response)) {
      this.onRender()
      return <StatusVisualizer {...response} />
    } else if (Buffer.isBuffer(response) || typeof response === 'string' || isError(response)) {
      const message = isError(response) ? response.message : response.toString()

      // Markdown interprets escapes, so we need to double-escape
      if (message[0] === '\u001b') {
        return <Ansi onRender={this._onRender}>{message}</Ansi>
      } else {
        return (
          <pre>
            <Markdown
              tab={tab}
              repl={tab.REPL}
              source={message.replace(/\\/g, '\\\\').replace(/\n/g, '\n\n')}
              onRender={this._onRender}
            />
          </pre>
        )
      }
    } else if (isCommentaryResponse(response)) {
      return (
        <span className="flex-fill flex-layout flex-align-stretch">
          <Commentary
            {...response.props}
            repl={tab.REPL}
            tabUUID={getPrimaryTabId(tab)}
            onRender={this._onRender}
            willRemove={this.props.willRemove}
            willUpdateCommand={this.props.willUpdateCommand}
            willUpdateResponse={(text: string) => {
              response.props.children = text
            }}
          />
        </span>
      )
    } else if (isRadioTable(response)) {
      this.onRender()
      return (
        <KuiContext.Consumer>
          {config => <RadioTableSpi table={response} title={!config.disableTableTitle} repl={tab.REPL} />}
        </KuiContext.Consumer>
      )
    } else if (isTable(response)) {
      const renderBottomToolbar = true
      const isLargeTable = response.body.length >= 50
      const renderGrid =
        isLargeTable &&
        (response.allowedPresentations === undefined || response.allowedPresentations.indexOf('grid') >= 0)
      return renderTable(
        tab,
        tab.REPL,
        response,
        undefined,
        renderBottomToolbar,
        renderGrid,
        this._onRender,
        this.props.isWidthConstrained
      )
      // ^^^ Notes: typescript doesn't like this, and i don't know why:
      // "is not assignable to type IntrinsicAttributes..."
      // <PaginatedTable {...props} />
    } else if (isMixedResponse(response)) {
      if (response.every(_ => typeof _ === 'string' || typeof _ === 'number' || typeof _ === 'boolean')) {
        return <pre className="break-all">[{response.toString()}]</pre>
      }
      return (
        <React.Fragment>
          {response.map((part, idx) => (
            <Scalar {...this.props} key={idx} response={part} />
          ))}
        </React.Fragment>
      )
    } else if (isReactResponse(response)) {
      this.onRender()
      return response.react
    } else if (Util.isHTML(response)) {
      // ^^^ intentionally using an "else" so that typescript double
      // checks that we've covered every case of ScalarResponse
      this.onRender()
      return <HTMLDom content={response} />
    } else if (isMarkdownResponse(response)) {
      return <Markdown tab={tab} repl={tab.REPL} source={response.content} onRender={this._onRender} />
    } else if (isRandomErrorResponse1(response)) {
      // maybe this is an error response from some random API?
      return (
        <Markdown tab={tab} repl={tab.REPL} source={strings('randomError1', response.code)} onRender={this._onRender} />
      )
    } else if (isRandomErrorResponse2(response)) {
      // maybe this is an error response from some random API?
      return (
        <Markdown
          tab={tab}
          repl={tab.REPL}
          source={strings('randomError2', response.errno)}
          onRender={this._onRender}
        />
      )
    } else if (isMultiModalResponse(response)) {
      return (
        <TopNavSidecar
          uuid={tab.uuid}
          tab={tab}
          execUUID={this.props.execUUID}
          active
          response={response}
          onRender={this.props.onRender}
          willChangeSize={this.props.willChangeSize}
          argvNoOptions={this.props.completeEvent ? this.props.completeEvent.argvNoOptions : undefined}
          parsedOptions={this.props.completeEvent ? this.props.completeEvent.parsedOptions : undefined}
        />
      )
    } else if (isNavResponse(response)) {
      return (
        <LeftNavSidecar
          uuid={tab.uuid}
          tab={tab}
          execUUID={this.props.execUUID}
          active
          response={response}
          onRender={this.props.onRender}
          willChangeSize={this.props.willChangeSize}
          argvNoOptions={this.props.completeEvent ? this.props.completeEvent.argvNoOptions : undefined}
          parsedOptions={this.props.completeEvent ? this.props.completeEvent.parsedOptions : undefined}
        />
      )
    } else if (isAbortableResponse(response)) {
      this.onRender()
      return this.renderResponse(response.response)
    }

    console.error('unexpected response from Scalar:', this.props.response)
    this.onRender()
    return <pre className="oops">Internal Error in command execution</pre>
  }

  public render() {
    if (this.state.catastrophicError) {
      return <div className="oops">{this.state.catastrophicError.toString()}</div>
    }

    try {
      return this.renderResponse(this.props.response)
    } catch (err) {
      console.error('catastrophic error rendering Scalar', err)
      return <pre>{err.toString()}</pre>
    }
  }
}
