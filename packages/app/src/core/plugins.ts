/*
 * Copyright 2017-2018 IBM Corporation
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
const debug = Debug('core/plugins')
debug('loading')

import * as commandTree from './command-tree'
import { KuiPlugin, PluginRegistration } from '../models/plugin'
import { CommandBase, Disambiguator, CatchAllHandler } from '../models/command'

/**
 * Plugin preloading support
 *
 */
import preloader from './preloader'

debug('modules loaded')

export const pluginRoot = '../../../../plugins'

const commandToPlugin = {} // map from command to plugin that defines it
const isSubtreeSynonym = {}
const isSynonym = {}
const topological = {} // topological sort of the plugins (order they resolved)
const overrides = {} // some plugins override the behavior of others
const usage = {} // as we scan for plugins, we'll memoize their usage models
const flat = []
const registrar: { [key: string]: KuiPlugin } = {} // this is the registrar for plugins

let prescanned: PrescanModel

debug('globals initialized')

/**
 * when in live (not scanning) mode, this will store the result of a
 * previous plugin scan
 */
let prescan: PrescanModel

/**
 * Scan for plugins incorporated via app/plugins/package.json
 *
 */
type Filter = (path: string) => boolean
export const scanForModules = async (dir: string, quiet = false, filter: Filter = () => true) => {
  debug('scanForModules %s', dir)

  const fs = await import('fs')
  const path = await import('path')
  const colors = await import('colors/safe')

  try {
    const plugins = {}
    const preloads = {}

    const doScan = ({ modules, moduleDir }: { modules: string[]; moduleDir: string }) => {
      modules.forEach(module => {
        const modulePath = path.join(moduleDir, module)

        if (module.charAt(0) === '@') {
          // support for @owner/repo style modules; see shell issue #260
          return doScan({
            modules: fs.readdirSync(modulePath),
            moduleDir: modulePath
          })
        }

        // eslint-disable-next-line @typescript-eslint/ban-types
        function lookFor(filename: string, destMap: Object, color: string) {
          const pluginPath = path.join(moduleDir, module, filename)
          debug('lookFor', filename, pluginPath)

          if (fs.existsSync(pluginPath)) {
            if (!quiet) {
              debug('found')
              console.log(
                colors.green('  \u2713 ') + colors[color](filename.replace(/\..*$/, '')) + '\t' + path.basename(module)
              )
            }
            destMap[module] = pluginPath
          } else {
            const backupPluginPath = path.join(modulePath, 'src', filename)
            debug('lookFor2', filename, backupPluginPath)

            if (fs.existsSync(backupPluginPath)) {
              if (!quiet) {
                debug('found2')
                console.log(
                  colors.green('  \u2713 ') +
                    colors[color](filename.replace(/\..*$/, '')) +
                    '\t' +
                    path.basename(module)
                )
              }
              destMap[module] = backupPluginPath
            } else {
              // support for javascript-coded plugins (monorepo)
              const backupPluginPath = path.join(modulePath, 'src/plugin', filename)
              debug('lookFor3', filename, backupPluginPath)

              if (fs.existsSync(backupPluginPath)) {
                if (!quiet) {
                  debug('found3')
                  console.log(
                    colors.green('  \u2713 ') +
                      colors[color](filename.replace(/\..*$/, '')) +
                      '\t' +
                      path.basename(module)
                  )
                }
                destMap[module] = backupPluginPath
              } else {
                // support for javascript-coded plugins (external client)
                const backupPluginPath = path.join(modulePath, 'plugin', filename)
                debug('lookFor4', filename, backupPluginPath)

                if (fs.existsSync(backupPluginPath)) {
                  if (!quiet) {
                    debug('found4')
                    console.log(
                      colors.green('  \u2713 ') +
                        colors[color](filename.replace(/\..*$/, '')) +
                        '\t' +
                        path.basename(module)
                    )
                  }
                  destMap[module] = backupPluginPath
                  // console.error('Skipping plugin, because it does not have a plugin.js', module)
                }
              }
            }
          }
        }

        lookFor('plugin.js', plugins, 'bold')
        lookFor('preload.js', preloads, 'dim')
      })
    }

    // scan the app/plugins/modules directory
    const moduleDir = dir // path.join(dir, 'modules')
    debug('moduleDir', moduleDir)
    doScan({ modules: fs.readdirSync(moduleDir).filter(filter), moduleDir })

    // scan any modules in package.json
    const packageJsonPath = path.join(dir, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonDeps = require(packageJsonPath)['dependencies']
      const packageJsonDepsArray = []

      for (const module in packageJsonDeps) {
        if (module.startsWith('shell-')) {
          packageJsonDepsArray.push(module)
        }
      }
      doScan({
        modules: packageJsonDepsArray,
        moduleDir: path.join(dir, 'node_modules')
      })
    }

    return { plugins, preloads }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error scanning for external plugins', err)
    }
    return {}
  }
}

