/*
 * Copyright 2017 The Kubernetes Authors
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
import { CommandLine, CommandOptions, ExecType, KResponse, ParsedOptions } from '../models/command'

export interface CommandStartEvent {
  tab: Tab
  startTime: number
  route: string
  command: string
  execUUID: string
  execType: ExecType
  execOptions: ExecOptions
  echo: boolean
  evaluatorOptions: CommandOptions
  pipeStages: CommandLine['pipeStages']

  /** The output will be redirected to a file; do not display any live output */
  redirectDesired: boolean
}

export type ResponseType = 'MultiModalResponse' | 'NavResponse' | 'ScalarResponse' | 'Incomplete' | 'Error'

export interface CommandCompleteEvent<R extends KResponse = KResponse, T extends ResponseType = ResponseType> {
  tab: Tab

  completeTime: number
  command: string
  argvNoOptions: string[]
  parsedOptions: ParsedOptions
  execOptions: ExecOptions
  pipeStages: CommandLine['pipeStages']

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

/** In order to snapshot an event, we'll need to remember just the tab uuid */
export type SnapshottedEvent<E extends CommandStartEvent | CommandCompleteEvent> = Omit<E, 'tab'> & {
  tab: E['tab']['uuid']
}

export interface Notebook {
  apiVersion: 'kui-shell/v1'
  kind: 'Notebook'
  metadata?: {
    name?: string
    description?: string
    preferReExecute?: boolean
  }
}

/** @return wether or not the given `raw` json is an instance of Notebook */
export function isNotebook(raw: Record<string, any>): raw is Notebook {
  const model = raw as Notebook
  return model.apiVersion === 'kui-shell/v1' && model.kind === 'Notebook'
}
