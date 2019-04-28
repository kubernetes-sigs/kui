/*
 * Copyright 2019 IBM Corporation
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

import { CodedError } from './errors'
import { IExecOptions } from './execOptions'
import { IUsageModel } from '../core/usage-error'

/**
 * "top-level", meaning the user hit enter in the CLI,
 * "click-handler", meaning that the user clicked on a UI element
 * "nested", meaning that some evaluator uses the repl in its internal implementation
 *
 */
export enum ExecType {
  TopLevel,
  ClickHandler,
  Nested
}

export interface ICommandOptions extends ICapabilityRequirements {
  // explicitly provided usage model?
  usage?: IUsageModel

  // yargs-parser flags
  flags?: YargsParserFlags

  // should we register in the UI that this command was executed?
  incognito?: 'popup'

  listen?: any // FIXME
  docs?: string
  synonymFor?: ICommand
  hide?: boolean
  override?: any
  plugin?: string
  okOptions?: string[]
  isIntention?: boolean
  requiresFullyQualifiedRoute?: boolean
}

export interface IEvent {
  // context: string
  command?: string
  route?: string
  plugin?: string
  isIntention?: boolean
  error?: string
  options?: any
  execType?: ExecType
  isDrilldown?: boolean
}

/**
 * Evaluator args
 *
 */
export interface IEvaluatorArgs {
  block: HTMLElement | boolean
  nextBlock: HTMLElement
  parsedOptions: { [key: string]: string }
  command: string
  argv: Array<string>
  argvNoOptions: Array<string>
  execOptions: IExecOptions
  createOutputStream: () => WritableStream
}

/** base command handler */
export type CommandHandler = (args: IEvaluatorArgs) => Promise<any>

/**
 * Evaluator
 *
 */
export interface IEvaluator {
  eval: CommandHandler
}

export interface ICommandBase {
  route: string
  options?: ICommandOptions
}

type CommandKey = string
type CommandKeyMap = { [key: string]: ICommand } // we can't use CommandKey here; yay tsc; TS1336
export type Disambiguator = { [key: string]: ICommandBase[] } // we can't use CommandKey here; yay tsc; TS1336

export interface ICommand extends ICommandBase {
  $: CommandHandler
  key: CommandKey
  parent: ICommand
  children?: CommandKeyMap
  synonyms?: CommandKeyMap
}

/** a command tree rooted by a command */
export type CommandTree = ICommand

export interface ICapabilityRequirements {
  needsUI?: boolean
  requiresLocal?: boolean
  noAuthOk?: boolean
  fullscreen?: boolean
}

export interface ICommandHandlerWithEvents extends IEvaluator {
  subtree: ICommandBase
  route: string
  options: ICommandOptions
  success: (args: { type: ExecType, command: string, isDrilldown: boolean, parsedOptions: { [ key: string ]: any } }) => void
  error: (command: string, err: CodedError) => CodedError
}

export type CommandTreeResolution = boolean | ICommandHandlerWithEvents | CodedError

export type YargsParserFlags = { [key in 'boolean' | 'alias']: string[] }

/** a catch all handler is presented with an offer to handle a given argv */
export type CatchAllOffer = (argv: Array<string>) => boolean

export interface ICatchAllHandler extends ICommandBase {
  prio: number
  plugin: string // registered plugin
  offer: CatchAllOffer // does the handler accept the given command?
  eval // command evaluator
}
