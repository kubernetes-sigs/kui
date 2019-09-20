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

import * as Debug from 'debug'
const debug = Debug('core/command-tree')
debug('loading')

import {
  CommandHandler,
  CommandTree,
  CommandTreeResolution,
  Disambiguator,
  ExecType,
  CatchAllOffer,
  CatchAllHandler,
  Command,
  CommandBase,
  CommandHandlerWithEvents,
  CommandOptions,
  Event
} from '../models/command'

import eventBus from './events'
import { UsageError } from './usage-error'
import { oopsMessage } from './oops'
import { CodedError } from '../models/errors'
import { ExecOptions } from '../models/execOptions'
import { Tab } from '../webapp/cli'
import { PluginResolver } from './plugins'
import { theme } from './settings'

/**
 * The command tree module
 *
 */
const root = (): CommandHandler => undefined // this will trigger a re-parse using Context.current as the path prefix
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const interior = (x?: string[], y?: number, z?: number): CommandHandler => undefined // this will trigger a re-parse using Context.current as the path prefix
const newTree = (): CommandTree => ({
  $: root(),
  key: '/',
  route: '/',
  children: {},
  parent: undefined
})
const model: CommandTree = newTree() // this is the model of registered listeners, a tree
const intentions: CommandTree = newTree() // this is the model of registered intentional listeners

let disambiguator: Disambiguator = {} // map from command name to disambiguations
export const catchalls: CatchAllHandler[] = [] // handlers for command not found

debug('finished loading modules')

