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

import type {
  Arguments,
  ParsedOptions,
  Tab as KuiTab,
  Content,
  MultiModalResponse,
  ToolbarProps
} from '@kui-shell/core'

import {
  isRadioTable,
  isReactProvider,
  isStringWithOptionalContentType,
  isTable,
  isCommandStringContent,
  isFunctionContent,
  isScalarContent,
  isStringDiffContent,
  isDescriptionList,
  isHTML
} from '@kui-shell/core/mdist/api/Response'

import Eval from './Eval'
const Editor = React.lazy(() => import('./Editor'))
const DiffEditor = React.lazy(() => import('./Editor/DiffEditor'))
import renderTable from './Table'
import HTMLString from './HTMLString'
import HTMLDom from './Scalar/HTMLDom'
import { KuiContext } from '../../'
const RadioTableSpi = React.lazy(() => import('../spi/RadioTable'))
const DescriptionList = React.lazy(() => import('../spi/DescriptionList'))

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
  execUUID: string
}

export default class KuiContent extends React.PureComponent<KuiMMRProps, State> {
  public constructor(props: KuiMMRProps) {
    super(props)
    this.state = KuiContent.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: KuiMMRProps, state?: State) {
    if (!state || state.mode !== props.mode || state.execUUID !== props.execUUID) {
      return Object.assign(state || {}, { mode: props.mode, execUUID: props.execUUID })
    } else {
      return state
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
      } else {
        return (
          <Editor
            content={mode}
            readOnly={false}
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
          response={response}
          renderSideBySide
          tabUUID={tab.uuid}
        />
      )
    } else if (isCommandStringContent(mode)) {
      const key = `${mode.contentFrom} ${mode.contentType}`
      return <Eval {...this.props} key={key} command={mode.contentFrom} contentType={mode.contentType} />
    } else if (isFunctionContent(mode)) {
      const command = mode.content
      return <Eval {...this.props} key={command.toString()} command={command} />
    } else if (isScalarContent(mode)) {
      if (isReactProvider(mode)) {
        return mode.react({ willUpdateToolbar })
      } else if (isDescriptionList(mode.content)) {
        return (
          <div className="flex-fill flex-layout flex-align-stretch">
            <div className="scrollable scrollable-auto scrollable-x flex-fill flex-layout flex-align-stretch">
              <DescriptionList
                as={mode.content.spec.as}
                groups={mode.content.spec.groups}
                className="left-pad right-pad"
              />
            </div>
          </div>
        )
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

/* export function isFocusable(node: React.ReactNode & Partial<Focusable>): node is Focusable {
  return typeof (node as Focusable).doFocus === 'function'
} */
