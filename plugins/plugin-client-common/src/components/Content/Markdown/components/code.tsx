/*
 * Copyright 2021 The Kubernetes Authors
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
import { KResponse, getPrimaryTabId } from '@kui-shell/core'
import { CodeProps } from 'react-markdown/lib/ast-to-react'

import { Props } from '../../Markdown'
import SourceOffset from './SourceOffset'
import { tryFrontmatter, codeWithResponseFrontmatter, decodePriorResponse } from '../frontmatter'

import Input from '../../../Views/Terminal/Block/Inputv2'
// const Input = React.lazy(() => import('../Views/Terminal/Block/Inputv2'))

const SimpleEditor = React.lazy(() => import('../../Editor/SimpleEditor'))

export default function code(
  mdprops: Props,
  codeSourceOffsets: SourceOffset[],
  codeIdx: (offset: SourceOffset) => number,
  spliceInCodeExecution: (replacement: string, startOffset: number, endOffset: number, codeIdx: number) => void,
  codeHasBeenExecuted: (codeIdx: number) => boolean
) {
  const spliceCodeWithResponseFrontmatter = (
    status: 'done' | 'error',
    response: KResponse,
    blockId: string,
    body: string,
    language: string,
    codeIdx: number
  ) => {
    spliceInCodeExecution(
      codeWithResponseFrontmatter(body, language, blockId, status, response),
      codeSourceOffsets[codeIdx].sliceStart,
      codeSourceOffsets[codeIdx].sliceEnd,
      codeIdx
    )
  }

  return (props: CodeProps) => {
    if (props.inline) {
      return <code className={props.className}>{props.children}</code>
    }

    const code = String(props.children).trim()
    const fm = tryFrontmatter(code)
    const { body, attributes } = fm

    const tabUUID = mdprops.tab ? getPrimaryTabId(mdprops.tab) : undefined

    // react-markdown v6+ places the language in the className
    const match = /language-(\w+)/.exec(props.className || '')
    const language = match ? match[1] : undefined

    if (mdprops.nested && /^(bash|sh|shell)$/.test(language)) {
      // onContentChange={body => this.splice(codeWithResponseFrontmatter(body, attributes.response), props.node.position.start.offset, props.node.position.end.offset)}
      const sliceStart = props.node.position.start.offset
      const sliceEnd = props.node.position.end.offset
      const myCodeIdx = codeIdx({ sliceStart, sliceEnd })

      const executed = codeHasBeenExecuted(myCodeIdx)

      // note how in the evaluation of `status`, we assume that if a
      // response is given but no status, that the status is 'done',
      // i.e. executed successfully to completion
      const status = attributes.status || (attributes.response ? 'done' : 'not-yet')
      const statusConsideringReplay = !executed && (status === 'done' || status === 'error') ? 'replayed' : status

      return (
        <Input
          readonly={false}
          className="kui--code-block-in-markdown"
          tab={mdprops.tab}
          value={body}
          language={language}
          blockId={attributes.id}
          validate={attributes.validate === '$body' ? body : attributes.validate}
          response={decodePriorResponse(attributes.response, attributes.responseEncoding)}
          status={statusConsideringReplay}
          arg1={body}
          arg2={language}
          arg3={myCodeIdx}
          onResponse={spliceCodeWithResponseFrontmatter}
          data-code-index={myCodeIdx}
        />
      )
    } else {
      return (
        <div className="paragraph">
          <code className="kui--code--editor">
            <SimpleEditor
              tabUUID={tabUUID}
              content={code}
              contentType={language}
              fontSize={12}
              simple
              minHeight={0}
              readonly
            />
          </code>
        </div>
      )
    }
  }
}
