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

import Debug from 'debug'
const debug = Debug('core/command-tree')
debug('loading')

import {
  CommandHandler,
  CommandOverrideHandler,
  CommandRegistrar,
  CommandTree,
  CommandTreeResolution,
  ExecType,
  EvaluatorArgs,
  CatchAllOffer,
  Command,
  CommandHandlerWithEvents,
  CommandOptions,
  Event,
  KResponse,
  ParsedOptions
} from '../models/command'

import eventChannelUnsafe from './events'
import { UsageError, UsageModel } from './usage-error'
import { oopsMessage } from './oops'
import { CodedError } from '../models/errors'
import { ExecOptions } from '../models/execOptions'
import { Tab } from '../webapp/tab'

import { prescanModel } from '../plugins/plugins'
import { PrescanUsage } from '../plugins/prescan'
import { PluginResolver } from '../plugins/resolver'

import { getModelInternal } from '../commands/tree'
import { registerTypeahead } from '../commands/typeahead'
import { Context, getCurrentContext } from '../commands/context'
debug('finished loading modules')

/**
 * Plugin registry
 *
 */
let resolver: PluginResolver
export const setPluginResolver = (_: PluginResolver) => {
  resolver = _
}

/**
 * Is route (/a/b/c) exactly the same as path (['a', 'b', 'c'])
 *
 * @param route is a registered command handler
 * @param path is what the user typed
 *
 */
const exactlyTheSameRoute = (route: string, path: string[]): boolean => {
  const routeAsPath = route.split('/').slice(1)
  for (let idx = 0; idx < routeAsPath.length; idx++) {
    if (routeAsPath[idx] !== path[idx]) {
      return false
    }
  }

  // if we got to this point, then route is a prefix of path

  if (routeAsPath.length !== path.length) {
    return false
  } else {
    return true
  }
}

/**
 * Navigate the given tree `model`, following the given `path` as [n1,n2,n3]
 *
 */
const treeMatch = <T extends KResponse, O extends ParsedOptions>(
  model: CommandTree,
  path: string[],
  readonly = false,
  hide = false,
  idxStart = 0,
  noWildcard = false
): Command<T, O> => {
  let parent = model
  let cur: Command<T, O>

  for (let idx = idxStart; idx < path.length; idx++) {
    cur = (parent.children && parent.children[path[idx]]) as Command<T, O>

    if (!cur) {
      // then we've reached the bottom of the tree
      if (readonly) {
        // we were instructed to give up
        break
      } else {
        // otherwise, we were instructed to create a new leaf node
        if (!parent.children) {
          parent.children = {}
        }
        cur = parent.children[path[idx]] = {
          $: undefined,
          parent,
          key: path[idx],
          options: { hide },
          route: `${parent.route === '/' ? '' : parent.route}/${path[idx]}`
        }
      }
    } else {
      // console.log('found', path[idx])
    }

    parent = cur
    cur = (cur.children && cur.children[path[idx]]) as Command<T, O>
    // console.log('match', idx, path[idx], cur)
  }

  if (!cur && !noWildcard) {
    // prefix match, e.g. "cleanAll !!!" should match a /cleanAll listener, as we have an implicit suffix wildcard
    // console.log('end of the line', parent)
    cur = parent as Command<T, O>
  }

  if (cur.options && cur.options.noArgs && !exactlyTheSameRoute(cur.route, path)) {
    // if cur represents a command registration that has asserted
    // it takes no extra arguments, we can fast-path this as a
    // non-match, if cur's route doesn't contain the requested
    // command path
  } else {
    return cur
  }
}
const match = <T extends KResponse, O extends ParsedOptions>(path: string[], readonly: boolean): Command<T, O> => {
  return treeMatch(getModelInternal().root, path, readonly)
}

class DefaultCommandOptions implements CommandOptions {}

/**
 * Register a command handler on the given route
 *
 */
