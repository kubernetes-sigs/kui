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
import REPL from './repl'

export type CommentaryResponse = {
  apiVersion: 'kui-shell/v1'
  kind: 'CommentaryResponse'
  props: {
    /** Content rendered inside the CardTitle */
    title?: string

    /** Body of the Card. It will be passed through as the source <Markdown source="..." /> */
    children: string

    /** Prefix for image URLs */
    baseUrl?: string

    /** [Optional] REPL controller, but required if you want your Card
     * to have functional kuiexec?command=... links via Markdown */
    repl?: REPL
  }
}

export function isCommentaryResponse(entity: Entity): entity is CommentaryResponse {
  const response = entity as CommentaryResponse
  return response.apiVersion === 'kui-shell/v1' && response.kind === 'CommentaryResponse'
}

/** is this commentary reponse be able to treated as a section break */
export function isCommentarySectionBreak(entity: Entity): boolean {
  return entity && isCommentaryResponse(entity) && entity.props.children === '---'
}

export function maybeKuiLink(link: string): string {
  const linkMatch = link.match('#kui-link-')
  if (linkMatch) {
    return linkMatch.input.slice(1)
  }
}
