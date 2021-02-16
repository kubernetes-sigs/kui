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

import Debug from 'debug'

// TODO esModuleInterop to allow for import
// import * as minimist from 'yargs-parser'
const minimist = require('yargs-parser')

import { CommandHandlerWithEvents, KResponse, ParsedOptions, YargsParserFlags } from '../models/command'

import { ExecOptions } from '../models/execOptions'
import { UsageError, UsageModel, UsageRow } from '../core/usage-error'

const debug = Debug('repl/enforce-usage')

/** trim the optional suffix e.g. --last [actionName] */

const stripTrailer = (str: string) => str && str.replace(/\s+.*$/, '')

/** turn --foo into foo and -f into f */

const unflag = (opt: string) => opt && stripTrailer(opt.replace(/^[-]+/, ''))

/**
 * yargs-parser flags that we want to apply to all commands
 *
 */
function getUsageOptionsForAll(usage: UsageModel): UsageRow[] {
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

  return builtInOptions
}

/**
 * Extract any yargs-parser flags that the command wants us to use
 *
 */
function getYargsParserFlagsForCommand<T extends KResponse, O extends ParsedOptions>(
  evaluator: CommandHandlerWithEvents<T, O>
): YargsParserFlags {
  return (
    (evaluator.options && evaluator.options.flags) ||
    (evaluator.options &&
      evaluator.options.synonymFor &&
      evaluator.options.synonymFor.options &&
      evaluator.options.synonymFor.options.flags) ||
    ({} as YargsParserFlags)
  )
}

function strictChecks<O extends ParsedOptions>(
  usage: UsageModel,
  builtInOptions: UsageRow[],
  argvNoOptions: string[],
  parsedOptions: O
) {
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
        debug(message, args, parsedOptions, optional) // args is argv with options stripped
        throw err
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
            Array.isArray(parsedOptions[optionalArg]) ||
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
        debug('bad value for option', optionalArg, match, parsedOptions, args)

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
        throw error
      }
    }

    //
    // user passed an incorrect number of positional parameters?
    //
    if (!onlyEnforceOptions && nActualArgs < nRequiredArgs) {
      const message =
        nRequiredArgs === 0 && nPositionalOptionals === 0
          ? 'This command accepts no positional arguments'
          : nPositionalOptionals > 0
          ? 'This command does not accept this number of arguments'
          : `This command requires ${nRequiredArgs} parameter${nRequiredArgs === 1 ? '' : 's'}, but you provided none`
      const err = new UsageError({ message, usage })
      err.code = 497
      debug(message, cmd, nActualArgs, nRequiredArgs, args, optLikeActuals)
      throw err
    }
  } /* strict usage model conformance checking */
}

/**
 * Do the given arguments (both positional and optional) conform to
 * the minimal requirements of the usage model of the given
 * `evaluator`?
 *
 */
export default function enforceUsage<T extends KResponse, O extends ParsedOptions>(
  argv: string[],
  evaluator: CommandHandlerWithEvents<T, O>,
  execOptions: ExecOptions
): boolean {
  //
  // fetch the usage model for the command
  //
  const _usage: UsageModel = evaluator.options && evaluator.options.usage
  const usage: UsageModel = _usage && _usage.fn ? _usage.fn(_usage.command) : _usage

  if (execOptions && execOptions.failWithUsage && !usage) {
    debug('caller needs usage model, but none exists for this command', evaluator)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return false
  }

  const builtInOptions = getUsageOptionsForAll(usage)

  // here, we encode some common aliases, and then overlay any flags from the command
  // narg: any flags that take more than one argument e.g. -p key value would have { narg: { p: 2 } }
  const commandFlags = getYargsParserFlagsForCommand(evaluator)

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
    configuration: Object.assign(
      { 'camel-case-expansion': false },
      (evaluator.options && evaluator.options.flags && evaluator.options.flags.configuration) ||
        (usage && usage.configuration) ||
        {}
    ),
    string: Object.assign({}, commandFlags.string || {}),
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
    throw new UsageError({ usage: evaluator.options.usage })
  }

  strictChecks(usage, builtInOptions, argvNoOptions, parsedOptions)

  return true
}
