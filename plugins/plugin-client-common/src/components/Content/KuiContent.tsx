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

import { isFile } from '@kui-shell/plugin-bash-like/fs'

import {
  ParsedOptions,
  Tab as KuiTab,
  Button,
  Content,
  isHTML,
  isReactProvider,
  isStringWithOptionalContentType,
  isTable,
  isCommandStringContent,
  isFunctionContent,
  isScalarContent,
  MultiModalResponse,
  ToolbarText
} from '@kui-shell/core'

import Eval from './Eval'
import Editor from './Editor'
import renderTable from './Table'
import Markdown from './Markdown'
import HTMLString from './HTMLString'
import HTMLDom from './Scalar/HTMLDom'

interface KuiMMRProps {
  tab: KuiTab
  mode: Content
  response: MultiModalResponse
  args: {
    argvNoOptions: string[]
    parsedOptions: ParsedOptions
  }
  willUpdateToolbar?: (toolbarText: ToolbarText, buttons?: Button[]) => void
}

export default class KuiMMRContent extends React.PureComponent<KuiMMRProps> {
  public render() {
    const { tab, mode, response, willUpdateToolbar, args } = this.props

    if (isStringWithOptionalContentType(mode)) {
      if (mode.contentType === 'text/html') {
        return <HTMLString content={mode.content} />
      } else if (mode.contentType === 'text/markdown') {
        return (
          <Markdown
            tab={tab}
            repl={tab.REPL}
            fullpath={isFile(response) ? response.spec.fullpath : undefined}
            source={mode.content}
          />
        )
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
      return (
        <Eval tab={tab} command={mode.contentFrom} contentType={mode.contentType} response={response} args={args} />
      )
    } else if (isFunctionContent(mode)) {
      return <Eval tab={tab} command={mode.content} response={response} args={args} />
    } else if (isScalarContent(mode)) {
      if (isReactProvider(mode)) {
        return mode.react({ willUpdateToolbar })
      } else if (isTable(mode.content)) {
        return renderTable(tab, tab.REPL, mode.content, false)
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