/**
 * Turn a map {k1:true, k2:true} into an array of the keys
 *
 */
function toArray<T>(M: { [key: string]: T }): string[] {
  const A: string[] = []
  for (const key in M) {
    A.push(key)
  }
  return A
}

/**
 * Load one plugin for the given plugin route, located in the given pluginPath on the local filesystem
 *
 */
const loadPlugin = async (route: string, pluginPath: string) => {
  debug('loadPlugin %s', route)

  const deps: { [key: string]: boolean } = {}

  // and override commandTree.listen
  const cmdToPlugin = {}
  const ctree = commandTree.proxy(route)
  const listen = ctree.listen
  const intention = ctree.intention
  const synonym = ctree.synonym
  const subtree = ctree.subtree
  const subtreeSynonym = ctree.subtreeSynonym

  ctree.subtreeSynonym = function(route, master) {
    if (route !== master.route) {
      isSubtreeSynonym[route] = true
      isSubtreeSynonym[master.route] = true
      return subtreeSynonym(route, master, {})
    }
  }
  ctree.listen = function(commandRoute) {
    cmdToPlugin[commandRoute] = route
    // eslint-disable-next-line prefer-rest-params, prefer-spread
    return listen.apply(undefined, arguments)
  }
  ctree.subtree = function(route, options) {
    return subtree(route, Object.assign({ listen: ctree.listen }, options))
  }
  ctree.intention = function(commandRoute) {
    cmdToPlugin[commandRoute] = route
    // eslint-disable-next-line prefer-rest-params, prefer-spread
    return intention.apply(undefined, arguments)
  }
  ctree.synonym = function(commandRoute) {
    cmdToPlugin[commandRoute] = route
    isSynonym[commandRoute] = true
    // eslint-disable-next-line prefer-rest-params, prefer-spread
    return synonym.apply(undefined, arguments)
  }

  const pluginLoaderRef = await import(pluginPath)
  const pluginLoader: PluginRegistration = pluginLoaderRef.default || pluginLoaderRef

  if (typeof pluginLoader === 'function') {
    // invoke the plugin loader
    registrar[route] = await pluginLoader(ctree, {})

    // turn the deps map, which is a canonicalization map from
    // module=>true (i.e. we use it to remove duplicates), into an
    // array of the non-duplicate modules
    const adeps = toArray(deps)
    if (adeps.length > 0) {
      topological[route] = adeps
    }

    // generate a mapping from commands (e.g. "/git/status" which is
    // hosted by the bash-like plugin) to plugin (e.g. "bash-like"),
    // which services that command
    for (const k in cmdToPlugin) {
      if (commandToPlugin[k]) {
        debug('override', k, cmdToPlugin[k], commandToPlugin[k])
        overrides[k] = cmdToPlugin[k]
      } else {
        debug('not override', k, cmdToPlugin[k])
      }
      commandToPlugin[k] = cmdToPlugin[k]
    }
  }
}

/**
 * Attempt to load the plugins during a plugin scan
 *
 * @param lastError so we don't repeat making the same mistake 100 times!
 *
 */
