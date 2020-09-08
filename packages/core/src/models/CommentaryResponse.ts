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

import { Entity } from './entity'
import REPL from './repl'
import Tab from '../webapp/tab'

/** Commentary describing actions in a different tab/split */
type Elsewhere = {
  elsewhere: true
  tabUUID: string
  tab?: () => Tab
}

type DefaultProps = Partial<Elsewhere> & {
  /** Content rendered inside the CardTitle */
  title?: string

  /** Body of the Card. It will be passed through as the source <Markdown source="..." /> */
  children: string

  /** [Optional] REPL controller, but required if you want your Card
   * to have functional kuiexec?command=... links via Markdown */
  repl?: REPL
}

type ElsewhereProps = DefaultProps & Required<Elsewhere>
export type ElsewhereCommentaryResponse = CommentaryResponse<ElsewhereProps>

export type CommentaryResponse<Props extends DefaultProps = DefaultProps> = {
  apiVersion: 'kui-shell/v1'
  kind: 'CommentaryResponse'
  props: Props
}

export function isCommentaryResponse(entity: Entity): entity is CommentaryResponse {
  const response = entity as CommentaryResponse
  return response.apiVersion === 'kui-shell/v1' && response.kind === 'CommentaryResponse'
}

export function isElsewhereCommentaryResponse(entity: Entity): entity is ElsewhereCommentaryResponse {
  return isCommentaryResponse(entity) && entity.props.elsewhere === true
}