const _listen = <T extends KResponse, O extends ParsedOptions>(
  model: CommandTree,
  route: string,
  handler: CommandHandler<T, O>,
  options: CommandOptions = new DefaultCommandOptions()
): Command<T, O> => {
  if (resolver && resolver.isOverridden(route)) {
    // then the overridden function was prematurely loaded; force a
    // load of the overriding plugin
    resolver.resolve(route, { tryCatchalls: false })
  }

  const path = route.split('/').splice(1)
  const leaf = treeMatch(getModelInternal().root, path, false, options.hide)

  if (leaf) {
    const prevOptions = leaf.options
    if (options) {
      leaf.options = options
    }

    if (leaf.$) {
      // then we're overriding an existing command
      if (!leaf.options) leaf.options = {}

      if (prevOptions) {
        Object.assign(leaf.options, prevOptions)
      }

      leaf.options.override = leaf.$
    }

    leaf.$ = handler as any as CommandHandler<T, O>
    leaf.route = route

    // populate the typeahead trie
    registerTypeahead(route)

    return leaf as Command<T, O>
  }
}

const listen = <T extends KResponse, O extends ParsedOptions>(
  route: string,
  handler: CommandHandler<T, O>,
  options: CommandOptions
): Command<T, O> => _listen(getModelInternal().root, route, handler, options)

/**
 * Register a subtree in the command tree
 *
 */
const _subtree = <T extends KResponse, O extends ParsedOptions>(
  route: string,
  options: CommandOptions
): Command<T, O> => {
  const myListen = options.listen || listen
  const path = route.split('/').splice(1)
  const leaf = match(path, false /*, options */)

  if (leaf) {
    leaf.route = route

    if (options) {
      leaf.options = options
    } else {
      leaf.options = {}
    }

    leaf.options.isDirectory = true

    const help = () => {
      // the usage message
      const usage =
        options.usage || (options.synonymFor && options.synonymFor.options && options.synonymFor.options.usage)

      /* if (options.synonymFor) {
        usageMessage.synonymFor = options.synonymFor
      } */

      throw new UsageError({ usage })
    }

    //
    // listen on /kubectl and /kubectl/help to present usage information
    //
    const opts = {
      noArgs: true,
      subtreeHandler: true,
      noAuthOk: true,
      requiresFullyQualifiedRoute: true
    }
    myListen(route, help, Object.assign({}, options, opts))
    myListen(`${route}/help`, help, Object.assign({}, options, opts))

    return leaf as Command<T, O>
  }
}

/**
 * Register a synonym of a subtree
 *
 */
const _subtreeSynonym = <T extends KResponse, O extends ParsedOptions>(
  route: string,
  master: Command<T, O>,
  options = master.options
) => {
  if (route !== master.route) {
    // <-- don't alias to yourself!
    const mySubtree = _subtree(route, Object.assign({}, options, { synonymFor: master }))

    // reverse mapping from master to synonym
    if (!master.synonyms) master.synonyms = {}
    master.synonyms[mySubtree.route] = mySubtree
  }
}

/**
 * Register a command handler on the given route, as a synonym of the given master handler
 *    master is the return value of `listen`
 *
 */
const _synonym = <T extends KResponse, O extends ParsedOptions>(
  route: string,
  handler: CommandHandler<T, O>,
  master: Command<T, O>,
  options = master.options
) => {
  if (route !== master.route) {
    // don't alias to yourself!
    const node = listen(route, handler, Object.assign({}, options, { synonymFor: master }))

    // reverse mapping from master to synonym
    if (!master.synonyms) master.synonyms = {}
    master.synonyms[node.route] = node
  }
}

/**
 * Oops, we couldn't resolve the given command. But maybe we found
 * some partial matches that might be helpful to the user.
 *
 */
const commandNotFoundMessage = 'Command not found'
const commandNotFoundMessageWithPartialMatches = 'The following commands are partial matches for your request.'

type PartialMatch = { route: string; usage?: UsageModel }

/**
 * Help the user with some partial matches for a command not found
 * condition. Here, we reuse the usage-error formatter, to present the
 * user with a list of possible completions to their (mistyped or
 * otherwise) command.
 *
 * We use the `available` list to present the list of available
 * command completions to what they typed.
 *
 */
const formatPartialMatches = (partialMatches: PartialMatch[], hide: boolean): UsageError => {
  return new UsageError(
    {
      message: hide ? '' : commandNotFoundMessage,
      usage: {
        header: commandNotFoundMessageWithPartialMatches,
        available: partialMatches.map(_ => _.usage)
      }
    },
    { noBreadcrumb: true, noHide: true }
  )
}

