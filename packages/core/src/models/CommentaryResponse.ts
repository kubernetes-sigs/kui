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

import { Entity } from './entity'
import { KResponse } from './command'
import REPL from './repl'

export type CommentaryResponse = {
  apiVersion: 'kui-shell/v1'
  kind: 'CommentaryResponse'
  props: {
    /** Content rendered inside the CardTitle */
    title?: string

    /** Source filepath */
    filepath?: string

    /** Markdown source */
    children: string

    /** Show header text indicating what we are doing (e.g. Editing Markdown) [Default: true] */
    header?: boolean

    /** Open in edit mode [Default: only if children.length === 0 */
    edit?: boolean

    /** Show a preview while editing [Default: true] */
    preview?: boolean

    /** Send edits to this channel (implies --no-header and --no-preview and --edit) */
    send?: string

    /** Consume edits from this channel (implies --no-header and --no-edit and --preview) */
    receive?: string

    /** Replace all existing content in this tab */
    replace?: boolean

    /** CodeBlock responses */
    codeBlockResponses?: { status: 'done' | 'error'; response: KResponse }[]

    /** Prefix for image URLs */
    baseUrl?: string

    /** Support for pymdownx.snippets */
    snippetBasePath?: string

    /** [Optional] REPL controller, but required if you want your Card
     * to have functional kuiexec?command=... links via Markdown */
    repl?: REPL

    /** [Optional] If true, the source specified by `filepath` does not utilize extended markdown, such as tabs and tips */
    simple?: boolean
  }
}

export function isCommentaryResponse(entity: Entity): entity is CommentaryResponse {
  const response = entity as CommentaryResponse
  return response.apiVersion === 'kui-shell/v1' && response.kind === 'CommentaryResponse'
}

export function maybeKuiLink(link: string): string {
  const linkMatch = link && link.match('#kui-link-')
  if (linkMatch) {
    return linkMatch.input.slice(1)
  }
}
