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
  isMessageWithUsageModel,
  isMessageWithCode,
  Tab as KuiTab,
  ScalarResponse,
  isHTML,
  isTable,
  isMixedResponse,
  isUsageError
} from '@kui-shell/core'

import HTMLDom from './HTMLDom'
import renderTable from '../Table'
import { isError } from '../../Views/Terminal/Block/BlockModel'

interface Props {
  tab: KuiTab
  response: ScalarResponse | Error
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

    this.state = {
      catastrophicError: undefined
    }
  }

  public static getDerivedStateFromError(error) {
    return { catastrophicError: error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('catastrophic error in Scalar', error, errorInfo)
  }

  public render() {
    if (this.state.catastrophicError) {
      return <div className="oops">{this.state.catastrophicError.toString()}</div>
    }

    const { tab, response } = this.props

    try {
      if (typeof response === 'number' || typeof response === 'string' || typeof response === 'boolean') {
        return <pre>{response}</pre>
      } else if (isTable(response)) {
        return renderTable(tab, tab.REPL, response, undefined, true)
        // ^^^ Notes: typescript doesn't like this, and i don't know why:
        // "is not assignable to type IntrinsicAttributes..."
        // <PaginatedTable {...props} />
      } else if (isMixedResponse(response)) {
        return (
          <div className="result-vertical flex-layout" style={{ flex: 1, alignItems: 'unset' }}>
            {response.map((part, idx) => (
              <Scalar key={idx} tab={this.props.tab} response={part} />
            ))}
          </div>
        )
      } else if (isUsageError(response)) {
        // hopefully we can do away with this shortly
        if (typeof response.raw === 'string') {
          return <pre>{response.raw}</pre>
        } else if (isMessageWithUsageModel(response.raw) || isMessageWithCode(response.raw)) {
          return <pre>{response.raw.message}</pre>
        } else {
          return <HTMLDom content={response.raw} />
        }
      } else if (isError(response)) {
        return <div className="oops">{response.message}</div>
      } else if (isHTML(response)) {
        // ^^^ intentionally using an "else" so that typescript double
        // checks that we've covered every case of ScalarResponse
        return <HTMLDom content={response} />
      }
    } catch (err) {
      console.error('catastrophic error rendering Scalar', err)
      return <pre>{err.toString()}</pre>
    }

    console.error('unexpected null return from Scalar:', response)
    return <pre className="oops">Internal Error in command execution</pre>
  }
}
