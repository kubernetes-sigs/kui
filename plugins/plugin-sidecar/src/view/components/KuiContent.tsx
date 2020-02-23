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
  Tab as KuiTab,
  Button,
  Content,
  isHTML,
  isStringWithOptionalContentType,
  isTable,
  isCommandStringContent,
  isFunctionContent,
  isScalarContent,
  MultiModalResponse,
  ToolbarText
} from '@kui-shell/core'

import { HTMLDom } from '@kui-shell/plugin-client-common'
import { KEditor as Editor } from '@kui-shell/plugin-editor'
import { renderTable } from '@kui-shell/plugin-carbon-tables'

import Eval from './Eval'
import Markdown from './Markdown'
import HTMLString from './HTMLString'

interface KuiMMRProps {
  tab: KuiTab
  mode: Content
  response: MultiModalResponse
  willUpdateToolbar?: (toolbarText: ToolbarText, buttons?: Button[]) => void
}

export default class KuiMMRContent extends React.PureComponent<KuiMMRProps> {
  public render() {
    const { tab, mode, response, willUpdateToolbar } = this.props

    if (isStringWithOptionalContentType(mode)) {
      if (mode.contentType === 'text/html') {
        return <HTMLString content={mode.content} />
      } else if (mode.contentType === 'text/markdown') {
        return <Markdown source={mode.content} />
      } else {
        return (
          <Editor
            content={mode}
            readOnly={false}
            willUpdateToolbar={willUpdateToolbar}
            response={response}
            repl={tab.REPL}
          />
        )
      }
    } else if (isCommandStringContent(mode)) {
      return <Eval tab={tab} command={mode.contentFrom} contentType={mode.contentType} response={response} />
    } else if (isFunctionContent(mode)) {
      return <Eval tab={tab} command={mode.content} response={response} />
    } else if (isScalarContent(mode)) {
      if (isTable(mode.content)) {
        return renderTable(tab, tab.REPL, mode.content)
        // ^^^ Notes: typescript doesn't like this, and i don't know why:
        // "is not assignable to type IntrinsicAttributes..."
        // <PaginatedTable {...props} />
      } else if (isHTML(mode.content)) {
        return <HTMLDom content={mode.content} />
      } else {
        console.error('Unsupported scalar content', mode)
      }
    }

    return <div className="oops">Unsupported content</div>
  }
}
