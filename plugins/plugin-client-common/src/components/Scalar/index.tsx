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
import { renderTable } from '@kui-shell/plugin-carbon-tables'
import {
  isMessageWithUsageModel,
  isMessageWithCode,
  Tab as KuiTab,
  ScalarResponse,
  isTable,
  isMixedResponse,
  isUsageError
} from '@kui-shell/core'

import HTMLDom from './HTMLDom'
import { isError } from '../Terminal/Block/BlockModel'

interface Props {
  tab: KuiTab
  response: ScalarResponse
}

/**
 * Component that renders a "ScalarResponse", which is a command
 * response that doesn't require any particularly special
 * interpretation or visualization of the inner structure --- i.e. a
 * response that is suitable for rendering directly in the Terminal.
 *
 */
export default class Scalar extends React.PureComponent<Props> {
  public render() {
    const { tab, response } = this.props

    if (typeof response === 'number' || typeof response === 'string' || typeof response === 'boolean') {
      return <pre>{response}</pre>
    } else if (isTable(response)) {
      return renderTable(tab, tab.REPL, response)
      // ^^^ Notes: typescript doesn't like this, and i don't know why:
      // "is not assignable to type IntrinsicAttributes..."
      // <PaginatedTable {...props} />
    } else if (isMixedResponse(response)) {
      return response.map((part, idx) => <Scalar key={idx} tab={this.props.tab} response={part} />)
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
    } /* if (isHTML(response)) */ else {
      // ^^^ intentionally using an "else" so that typescript double
      // checks that we've covered every case of ScalarResponse
      return <HTMLDom content={response} />
    }
  }
}
