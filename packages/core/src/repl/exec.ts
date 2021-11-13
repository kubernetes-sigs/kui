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

/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * The Read-Eval-Print Loop (REPL)
 *
 */
import minimist from 'yargs-parser'
import Debug from 'debug'
const debug = Debug('core/repl')
const debugCommandErrors = Debug('core/repl/errors')

import { v4 as uuid } from 'uuid'

import isError from './error'
import encodeComponent from './encode'
import { splitIntoPipeStages } from './pipe-stages'
import { split, patterns, semiSplit } from './split'
import { RawContent, RawResponse, isRawResponse, MixedResponse, MixedResponsePart } from '../models/entity'
import { getHistoryForTab } from '../models/history'
import { Executor, ReplEval, DirectReplEval } from './types'
import { isMultiModalResponse } from '../models/mmr/is'
import { isNavResponse } from '../models/NavResponse'
import expandHomeDir from '../util/home'
import { CommandStartEvent, CommandCompleteEvent } from './events'

import {
  CommandLine,
  CommandTreeResolution,
  CommandHandlerWithEvents,
  EvaluatorArgs as Arguments,
  ExecType,
  KResponse,
  ParsedOptions,
  YargsParserFlags
} from '../models/command'

import REPL from '../models/repl'

import { ExecOptions, ExecOptionsWithUUID, DefaultExecOptions, DefaultExecOptionsForTab } from '../models/execOptions'
import eventChannelUnsafe, { eventBus } from '../core/events'
import { CodedError } from '../models/errors'
import { UsageModel, UsageRow } from '../core/usage-error'

import { isHeadless, hasLocalAccess } from '../core/capabilities'
import { promiseEach } from '../util/async'
import SymbolTable from '../core/symbol-table'

import { getModel } from '../commands/tree'
import { isSuccessfulCommandResolution } from '../commands/resolution'

import { Tab, getCurrentTab, getTabId, splitFor } from '../webapp/tab'
import { Block } from '../webapp/models/block'

import { Stream, Streamable } from '../models/streamable'
import enforceUsage from './enforce-usage'
import { isXtermResponse } from '../models/XtermResponse'

let currentEvaluatorImpl: ReplEval = new DirectReplEval()

export const setEvaluatorImpl = (impl: ReplEval): void => {
  debug('setting evaluator impl', impl.name)
  currentEvaluatorImpl = impl
}

/** trim the optional suffix e.g. --last [actionName] */
const stripTrailer = (str: string) => str && str.replace(/\s+.*$/, '')

/** turn --foo into foo and -f into f */
const unflag = (opt: string) => opt && stripTrailer(opt.replace(/^[-]+/, ''))

const emptyExecOptions = (): ExecOptions => new DefaultExecOptions()

function okIf404(err: CodedError) {
  if (err.code === 404) {
    return false
  } else {
    throw err
  }
}

/**
 * Find a matching command evaluator
 *
 */
async function lookupCommandEvaluator<T extends KResponse, O extends ParsedOptions>(
  argv: string[],
  execOptions: ExecOptions
): Promise<CommandTreeResolution<T, O>> {
  // first try treating options as binary
  const tryCatchalls = false
  const argvNoOptions = argv.filter((_, idx, A) => _.charAt(0) !== '-' && (idx === 0 || A[idx - 1].charAt(0) !== '-'))
  const evaluator = await getModel()
    .read<T, O>(argvNoOptions, execOptions, tryCatchalls)
    .catch(okIf404)

  if (!isSuccessfulCommandResolution(evaluator)) {
    // then try treating options as unary
    const tryCatchalls2 = false
    const argvNoOptions2 = argv.filter(_ => _.charAt(0) !== '-')
    const evaluator2 = await getModel()
      .read<T, O>(argvNoOptions2, execOptions, tryCatchalls2)
      .catch(okIf404)
    if (isSuccessfulCommandResolution(evaluator2)) {
      return evaluator2
    } else {
      const tryCatchalls3 = true
      const evaluator3 = await getModel().read<T, O>(argvNoOptions, execOptions, tryCatchalls3)
      if (isSuccessfulCommandResolution(evaluator3)) {
        return evaluator3
      }
    }
  }

  return evaluator
}

