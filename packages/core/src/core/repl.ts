/*
 * Copyright 2017-19 IBM Corporation
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

/**
 * The Read-Eval-Print Loop (REPL)
 *
 */

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import * as Debug from 'debug'
const debug = Debug('core/repl')
debug('loading')

import {
  CommandTreeResolution,
  ExecType,
  Evaluator,
  EvaluatorArgs,
  ParsedOptions,
  YargsParserFlags,
  Response
} from '../models/command'

import { ElementMimic } from '../util/mimic-dom'
import { isEntitySpec, EntitySpec, isLowLevelLoop, MixedResponse, MixedResponsePart } from '../models/entity'
import { ExecOptions, DefaultExecOptions, DefaultExecOptionsForTab } from '../models/execOptions'
import eventBus from './events'
import historyModel from '../models/history'
import { CodedError } from '../models/errors'
import * as commandTree from './command-tree'
import { UsageError, UsageModel, UsageRow } from './usage-error'

import { isHeadless, hasLocalAccess, hasAuth as hasAuthCapability } from './capabilities'
import { streamTo as headlessStreamTo } from '../main/headless-support' // FIXME
import { isHTML } from '../util/types'
import { promiseEach } from '../util/async'
import SymbolTable from './symbol-table'

import * as cli from '../webapp/cli'

import * as minimist from 'yargs-parser'

debug('finished loading modules')

/**
 * repl.exec, and the family repl.qexec, repl.pexec, etc. are all
 * backed by an implementation of this interface
 *
 */
export interface Executor {
  name: string
  exec(commandUntrimmed: string, execOptions: ExecOptions)
}

/**
 * Apply the given evaluator to the given arguments
 *
 */
export interface ReplEval {
  name: string
  apply(
    commandUntrimmed: string,
    execOptions: ExecOptions,
    evaluator: Evaluator,
    args: EvaluatorArgs
  ): Response | Promise<Response>
}

/**
 * Directly apply the given evaluator to the given arguments. This is
 * the default evaluator implementation.
 *
 */
export class DirectReplEval implements ReplEval {
  name = 'DirectReplEval'

  apply(commandUntrimmed: string, execOptions: ExecOptions, evaluator: Evaluator, args: EvaluatorArgs) {
    return evaluator.eval(args)
  }
}
let currentEvaluatorImpl: ReplEval = new DirectReplEval()

export const setEvaluatorImpl = (impl: ReplEval): void => {
  debug('setting evaluator impl', impl.name)
  currentEvaluatorImpl = impl
}

/**
 * do we have authentication? we don't cache this, to keep things
 * simpler; the check should be (and please should remain) cheap
 *
 */
let forceNoAuth = false
export const setNoAuth = () => {
  forceNoAuth = true
}
export const hasAuth = async () => {
  if (forceNoAuth) {
    return false
  } else {
    // for historical reasons, the default auth scheme is openwhisk;
    // this will change
    return hasAuthCapability('openwhisk')
  }
}

export const init = (prefs = {}) => {
  debug('init')
  return cli.init(prefs)
}

const patterns = {
  commentLine: /\s+#.*$/,
  dash: /-([^\s]*)/,
  whitespace: /\s/
}

/**
 * Escape the given value so that it is compatible with command line execution
 *
 */
const escape = (str: string) => str.replace(patterns.dash, "'-$1'")

/**
 * Resolve the given string as a possible reference to an environment
 * variable; e.g. $FOO should resolve to 3 if process.env.FOO has
 * value 3.
 *
 */
const resolveEnvVar = (variable: string): string => {
  const envValue = process.env[variable.substring(1)]
  return envValue ? escape(envValue) : variable
}

/**
 * Split the given string into an argv
 *
 */