const suggestPartialMatches = (
  command: string,
  partialMatches?: PartialMatch[],
  noThrow = false,
  hide = false
): CodedError => {
  const availablePartials = partialMatches && partialMatches.filter(_ => _.usage)
  const anyPartials = availablePartials && availablePartials.length > 0

  const error: CodedError = anyPartials
    ? formatPartialMatches(availablePartials, hide)
    : new Error(`${commandNotFoundMessage}: ${command}`)
  error.code = 404

  // to allow for programmatic use of the partial matches, e.g. for tab completion
  if (anyPartials) {
    error.partialMatches = availablePartials.map(_ => ({
      command: _.route.split('/').slice(1).join(' '),
      usage: _.usage
    }))
  } else {
    error.hide = hide
  }

  if (noThrow) {
    return error
  } else {
    throw error
  }
}

/**
 *
 * @return a command handler with success and failure event handlers
 *
 */
const withEvents = <T extends KResponse, O extends ParsedOptions>(
  evaluator: CommandHandler<T, O>,
  leaf: Command<T, O>,
  partialMatches?: PartialMatch[]
): CommandHandlerWithEvents<T, O> => {
  // let the world know we have resolved a command, and are about to evaluate it
  const event: Event = {
    // context: currentContext()
    // ANONYMIZE: namespace: namespace.current()
  }

  // if we have a command tree node, add some extra fields to the event
  if (leaf) {
    event.route = leaf.route // e.g. "/git/status" from the bash-like plugin
    event.plugin = leaf.options.plugin || 'builtin' // e.g. "bash-like"
  }

  const handler: CommandHandlerWithEvents<T, O> = {
    subtree: leaf,
    route: leaf.route,
    eval: evaluator,
    options: leaf && leaf.options,
    success: ({ tab, type, command, isDrilldown = false, parsedOptions }) => {
      event.tab = tab
      event.execType = type
      event.command = command
      event.isDrilldown = isDrilldown

      // any command line options that the command has blessed to pass through to the event bus
      if (parsedOptions && leaf.options && leaf.options.okOptions) {
        const opts = leaf.options.okOptions.filter(_ => parsedOptions[_])
        if (opts) {
          event.options = opts
        }
      }

      /* if (leaf && eventChannelUnsafe) {
        eventChannelUnsafe.emit('/command/complete', event)
        if (event.execType !== ExecType.Nested) {
          eventChannelUnsafe.emit('/command/complete/fromuser', tab)
        }
      } */
    },
    error: (command: string, tab: Tab, execType: ExecType, err: CodedError): CodedError => {
      event.tab = tab
      event.execType = execType
      event.command = command
      event.error = oopsMessage(err)
      if (leaf && eventChannelUnsafe) {
        eventChannelUnsafe.emit('/command/complete', event)
        if (event.execType !== ExecType.Nested) {
          eventChannelUnsafe.emit('/command/complete/fromuser', tab)
        }
      }

      if (err.code === 127 && partialMatches) {
        // command not found
        const suggestions = suggestPartialMatches(command, partialMatches, true, err.hide) // true: don't throw an exception
        return suggestions
      }

      return err
    }
  }

  return handler
}

/**
 * Parse the given argv, and return an evaluator or throw an Error
 *
 */
const _read = async <T extends KResponse, O extends ParsedOptions>(
  model: CommandTree,
  argv: string[],
  contextRetry: string[],
  originalArgv: string[],
  tryCatchalls: boolean
): Promise<false | CommandHandlerWithEvents<T, O>> => {
  let leaf = treeMatch<T, O>(getModelInternal().root, argv, true) // true means read-only, don't modify the context model please
  let evaluator: CommandHandler<T, O> = (leaf && leaf.$) as CommandHandler<T, O>

  if (!evaluator) {
    //
    // maybe the plugin that supports this route hasn't been
    // loaded, yet; so: invoke the plugin resolver and retry
    //
    const route = `/${argv.join('/')}`
    await resolver.resolve(route, { tryCatchalls: tryCatchalls && (!contextRetry || contextRetry.length === 0) })
    leaf = treeMatch(getModelInternal().root, argv, true) // true means read-only, don't modify the context model please
    evaluator = (leaf && leaf.$) as CommandHandler<T, O>
  }

  if (!evaluator) {
    if (!contextRetry) {
      return false
    } else if (contextRetry.length === 0) {
      return _read(getModelInternal().root, originalArgv, undefined, originalArgv, tryCatchalls)
    } else if (
      contextRetry.length > 0 &&
      contextRetry[contextRetry.length - 1] !== originalArgv[originalArgv.length - 1]
    ) {
      // command not found so far, look further afield.
      const maybeInContextRetry = _read<T, O>(
        getModelInternal().root,
        contextRetry.concat(originalArgv),
        contextRetry.slice(0, contextRetry.length - 1),
        originalArgv,
        tryCatchalls
      )

      if (maybeInContextRetry) {
        return maybeInContextRetry
      }

      // oof, fallback plan: look in the default context
      const newContext = getCurrentContext()
        .concat(originalArgv)
        .filter((elt, idx, A) => elt !== A[idx - 1])
      const maybeInDefaultContext = _read<T, O>(
        getModelInternal().root,
        newContext,
        contextRetry.slice(0, contextRetry.length - 1),
        originalArgv,
        tryCatchalls
      )
      return maybeInDefaultContext
    } else {
      // if we get here, we can't find a matching command
      return false
    }
  } else {
    return withEvents<T, O>(evaluator, leaf)
  }
}

