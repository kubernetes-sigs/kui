/*
 * Copyright 2019 The Kubernetes Authors
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
import { Tab } from '../webapp/tab'
import { Block } from '../webapp/models/block'
import { StreamableFactory } from './streamable'
import * as Yargs from 'yargs-parser'

/**
 * A command `KResponse` can be any supported `Entity` type
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KResponse<Content extends any = any> = Entity<Content>
export default KResponse

/**
 * "top-level", meaning the user hit enter in the CLI,
 * "click-handler", meaning that the user clicked on a UI element
 * "nested", meaning that some evaluator uses the repl in its internal implementation
 *
 */
export enum ExecType {
  TopLevel,
  ClickHandler,
  Nested,
  Rerun
}

export type ViewTransformer<T extends KResponse, O extends ParsedOptions> = (
  args: EvaluatorArgs<O>,
  response: T
) => Promise<T> | void | Promise<void>

export interface CommandOptions extends CapabilityRequirements {
  /** does this command accept no arguments of any sort (neither positional nor optional)? */
  noArgs?: boolean

  /** Semicolon-expand the command line? Default: true */
  semiExpand?: boolean

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

  /** is this an interior node ("directory", versus a leaf-node with a command handler */
  isDirectory?: boolean

  listen?: CommandListener
  docs?: string
  synonymFor?: Command<KResponse, ParsedOptions>
  hide?: boolean
  override?: CommandHandler<KResponse, ParsedOptions>
  plugin?: string
  okOptions?: string[]

  /** controller wants to handle redirect */
  noCoreRedirect?: boolean

  /** model to view transformer */
  viewTransformer?: ViewTransformer<KResponse, ParsedOptions>

  /**
   * Is the command experimental? e.g. initial release, lack of test coverage
   *
   */
  isExperimental?: boolean

  /**
   * Is the command only want to show output and hide input?
   *
   */
  outputOnly?: boolean

  /** When this command is being replayed, prefer to re-execute if possible */
  preferReExecute?: boolean
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
   * pipeline stages, e.g. if command='a b --foo|c', the pipeStages=[['a','b, '--foo'],'c']
   */
  pipeStages: {
    prefix?: string
    stages: string[][]
    redirect?: string
    redirector?: '>' | '>>' | '2>&1' | '>&' | '>>&'
  }

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
   * Same as createOutputStream, but for stderr
   */
  createErrorStream: StreamableFactory

  /**
   * EXPERT MODE: The REPL block in which this command was initiated
   * (rarely used, but useful for more complex UI extensions)
   */
  block: Block | boolean

  /**
   * EXPERT MODE: The REPL block that will house the *subsequent*
   * command execution (rarely used, but useful for more complex UI
   * extensions)
   */
  nextBlock: HTMLElement
}

/** base command handler */
export type CommandHandler<T extends KResponse, O extends ParsedOptions> = (args: EvaluatorArgs<O>) => T | Promise<T>

/** command handler when overriding commands from other plugins */
export type CommandOverrideHandler<T extends KResponse, O extends ParsedOptions> = (
  args: EvaluatorArgs<O>,
  underlyingHandler: CommandHandler<T, O>
) => T | Promise<T>

/**
 * Evaluator
 *
 */
export interface Evaluator<T extends KResponse, O extends ParsedOptions> {
  eval: CommandHandler<T, O>
}

export interface CommandBase {
  route: string
  plugin?: string
  options?: CommandOptions
}

type CommandKey = string
// we can't use CommandKey here; yay tsc; TS1336
interface CommandKeyMap {
  [key: string]: Command<KResponse, ParsedOptions>
}
// we can't use CommandKey here; yay tsc; TS1336
export interface Disambiguator {
  [key: string]: CommandBase[]
}

export interface Command<T extends KResponse, O extends ParsedOptions> extends CommandBase {
  $: CommandHandler<T, O>
  key: CommandKey
  parent: Command<KResponse, ParsedOptions>
  children?: CommandKeyMap
  synonyms?: CommandKeyMap
}

/** a command tree rooted by a command */
export type CommandTree = Command<KResponse, ParsedOptions>

export interface CapabilityRequirements {
  needsUI?: boolean
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

export interface CommandHandlerWithEvents<T extends KResponse, O extends ParsedOptions> extends Evaluator<T, O> {
  subtree: Command<T, O>
  route: string
  options: CommandOptions
  success: OnSuccess
  error: OnError
}
export function isCommandHandlerWithEvents<T extends KResponse, O extends ParsedOptions>(
  evaluator: Evaluator<T, O>
): evaluator is CommandHandlerWithEvents<T, O> {
  const handler = evaluator as CommandHandlerWithEvents<T, O>
  return handler.options !== undefined
}

export type CommandTreeResolution<T extends KResponse, O extends ParsedOptions> =
  | boolean
  | CommandHandlerWithEvents<T, O>
  | CodedError

export interface YargsParserFlags {
  configuration?: Partial<Yargs.Configuration>
  array?: string[]
  boolean?: string[]
  string?: string[]
  narg?: Record<string, number>
  alias?: Record<string, string[]>
}

/** a catch all handler is presented with an offer to handle a given argv */
export type CatchAllOffer = (argv: string[]) => boolean

export interface CatchAllHandler<T extends KResponse, O extends ParsedOptions> extends Command<T, O> {
  prio: number
  plugin: string // registered plugin
  offer: CatchAllOffer // does the handler accept the given command?
  eval: CommandHandler<T, O> // command evaluator
}

/**
 * The registrar.listen API
 *
 */
type CommandListener = <T extends KResponse, O extends ParsedOptions>(
  route: string,
  handler: CommandHandler<T, O>,
  options?: CommandOptions
) => Command<T, O>

export interface CommandRegistrar {
  find: <T extends KResponse, O extends ParsedOptions>(
    route: string,
    fromPlugin?: string,
    noOverride?: boolean
  ) => Promise<Command<T, O>>
  listen: CommandListener
  override: <T extends KResponse, O extends ParsedOptions>(
    route: string,
    fromPlugin: string,
    handler: CommandOverrideHandler<T, O>,
    options?: CommandOptions
  ) => Promise<Command<T, O>>
  synonym: <T extends KResponse, O extends ParsedOptions>(
    route: string,
    handler: CommandHandler<T, O>,
    master: Command<T, O>,
    options?: CommandOptions
  ) => void
  subtree: <T extends KResponse, O extends ParsedOptions>(route: string, options: CommandOptions) => Command<T, O>
  subtreeSynonym: <T extends KResponse, O extends ParsedOptions>(
    route: string,
    masterTree: Command<T, O>,
    options?: CommandOptions
  ) => void
  catchall: <T extends KResponse, O extends ParsedOptions>(
    offer: CatchAllOffer,
    handler: CommandHandler<T, O>,
    prio: number,
    options?: CommandOptions
  ) => void
}
