/*
 * Copyright 2017-20 IBM Corporation
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

import Tab from '../webapp/tab'
import ExecOptions from '../models/execOptions'
import { CommandOptions, ExecType, KResponse, ParsedOptions } from '../models/command'

export interface CommandStartEvent {
  tab: Tab
  route: string
  command: string
  execUUID: string
  execType: ExecType
  echo: boolean
}

export type ResponseType = 'MultiModalResponse' | 'NavResponse' | 'ScalarResponse' | 'Incomplete' | 'Error'

export interface CommandCompleteEvent<R extends KResponse = KResponse, T extends ResponseType = ResponseType> {
  tab: Tab

  command: string
  argvNoOptions: string[]
  parsedOptions: ParsedOptions
  execOptions: ExecOptions

  execUUID: string
  execType: ExecType
  cancelled: boolean
  echo: boolean
  evaluatorOptions: CommandOptions

  response: R
  responseType: T

  historyIdx: number
}

export type CommandStartHandler = (event: CommandStartEvent) => void

export type CommandCompleteHandler<R extends KResponse = KResponse, T extends ResponseType = ResponseType> = (
  event: CommandCompleteEvent<R, T>
) => void