export interface Split {
  A: string[]
  endIndices: number[]
}
export const _split = (
  str: string,
  removeOuterQuotes = true,
  returnIndices = false,
  removeInlineOuterQuotes = false
): Split | string[] => {
  const A: string[] = []
  const endIndices: number[] = []
  const stack: string[] = []

  let cur = ''

  const endsWithQuoteSpace = (idx: number, lookFor: string): boolean => {
    for (let ii = idx + 1; ii < str.length; ii++) {
      if (str.charAt(ii) === lookFor) {
        return ii === str.length - 1 || /\s/.test(str.charAt(ii + 1))
      }
    }

    return false
  }

  const removedLastOpenQuote: boolean[] = []
  let escapeActive = false
  for (let idx = 0; idx < str.length; idx++) {
    const char = str.charAt(idx)

    if (char === '\\') {
      if (!escapeActive) {
        escapeActive = true
      } else {
        escapeActive = false
        cur += '\\'
      }

      continue
    } else if (!escapeActive) {
      escapeActive = false
    }

    if (stack.length === 0 && !escapeActive && patterns.whitespace.test(char)) {
      if (cur.length > 0) {
        A.push(resolveEnvVar(cur))
        endIndices.push(idx)
        cur = ''
      }
      continue
    }

    const last = stack.length > 0 && stack[stack.length - 1]

    if (char === '{') {
      stack.push(char)
    } else if (char === '}' && last === '{') {
      stack.pop()
    }

    if (!escapeActive && (char === "'" || char === '"')) {
      if (char === last) {
        // found matching close quote
        stack.pop()
        const removedLast = removedLastOpenQuote.pop()

        if (stack.length > 0 || !removedLast) {
          // add the outer quotes?
          cur += char
        }
      } else {
        // found open quote
        const removeQuote =
          removeOuterQuotes &&
          endsWithQuoteSpace(idx, char) &&
          (idx === 0 ||
            (stack.length === 0 && (removeInlineOuterQuotes || patterns.whitespace.test(str.charAt(idx - 1)))))

        removedLastOpenQuote.push(removeQuote)

        if (stack.length > 0 || !removeQuote) {
          // add the outer quotes?
          cur += char
        }

        stack.push(char)
      }
    } else {
      // not a quote
      cur += char
    }
  }

  if (cur.length > 0) {
    A.push(resolveEnvVar(cur))
    endIndices.push(str.length)
  }

  if (returnIndices) {
    return { A, endIndices }
  } else {
    return A
  }
}
export const split = (str: string, removeOuterQuotes = true, removeInlineOuterQuotes = false): string[] => {
  return _split(str, removeOuterQuotes, undefined, removeInlineOuterQuotes) as string[]
}

/** an empty promise, for blank lines */
const emptyPromise = () => {
  const emptyPromise = Promise.resolve({ blank: true })
  return emptyPromise
}

/** trim the optional suffix e.g. --last [actionName] */
const stripTrailer = (str: string) => str && str.replace(/\s+.*$/, '')

/** turn --foo into foo and -f into f */
const unflag = (opt: string) => opt && stripTrailer(opt.replace(/^[-]+/, ''))

/**
 * How to handle errors in command execution? Headless might want to
 * override the graphical default
 *
 */
type OopsHandler = (block: HTMLElement, nextBlock: HTMLElement) => (err: Error) => void
let oopsHandler: OopsHandler
export const installOopsHandler = (fn: OopsHandler) => {
  debug('installing oops handler')
  oopsHandler = fn
}
const oops = (command?: string, block?: HTMLElement, nextBlock?: HTMLElement) => (err: Error) => {
  if (oopsHandler) {
    debug('invoking registered oops handler')
    return oopsHandler(block, nextBlock)(err)
  } else {
    return cli.oops(command, block, nextBlock)(err)
  }
}

const emptyExecOptions = (): ExecOptions => new DefaultExecOptions()

/**
 * Execute the given command-line directly in this process
 *
 */
class InProcessExecutor implements Executor {
  name = 'InProcessExecutor'