const topologicalSortForScan = async (
  pluginPaths: string[],
  iter: number,
  lastError?: Error,
  lastErrorAlreadyEmitted?: boolean
) => {
  debug('topologicalSortForScan', iter)

  if (iter >= 100) {
    debug('unable to resolve plugins')
    if (lastError) {
      if (!lastErrorAlreadyEmitted) {
        throw lastError
      } // fallthrough intentional

      throw new Error('Unable to resolve plugins')
    }
  }

  let nUnresolved = 0
  const unresolved = []
  for (const route in pluginPaths) {
    debug('resolving %s', route)
    try {
      const module = { route: route, path: pluginPaths[route] }
      await loadPlugin(route, pluginPaths[route] /*, opts */)
      flat.push(module)
      delete pluginPaths[route]
    } catch (err) {
      const notFound = err.message.indexOf('Module not found') >= 0 || err.message.indexOf('Cannot find module') >= 0
      if ((!notFound || iter > 10) && (lastError && lastError.message !== err.message)) {
        //
        // note how we do not print the error if any of three
        // conditions hold (but we still continue iterating)
        //
        // 1. Module not found errors; these are why we have to iterate, because of inter-module dependencies
        //
        // 2. don't print errors for the first 10 iterations; only print errors if they persist
        //
        // 3. if this error is the same as the last; no sense in repeating ourselves
        //
        debug('not retrying')
        console.error(err)
        lastErrorAlreadyEmitted = true
      }

      //
      // let's try again; here we are implementing a fixpoint
      // computation by iterating till convergence; this fixpoint
      // gives us the topological sort without having to bother
      // computing the topological sort!
      //
      lastError = err
      nUnresolved++
      unresolved.push(route)
    }
  }

  if (nUnresolved > 0) {
    debug('nUnresolved', nUnresolved, unresolved)
    return topologicalSortForScan(pluginPaths, iter + 1, lastError, lastErrorAlreadyEmitted)
  } else {
    debug('topologicalSortForScan done')
  }
}

/**
 * Look for plugins by scanning the local filesystem
 *
 */
interface LocalOptions extends PrescanOptions {
  pluginRootAbsolute?: string
}
const resolveFromLocalFilesystem = async (opts: LocalOptions = {}) => {
  debug('resolveFromLocalFilesystem')

  const path = await import('path')
  const pluginRootAbsolute = process.env.PLUGIN_ROOT || path.join(__dirname, pluginRoot) // filesystem path for the plugins
  debug('pluginRootAbsolute', pluginRootAbsolute)

  // this scan looks for plugins offered by the client
  const clientHosted = await scanForModules(opts.pluginRootAbsolute || pluginRootAbsolute)

  // this scan looks for plugins npm install'd by the client
  let clientRequired
  try {
    const secondary = path.dirname(path.dirname(require.resolve('@kui-shell/core/package.json')))
    clientRequired = await scanForModules(secondary, false, (filename: string) => !!filename.match(/^plugin-/))
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('error scanning for client-required plugins', err)
    }
  }

  // we take the union of the client-provided plugins and the client-required plugins
  const plugins = Object.assign({}, clientHosted.plugins, clientRequired.plugins)
  const preloads = Object.assign({}, clientHosted.preloads, clientRequired.preloads)

  debug('availablePlugins %s', JSON.stringify(plugins))

  // then, we load the plugins
  await topologicalSortForScan(plugins, 0)

  return preloads
}

/**
 * Load the prescan model, in preparation for loading the shell
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loadPrescan = async (userDataDir: string): Promise<PrescanModel> => {
  try {
    prescanned = (await import('@kui-shell/prescan')) as PrescanModel
    return prescanned
  } catch (err) {
    debug('prescanned does not exist or is not valid JSON', err)
  }
}

/** export the prequire function */
const prequire = async (route: string, options?: object) => {
  debug('prequire %s', route)

  try {
    if (!Object.prototype.hasOwnProperty.call(registrar, route)) {
      // note how we stash a promise in the registrar immediately, to
      // avoid race conditions with multiple threads trying to prequire
      // the same plugin
      // eslint-disable-next-line no-async-promise-executor
      registrar[route] = new Promise(async (resolve, reject) => {
        const module = prescan.flat.find(_ => _.route === route)
        if (module) {
          try {
            // NOTE ON @kui-shell relativization: this is important so that
            // webpack can be isntructed to pull in the plugins into the build
            // see the corresponding NOTE in ./plugin-assembler.ts and ./preloader.ts
            const registrationRef = await import('@kui-shell/plugin-' + module.path.replace(/^plugin-/, ''))
            const registration: PluginRegistration = registrationRef.default || registrationRef
            const combinedOptions = Object.assign({ usage: prescan.usage, docs: prescan.docs }, options)

            resolve(registration(commandTree.proxy(route), combinedOptions))
            debug('prequire success %s', route)
          } catch (err) {
            console.error(`prequire error ${route}`, err)
            reject(err)
          }
        }
      })
    }

    debug('prequire success', route)
  } catch (err) {
    debug('prequire failure', route)
    console.error(err)
  }

  return registrar[route]
}
export const preload = () => {
  debug('invoking preloader')
  preloader(prescan, { usage: prescan.usage, docs: prescan.docs })
}