interface CommandEvaluationError extends CodedError {
  kind: 'commandresolution'
}

/**
 * Execute the given command-line directly in this process
 *
 */
class InProcessExecutor implements Executor {
  public name = 'InProcessExecutor'

  private loadSymbolTable(tab: Tab, execOptions: ExecOptions) {
    if (!isHeadless()) {
      const curDic = SymbolTable.read(tab)
      if (typeof curDic !== 'undefined') {
        if (!execOptions.env) {
          execOptions.env = {}
        }
        execOptions.env = Object.assign({}, execOptions.env, curDic)
      }
    }
  }

  /** Add a history entry */
  private pushHistory(command: string, execOptions: ExecOptions, tab: Tab): number | void {
    if (!execOptions || !execOptions.noHistory) {
      if (!execOptions || !execOptions.quiet) {
        if (!execOptions || execOptions.type !== ExecType.Nested) {
          const historyModel = getHistoryForTab(tab.uuid)
          return (execOptions.history = historyModel.add({
            raw: command
          }))
        }
      }
    }
  }

  /** Update a history entry with the response */
  /* private updateHistory(cursor: number, endEvent: CommandCompleteEvent) {
    getHistoryForTab(endEvent.tab.uuid).update(cursor, async line => {
      const resp = await endEvent.response
      if (!isHTML(resp) && !isReactResponse(resp)) {
        try {
          JSON.stringify(resp)
          line.response = resp
          line.execUUID = endEvent.execUUID
          line.historyIdx = endEvent.historyIdx
          line.responseType = endEvent.responseType
        } catch (err) {
          debug('non-serializable response', resp)
        }
      }
    })
  } */

  /** Notify the world that a command execution has begun */
  private emitStartEvent(startEvent: CommandStartEvent) {
    eventBus.emitCommandStart(startEvent)
  }

  /** Notify the world that a command execution has finished */
  private emitCompletionEvent<T extends KResponse, O extends ParsedOptions>(
    presponse: T | Promise<T>,
    endEvent: Omit<CommandCompleteEvent, 'response' | 'responseType' | 'historyIdx'>,
    historyIdx?: number
  ) {
    return Promise.resolve(presponse).then(response => {
      const responseType = isMultiModalResponse(response)
        ? ('MultiModalResponse' as const)
        : isNavResponse(response)
        ? ('NavResponse' as const)
        : ('ScalarResponse' as const)

      const fullEvent = Object.assign(endEvent, { response, responseType, historyIdx })
      eventBus.emitCommandComplete(fullEvent)

      /* if (historyIdx) {
        this.updateHistory(historyIdx, fullEvent)
      } */
    })
  }

