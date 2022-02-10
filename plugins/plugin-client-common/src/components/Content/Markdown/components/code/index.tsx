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
import { CodeProps } from 'react-markdown/lib/ast-to-react'
import { KResponse, CommentaryResponse, getPrimaryTabId } from '@kui-shell/core'

import { Props } from '../../../Markdown'
import { tryFrontmatter } from '../../frontmatter'

import Input from '../../../../Views/Terminal/Block/Inputv2'

const SimpleEditor = React.lazy(() => import('../../../Editor/SimpleEditor'))

type CodeBlockResponse = CommentaryResponse['props']['codeBlockResponses'][0]
export { CodeBlockResponse }

export default function code(
  mdprops: Props,
  uuid: string,
  codeBlockResponses: (codeBlockIdx: number) => CodeBlockResponse & { replayed: boolean },
  spliceInCodeExecution: (status: 'done' | 'error', response: KResponse, codeIdx: number) => void
) {
  return (props: CodeProps & { codeIdx: string }) => {
    if (props.inline) {
      return <code className={props.className}>{props.children}</code>
    }

    const code = String(props.children).trim()
    const { body, attributes } = tryFrontmatter(code)

    const tabUUID = mdprops.tab ? getPrimaryTabId(mdprops.tab) : undefined

    // react-markdown v6+ places the language in the className
    const match = /language-(\w+)/.exec(props.className || '')
    const language = match ? match[1] : undefined

    if (mdprops.nested && props.codeIdx && mdprops.executableCodeBlocks !== false) {
      // onContentChange={body => this.splice(codeWithResponseFrontmatter(body, attributes.response), props.node.position.start.offset, props.node.position.end.offset)}
      const myCodeIdx = parseInt(props.codeIdx)

      const _response = codeBlockResponses(myCodeIdx)
      const status = _response ? _response.status : undefined
      const response = _response ? _response.response : undefined

      // i.e. executed in *this* session
      const executed = _response && !_response.replayed

      // note how in the evaluation of `status`, we assume that if a
      // response is given but no status, that the status is 'done',
      // i.e. executed successfully to completion
      const statusConsideringReplay = !executed && (status === 'done' || status === 'error') ? 'replayed' : status

      // don't show the input part, only the output part, of this code block
      // TODO: we should also look at the command registration, for the command that was executed
      const outputOnly = attributes.outputOnly === true || attributes.outputOnly === 'true'

      const blockId = attributes.id || `${uuid}-${myCodeIdx}`

      return (
        <React.Fragment>
          <Input
            readonly={false}
            id={`kui-link-${blockId}`}
            className="kui--code-block-in-markdown"
            tab={mdprops.tab}
            value={body}
            watch={attributes.watch}
            language={language}
            blockId={blockId}
            validate={attributes.validate}
            response={response}
            status={statusConsideringReplay}
            arg1={myCodeIdx}
            onResponse={spliceInCodeExecution}
            outputOnly={outputOnly}
            executeImmediately={attributes.execute === 'now'}
            data-code-index={myCodeIdx}
            data-is-maximized={attributes.maximize}
          />
        </React.Fragment>
      )
    } else {
      return (
        <div className={'paragraph' + (mdprops.executableCodeBlocks === false ? ' kui--inverted-color-context' : '')}>
          {!language ? (
            <pre>
              <code>{code}</code>
            </pre>
          ) : (
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
          )}
        </div>
      )
    }
  }
}