export interface PluginResolver {
  resolve: (route: string, options?: { subtree: boolean }) => void
  disambiguate: (route: string) => CommandBase[]
  disambiguatePartial: (partial: string) => string[]
  resolveOne: (route: string) => Promise<void>
  isOverridden: (route: string) => boolean
}

/**
 * Make a plugin resolver from a given prescan model
 *
 */
const makeResolver = (prescan: PrescanModel): PluginResolver => {
  debug('makeResolver')

  /** memoize resolved plugins */
  const isResolved = {}

  /** resolve one given plugin */
  const resolveOne = async (plugin: string): Promise<KuiPlugin> => {
    debug('resolveOne', plugin)

    try {
      if (!plugin) {
        return
      } else if (!isResolved[plugin]) {
        // eslint-disable-next-line no-async-promise-executor
        isResolved[plugin] = new Promise(async (resolve, reject) => {
          try {
            const prereqs = prescan.topological[plugin]
            if (prereqs) {
              debug('resolveOne loading prereqs', plugin)
              await Promise.all(prereqs.map(route => prequire(route)))
            }

            debug('resolveOne loading plugin', plugin)
            const loadedPlugin = prequire(plugin)
            debug('resolveOne loading plugin done', plugin)
            resolve(loadedPlugin)
          } catch (err) {
            console.error(`Error resolving plugin ${plugin}`, err)
            reject(err)
          }
        })
      } else {
        debug('already resolved', plugin)
      }

      // NOTE: even if isResolved[plugin] already has an entry, we may
      // need to wait for it to complete, if there is a race between
      // two threads trying to load the plugin
      return isResolved[plugin]
    } finally {
      debug('resolveOne done', plugin)
    }
  } /* resolveOne */

  /** a plugin resolver impl */
  const resolver = {
    isOverridden: (route: string): boolean => prescan.overrides[route] !== undefined,

    resolveOne,

    disambiguate: (command: string) => {
      debug('attempting to disambiguate command', command)
      return prescan.disambiguator[command]
    },

    /** given a partial command, do we have a disambiguation of it? e.g. "gr" => "grid" */
    disambiguatePartial: (partial: string): string[] => {
      debug('attempting to disambiguate partial', partial)
      const matches: string[] = []
      if (prescan.disambiguator) {
        for (const command in prescan.disambiguator) {
          if (command.indexOf(partial) === 0) {
            // const { route, plugin } = prescan.disambiguator[command]
            matches.push(command)
          }
        }
      }

      debug('disambiguate partial', partial, matches)
      return matches
    },

    /** load any plugins required by the given command */
    resolve: (command: string, { subtree = false } = {}) => {
      // subpath if we are looking for plugins for a subtree, e.g. for cd /auth
      debug('resolve', command)

      let plugin
      let matchLen
      for (const route in prescan.commandToPlugin) {
        if (route === command) {
          plugin = prescan.commandToPlugin[route]
          break
        } else if (subtree ? route.indexOf(command) === 0 : command.indexOf(`${route}/`) === 0) {
          if (!matchLen || route.length > matchLen) {
            plugin = prescan.commandToPlugin[route]
            matchLen = route.length
          }
        }
      }
      if (plugin) {
        return resolveOne(plugin)
      } else if (prescan.catchalls.length > 0) {
        // see if we have catchall
        debug('scanning catchalls', prescan.catchalls)
        return Promise.all(prescan.catchalls.map(_ => resolveOne(_.plugin)))
      }
    }
  } /* resolver */

  debug('makeResolver done')
  return resolver
} /* makeResolver */