// for plugins.js
export const startScan = (): Disambiguator => {
  const state = disambiguator
  disambiguator = {}
  debug('startScan', disambiguator)
  return state
}
export const endScan = (state: Disambiguator): Disambiguator => {
  debug('finishing up')
  const map: Disambiguator = {}
  for (const command in disambiguator) {
    map[command] = disambiguator[command].map(({ route, options }) => ({
      route,
      plugin: options && options.plugin
    }))
  }
  if (state) {
    disambiguator = state
  }
  return map
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
 * Navigate the given tree model, following the given path as [n1,n2,n3]
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
      if (readonly) {
        break
      } else {
        // console.log('create',path[idx])
        if (!parent.children) {
          parent.children = {}
        }
        cur = parent.children[path[idx]] = {
          $: interior(path, 0, idx),
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
  return treeMatch(model, path, readonly)
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
) => {
  const path = route.split('/').splice(1)
  const leaf = treeMatch(model, path, false, options.hide)

  if (leaf) {
    const prevOptions = leaf.options
    if (options) {
      leaf.options = options
    }

    if (leaf.$) {
      // then we're overriding an existing command
      if (!leaf.options) leaf.options = {}

      if (prevOptions) {
        for (const key in prevOptions) {
          leaf.options[key] = prevOptions[key]
        }
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
      let resolutions = disambiguator[leaf.key]
      if (!resolutions) {
        resolutions = disambiguator[leaf.key] = []
      }

      if (!resolutions.find(resolution => resolution.route === leaf.route)) {
        resolutions.push(leaf)
      }
    }

    return leaf
  }
}
export const listen = (route: string, handler: CommandHandler, options: CommandOptions) =>
  _listen(model, route, handler, options)

/**
 * Register a subtree in the command tree
 *
 */
export const subtree = (route: string, options: CommandOptions) => {
  const myListen = options.listen || listen
  const path = route.split('/').splice(1)
  const leaf = match(path, false /*, options */)

  if (leaf) {
    leaf.route = route

    if (options) {
      leaf.options = options
    }

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
export const subtreeSynonym = (route: string, master: Command, options = master.options) => {
  if (route !== master.route) {
    // <-- don't alias to yourself!
    const mySubtree = subtree(route, Object.assign({}, options, { synonymFor: master }))

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
export const synonym = (route: string, handler: CommandHandler, master: Command, options = master.options) => {
  if (route !== master.route) {
    // don't alias to yourself!
    const node = listen(route, handler, Object.assign({}, options, { synonymFor: master }))

    // reverse mapping from master to synonym
    if (!master.synonyms) master.synonyms = {}
    master.synonyms[node.route] = node
  }
}

/**
 * Register an intentional action
 *
 */
export const intention = (route: string, handler: CommandHandler, options: CommandOptions) =>
  _listen(intentions, route, handler, Object.assign({}, options, { isIntention: true }))

/**
 * Oops, we couldn't resolve the given command. But maybe we found
 * some partial matches that might be helpful to the user.
 *
 */
const commandNotFoundMessage = 'Command not found'
const commandNotFoundMessageWithPartialMatches = 'The following commands are partial matches for your request.'

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
const formatPartialMatches = (partialMatches: Command[]): UsageError => {
  return new UsageError(
    {
      message: commandNotFoundMessage,
      usage: {
        header: commandNotFoundMessageWithPartialMatches,
        available: partialMatches.map(({ options }) => options.usage)
      }
    },
    { noBreadcrumb: true, noHide: true }
  )
}

export const suggestPartialMatches = (
  command: string,
  partialMatches?: Command[],
  noThrow = false,
  hide = false
): CodedError => {
  // filter out any partial matches without usage info
  const availablePartials = (partialMatches || []).filter(({ options }) => options.usage)
  const anyPartials = availablePartials.length > 0

  const error: CodedError = anyPartials
    ? formatPartialMatches(availablePartials)
    : new Error(`${commandNotFoundMessage}: ${command}`)
  error.code = 404

  // to allow for programmatic use of the partial matches, e.g. for tab completion
  if (anyPartials) {
    error['partialMatches'] = availablePartials.map(_ => ({
      command: _.route
        .split('/')
        .slice(1)
        .join(' '),
      usage: _.options && _.options.usage
    }))
  } else {
    error['hide'] = hide
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
  leaf: CommandBase,
  partialMatches?: Command[]
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

    if (leaf.options.isIntention) {
      // e.g. leaf represents |save to cloudant|
      event.isIntention = true
    }
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
        const suggestions = suggestPartialMatches(command, partialMatches, true, err['hide']) // true: don't throw an exception
        return suggestions
      }

      return err
    }
  }

  return handler
}

/**
 * The default command execution context. For example, if the
 * execution context is /foo/bar, and there is a command /foo/bar/baz,
 * then the issuance of a command "baz" will resolve to /foo/bar/baz.
 *
 * The default can be overridden either by changing the next line, or
 * by calling `setDefaultCommandContext`.
 *
 */
let _defaultContext: string[] = (theme && theme.defaultContext) || []
export const getDefaultCommandContext = () => _defaultContext

/**
 * Parse the given argv, and return an evaluator or throw an Error
 *
 */
const _read = async (
  model: CommandTree,
  argv: string[],
  contextRetry: string[],
  originalArgv: string[]
): Promise<boolean | CommandHandlerWithEvents> => {
  let leaf = treeMatch(model, argv, true) // true means read-only, don't modify the context model please
  let evaluator = leaf && leaf.$

  if (!evaluator) {
    //
    // maybe the plugin that supports this route hasn't been
    // loaded, yet; so: invoke the plugin resolver and retry
    //
    const route = `/${argv.join('/')}`
    await resolver.resolve(route)
    leaf = treeMatch(model, argv, true) // true means read-only, don't modify the context model please
    evaluator = leaf && leaf.$
  }

  if (!evaluator) {
    if (!contextRetry) {
      return false
    } else if (contextRetry.length === 0) {
      return _read(model, originalArgv, undefined, originalArgv)
    } else if (
      contextRetry.length > 0 &&
      contextRetry[contextRetry.length - 1] !== originalArgv[originalArgv.length - 1]
    ) {
      // command not found so far, look further afield.
      const maybeInContextRetry = _read(
        model,
        contextRetry.concat(originalArgv),
        contextRetry.slice(0, contextRetry.length - 1),
        originalArgv
      )

      if (maybeInContextRetry) {
        return maybeInContextRetry
      }

      // oof, fallback plan: look in the default context
      const newContext = _defaultContext.concat(originalArgv).filter((elt, idx, A) => elt !== A[idx - 1])
      const maybeInDefaultContext = _read(
        model,
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
          return _read(model, originalArgv, undefined, originalArgv)
        }
      }
    }

    return withEvents(evaluator, leaf)
  }
}

/**
 * The command context model, defaulting to the _defaultContext, which
 * can be overridden via `setDefaultCommandContext`.
 *
 */
const Context = {
  current: _defaultContext
}

/**
 * When commands are executed, the command resolver will use a
 * fallback prefix. This routine tries to discover, from the
 * environment, what the default fallback prefix should be.
 *
 */
export const setDefaultCommandContext = (commandContext: string[]) => {
  Context.current = _defaultContext = commandContext
}

/** read, with retries based on the current context */
const internalRead = (model: CommandTree, argv: string[]): Promise<boolean | CommandHandlerWithEvents> => {
  if (argv[0] === 'kui') argv.shift()
  return _read(model, argv, Context.current, argv)
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
 * See if a command resolves unambiguously
 *
 */
const disambiguate = async (argv: string[], noRetry = false) => {
  let idx: number
  const resolutions =
    (((idx = 0) || true) && resolver.disambiguate(argv[idx])) ||
    (argv.length > 1 && ((idx = argv.length - 1) || true) && resolver.disambiguate(argv[idx])) ||
    []

  if (resolutions.length === 0 && !noRetry) {
    // maybe we haven't loaded the plugin, yet
    await resolver.resolve(`/${argv.join('/')}`)
    return disambiguate(argv, true)
  } else if (resolutions.length === 1) {
    // one unambiguous resolution! great, but we need to
    // double-check: if the resolution is a subtree, then it better have a child that matches
    const argvForMatch = resolutions[0].route.split('/').slice(1)
    const cmdMatch = treeMatch(model, argvForMatch)
    const leaf =
      cmdMatch && cmdMatch.$ ? areCompatible(argvForMatch, argv) && cmdMatch : treeMatch(intentions, argvForMatch)

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
 * We could not find a registered command handler
 *
 */
const commandNotFound = async (argv: string[], partialMatches?: Command[], execOptions?: ExecOptions) => {
  // first, see if we have any catchall handlers; offer the argv, and
  // choose the highest priority handler that accepts the argv
  if (!execOptions || !execOptions.failWithUsage) {
    const catchallHandler = catchalls
      .filter(({ offer }) => offer(argv))
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
 * Command not found: let's find partial matches at head of the given
 * subtree. We hope that the last part of the argv is a partial match
 * for some command at this root. Return all such prefix matches.
 *
 */
const findPartialMatchesAt = (subtree: Command, partial: string): Command[] => {
  const matches = []

  if (subtree && subtree.children && partial) {
    for (const cmd in subtree.children) {
      if (cmd.indexOf(partial) === 0) {
        const match = subtree.children[cmd]
        if (!match.options || (!match.options.synonymFor && !match.options.hide)) {
          // don't include synonyms or hidden commands
          matches.push(match)
        }
      }
    }
  }

  return matches
}

interface Route {
  route: string
}

/** remove duplicates of leaf nodes from a given array */
const removeDuplicates = async (arr: Route[]): Promise<Route[]> => {
  return (await Promise.all(arr))
    .filter(x => x)
    .reduce(
      (state, item) => {
        const { M, A } = state
        // const route = item.route

        if (item && !M[item.route]) {
          M[item.route] = true
          A.push(item)
        }

        return state
      },
      { M: {}, A: [] }
    )['A']
}

export function isSuccessfulCommandResolution(
  resolution: CommandTreeResolution
): resolution is CommandHandlerWithEvents {
  return (resolution as CommandHandlerWithEvents).eval !== undefined
}
/** here, we don't use any implicit context resolutions */
export const readIntention = async (argv: string[], noRetry = false): Promise<CommandTreeResolution> => {
  const cmd = _read(intentions, argv, undefined, argv)

  if (!cmd) {
    if (!noRetry) {
      await resolver.resolve(`/${argv.join('/')}`)
      return readIntention(argv, true)
    }
  }

  if (!cmd) {
    return disambiguate(argv) || commandNotFound(argv)
  } else {
    return cmd
  }
}

/** here, we will use implicit context resolutions */
export const read = async (
  argv: string[],
  noRetry = false,
  noSubtreeRetry = false,
  execOptions: ExecOptions
): Promise<CommandTreeResolution> => {
  let cmd = await disambiguate(argv)

  if (cmd && resolver.isOverridden(cmd.route) && !noRetry) {
    await resolver.resolve(cmd.route)
    return read(argv, true, noSubtreeRetry, execOptions)
  }

  if (!cmd) {
    if (!noRetry) {
      await resolver.resolve(`/${argv.join('/')}`)
      cmd = (await disambiguate(argv)) || (await internalRead(model, argv))
    }
  }

  if (!cmd) {
    try {
      cmd = await readIntention(argv)
    } catch (err) {
      if (err.code === 404 && !noSubtreeRetry) {
        await resolver.resolve(`/${argv.join('/')}`, { subtree: true })
        return read(argv, false, true, execOptions)
      }
    }
  }

  if (!cmd) {
    // command not found, but maybe we can find partial matches
    // that might be helpful?
    let matches

    if (argv.length === 1) {
      // disambiguatePartial takes a partial command, and
      // returns an array of matching full commands, which we
      // can turn into leafs via `disambiguate`
      matches = await removeDuplicates(
        findPartialMatchesAt(model, argv[0]).concat(
          resolver
            .disambiguatePartial(argv[0])
            .map(_ => [_])
            .map(_ => disambiguate(_))
        )
      )
    } else {
      const allButLast = argv.slice(0, argv.length - 1)
      const last = argv[argv.length - 1]

      const parent = (await internalRead(model, allButLast)) || (await disambiguate(allButLast))
      if (parent) {
        matches = await removeDuplicates(findPartialMatchesAt(parent.subtree, last))
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

class CommandModel {
  /**
   * Call the given callback function `fn` for each node in the command tree
   *
   */
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  forEachNode(fn: (command: Command) => void) {
    const iter = (root: Command) => {
      if (root) {
        fn(root)
        if (root.children) {
          for (const cmd in root.children) {
            iter(root.children[cmd])
          }
        }
      }
    }
    iter(model)
  }
}

/**
 * Returns the command tree model
 *
 */
export const getModel = () => new CommandModel()

/**
 * Print the command tree to the browser console
 *   mostly helpful for debugging
 *
 */
// export const debug = () => console.log('Command Tree', model, disambiguator, intentions)

/**
 * To help with remembering from which plugin calls to listen emanate
 *
 */
export const proxy = (plugin: string) => ({
  catchall: (
    offer: CatchAllOffer,
    handler: CommandHandler,
    prio = 0,
    options: CommandOptions = new DefaultCommandOptions()
  ) => catchalls.push({ route: '*', offer, eval: handler, prio, plugin, options }),
  listen: (route: string, handler: CommandHandler, options: CommandOptions) =>
    listen(route, handler, Object.assign({}, options, { plugin })),
  intention: (route: string, handler: CommandHandler, options: CommandOptions) =>
    intention(route, handler, Object.assign({}, options, { plugin })),
  synonym: (route: string, handler: CommandHandler, master: Command, options: CommandOptions) =>
    synonym(route, handler, master, Object.assign({}, options, { plugin })),
  subtree,
  subtreeSynonym,
  commandNotFoundMessage,
  find: async (route: string, noOverride = true) => {
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
})