  /**
   * Split an `argv` into a pair of `argvNoOptions` and `ParsedOptions`.
   *
   */
  private parseOptions<T extends KResponse, O extends ParsedOptions>(
    argv: string[],
    evaluator: CommandHandlerWithEvents<T, O>
  ): { argvNoOptions: string[]; parsedOptions: O } {
    /* interface ArgCount {
          [key: string]: number
        } */
    //
    // fetch the usage model for the command
    //
    const _usage: UsageModel = evaluator.options && evaluator.options.usage
    const usage: UsageModel = _usage && _usage.fn ? _usage.fn(_usage.command) : _usage
    // debug('usage', usage)

    /* if (execOptions && execOptions.failWithUsage && !usage) {
          debug('caller needs usage model, but none exists for this command', evaluator)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (false as any) as T
        } */

    const builtInOptions: UsageRow[] = [{ name: '--quiet', alias: '-q', hidden: true, boolean: true }]
    if (!usage || !usage.noHelp) {
      // usage might tell us not to add help, or not to add the -h help alias
      const help: { name: string; hidden: boolean; boolean: boolean; alias?: string } = {
        name: '--help',
        hidden: true,
        boolean: true
      }
      if (!usage || !usage.noHelpAlias) {
        help.alias = '-h'
      }
      builtInOptions.push(help)
    }

    // here, we encode some common aliases, and then overlay any flags from the command
    // narg: any flags that take more than one argument e.g. -p key value would have { narg: { p: 2 } }
    const commandFlags: YargsParserFlags =
      (evaluator.options && evaluator.options.flags) ||
      (evaluator.options &&
        evaluator.options.synonymFor &&
        evaluator.options.synonymFor.options &&
        evaluator.options.synonymFor.options.flags) ||
      ({} as YargsParserFlags)
    const optional = builtInOptions.concat(
      (evaluator.options && evaluator.options.usage && evaluator.options.usage.optional) || []
    )
    const optionalBooleans = optional && optional.filter(({ boolean }) => boolean).map(_ => unflag(_.name))

    interface CanonicalArgs {
      [key: string]: string
    }
    const optionalAliases =
      optional &&
      optional
        .filter(({ alias }) => alias)
        .reduce((M: CanonicalArgs, { name, alias }) => {
          M[unflag(alias)] = unflag(name)
          return M
        }, {})

    const allFlags = {
      configuration: Object.assign(
        { 'camel-case-expansion': false },
        (evaluator.options && evaluator.options.flags && evaluator.options.flags.configuration) ||
          (usage && usage.configuration) ||
          {}
      ),
      string: commandFlags.string || [],
      array: commandFlags.array || [],
      boolean: (commandFlags.boolean || []).concat(optionalBooleans || []),
      alias: Object.assign({}, commandFlags.alias || {}, optionalAliases || {}),
      narg: Object.assign(
        {},
        commandFlags.narg || {}, // narg from registrar.listen(route, handler, { flags: { narg: ... }})
        (optional &&
          optional.reduce((N, { name, alias, narg }) => {
            // narg from listen(route, handler, { usage: { optional: [...] }})
            if (narg) {
              N[unflag(name)] = narg
              N[unflag(alias)] = narg
            }
            return N
          }, {} as Record<string, number>)) ||
          {}
      )
    }

    const parsedOptions = (minimist(argv, allFlags) as any) as O
    const argvNoOptions: string[] = parsedOptions._

    return { argvNoOptions, parsedOptions }
  }

