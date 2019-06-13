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
import { ExecOptions } from './execOptions'
import { UsageModel } from '../core/usage-error'
import { Tab } from '../webapp/cli'

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

export interface CommandOptions extends CapabilityRequirements {
  // explicitly provided usage model?
  usage?: UsageModel

  // yargs-parser flags
  flags?: YargsParserFlags

  // hide this command from the help system
  hidden?: boolean

  // should we register in the UI that this command was executed?
  incognito?: 'popup'[]

  // optional name for the view being presented
  viewName?: string

  // hint for screen width in popup mode
  width?: number

  // hint for screen height in popup mode
  height?: number

  // request that the REPL be cleared of the initial command in popup mode
  clearREPLOnLoad?: boolean

  // show this placeholder text when executing the command in popup mode (instead of the command line)
  placeholder?: string

  listen?: any // FIXME
  docs?: string
  synonymFor?: Command
  hide?: boolean
  override?: any
  plugin?: string
  okOptions?: string[]
  isIntention?: boolean
  requiresFullyQualifiedRoute?: boolean
}

export interface Event {
  // context: string
  tab?: Tab
  command?: string
  route?: string
  plugin?: string
  isIntention?: boolean
  error?: string
  options?: any
  execType?: ExecType
  isDrilldown?: boolean
}

export interface ParsedOptions {
  [key: string]: string
}

/**
 * Evaluator args
 *
 */
export interface EvaluatorArgs {
  tab: Tab
  block: HTMLElement | boolean
  nextBlock: HTMLElement
  parsedOptions: ParsedOptions
  command: string
  argv: string[]
  argvNoOptions: string[]
  execOptions: ExecOptions
  createOutputStream: () => WritableStream
}

// TODO
export type CommandResponse = any

/** base command handler */
export type CommandHandler = (args: EvaluatorArgs) => CommandResponse | Promise<CommandResponse>

/**
 * Evaluator
 *
 */
export interface Evaluator {
  eval: CommandHandler
}

export interface CommandBase {
  route: string
  options?: CommandOptions
}

type CommandKey = string
// we can't use CommandKey here; yay tsc; TS1336
interface CommandKeyMap {
  [key: string]: Command
}
// we can't use CommandKey here; yay tsc; TS1336
export interface Disambiguator {
  [key: string]: CommandBase[]
}

export interface Command extends CommandBase {
  $: CommandHandler
  key: CommandKey
  parent: Command
  children?: CommandKeyMap
  synonyms?: CommandKeyMap
}

/** a command tree rooted by a command */
export type CommandTree = Command

export interface CapabilityRequirements {
  needsUI?: boolean
  inBrowserOk?: boolean
  requiresLocal?: boolean
  noAuthOk?: boolean | string[]
  fullscreen?: boolean
}

export interface CommandHandlerWithEvents extends Evaluator {
  subtree: CommandBase
  route: string
  options: CommandOptions
  success: (args: { tab: Tab; type: ExecType; command: string; isDrilldown: boolean; parsedOptions: { [ key: string ]: any } }) => void
  error: (command: string, tab: Tab, type: ExecType, err: CodedError) => CodedError
}
export function isCommandHandlerWithEvents (evaluator: Evaluator): evaluator is CommandHandlerWithEvents {
  const handler = evaluator as CommandHandlerWithEvents
  return handler.options !== undefined
}

export type CommandTreeResolution = boolean | CommandHandlerWithEvents | CodedError

export type YargsParserFlags = { [key in 'boolean' | 'alias']: string[] }

/** a catch all handler is presented with an offer to handle a given argv */
export type CatchAllOffer = (argv: string[]) => boolean

export interface CatchAllHandler extends CommandBase {
  prio: number
  plugin: string // registered plugin
  offer: CatchAllOffer // does the handler accept the given command?
  eval // command evaluator
}

export interface CommandRegistrar {
  find: (route: string, noOverride?: boolean) => Promise<Command>
  listen: (route: string, handler: CommandHandler, options: CommandOptions) => Command
  synonym: (route: string, handler: CommandHandler, master: Command, options: CommandOptions) => void
  subtree: (route: string, options: CommandOptions) => Command
  subtreeSynonym: (route: string, masterTree: Command) => void
}