/** read, with retries based on the current context */
const internalRead = <T extends KResponse, O extends ParsedOptions>(
  model: CommandTree,
  argv: string[],
  tryCatchalls: boolean
): Promise<false | CommandHandlerWithEvents<T, O>> => {
  if (argv[0] === 'kui') argv.shift()
  return _read(getModelInternal().root, argv, Context.current, argv, tryCatchalls)
}

/**
 * We could not find a registered command handler for the given `argv`.
 *
 */
const commandNotFound = (
  argv: string[],
  partialMatches?: PartialMatch[],
  execOptions?: ExecOptions,
  tryCatchalls = true
) => {
  // first, see if we have any catchall handlers; offer the argv, and
  // choose the highest priority handler that accepts the argv
  if (!execOptions || !execOptions.failWithUsage) {
    const catchallHandler =
      tryCatchalls &&
      getModelInternal()
        .catchalls.filter(({ offer }) => offer(argv))
        .sort(({ prio: prio1 }, { prio: prio2 }) => prio2 - prio1)[0]
    if (catchallHandler) {
      return withEvents(catchallHandler.eval, catchallHandler, partialMatches)
    }

    // otherwise, give up trying to find a registered command handler,
    // and look for partial matches
    eventChannelUnsafe.emit('/command/resolved', {
      // ANONYMIZE: namespace: namespace.current(),
      error: `${commandNotFoundMessage}: ${argv.join(' ')}`,
      command: argv[0]
    })
  }

  return suggestPartialMatches(argv.join(' '), partialMatches)
}

/**
 * Find partial matches at head of the given subtree. We hope that the
 * last part of the argv (represented here in `partial`) is a partial
 * match for some command at this root.
 *
 * @return all such prefix matches
 *
 */
const findPartialMatchesAt = (usage: PrescanUsage, partial: string): PartialMatch[] => {
  const matches: PartialMatch[] = []

  function maybeAdd(match: PartialMatch) {
    if (match.route.indexOf(partial) >= 0 && (!match.usage || (!match.usage.synonymFor && !match.usage.hide))) {
      matches.push(match)
    }
  }

  for (const route in usage) {
    maybeAdd(usage[route])

    for (const cmd in usage[route].children) {
      maybeAdd(usage[route].children[cmd])
    }
  }

  return matches
}

/**
 * Look up a command handler for the given `argv`. This is the main
 * Read part of a REPL.
 *
 */
