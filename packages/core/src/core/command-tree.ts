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

import Debug from 'debug'
const debug = Debug('core/command-tree')
debug('loading')

import {
  CommandHandler,
  CommandRegistrar,
  CommandTree,
  CommandTreeResolution,
  Disambiguator,
  ExecType,
  CatchAllOffer,
  Command,
  CommandHandlerWithEvents,
  CommandOptions,
  Event
} from '../models/command'

import eventBus from './events'
import { UsageError, UsageModel } from './usage-error'
import { oopsMessage } from './oops'
import { CodedError } from '../models/errors'
import { ExecOptions } from '../models/execOptions'
import { Tab } from '../webapp/cli'

import { prescanModel } from '../plugins/plugins'
import { PrescanUsage } from '../plugins/prescan'
import { PluginResolver } from '../plugins/resolver'

import { getModelInternal } from '../commands/tree'
import { Context, getCurrentContext } from '../commands/context'

debug('finished loading modules')

// for plugins.js
export const endScan = (/* state: Disambiguator */): Disambiguator => {
  debug('finishing up', getModelInternal().disambiguator)
  const map: Disambiguator = {}
  for (const command in getModelInternal().disambiguator) {
    map[command] = getModelInternal().disambiguator[command].map(({ route, options }) => ({
      route,
      plugin: options && options.plugin
    }))
  }
  /* if (state) {
    disambiguator = state
  } */
  return map
}

/**
 * In support of plugin removal, cull the disambiguator cache
 *
 */
export function cullFromDisambiguator(pluginToBeRemoved: string) {
  for (const key in getModelInternal().disambiguator) {
    getModelInternal().disambiguator[key] = getModelInternal().disambiguator[key].filter(({ plugin }) => {
      if (plugin !== pluginToBeRemoved) {
        debug('cullFromDisambiguator deleted', key)
        return false
      } else {
        return true
      }
    })
    const after = getModelInternal().disambiguator[key].length
    if (after === 0) {
      debug('cullFromDisambiguator purged', key, getModelInternal().disambiguator[key])
      delete getModelInternal().disambiguator[key]
    }
  }
  debug('cullFromDisambiguator done', getModelInternal().disambiguator)
}

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
const treeMatch = (
  model: CommandTree,
  path: string[],
  readonly = false,
  hide = false,
  idxStart = 0,
  noWildcard = false
): Command => {
  let parent = model
  let cur: Command

  for (let idx = idxStart; idx < path.length; idx++) {
    cur = parent.children && parent.children[path[idx]]

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
          parent: parent,
          key: path[idx],
          options: { hide: hide },
          route: `${parent.route === '/' ? '' : parent.route}/${path[idx]}`
        }
      }
    } else {
      // console.log('found', path[idx])
    }

    parent = cur
    cur = cur.children && cur.children[path[idx]]
    // console.log('match', idx, path[idx], cur)
  }

  if (!cur && !noWildcard) {
    // prefix match, e.g. "cleanAll !!!" should match a /cleanAll listener, as we have an implicit suffix wildcard
    // console.log('end of the line', parent)
    cur = parent
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
const match = (path: string[], readonly: boolean): Command => {
  return treeMatch(getModelInternal().root, path, readonly)
}

class DefaultCommandOptions implements CommandOptions {}

/**
 * Register a command handler on the given route
 *
 */
const _listen = (
  model: CommandTree,
  route: string,
  handler: CommandHandler,
  options: CommandOptions = new DefaultCommandOptions()
): Command => {
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

    leaf.$ = handler
    leaf.route = route

    // update the disambiguator map
    if (
      /*! (options && options.synonymFor) && */ // leaf is NOT a synonym
      !(leaf.parent && leaf.parent.options && leaf.parent.options.synonymFor)
    ) {
      // tree is NOT a synonym
      let resolutions = getModelInternal().disambiguator[leaf.key]
      if (!resolutions) {
        resolutions = getModelInternal().disambiguator[leaf.key] = []
      }

      if (!resolutions.find(resolution => resolution.route === leaf.route)) {
        resolutions.push(leaf)
      }
    }

    return leaf
  }
}

const listen = (route: string, handler: CommandHandler, options: CommandOptions) =>
  _listen(getModelInternal().root, route, handler, options)

/**
 * Register a subtree in the command tree
 *
 */
const _subtree = (route: string, options: CommandOptions) => {
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
      inBrowserOk: true,
      requiresFullyQualifiedRoute: true
    }
    myListen(route, help, Object.assign({}, options, opts))
    myListen(`${route}/help`, help, Object.assign({}, options, opts))

    return leaf
  }
}

