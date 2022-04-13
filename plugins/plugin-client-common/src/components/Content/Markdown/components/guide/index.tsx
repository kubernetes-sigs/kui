/*
 * Copyright 2022 The Kubernetes Authors
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

import { CodeBlockResponseFn } from '../../components'
import { ChoiceState, Props as MarkdownProps } from '../../../Markdown'

const Guide = React.lazy(() => import('./Guide'))

export default function guidebookGuideWrapper(
  mdprops: MarkdownProps,
  uuid: string,
  choices: ChoiceState,
  codeBlockResponses: CodeBlockResponseFn
) {
  return function guidebookGuide(props: { 'data-kui-code-blocks': string }) {
    const blocks = props['data-kui-code-blocks']
      ? JSON.parse(props['data-kui-code-blocks']).map(_ => JSON.parse(Buffer.from(_, 'base64').toString()))
      : undefined

    return !blocks ? (
      <span className="all-pad">Nothing to do!</span>
    ) : (
      <Guide tab={mdprops.tab} uuid={uuid} blocks={blocks} choices={choices} codeBlockResponses={codeBlockResponses} />
    )
  }
}
