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

import React from 'react'
import { isFile } from '@kui-shell/plugin-bash-like/fs'

import {
  Arguments,
  ParsedOptions,
  Tab as KuiTab,
  Content,
  isHTML,
  isRadioTable,
  isReactProvider,
  isStringWithOptionalContentType,
  isTable,
  isTreeResponse,
  isCommandStringContent,
  isFunctionContent,
  isScalarContent,
  isStringDiffContent,
  MultiModalResponse,
  ToolbarProps
} from '@kui-shell/core'

import Eval from './Eval'
import Editor from './Editor'
import DiffEditor from './Editor/DiffEditor'
import renderTable from './Table'
import Tree from '../spi/Tree'
import Markdown from './Markdown'
import HTMLString from './HTMLString'
import HTMLDom from './Scalar/HTMLDom'
import { KuiContext } from '../../'
import RadioTableSpi from '../spi/RadioTable'

export type KuiMMRProps = ToolbarProps & {
  tab: KuiTab
  mode: Content
  isActive: boolean
  response: MultiModalResponse
  args: {
    argsForMode?: Arguments
    argvNoOptions: string[]
    parsedOptions: ParsedOptions
  }
  execUUID: string // NOTE: we could remove this once this issue is fixed: https://github.com/IBM/kui/issues/6328
}

interface State {
  mode: Content
  isRendered: boolean
}

export default class KuiContent extends React.Component<KuiMMRProps, State> {
  public constructor(props: KuiMMRProps) {
    super(props)

    this.state = {
      mode: props.mode,
      isRendered: false
    }
  }

  public static getDerivedStateFromProps(props: KuiMMRProps, state: State) {
    if (state && state.isRendered && state.mode === props.mode) {
      return state
    } else {
      return Object.assign(state || {}, { isRendered: false, mode: props.mode })
    }
  }

  public shouldComponentUpdate(nextProps: KuiMMRProps) {
    return nextProps.isActive && (!this.state || !this.state.isRendered)
  }

  public componentDidUpdate() {
    if (this.props.isActive) {
      this.setState({
        isRendered: true
      })
    }
  }

  public render() {
    if (!this.props.isActive) {
      return <React.Fragment />
    }

    const { mode } = this.state
    const { tab, response, willUpdateToolbar } = this.props
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
            sizeToFit
            willUpdateToolbar={willUpdateToolbar}
            response={response}
            repl={tab.REPL}
            tabUUID={tab.uuid}
          />
        )
      }
    } else if (isStringDiffContent(mode)) {
      return (
        <DiffEditor
          contentType={mode.contentType}
          originalContent={mode.content.a}
          modifiedContent={mode.content.b}
          sizeToFit
          response={response}
          renderSideBySide
          tabUUID={tab.uuid}
        />
      )
    } else if (isCommandStringContent(mode)) {
      return <Eval {...this.props} command={mode.contentFrom} contentType={mode.contentType} />
    } else if (isFunctionContent(mode)) {
      return <Eval {...this.props} command={mode.content} />
    } else if (isScalarContent(mode)) {
      if (isReactProvider(mode)) {
        return mode.react({ willUpdateToolbar })
      } else if (isRadioTable(mode.content)) {
        const radioTable = mode.content
        // ^^^ Notes: Even though isRadioTable(mode.content) checks the type of mode.content,
        // RadioTableSpi in KuiContext.Consumer doesn't know the type of mode.content is RadioTable and throws error
        // so we have to re-assign mode.content to work around this typescript compile error
        return (
          <KuiContext.Consumer>
            {config => <RadioTableSpi table={radioTable} title={!config.disableTableTitle} repl={tab.REPL} />}
          </KuiContext.Consumer>
        )
      } else if (isTable(mode.content)) {
        return renderTable(tab, tab.REPL, mode.content, false)
        // ^^^ Notes: typescript doesn't like this, and i don't know why:
        // "is not assignable to type IntrinsicAttributes..."
        // <PaginatedTable {...props} />
      } else if (isHTML(mode.content)) {
        return <HTMLDom content={mode.content} />
      } else if (isTreeResponse(mode.content)) {
        return (
          <Tree
            tab={this.props.tab}
            data={mode.content.data}
            response={this.props.response}
            execUUID={this.props.execUUID}
          />
        )
      } else {
        console.error('Unsupported scalar content', mode)
      }
    }

    return <div className="oops">Unsupported content</div>
  }
}

export interface Focusable {
  doFocus(): void
}

export function isFocusable(node: React.ReactNode & Partial<Focusable>): node is Focusable {
  return typeof (node as Focusable).doFocus === 'function'
}
