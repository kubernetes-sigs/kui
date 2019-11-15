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

import REPL from './repl'
import { Entity } from './entity'
import { CodedError } from './errors'
import { ExecOptions } from './execOptions'
import { UsageModel } from '../core/usage-error'
import { Tab } from '../webapp/cli'
import { StreamableFactory } from './streamable'

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
  /** does this command accept no arguments of any sort (neither positional nor optional)? */
  noArgs?: boolean

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

  /** is this an interior node ("directory", versus a leaf-node with a command handler */
  isDirectory?: boolean

  listen?: CommandListener
  docs?: string
  synonymFor?: Command
  hide?: boolean
  override?: CommandHandler
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
  options?: string[]
  execType?: ExecType
  isDrilldown?: boolean
}

export interface ParsedOptions {
  _?: string[]
  [key: string]: string | boolean | number | string[]
}

/**
 * This information represents a command line, but split out in
 * various useful ways.
 *
 */
export interface CommandLine<Options = ParsedOptions> {
  /**
   * the raw command string, as given by the user
   */
  command: string

  /** the result of a whitespace split applied to the `command` string
   * that pays attention to backslash escaping and quotations
   */
  argv: string[]

  /**
   * the residual of `argv` without `parsedOptions`
   */
  argvNoOptions: string[]

  /**
   * the dash options parsed out in a way that pays attention to n-ary
   * options such as `--option key value`
   */
  parsedOptions: Options
}

/**
 * The full set of data passed to a command handler
 *
 */
export interface EvaluatorArgs<Options = ParsedOptions> extends CommandLine<Options> {
  /**
   * The tab context in which the command was initiated
   */
  tab: Tab

  REPL: REPL

  /**
   * Optional command channel options that one command can use to
   * influence the execution of another.
   */
  execOptions: ExecOptions

  /**
   * Commands can use this to stream output to the UI, rather than
   * using the normal request-response interaction between the REPL
   * and the command.
   */
  createOutputStream: StreamableFactory

  /**
   * EXPERT MODE: The REPL block in which this command was initiated
   * (rarely used, but useful for more complex UI extensions)
   */
  block: HTMLElement | boolean

  /**
   * EXPERT MODE: The REPL block that will house the *subsequent*
   * command execution (rarely used, but useful for more complex UI
   * extensions)
   */
  nextBlock: HTMLElement
}

// TODO
export type Response = Entity

/** base command handler */
export type CommandHandler<T = Response, O = ParsedOptions> = (args: EvaluatorArgs<O>) => T | Promise<T>

/** command handler when overriding commands from other plugins */
export type CommandOverrideHandler<T = Response, O = ParsedOptions> = (
  args: EvaluatorArgs<O>,
  underlyingHandler: CommandHandler<T, O>
) => T | Promise<T>

/**
 * Evaluator
 *
 */
export interface Evaluator {
  eval: CommandHandler
}

export interface CommandBase {
  route: string
  plugin?: string
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

export type OnSuccess = (args: {
  tab: Tab
  type: ExecType
  command: string
  isDrilldown: boolean
  parsedOptions: ParsedOptions
}) => void

export type OnError = (command: string, tab: Tab, type: ExecType, err: CodedError) => CodedError

export interface CommandHandlerWithEvents extends Evaluator {
  subtree: Command
  route: string
  options: CommandOptions
  success: OnSuccess
  error: OnError
}
export function isCommandHandlerWithEvents(evaluator: Evaluator): evaluator is CommandHandlerWithEvents {
  const handler = evaluator as CommandHandlerWithEvents
  return handler.options !== undefined
}

export type CommandTreeResolution = boolean | CommandHandlerWithEvents | CodedError

export interface YargsParserFlags {
  boolean?: string[]
  alias?: Record<string, string[]>
}

/** a catch all handler is presented with an offer to handle a given argv */
export type CatchAllOffer = (argv: string[]) => boolean

export interface CatchAllHandler extends Command {
  prio: number
  plugin: string // registered plugin
  offer: CatchAllOffer // does the handler accept the given command?
  eval: CommandHandler // command evaluator
}

type CommandListener = (route: string, handler: CommandHandler, options?: CommandOptions) => Command

export interface CommandRegistrar {
  find: (route: string, fromPlugin?: string, noOverride?: boolean) => Promise<Command>
  listen: CommandListener
  override: (
    route: string,
    fromPlugin: string,
    handler: CommandOverrideHandler,
    options?: CommandOptions
  ) => Promise<Command>
  synonym: (route: string, handler: CommandHandler, master: Command, options?: CommandOptions) => void
  subtree: (route: string, options: CommandOptions) => Command
  subtreeSynonym: (route: string, masterTree: Command, options?: CommandOptions) => void
  catchall: (offer: CatchAllOffer, handler: CommandHandler, prio: number, options: CommandOptions) => void
}