/**
 * Register a synonym of a subtree
 *
 */
const _subtreeSynonym = (route: string, master: Command, options = master.options) => {
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
const _synonym = (route: string, handler: CommandHandler, master: Command, options = master.options) => {
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
const formatPartialMatches = (partialMatches: PartialMatch[]): UsageError => {
  return new UsageError(
    {
      message: commandNotFoundMessage,
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
    ? formatPartialMatches(availablePartials)
    : new Error(`${commandNotFoundMessage}: ${command}`)
  error.code = 404

  // to allow for programmatic use of the partial matches, e.g. for tab completion
  if (anyPartials) {
    error.partialMatches = availablePartials.map(_ => ({
      command: _.route
        .split('/')
        .slice(1)
        .join(' '),
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
const withEvents = (
  evaluator: CommandHandler,
  leaf: Command,
  partialMatches?: PartialMatch[]
): CommandHandlerWithEvents => {
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

  const handler: CommandHandlerWithEvents = {
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

      if (leaf && eventBus) eventBus.emit('/command/complete', event)
    },
    error: (command: string, tab: Tab, execType: ExecType, err: CodedError): CodedError => {
      event.tab = tab
      event.execType = execType
      event.command = command
      event.error = oopsMessage(err)
      if (leaf && eventBus) eventBus.emit('/command/complete', event)

      if (err.code === 127) {
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
const _read = async (
  model: CommandTree,
  argv: string[],
  contextRetry: string[],
  originalArgv: string[]
): Promise<false | CommandHandlerWithEvents> => {
  let leaf = treeMatch(getModelInternal().root, argv, true) // true means read-only, don't modify the context model please
  let evaluator = leaf && leaf.$

  if (!evaluator) {
    //
    // maybe the plugin that supports this route hasn't been
    // loaded, yet; so: invoke the plugin resolver and retry
    //
    const route = `/${argv.join('/')}`
    await resolver.resolve(route)
    leaf = treeMatch(getModelInternal().root, argv, true) // true means read-only, don't modify the context model please
    evaluator = leaf && leaf.$
  }

  if (!evaluator) {
    if (!contextRetry) {
      return false
    } else if (contextRetry.length === 0) {
      return _read(getModelInternal().root, originalArgv, undefined, originalArgv)
    } else if (
      contextRetry.length > 0 &&
      contextRetry[contextRetry.length - 1] !== originalArgv[originalArgv.length - 1]
    ) {
      // command not found so far, look further afield.
      const maybeInContextRetry = _read(
        getModelInternal().root,
        contextRetry.concat(originalArgv),
        contextRetry.slice(0, contextRetry.length - 1),
        originalArgv
      )

      if (maybeInContextRetry) {
        return maybeInContextRetry
      }

      // oof, fallback plan: look in the default context
      const newContext = getCurrentContext()
        .concat(originalArgv)
        .filter((elt, idx, A) => elt !== A[idx - 1])
      const maybeInDefaultContext = _read(
        getModelInternal().root,
        newContext,
        contextRetry.slice(0, contextRetry.length - 1),
        originalArgv
      )
      return maybeInDefaultContext
    } else {
      // if we get here, we can't find a matching command
      return false
    }
  } else {
    if (leaf.options && leaf.options.requiresFullyQualifiedRoute) {
      const routeWithoutContext = `/${originalArgv.join('/')}`
      if (leaf.route !== routeWithoutContext) {
        // e.g. executing "help" we don't want to use the default
        // context (see "subtree help" above for an example use of
        // this feature)
        if (argv.length === originalArgv.length && argv.every((elt, idx) => elt === originalArgv[idx])) {
          return false
        } else {
          return _read(getModelInternal().root, originalArgv, undefined, originalArgv)
        }
      }
    }

    return withEvents(evaluator, leaf)
  }
}

/** read, with retries based on the current context */
const internalRead = (model: CommandTree, argv: string[]): Promise<false | CommandHandlerWithEvents> => {
  if (argv[0] === 'kui') argv.shift()
  return _read(getModelInternal().root, argv, Context.current, argv)
}

/**
 * Is the given suffix-unambiguous registered command A compatible
 * with the given executed command B?
 *
 *   A: [ which, ls ], B: [ ls ] => true, because 'ls' is a unambiguous suffix of the registered command A
 *   A: [ ls ], B: [ which, ls ] => false, because the user asked for 'which ls', and all we could find was 'ls'
 *
 */
const areCompatible = (A: string[], B: string[]): boolean => {
  const start = A.indexOf(B[0])

  let Bidx = 0
  for (let Aidx = start; Aidx < A.length && Bidx < B.length; Aidx++, Bidx++) {
    if (A[Aidx] !== B[Bidx]) {
      break
    }
  }

  return Bidx > 0
}

/**
 * See if the given `argv` resolves unambiguously, independent of
 * command context.
 *
 */
const disambiguate = async (argv: string[], noRetry = false): Promise<CommandHandlerWithEvents> => {
  let idx: number
  const resolutions =
    (((idx = 0) || true) && resolver.disambiguate(argv[idx])) ||
    (argv.length > 1 && ((idx = argv.length - 1) || true) && resolver.disambiguate(argv[idx])) ||
    []
  debug('disambiguate', argv, resolutions)

  if (resolutions.length === 0 && !noRetry) {
    // maybe we haven't loaded the plugin, yet
    await resolver.resolve(`/${argv.join('/')}`)
    return disambiguate(argv, true)
  } else if (resolutions.length === 1) {
    // one unambiguous resolution! great, but we need to
    // double-check: if the resolution is a subtree, then it better have a child that matches
    const argvForMatch = resolutions[0].route.split('/').slice(1)
    const cmdMatch = treeMatch(getModelInternal().root, argvForMatch)
    const leaf = cmdMatch && cmdMatch.$ ? areCompatible(argvForMatch, argv) && cmdMatch : undefined

    if (!leaf || !leaf.$) {
      if (!noRetry && resolutions[0].plugin) {
        await resolver.resolveOne(resolutions[0].plugin)
        return disambiguate(argv, true)
      } else {
        return
      }
    } else if (idx === argv.length - 1 && leaf.children) {
      // then the match is indeed a subtree
      const next = argv[argv.length - 1]
      for (const cmd in leaf.children) {
        if (cmd === next) {
          return withEvents(leaf.children[cmd].$, leaf.children[cmd])
        }
      }

      return
    } else if (idx < argv.length - 1 && leaf.children) {
      return
    }

    return withEvents(leaf.$, leaf)
  }
}

/**
 * We could not find a registered command handler for the given `argv`.
 *
 */
const commandNotFound = (argv: string[], partialMatches?: PartialMatch[], execOptions?: ExecOptions) => {
  // first, see if we have any catchall handlers; offer the argv, and
  // choose the highest priority handler that accepts the argv
  if (!execOptions || !execOptions.failWithUsage) {
    const catchallHandler = getModelInternal()
      .catchalls.filter(({ offer }) => offer(argv))
      .sort(({ prio: prio1 }, { prio: prio2 }) => prio2 - prio1)[0]
    if (catchallHandler) {
      return withEvents(catchallHandler.eval, catchallHandler, partialMatches)
    }

    // otherwise, give up trying to find a registered command handler,
    // and look for partial matches
    eventBus.emit('/command/resolved', {
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
export const read = async (
  root: CommandTree,
  argv: string[],
  noRetry = false,
  noSubtreeRetry = false,
  execOptions: ExecOptions
): Promise<CommandTreeResolution> => {
  let cmd: false | CodedError | CommandHandlerWithEvents = await disambiguate(argv)

  if (cmd && resolver.isOverridden(cmd.route) && !noRetry) {
    await resolver.resolve(cmd.route)
    return read(root, argv, true, noSubtreeRetry, execOptions)
  }

  if (!cmd) {
    if (!noRetry) {
      await resolver.resolve(`/${argv.join('/')}`)
      cmd = (await disambiguate(argv)) || (await internalRead(root, argv))
    }
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

      const parent = (await internalRead(root, allButLast)) || (await disambiguate(allButLast))
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

    return commandNotFound(argv, matches, execOptions)
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

  public catchall(
    offer: CatchAllOffer,
    handler: CommandHandler,
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

  public listen(route: string, handler: CommandHandler, options: CommandOptions) {
    return listen(route, handler, Object.assign({}, options, { plugin: this.plugin }))
  }

  public synonym(route: string, handler: CommandHandler, master: Command, options: CommandOptions) {
    return _synonym(route, handler, master, options && Object.assign({}, options, { plugin: this.plugin }))
  }

  public subtree(route: string, options: CommandOptions) {
    return _subtree(route, options)
  }

  public subtreeSynonym(route: string, master: Command, options = master.options) {
    return _subtreeSynonym(route, master, options)
  }

  public async find(route: string, noOverride = true) {
    const cmd = match(route.split('/').slice(1), true)
    if (!cmd || cmd.route !== route || (!noOverride && resolver && resolver.isOverridden(cmd.route))) {
      if (resolver) {
        await resolver.resolve(route)
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
