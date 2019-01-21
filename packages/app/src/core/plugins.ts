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
import { PluginRegistration } from '../models/plugin'

debug('modules loaded')

export const pluginRoot = '../../../../plugins'

const commandToPlugin = {} // map from command to plugin that defines it
const isSubtreeSynonym = {}
const isSynonym = {}
const topological = {} // topological sort of the plugins (order they resolved)
const overrides = {} // some plugins override the behavior of others
const usage = {} // as we scan for plugins, we'll memoize their usage models
const flat = []
const registrar = {} // this is the registrar for plugins

let prescanned

debug('globals initialized')

/**
 * when in live (not scanning) mode, this will store the result of a
 * previous plugin scan
 */
let prescan

/**
 * Scan for plugins incorporated via app/plugins/package.json
 *
 */
export const scanForModules = (dir: string, quiet = false) => {
  debug('scanForModules %s', dir)

  const fs = require('fs')
  const path = require('path')
  const colors = require('colors/safe')

  try {
    const plugins = {}
    const preloads = {}

    const doScan = ({ modules, moduleDir }) => {
      modules.forEach(module => {
        const modulePath = path.join(moduleDir, module)

        if (module.charAt(0) === '@') {
          // support for @owner/repo style modules; see shell issue #260
          return doScan({ modules: fs.readdirSync(modulePath), moduleDir: modulePath })
        }

        function lookFor (filename: string, destMap: Object, color: string) {
          const pluginPath = path.join(moduleDir, module, filename)
          debug('lookFor', filename, pluginPath)

          if (fs.existsSync(pluginPath)) {
            if (!quiet) {
              console.log(colors.green('  \u2713 ') + colors[color](filename.replace(/\..*$/, '')) + '\t' + path.basename(module))
            }
            destMap[module] = pluginPath
          } else {
            const backupPluginPath = path.join(modulePath, 'src', filename)
            debug('lookFor2', filename, backupPluginPath)

            if (fs.existsSync(backupPluginPath)) {
              if (!quiet) {
                console.log(colors.green('  \u2713 ') + colors[color](filename.replace(/\..*$/, '')) + '\t' + path.basename(module))
              }
              destMap[module] = backupPluginPath
            } else {
              // console.error('Skipping plugin, because it does not have a plugin.js', module)
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
    doScan({ modules: fs.readdirSync(moduleDir), moduleDir })

    // scan any modules in package.json
    const packageJsonPath = path.join(dir, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonDeps = require(packageJsonPath)['dependencies']
      const packageJsonDepsArray = []

      for (let module in packageJsonDeps) {
        if (module.startsWith('shell-')) {
          packageJsonDepsArray.push(module)
        }
      }
      doScan({ modules: packageJsonDepsArray, moduleDir: path.join(dir, 'node_modules') })
    }

    return { plugins, preloads }
  } catch (e) {
    console.error('Error scanning for external plugins', e)
  }
}

/**
 * Allow one plugin to require another
 *
 */
const _prequire = module => {
  debug('_prequire %s', module)

  if (registrar.hasOwnProperty(module)) return registrar[module]
  else throw new Error('Module not found: ' + module)
}

/**
 * Turn a map {k1:true, k2:true} into an array of the keys
 *
 */
const toArray = M => {
  const A = []
  for (let key in M) {
    A.push(key)
  }
  return A
}

/**
 * Load one plugin for the given plugin route, located in the given pluginPath on the local filesystem
 *
 */
const loadPlugin = async (route, pluginPath) => {
  debug('loadPlugin %s', route)

  const deps = {}

  // for assembly mode, override prequire
  const preq = module => {
    deps[module] = true
    return _prequire(module)
  }

  // and override commandTree.listen
  const cmdToPlugin = {}
  const ctree = commandTree.proxy(route)
  const listen = ctree.listen
  const intention = ctree.intention
  const synonym = ctree.synonym
  const subtree = ctree.subtree
  const subtreeSynonym = ctree.subtreeSynonym

  ctree.subtreeSynonym = function (route, master) {
    if (route !== master.route) {
      isSubtreeSynonym[route] = true
      isSubtreeSynonym[master.route] = true
      return subtreeSynonym(route, master, {})
    }
  }
  ctree.listen = function (commandRoute) {
    cmdToPlugin[commandRoute] = route
    return listen.apply(undefined, arguments)
  }
  ctree.subtree = function (route, options) {
    return subtree(route, Object.assign({ listen: ctree.listen }, options))
  }
  ctree.intention = function (commandRoute) {
    cmdToPlugin[commandRoute] = route
    return intention.apply(undefined, arguments)
  }
  ctree.synonym = function (commandRoute) {
    cmdToPlugin[commandRoute] = route
    isSynonym[commandRoute] = true
    return synonym.apply(undefined, arguments)
  }

  const pluginLoaderRef = await import(pluginPath)
  const preloaderRef = await import(pluginPath)
  const pluginLoader: PluginRegistration = pluginLoaderRef.default || pluginLoaderRef

  if (typeof pluginLoader === 'function') {
    // invoke the plugin loader
    registrar[route] = await pluginLoader(ctree, preq, {})

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
    for (let k in cmdToPlugin) {
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
 */
const topologicalSortForScan = async (pluginPaths, iter) => {
  debug('topologicalSortForScan', iter)

  if (iter >= 100) {
    debug('unable to resolve plugins')
    throw new Error('Unable to resolve plugins')
  }

  let nUnresolved = 0
  const unresolved = []
  for (let route in pluginPaths) {
    debug('resolving %s', route)
    try {
      const module = { route: route, path: pluginPaths[route] }
      await loadPlugin(route, pluginPaths[route] /*, opts */)
      flat.push(module)
      delete pluginPaths[route]
    } catch (e) {
      if (e.message.indexOf('Module not found') < 0 || iter > 10) {
        console.error(e)
      }
      nUnresolved++
      unresolved.push(route)
    }
  }

  if (nUnresolved > 0) {
    debug('nUnresolved', nUnresolved, unresolved)
    return topologicalSortForScan(pluginPaths, iter + 1)
  } else {
    debug('topologicalSortForScan done')
  }
}

/**
 * Look for plugins by scanning the local filesystem
 *
 */
interface ILocalOptions {
  pluginRootAbsolute?: string
}
const resolveFromLocalFilesystem = async (opts: ILocalOptions = {}) => {
  debug('resolveFromLocalFilesystem')

  const path = require('path')
  const pluginRootAbsolute = path.join(__dirname, pluginRoot) // filesystem path for the plugins
  debug('pluginRootAbsolute', pluginRootAbsolute)

  const { plugins, preloads } = scanForModules(opts.pluginRootAbsolute || pluginRootAbsolute)

  debug('availablePlugins %s', JSON.stringify(plugins))

  // then, we load the plugins
  await topologicalSortForScan(plugins, 0)

  return preloads
}

/**
 * Load the prescan model, in preparation for loading the shell
 *
 */
export const init = async () => {
  debug('init')

  // global
  prescan = await loadPrescan(pluginRoot)

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
}

/**
 * Load the prescan model, in preparation for loading the shell
 *
 */
const loadPrescan = async (userDataDir: string) => {
  try {
    prescanned = await import('@kui/prescan')
    return prescanned
  } catch (err) {
    debug('prescanned does not exist or is not valid JSON', err)
  }
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

/**
 * Make a plugin resolver from a given prescan model
 *
 */
const makeResolver = prescan => {
  debug('makeResolver')

  /** memoize resolved plugins */
  const isResolved = {}

  /** resolve one given plugin */
  const resolveOne = async plugin => {
    debug('resolveOne', plugin)

    try {
      if (!plugin) {
        return
      } else if (!isResolved[plugin]) {
        isResolved[plugin] = new Promise(async (resolve, reject) => {
          try {
            const prereqs = prescan.topological[plugin]
            if (prereqs) {
              debug('resolveOne loading prereqs', plugin)
              await Promise.all(prereqs.map(prequire))
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
        debug('already resolved', plugin, isResolved[plugin])
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
    isOverridden: route => prescan.overrides[route],

    resolveOne,

    disambiguate: command => {
      debug('attempting to disambiguate command', command)
      return prescan.disambiguator[command]
    },

    /** given a partial command, do we have a disambiguation of it? e.g. "gr" => "grid" */
    disambiguatePartial: partial => {
      debug('attempting to disambiguate partial', partial)
      const matches = []
      if (prescan.disambiguator) {
        for (let command in prescan.disambiguator) {
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
    resolve: (command, { subtree = false } = {}) => { // subpath if we are looking for plugins for a subtree, e.g. for cd /auth
      debug('resolve', command)

      let plugin
      let matchLen
      for (let route in prescan.commandToPlugin) {
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
      } else {
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
 * Generate a prescan model
 *
 */
export const generatePrescanModel = async opts => {
  debug('generatePrescanModel', opts)

  const state = opts.externalOnly && commandTree.startScan()

  const preloads = await resolveFromLocalFilesystem(opts)

  const disambiguator = {}
  for (let route in commandToPlugin) {
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
    preloads: Object.keys(preloads).map(route => ({ route, path: preloads[route] })),
    commandToPlugin,
    topological,
    flat,
    overrides,
    usage,
    disambiguator: commandTree.endScan(state),
    catchalls: commandTree.catchalls
  }
}

/**
 * Assemble the plugins for faster loading
 *
 */
export const assemble = opts => generatePrescanModel(Object.assign({ assembly: true }, opts))

/** export the prequire function */
export const prequire = async (route, options?) => {
  debug('prequire %s', route)

  try {
    if (!registrar.hasOwnProperty(route)) {
      // note how we stash a promise in the registrar immediately, to
      // avoid race conditions with multiple threads trying to prequire
      // the same plugin
      registrar[route] = new Promise(async (resolve, reject) => {
        const module = prescan.flat.find(_ => _.route === route)
        if (module) {
          try {
            // NOTE ON @kui/plugins relativization: this is important so that
            // webpack can be isntructed to pull in the plugins into the build
            // see the corresponding NOTE in ./plugin-assembler.ts and ./preloader.ts
            const registrationRef = await import('@kui/plugins/' + module.path)
            const registration: PluginRegistration = registrationRef.default || registrationRef
            const combinedOptions = Object.assign({ usage: prescan.usage, docs: prescan.docs }, options)

            resolve(registration(commandTree.proxy(route), prequire, combinedOptions))
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

/**
 * Plugin preloading support
 *
 */
import preloader from './preloader'
export const preload = () => preloader(prequire, commandTree, prescan, { usage: prescan.usage, docs: prescan.docs })

/** print to the javascript console the registered plugins */
// export const debug = () => console.log('Installed plugins', registrar)

debug('done loading')