export const read = async <T extends KResponse, O extends ParsedOptions>(
  root: CommandTree,
  argv: string[],
  noRetry = false,
  execOptions: ExecOptions,
  tryCatchalls = true
): Promise<CommandTreeResolution<T, O>> => {
  let cmd: false | CodedError | CommandHandlerWithEvents<T, O>

  if (!noRetry) {
    await resolver.resolve(`/${argv.join('/')}`, { tryCatchalls: false })
    cmd = await internalRead(root, argv, tryCatchalls)
  }

  if (!cmd && /\.?\//.test(argv[0])) {
    // Look for slashes instead of spaces. e.g. if the user types
    // /a/b/c, and there is a registered command route /a/b/c,
    // ... then we should resolve that command as a kui command
    const { cwd } = await import('../util/home')
    const exe = argv[0].replace(/^\.\//, cwd() + '/')
    const argv2 = exe.split(/\//).slice(1)
    await resolver.resolve(exe, { tryCatchalls: false })
    cmd = await internalRead(root, argv2, tryCatchalls)
  }

  if (!cmd) {
    // command not found, but maybe we can find partial matches
    // that might be helpful?
    let matches: PartialMatch[]

    if (argv.length === 1) {
      matches = await findPartialMatchesAt(prescanModel().usage, argv[0])
    } else {
      const allButLast = argv.slice(0, argv.length - 1)
      const last = argv[argv.length - 1]

      const parent = await internalRead(root, allButLast, tryCatchalls)
      if (parent) {
        matches = await findPartialMatchesAt(prescanModel().usage, last)
      }
    }

    // found some partial matches?
    if (matches && matches.length > 0) {
      // debug('found partial matches', matches)
    } else {
      matches = undefined
    }

    return commandNotFound(argv, matches, execOptions, tryCatchalls) as CommandTreeResolution<T, O>
  } else {
    return cmd
  }
}

/**
 * The model we present to plugins, a `CommandRegistrar`
 *
 */
export class ImplForPlugins implements CommandRegistrar {
  // eslint-disable-next-line no-useless-constructor
  public constructor(protected readonly plugin: string) {}

  public catchall<T extends KResponse, O extends ParsedOptions>(
    offer: CatchAllOffer,
    handler: CommandHandler<T, O>,
    prio = 0,
    options: CommandOptions = new DefaultCommandOptions()
  ) {
    return getModelInternal().catchalls.push({
      route: '*',
      offer,
      eval: handler,
      prio,
      plugin: this.plugin,
      options,
      $: undefined,
      key: undefined,
      parent: undefined
    })
  }

  public listen<T extends KResponse, O extends ParsedOptions>(
    route: string,
    handler: CommandHandler<T, O>,
    options?: CommandOptions
  ): Command<T, O> {
    return listen(route, handler, Object.assign({}, options, { plugin: this.plugin }))
  }

  public synonym<T extends KResponse, O extends ParsedOptions>(
    route: string,
    handler: CommandHandler<T, O>,
    master: Command<T, O>,
    options: CommandOptions
  ) {
    return _synonym(route, handler, master, options && Object.assign({}, options, { plugin: this.plugin }))
  }

  public subtree<T extends KResponse, O extends ParsedOptions>(route: string, options: CommandOptions): Command<T, O> {
    return _subtree(route, options)
  }

  public subtreeSynonym<T extends KResponse, O extends ParsedOptions>(
    route: string,
    master: Command<T, O>,
    options = master.options
  ) {
    return _subtreeSynonym(route, master, options)
  }

  public async override<T extends KResponse, O extends ParsedOptions>(
    route: string,
    fromPlugin: string,
    overrideHandler: CommandOverrideHandler<T, O>,
    options?: CommandOptions
  ): Promise<Command<T, O>> {
    let currentHandler = (await this.find<T, O>(route, fromPlugin)).$
    if (!currentHandler) {
      if (resolver) {
        await resolver.resolveOne(fromPlugin)
      }

      currentHandler = (await this.find<T, O>(route, fromPlugin)).$
      if (!currentHandler) {
        throw new Error(`Cannot find desired command handler for ${route} from plugin ${fromPlugin}`)
      }
    }

    const handler = (args: EvaluatorArgs<O>) => overrideHandler(args, currentHandler)
    return this.listen(route, handler, options)
  }

  public async find<T extends KResponse, O extends ParsedOptions>(
    route: string,
    fromPlugin?: string,
    noOverride = true
  ): Promise<Command<T, O>> {
    const cmd = match<T, O>(route.split('/').slice(1), true)
    if (!cmd || cmd.route !== route || (!noOverride && resolver && resolver.isOverridden(cmd.route))) {
      if (resolver) {
        if (fromPlugin) {
          await resolver.resolveOne(fromPlugin)
        } else {
          await resolver.resolve(route, { tryCatchalls: false })
        }
      }
      return match(route.split('/').slice(1), true)
    } else {
      return cmd
    }
  }
}

/**
 * Create a `CommandRegistrar` facade, for use by plugins in
 * registering commands.
 *
 * This method is named "proxy" because it mostly delegates to the
 * underlying implementation, with extra help in:
 *
 * - remembering from which plugin calls to listen emanate.
 * - consolidating the tree model across separately-installed @kui-shell/core
 *
 */
export function proxy(plugin: string): CommandRegistrar {
  return new ImplForPlugins(plugin)
}
