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

import { Choices } from 'madwizard'
import { REPL } from '@kui-shell/core'
import { Components } from 'react-markdown'

import _a from './a'
import p from './p'
import tag from './tag'
import _div from './div'
import _img from './img'
import tabbed from './tabbed'
import _heading from './heading'
import blockquote from './blockquote'
import { list, li } from './list'
import { details, tip } from './details'
import { table, thead, tbody, tr, th, td } from './table'
import _code, { CodeBlockResponse } from './code'

import { Props } from '../../Markdown'

export type CodeBlockResponseFn = (codeBlockIdx: number) => CodeBlockResponse & { replayed: boolean }

type Args = {
  mdprops: Props
  repl: REPL
  uuid: string
  choices: Choices.ChoiceState
  codeBlockResponses: CodeBlockResponseFn
}

function typedComponents(args: Args): Components {
  const { mdprops, repl, uuid, codeBlockResponses } = args

  const a = _a(mdprops, uuid, repl)
  const div = _div(mdprops, uuid, args.choices)
  const img = _img(mdprops)
  const code = _code(mdprops, uuid, codeBlockResponses)
  const heading = _heading(uuid)

  return {
    a,
    blockquote,
    code,
    details,
    div,
    h1: heading,
    h2: heading,
    h3: heading,
    h4: heading,
    h5: heading,
    h6: heading,
    img,
    li,
    ol: list,
    p,
    table,
    thead,
    tbody,
    tr,
    th,
    td,
    ul: list
  }
}

/** avoid typing issues... */
function components(args: Args) {
  const components = Object.assign(
    {
      tip,
      tag,
      tabbed: tabbed(args.uuid, args.choices)
    },
    typedComponents(args)
  )

  return function mkComponents() {
    return components
  }
}

export default components