/**
 * Load the prescan model, in preparation for loading the shell
 *
 * @return truthy value if we indeed did the initialization
 */
export const init = async () => {
  debug('init')

  if (prescan) {
    return false
  }

  // global
  prescan = (await loadPrescan(pluginRoot)) as PrescanModel
  debug('prescan loaded')

  // disabled: userData plugins
  /* .then(builtins => loadPrescan(path.join(app.getPath('userData'), 'plugins'))
      .catch(err => {
        debug('no user-installed plugins, due to %s', err)
        return {}
      })
      .then(unify(builtins)) // merge builtin plugins with user-installed plugins
  */

  commandTree.setPluginResolver(makeResolver(prescan))

  debug('init done')
  return true
}

/**
 * Unify two prescan models
 *
 */
/* const unify = m1 => m2 => {
  debug('unify')

  const unified = {}

  for (let key in m1) {
    const v1 = m1[key]
    const v2 = m2[key]

    unified[key] = v1

    if (v2) {
      debug('unifying user-installed model for %s', key)
      if (Array.isArray(v1)) {
        unified[key] = v1.concat(v2)
      } else {
        for (let kk in v2) {
          v1[kk] = v2[kk]
        }
      }
    }
  }

  return unified
} */

interface PrescanCommandDefinition {
  route: string
  path: string
}
export type PrescanCommandDefinitions = PrescanCommandDefinition[]
export interface PrescanDocs {
  [key: string]: string
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrescanUsage = any // FIXME something like: { [key: string]: ICommandOptions }
export interface PrescanModel {
  docs: PrescanDocs
  preloads: PrescanCommandDefinitions
  commandToPlugin: { [key: string]: string }
  topological: { [key: string]: string[] }
  flat: PrescanCommandDefinitions
  overrides: { [key: string]: string }
  usage: PrescanUsage
  disambiguator: Disambiguator
  catchalls: CatchAllHandler[]
}

interface PrescanOptions {
  externalOnly?: boolean
}

/**
 * Generate a prescan model
 *
 */
export const generatePrescanModel = async (opts: PrescanOptions): Promise<PrescanModel> => {
  debug('generatePrescanModel', opts)

  const state = opts.externalOnly && commandTree.startScan()

  const preloads = await resolveFromLocalFilesystem(opts)

  const disambiguator = {}
  for (const route in commandToPlugin) {
    const A = route.split('/')
    for (let idx = 1; idx < A.length; idx++) {
      const cmd = `/${A.slice(idx).join('/')}`
      if (!disambiguator[cmd]) {
        // this is, so far, an unambiguous resolution
        disambiguator[cmd] = route
        commandToPlugin[cmd] = commandToPlugin[route]
      } else {
        // a conflict. is it a subtree-synonym conflcit? if so ignore the conflict
        const subtree = route.substring(0, route.lastIndexOf('/'))
        if (!isSubtreeSynonym[subtree]) {
          if (disambiguator[cmd] === cmd) {
            // rule in favor of what we ahve
          } else if (route === cmd) {
            // rule in favor of the new one
            disambiguator[cmd] = route
            commandToPlugin[cmd] = commandToPlugin[route]
          } else {
            // collision, remove the previous disambiguator
            disambiguator[cmd] = true
            delete commandToPlugin[cmd]
          }
        }
      }
    }
  }

  return {
    preloads: Object.keys(preloads).map(route => ({
      route,
      path: preloads[route]
    })),
    commandToPlugin,
    topological,
    flat,
    overrides,
    usage,
    disambiguator: commandTree.endScan(state),
    catchalls: commandTree.catchalls,
    docs: undefined // plugin-assembler will fill this in
  }
}

/**
 * Assemble the plugins for faster loading
 *
 */
export const assemble = (opts: PrescanOptions): Promise<PrescanModel> => {
  return generatePrescanModel(Object.assign({ assembly: true }, opts))
}

/** print to the javascript console the registered plugins */
// export const debug = () => console.log('Installed plugins', registrar)

debug('done loading')