  async exec(commandUntrimmed: string, execOptions = emptyExecOptions()) {
    const tab = execOptions.tab || cli.getCurrentTab()

    if (!isHeadless()) {
      const curDic = SymbolTable.read(tab)
      if (typeof curDic !== 'undefined') {
        if (!execOptions.env) {
          execOptions.env = {}
        }
        execOptions.env = Object.assign({}, execOptions.env, curDic)
      }
    }

    const echo = !execOptions || execOptions.echo !== false
    const nested = execOptions && execOptions.noHistory && !execOptions.replSilence
    if (nested) execOptions.nested = nested

    const block = (execOptions && execOptions.block) || cli.getCurrentBlock(tab)
    const blockParent = block && block.parentNode // remember this one, in case the command removes block from its parent
    const prompt = block && cli.getPrompt(block)

    // maybe execOptions has been attached to the prompt dom (e.g. see repl.partial)
    if (!execOptions) execOptions = prompt['execOptions']
    if (execOptions && execOptions.pip) {
      const { container, returnTo } = execOptions.pip
      try {
        const { drilldown } = await import('../webapp/picture-in-picture') // FIXME
        return drilldown(tab, commandUntrimmed, undefined, document.querySelector(container), returnTo)()
      } catch (err) {
        console.error(err as Error)
        // fall through to normal execution, if pip fails
      }
    }

    // clone the current block so that we have one for the next
    // prompt, when we're done evaluating the current command
    let nextBlock: HTMLElement
    if (!execOptions || (!execOptions.noHistory && echo)) {
      // this is a top-level exec
      cli.unlisten(prompt)
      nextBlock = (execOptions && execOptions.nextBlock) || (block.cloneNode(true) as HTMLElement)

      // since we cloned it, make sure it's all cleaned out
      nextBlock.querySelector('input').value = ''
      // nextBlock.querySelector('input').setAttribute('placeholder', 'enter your command')
    } else {
      // qfexec with nextBlock, see rm plugin
      nextBlock = execOptions && execOptions.nextBlock
    }

    if (nextBlock) {
      // remove any .repl-temporary that might've come along for the
      // ride when we cloned the current block
      cli.removeAnyTemps(nextBlock)
    }

    // blank line, after removing comments?
    const command = commandUntrimmed.trim().replace(patterns.commentLine, '')
    if (!command) {
      if (block) {
        cli.setStatus(block, 'valid-response')
        cli.installBlock(blockParent, block, nextBlock)()
      }
      return emptyPromise()
    }

    if (execOptions && execOptions.echo && prompt) {
      // this is a programmatic exec, so make the command appear in the console
      prompt.value = commandUntrimmed
    }

    try {
      if (block && !nested && echo) {
        cli.setStatus(block, 'processing')
        prompt.readOnly = true
      }

      const argv = split(command)
      // debug('split', command, argv)

      if (argv.length === 0) {
        if (block) {
          cli.setStatus(block, 'valid-response')
          cli.installBlock(blockParent, block, nextBlock)()
        }
        return emptyPromise()
      }

      // add a history entry
      if (!execOptions || !execOptions.noHistory) {
        if (!execOptions || !execOptions.quiet) {
          execOptions.history = historyModel.add({
            raw: command
          })
        }
      }

      // the Read part of REPL
      const argvNoOptions = argv.filter(_ => _.charAt(0) !== '-')
      const evaluator: CommandTreeResolution = await (execOptions && execOptions.intentional
        ? commandTree.readIntention(argvNoOptions)
        : commandTree.read(argvNoOptions, false, false, execOptions))

      if (commandTree.isSuccessfulCommandResolution(evaluator)) {
        //
        // fetch the usage model for the command
        //
        const _usage: UsageModel = evaluator.options && evaluator.options.usage
        const usage: UsageModel = _usage && _usage.fn ? _usage.fn(_usage.command) : _usage
        // debug('usage', usage)

        if (execOptions && execOptions.failWithUsage && !usage) {
          debug('caller needs usage model, but none exists for this command', evaluator)
          return false
        }

        const builtInOptions: UsageRow[] = [{ name: '--quiet', alias: '-q', hidden: true, boolean: true }]
        if (!usage || !usage.noHelp) {
          // usage might tell us not to add help, or not to add the -h help alias
          const help = { name: '--help', hidden: true, boolean: true }
          if (!usage || !usage.noHelpAlias) {
            help['alias'] = '-h'
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

        interface ArgCount {
          [key: string]: number
        }
        const allFlags = {
          configuration: Object.assign({ 'camel-case-expansion': false }, (usage && usage.configuration) || {}),
          boolean: (commandFlags.boolean || []).concat(optionalBooleans || []),
          alias: Object.assign({}, commandFlags.alias || {}, optionalAliases || {}),
          narg:
            optional &&
            optional.reduce((N: ArgCount, { name, alias, narg }) => {
              if (narg) {
                N[unflag(name)] = narg
                N[unflag(alias)] = narg
              }
              return N
            }, {})
        }

        // now use minimist to parse the command line options
        // minimist stores the residual, non-opt, args in _
        const parsedOptions: ParsedOptions = minimist(argv, allFlags)
        const argvNoOptions: string[] = parsedOptions._

        //
        // if the user asked for help, and the plugin registered a
        // usage model, we can service that here, without having
        // to involve the plugin. this lets us avoid having each
        // plugin check for options.help
        //
        if ((!usage || !usage.noHelp) && parsedOptions.help && evaluator.options && evaluator.options.usage) {
          if (execOptions && execOptions.failWithUsage) {
            return evaluator.options.usage
          } else {
            return oops(command, block, nextBlock)(new UsageError({ usage: evaluator.options.usage }))
          }
        }

        //
        // here is where we enforce the usage model
        //
        if (usage && usage.strict) {
          // strict: command wants *us* to enforce conformance
          // required and optional parameters
          const { strict: cmd, onlyEnforceOptions = false, required = [], oneof = [], optional: _optional = [] } = usage
          const optLikeOneOfs: UsageRow[] = oneof.filter(({ command, name = command }) => name.charAt(0) === '-') // some one-ofs might be of the form --foo
          const positionalConsumers = _optional.filter(
            ({ name, alias, consumesPositional }) =>
              consumesPositional && (parsedOptions[unflag(name)] || parsedOptions[unflag(alias)])
          )
          const optional = builtInOptions.concat(_optional).concat(optLikeOneOfs)
          const positionalOptionals = optional.filter(({ positional }) => positional)
          const nPositionalOptionals = positionalOptionals.length

          // just introducing a shorter variable name, here
          const args = argvNoOptions
          const nPositionalsConsumed = positionalConsumers.length
          const nRequiredArgs = required.length + (oneof.length > 0 ? 1 : 0) - nPositionalsConsumed
          const optLikeActuals = optLikeOneOfs.filter(
            ({ name, alias = '' }) =>
              Object.prototype.hasOwnProperty.call(parsedOptions, unflag(name)) ||
              Object.prototype.hasOwnProperty.call(parsedOptions, unflag(alias))
          )
          const nOptLikeActuals = optLikeActuals.length
          const cmdArgsStart = args.indexOf(cmd)
          const nActualArgs = args.length - cmdArgsStart - 1 + nOptLikeActuals

          // did the user pass an unsupported optional parameter?
          for (const optionalArg in parsedOptions) {
            // skip over minimist's _
            if (optionalArg === '_' || parsedOptions[optionalArg] === false) {
              // minimist nonsense
              continue
            }

            // should we enforce this option?
            const enforceThisOption =
              onlyEnforceOptions === undefined || typeof onlyEnforceOptions === 'boolean'
                ? true
                : !!onlyEnforceOptions.find(_ => _ === `-${optionalArg}` || _ === `--${optionalArg}`)

            if (!enforceThisOption) {
              // then neither did the spec didn't mention anything about enforcement (!onlyEnforceOptions)
              // nor did the spec said only to enforce options, but enforce them all (onlyEnforceOptions === true)
              // nor did the spec enumerated options to enforce, and this is one of them
              continue
            }

            // find a matching declared optional arg
            const match = optional.find(({ name, alias }) => {
              return (
                stripTrailer(alias) === `-${optionalArg}` ||
                stripTrailer(name) === `-${optionalArg}` ||
                stripTrailer(name) === `--${optionalArg}`
              )
            })

            if (!match) {
              //
              // then the user passed an option, but the command doesn't accept it
              //
              debug('unsupported optional paramter', optionalArg)

              const message = `Unsupported optional parameter ${optionalArg}`
              const err = new UsageError({ message, usage })
              err.code = 499
              debug(message, args, parsedOptions, optional, argv) // args is argv with options stripped
              if (execOptions && execOptions.failWithUsage) {
                return err
              } else {
                return oops(command, block, nextBlock)(err)
              }
            } else if (
              (match.boolean && typeof parsedOptions[optionalArg] !== 'boolean') ||
              (match.file && typeof parsedOptions[optionalArg] !== 'string') ||
              (match.booleanOK &&
                !(typeof parsedOptions[optionalArg] === 'boolean' || typeof parsedOptions[optionalArg] === 'string')) ||
              (match.numeric && typeof parsedOptions[optionalArg] !== 'number') ||
              (match.narg > 1 && !Array.isArray(parsedOptions[optionalArg])) ||
              (!match.boolean &&
                !match.booleanOK &&
                !match.numeric &&
                (!match.narg || match.narg === 1) &&
                !(
                  typeof parsedOptions[optionalArg] === 'string' ||
                  typeof parsedOptions[optionalArg] === 'number' ||
                  typeof parsedOptions[optionalArg] === 'boolean'
                )) ||
              // is the given option not one of the allowed options
              (match.allowed &&
                !match.allowed.find(
                  _ =>
                    _ === parsedOptions[optionalArg] ||
                    _ === '...' ||
                    (match.allowedIsPrefixMatch && parsedOptions[optionalArg].toString().indexOf(_.toString()) === 0)
                ))
            ) {
              //
              // then the user passed an option, but of the wrong type
              //
              debug('bad value for option', optionalArg, match, parsedOptions, args, allFlags)

              const expectedMessage = match.boolean
                ? ', expected boolean'
                : match.numeric
                ? ', expected a number'
                : match.file
                ? ', expected a file path'
                : ''

              const message = `Bad value for option ${optionalArg}${expectedMessage}${
                typeof parsedOptions[optionalArg] === 'boolean' ? '' : ', got ' + parsedOptions[optionalArg]
              }${match.allowed ? ' expected one of: ' + match.allowed.join(', ') : ''}`
              const error = new UsageError({ message, usage })
              debug(message, match)
              error.code = 498
              if (execOptions && execOptions.failWithUsage) {
                return error
              } else {
                return oops(command, block, nextBlock)(error)
              }
            }
          }

          //
          // user passed an incorrect number of positional parameters?
          //
          if (!onlyEnforceOptions && nActualArgs !== nRequiredArgs) {
            // it's ok if we have nActualArgs in the range [nRequiredArgs, nRequiredArgs + nPositionalOptionals]
            if (!(nActualArgs >= nRequiredArgs && nActualArgs <= nRequiredArgs + nPositionalOptionals)) {
              // yup, scan for implicitOK
              const implicitIdx = required.findIndex(({ implicitOK }) => implicitOK !== undefined)
              const { currentSelection } = await import('../webapp/views/sidecar') // FIXME
              const selection = currentSelection(tab)

              let nActualArgsWithImplicit = nActualArgs

              if (
                implicitIdx >= 0 &&
                selection &&
                required[implicitIdx].implicitOK.find(_ => _ === selection.type || _ === selection.prettyType)
              ) {
                nActualArgsWithImplicit++

                // if implicit, maybe other required parameters aren't needed
                const notNeededIfImplicit = required.filter(({ notNeededIfImplicit }) => notNeededIfImplicit)
                nActualArgsWithImplicit += notNeededIfImplicit.length
              }

              if (nActualArgsWithImplicit !== nRequiredArgs) {
                // then either the command didn't specify
                // implicitOK, or the current selection
                // (or lack thereof) didn't match with the
                // command's typing requirement
                const message =
                  nRequiredArgs === 0 && nPositionalOptionals === 0
                    ? 'This command accepts no positional arguments'
                    : nPositionalOptionals > 0
                    ? 'This command does not accept this number of arguments'
                    : `This command requires ${nRequiredArgs} parameter${
                        nRequiredArgs === 1 ? '' : 's'
                      }, but you provided ${nActualArgsWithImplicit === 0 ? 'none' : nActualArgsWithImplicit}`
                const err = new UsageError({ message, usage })
                err.code = 497
                debug(message, cmd, nActualArgs, nRequiredArgs, args, optLikeActuals)

                if (execOptions && execOptions.nested) {
                  debug('returning usage error')
                  return err
                } else {
                  debug('broadcasting usage error')
                  return oops(command, block, nextBlock)(err)
                }
              } else {
                debug('repl selection', selection)
                // for activation, the proper entity path is an annotation
                const activationPath: { key: string; value: string } =
                  selection.type === 'activations' &&
                  selection.annotations &&
                  selection.annotations.find(_ => _.key === 'path')
                if (activationPath) {
                  // ooh, then splice in the implicit parameter and entity type. We splice entity type here for later commands to easily distinguish composition/action.
                  args.splice(
                    implicitIdx,
                    cmdArgsStart + 1,
                    `/${activationPath.value}`,
                    selection['sessionId'] || selection['ast'] ? 'composition' : 'action'
                  )
                } else {
                  // ooh, then splice in the implicit parameter
                  args.splice(
                    implicitIdx,
                    cmdArgsStart + 1,
                    selection.namespace ? `/${selection.namespace}/${selection.name}` : selection.name
                  )
                }
                debug('spliced in implicit argument', cmdArgsStart, implicitIdx, args)
              }
            }
          }
        } /* strict usage model conformance checking */

        if (evaluator.options && !(await hasAuth()) && !evaluator.options.noAuthOk) {
          debug('command requires auth, and we do not have it')
          const err = new Error('Command requires authentication')
          err['code'] = 403
          return oops(command, block, nextBlock)(err)
        }

        if (evaluator.options && evaluator.options.requiresLocal && !hasLocalAccess()) {
          debug('command does not work in a browser')
          const err = new Error('Command requires local access')
          err['code'] = 406 // http not acceptable
          return oops(command, block, nextBlock)(err)
        }

        // if we don't have a head (yet), but this command
        // requires one, then ask for a head and try again. note
        // that we ignore this needsUI constraint if the user is
        // asking for help
        if (
          isHeadless() &&
          !parsedOptions.cli &&
          !parsedOptions.help &&
          ((process.env.DEFAULT_TO_UI && !parsedOptions.cli) || (evaluator.options && evaluator.options.needsUI))
        ) {
          import('../main/headless').then(({ createWindow }) =>
            createWindow(argv, evaluator.options.fullscreen, evaluator.options)
          )
          return Promise.resolve(true)
        }

        if (execOptions && execOptions.placeholder && prompt) {
          // prompt might not be defined, e.g. if the command
          // does a qexec, i.e. delegates to some other command;
          // that's ok, because in that case, we've already
          // displayed the placeholder
          prompt.value = execOptions.placeholder
        }

        //
        // the Eval part of REPL
        //
        return Promise.resolve()
          .then(() => {
            eventBus.emit('/command/start', {
              tab,
              route: evaluator.route,
              command,
              execType: (execOptions && execOptions.type) || ExecType.TopLevel
            })

            return currentEvaluatorImpl.apply(commandUntrimmed, execOptions, evaluator, {
              tab,
              block: block || true,
              nextBlock,
              argv,
              command,
              execOptions,
              argvNoOptions,
              parsedOptions,
              createOutputStream:
                execOptions.createOutputStream ||
                (() => (isHeadless() ? headlessStreamTo() : Promise.resolve(cli.streamTo(tab, block))))
            })
          })
          .then(async (response: Response) => {
            if (execOptions.rawResponse) {
              return response
            }

            if (response === undefined) {
              // weird, the response is empty!
              console.error(argv)
              throw new Error('Internal Error')
            }

            if (block && block['isCancelled']) {
              // user cancelled the command
              debug('squashing output of cancelled command')
              return
            }

            if (isEntitySpec(response) && response.verb === 'delete') {
              const { maybeHideEntity } = await import('../webapp/views/sidecar') // FIXME
              if (maybeHideEntity(tab, response) && nextBlock) {
                // cli.setContextUI(commandTree.currentContext(), nextBlock)
              }
            }

            if (UsageError.isUsageError(response)) {
              throw response
            }

            // indicate that the command was successfuly completed
            evaluator.success({
              tab,
              type: (execOptions && execOptions.type) || ExecType.TopLevel,
              isDrilldown: execOptions.isDrilldown,
              command,
              parsedOptions
            })

            const render = execOptions && !!execOptions.render

            // response=true means we are in charge of 'ok'
            if (
              !render &&
              ((execOptions && execOptions.replSilence) ||
                nested ||
                isLowLevelLoop(response) ||
                ElementMimic.isFakeDom(block))
            ) {
              // the parent exec will deal with the repl
              debug('passing control back to prompt processor or headless')
              return Promise.resolve(response)
            } else {
              // we're the top-most exec, so deal with the repl!
              const resultDom = render ? cli.replResult() : (block.querySelector('.repl-result') as HTMLElement)
              return new Promise(resolve => {
                cli
                  .printResults(
                    block,
                    nextBlock,
                    tab,
                    resultDom,
                    echo && !render,
                    execOptions,
                    parsedOptions,
                    command,
                    evaluator
                  )(response) // <--- the Print part of REPL
                  .then(() => {
                    if (render) {
                      resolve(resultDom.parentElement)
                    } else if (echo) {
                      // <-- create a new input, for the next iter of the Loop
                      setTimeout(() => {
                        cli.installBlock(blockParent, block, nextBlock)()
                        resolve(response)
                      }, 100)
                    } else {
                      resolve(response)
                    }
                  })
                  .catch((err: Error) => {
                    console.error(err)
                    if (execOptions && execOptions.noHistory) {
                      // then pass the error upstream
                      throw err
                    } else {
                      // then report the error to the repl
                      oops(command, block, nextBlock)(err)
                    }
                  })
              })
            }
          })
          .catch((err: CodedError) => {
            // how should we handle the error?
            const returnIt = execOptions && execOptions.failWithUsage // return to caller; it'll take care of things from now
            const rethrowIt = execOptions && execOptions.rethrowErrors // rethrow the exception
            const reportIt = execOptions && execOptions.reportErrors // report it to the user via the repl

            if (returnIt) {
              debug('returning command execution error', err.code, err)
              return err
            } else if (isHeadless()) {
              debug('rethrowing error because we are in headless mode', err)
              throw err
            } else {
              // indicate that the command was NOT successfuly completed
              err = evaluator.error(command, tab, (execOptions && execOptions.type) || ExecType.TopLevel, err)

              if (!nested && !rethrowIt) {
                debug('reporting command execution error to user via repl')
                // console.error(err)
                oops(command, block, nextBlock)(err)
              } else {
                debug('rethrowing command execution error', err)
                if (reportIt) {
                  // maybe the caller also wants us to report it via the repl?
                  debug('also reporting command execution error to user via repl')
                  oops(command, block, nextBlock)(err)
                }
                throw err
              }
            }
          })
      }
    } catch (err) {
      const e = err as CodedError

      if (isHeadless() && e.code !== 404) {
        try {
          debug('attempting to run the command graphically', e)
          const command = commandUntrimmed.trim().replace(patterns.commentLine, '')
          const argv = split(command)
          await import('../main/spawn-electron').then(({ initElectron }) =>
            initElectron(argv, { forceUI: true }, true, { fullscreen: true })
          )
        } catch (err) {
          debug('nope, we failed to run the command graphically')
          console.error(err)
        }
      }

      if (execOptions && execOptions.failWithUsage) {
        return e
      } else if (isHeadless()) {
        throw e
      }

      console.error('catastrophic error in repl')
      console.error(e)

      if (execOptions.nested) {
        // for nested/qexecs, we don't want to report anything to the
        // repl
        return
      }

      const blockForError = block || cli.getCurrentProcessingBlock(tab)

      return Promise.resolve(e.message).then(message => {
        if (isHTML(message)) {
          e.message = message
          oops(command, block, nextBlock)(e)
        } else {
          const cmd = cli.showHelp(command, blockForError, nextBlock, e)
          const resultDom = blockForError.querySelector('.repl-result') as HTMLElement
          return Promise.resolve(cmd)
            .then(cli.printResults(blockForError, nextBlock, tab, resultDom))
            .then(cli.installBlock(blockForError.parentNode, blockForError, nextBlock))
        }
      })
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
 */
export const doEval = ({ block = cli.getCurrentBlock(), prompt = cli.getPrompt(block) } = {}) => {
  const command = prompt.value.trim()

  if (block['completion']) {
    // then this is a follow-up to prompt
    block['completion'](prompt.value)
  } else {
    // otherwise, this is a plain old eval, resulting from the user hitting Enter
    return exec(command, new DefaultExecOptionsForTab(cli.getTabFromTarget(prompt)))
  }
}

/**
 * If, while evaluating a command, it needs to evaluate a sub-command...
 *
 */
export const qexec = <T = Response>(
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
        block: block,
        nextBlock: nextBlock,
        noHistory: true,
        contextChangeOK
      },
      execOptions,
      {
        type: ExecType.Nested
      }
    )
  )
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
export const iexec = (
  command: string,
  block?: HTMLElement,
  contextChangeOK?: boolean,
  execOptions?: ExecOptions,
  nextBlock?: HTMLElement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  return qexec(command, block, contextChangeOK, Object.assign({}, execOptions, { intentional: true }), nextBlock)
}

/**
 * "raw" exec, where we want the data model back directly
 *
 */
export const rexec = <T = Response>(command: string, execOptions = emptyExecOptions()): Promise<T> => {
  return qexec(command, undefined, undefined, Object.assign({ raw: true }, execOptions))
}

/**
 * Programmatic exec, as opposed to human typing and hitting enter
 *
 */
export const pexec = <T = Response>(command: string, execOptions?: ExecOptions): Promise<T> => {
  return exec(command, Object.assign({ echo: true, type: ExecType.ClickHandler }, execOptions))
}

/**
 * Execute a command in response to an in-view click
 *
 */
export const click = async (command: string | (() => Promise<string>), evt: MouseEvent) => {
  const { drilldown } = await import('../webapp/picture-in-picture')
  const tab = cli.getTabFromTarget(evt.currentTarget)
  return drilldown(tab, command)(evt)
}

/**
 *
 *
 */
export async function update(tab: cli.Tab, command: string, execOptions?: ExecOptions) {
  const [resource, { showEntity }] = await Promise.all([
    pexec<EntitySpec>(
      command,
      Object.assign(
        {
          echo: false,
          alreadyWatching: true,
          noHistory: true
        },
        execOptions
      )
    ),
    import('../webapp/views/sidecar')
  ])

  await showEntity(tab, resource)
}

/**
 * Update the executor impl
 *
 */
export const setExecutorImpl = (impl: Executor): void => {
  currentExecutorImpl = impl
}

/**
 * Add quotes if the argument needs it; compare to encodeURIComponent
 *
 */
export const encodeComponent = (component: string | number | boolean, quote = '"') => {
  if (component === undefined) {
    return ''
  } else if (
    typeof component === 'string' &&
    patterns.whitespace.test(component) &&
    component.charAt(0) !== quote &&
    component.charAt(component.length - 1) !== quote
  ) {
    return `${quote}${component}${quote}`
  } else {
    return component
  }
}

/**
 * If the command is semicolon-separated, invoke each element of the
 * split separately
 *
 */
export async function semicolonInvoke(opts: EvaluatorArgs): Promise<MixedResponse> {
  const commands = opts.command.split(/\s*;\s*/)
  if (commands.length > 1) {
    debug('semicolonInvoke', commands)

    const result: MixedResponse = await promiseEach(commands.filter(_ => _), async command => {
      const block = cli.subblock()

      // note: xterm.js 3.14 requires that this subblock be attached
      // somewhere; it'll be reattached in the right place by
      // cli.printResults, when the commands are all done
      if (typeof opts.block !== 'boolean') {
        opts.block.querySelector('.repl-result').appendChild(block)
      }

      const entity = await qexec<MixedResponsePart | true>(
        command,
        block,
        undefined,
        Object.assign({}, opts.execOptions, { quiet: false })
      )
      if (entity === true) {
        // pty output
        return block
      } else {
        // not a pty, so remove that subblock, as we have an entity response
        block.remove()
        return entity
      }
    })
    return result
  }
}

debug('loading done')