  private async execUnsafe<T extends KResponse, O extends ParsedOptions>(
    commandUntrimmed: string,
    execOptions = emptyExecOptions()
  ): Promise<T | CodedError<number> | HTMLElement | MixedResponse | CommandEvaluationError> {
    const startTime = Date.now()
    const tab = execOptions.tab || getCurrentTab()

    const execType = (execOptions && execOptions.type) || ExecType.TopLevel
    const REPL = tab.REPL || getImpl(tab)

    // trim suffix comments, e.g. "kubectl get pods # comments start here"
    // insert whitespace for whitespace-free prefix comments, e.g. "#comments" -> "# comments"
    let command = (commandUntrimmed || '')
      .trim()
      .replace(patterns.suffixComments, '$1')
      .replace(patterns.prefixComments, '# $1')
    const argv = split(command)

    // pipeline splits, e.g. if command='a b|c', the pipeStages=[['a','b'],'c']
    const pipeStages = splitIntoPipeStages(command)

    // debug('command', commandUntrimmed)
    const evaluator = await lookupCommandEvaluator<T, O>(argv, execOptions)
    if (isSuccessfulCommandResolution(evaluator)) {
      // If core handles redirect, argv and command shouldn't contain the redirect part;
      // otherwise, controllers may use argv and command incorrectly e.g. kuiecho hi > file will print "hi > file" instead of "hi"
      const noCoreRedirect = execOptions.noCoreRedirect || (evaluator.options && evaluator.options.noCoreRedirect)
      const originalCommand = command
      if (!noCoreRedirect && pipeStages.redirect) {
        argv.splice(argv.indexOf(pipeStages.redirector), 2)
        command = command.replace(new RegExp(`\\s*${pipeStages.redirector}\\s*${pipeStages.redirect}\\s*$`), '')
      }

      const { argvNoOptions, parsedOptions } = this.parseOptions(argv, evaluator)

      if (evaluator.options && evaluator.options.requiresLocal && !hasLocalAccess()) {
        debug('command does not work in a browser')
        const err = new Error('Command requires local access') as CommandEvaluationError
        err.code = 406 // http not acceptable
        err.kind = 'commandresolution'
        return err
      }

      // if we don't have a head (yet), but this command requires one,
      // then ask for a head and try again. note that we ignore this
      // needsUI constraint if the user is asking for help
      if (
        isHeadless() &&
        !parsedOptions.cli &&
        !(parsedOptions.h || parsedOptions.help) &&
        ((process.env.DEFAULT_TO_UI && !parsedOptions.cli) || (evaluator.options && evaluator.options.needsUI))
      ) {
        import('../main/headless').then(({ createWindow }) =>
          createWindow(argv, evaluator.options.fullscreen, evaluator.options, true)
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (true as any) as T
      }

      const execUUID = execOptions.execUUID || uuid()
      execOptions.execUUID = execUUID
      const evaluatorOptions = evaluator.options

      // are we asked to redirect the output to a file?
      const redirectDesired = !noCoreRedirect && !!pipeStages.redirect

      this.emitStartEvent({
        tab,
        route: evaluator.route,
        startTime,
        command: commandUntrimmed,
        redirectDesired,
        pipeStages,
        evaluatorOptions,
        execType,
        execUUID,
        execOptions,
        echo: execOptions.echo
      })

      if (command.length === 0) {
        // blank line (after stripping off comments)
        this.emitCompletionEvent(true, {
          tab,
          execType,
          completeTime: Date.now(),
          command: commandUntrimmed,
          argvNoOptions,
          parsedOptions,
          pipeStages,
          execOptions,
          execUUID,
          cancelled: true,
          echo: execOptions.echo,
          evaluatorOptions
        })
        return
      }

      const historyIdx = isHeadless() ? -1 : this.pushHistory(originalCommand, execOptions, tab)

      try {
        enforceUsage(argv, evaluator, execOptions)
      } catch (err) {
        debug('usage enforcement failure', err, execType === ExecType.Nested)
        this.emitCompletionEvent(
          err,
          {
            tab,
            execType,
            completeTime: Date.now(),
            command: commandUntrimmed,
            argvNoOptions,
            parsedOptions,
            pipeStages,
            execOptions,
            cancelled: false,
            echo: execOptions.echo,
            execUUID,
            evaluatorOptions
          },
          historyIdx || -1
        )

        if (execOptions.type === ExecType.Nested) {
          throw err
        } else {
          return
        }
      }

      this.loadSymbolTable(tab, execOptions)

      const args: Arguments<O> = {
        tab,
        REPL,
        block: execOptions.block,
        nextBlock: undefined,
        argv,
        command,
        execOptions,
        argvNoOptions,
        pipeStages,
        parsedOptions: parsedOptions as O,
        createErrorStream: execOptions.createErrorStream || (() => this.makeStream(getTabId(tab), execUUID, 'stderr')),
        createOutputStream: execOptions.createOutputStream || (() => this.makeStream(getTabId(tab), execUUID, 'stdout'))
      }

      // COMMAND EXECUTION ABOUT TO COMMENCE. This is where we
      // actually execute the command line and populate this
      // `response` variable:
      let response: T | Promise<T> | MixedResponse
      const commands = evaluatorOptions.semiExpand === false ? [] : semiSplit(command)
      if (commands.length > 1) {
        // e.g. "a ; b ; c"
        response = await semicolonInvoke(commands, execOptions)
      } else {
        // e.g. just "a" or "a > /tmp/foo"
        try {
          response = await Promise.resolve(
            currentEvaluatorImpl.apply<T, O>(commandUntrimmed, execOptions, evaluator, args)
          ).then(response => {
            // indicate that the command was successfuly completed
            evaluator.success({
              tab,
              type: (execOptions && execOptions.type) || ExecType.TopLevel,
              isDrilldown: execOptions.isDrilldown,
              command,
              parsedOptions
            })

            return response
          })
        } catch (err) {
          debugCommandErrors(err)
          evaluator.error(command, tab, execType, err)
          if (execType === ExecType.Nested || execOptions.rethrowErrors) {
            throw err
          }
          response = err
        }

        if (evaluator.options.viewTransformer && execType !== ExecType.Nested) {
          response = await Promise.resolve(response)
            .then(async _ => {
              const maybeAView = await evaluator.options.viewTransformer(args, _)
              return maybeAView || _
            })
            .catch(err => {
              // view transformer failed; treat this as the response to the user
              return err
            })
        }

        // the || true part is a safeguard for cases where typescript
        // didn't catch a command handler returning nothing; it
        // shouldn't happen, but probably isn't a sign of a dire
        // problem. issue a debug warning, in any case
        if (!response) {
          debug('warning: command handler returned nothing', commandUntrimmed)
        }
      }

      // Here is where we handle redirecting the response to a file
      if (redirectDesired && !isError(await response)) {
        try {
          await redirectResponse(response, pipeStages.redirect, pipeStages.redirector)

          // mimic "no response", now that we've successfully
          // redirected the response to a file
          response = true as T
        } catch (err) {
          response = err
        }
      }

      this.emitCompletionEvent(
        response || true,
        {
          tab,
          execType,
          completeTime: Date.now(),
          command: commandUntrimmed,
          argvNoOptions,
          parsedOptions,
          pipeStages,
          execUUID,
          cancelled: false,
          echo: execOptions.echo,
          evaluatorOptions,
          execOptions
        },
        historyIdx || -1
      )

      return response
    } else {
      const err = new Error('Command not found') as CommandEvaluationError
      err.code = 404 // http not acceptable
      err.kind = 'commandresolution'
      return err
    }
  }

  public async exec<T extends KResponse, O extends ParsedOptions>(
    commandUntrimmed: string,
    execOptions = emptyExecOptions()
  ): Promise<T | CodedError<number> | HTMLElement | MixedResponse | CommandEvaluationError> {
    try {
      return await this.execUnsafe(commandUntrimmed, execOptions)
    } catch (err) {
      if (execOptions.type !== ExecType.Nested && !execOptions.rethrowErrors) {
        console.error('Internal Error: uncaught exception in exec', err)
        return err
      } else {
        throw err
      }
    }
  }

  private async makeStream(tabUUID: string, execUUID: string, which: 'stdout' | 'stderr'): Promise<Stream> {
    if (isHeadless()) {
      const { streamTo: headlessStreamTo } = await import('../main/headless-support')
      return headlessStreamTo(which)
    } else {
      const stream = (response: Streamable) =>
        new Promise<void>(resolve => {
          eventChannelUnsafe.once(`/command/stdout/done/${tabUUID}/${execUUID}`, () => {
            resolve()
          })
          eventChannelUnsafe.emit(`/command/stdout/${tabUUID}/${execUUID}`, response)
        })
      return Promise.resolve(stream)
    }
  }
} /* InProcessExecutor */

/**
 * Execute the given command-line. This function operates by
 * delegation to the IExecutor impl.
 *
 */
let currentExecutorImpl: Executor = new InProcessExecutor()
export const exec = (commandUntrimmed: string, execOptions = emptyExecOptions()) => {
  return currentExecutorImpl.exec(commandUntrimmed, execOptions)
}

/**
 * User hit enter in the REPL
 *
 * @param execUUID for command re-execution
 *
 */
export const doEval = (_tab: Tab, block: Block, command: string, execUUID?: string) => {
  const tab = splitFor(_tab)
  const defaultExecOptions = new DefaultExecOptionsForTab(tab, block, execUUID)
  const execOptions: ExecOptions = !execUUID
    ? defaultExecOptions
    : Object.assign(defaultExecOptions, { type: ExecType.Rerun })

  return exec(command, execOptions)
}

/**
 * If, while evaluating a command, it needs to evaluate a sub-command...
 *
 */
export const qexec = <T extends KResponse>(
  command: string,
  block?: HTMLElement | boolean,
  contextChangeOK?: boolean,
  execOptions?: ExecOptions,
  nextBlock?: HTMLElement
): Promise<T> => {
  return exec(
    command,
    Object.assign(
      {
        block,
        nextBlock,
        noHistory: true,
        contextChangeOK
      },
      execOptions,
      {
        type: ExecType.Nested
      }
    )
  ) as Promise<T>
}
export const qfexec = (
  command: string,
  block?: HTMLElement,
  nextBlock?: HTMLElement,
  execOptions?: ExecOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  // context change ok, final exec in a chain of nested execs
  return qexec(command, block, true, execOptions, nextBlock)
}

/**
 * "raw" exec, where we want the data model back directly
 *
 */
export const rexec = async <Raw extends RawContent>(
  command: string,
  execOptions = emptyExecOptions()
): Promise<RawResponse<Raw>> => {
  const content = await qexec<Raw | RawResponse<Raw>>(
    command,
    undefined,
    undefined,
    Object.assign({ raw: true }, execOptions)
  )

  if (isRawResponse(content)) {
    return content
  } else {
    // bad actors may return a string; adapt this to RawResponse
    return {
      mode: 'raw',
      content
    }
  }
}

/**
 * Evaluate a command and place the result in the current active view for the given tab
 *
 */
export const reexec = <T extends KResponse>(command: string, execOptions: ExecOptionsWithUUID): Promise<T> => {
  return exec(command, Object.assign({ echo: true, type: ExecType.Rerun }, execOptions)) as Promise<T>
}

/**
 * Programmatic exec, as opposed to human typing and hitting enter
 *
 */
export const pexec = <T extends KResponse>(command: string, execOptions?: ExecOptions): Promise<T> => {
  return exec(command, Object.assign({ echo: true, type: ExecType.ClickHandler }, execOptions)) as Promise<T>
}

/**
 * Execute a command in response to an in-view click
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
export async function click(command: string | (() => Promise<string>), evt: MouseEvent): Promise<void> {}

/**
 * Update the executor impl
 *
 */
export const setExecutorImpl = (impl: Executor): void => {
  currentExecutorImpl = impl
}

/**
 * If the command is semicolon-separated, invoke each element of the
 * split separately
 *
 */
async function semicolonInvoke(commands: string[], execOptions: ExecOptions): Promise<MixedResponse> {
  debug('semicolonInvoke', commands)

  const nonEmptyCommands = commands.filter(_ => _)

  const result: MixedResponse = await promiseEach(nonEmptyCommands, async command => {
    try {
      const entity = await qexec<MixedResponsePart | true>(
        command,
        undefined,
        undefined,
        Object.assign({}, execOptions, { quiet: false, /* block, */ execUUID: execOptions.execUUID })
      )

      if (entity === true) {
        // pty output
        return ''
      } else {
        return entity
      }
    } catch (err) {
      return err.message
    }
  })

  return result
}

/**
 * @return an instance that obeys the REPL interface
 *
 */
export function getImpl(tab: Tab): REPL {
  const impl = { qexec, rexec, pexec, reexec, click, encodeComponent, split } as REPL
  tab.REPL = impl
  return impl
}

/**
 * redirect a string response
 *
 */
async function redirectResponse<T extends KResponse>(
  _response: MixedResponse | T | Promise<T>,
  filepath: string,
  redirector: CommandLine['pipeStages']['redirector']
) {
  const response = await _response

  if (Buffer.isBuffer(response) || typeof response === 'string' || isXtermResponse(response)) {
    try {
      const data = isXtermResponse(response) ? response.rows.map(i => i.map(j => j.innerText)).join(' ') : response
      const writeOptions = redirector === '>>' ? '--append' : ''
      await rexec<{ data: string }>(`vfs fwrite ${encodeComponent(expandHomeDir(filepath))} ${writeOptions}`, { data })

      debug(`redirected response to ${filepath}`)
    } catch (err) {
      console.error(err)
      throw new Error(`Error in redirect: ${err.message}`)
    }
  } else {
    debug('Unsupported redirect response', response)
    throw new Error('Error: unsupported redirect response')
  }
}
