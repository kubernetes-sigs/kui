/*
 * Copyright 2017-2019 IBM Corporation
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
const debug = Debug('core/plugins/scanner')
debug('loading')

import { pluginRoot } from './plugins'
import { PrescanModel, PrescanUsage } from './prescan'

import * as commandTree from '../core/command-tree'
import { Command, CommandHandler, CommandOptions, KResponse, ParsedOptions } from '../models/command'
import { isCodedError } from '../models/errors'
import { KuiPlugin, PluginRegistration } from '../models/plugin'

import { getModel } from '../commands/tree'

/**
 * A data structure to facilitate computation of the Prescan model
 *
 */
class ScanCache {
  public readonly registrar: Record<string, KuiPlugin>

  /** map from command to plugin *name* that defines it */
  public readonly commandToPlugin: Record<string, string> = {}

  /**  topological sort of the plugins (order they resolved) */
  public readonly topological: Record<string, string[]> = {}

  /** some plugins override the behavior of others */
  public readonly overrides: Record<string, string> = {}

  /** as we scan for plugins, we'll memoize their usage models */
  public readonly usage: PrescanUsage = {}

  // TODO document
  public readonly flat: { route: string; path: string }[] = []
  public readonly isSubtreeSynonym: Record<string, boolean> = {}
  public readonly isSynonym: Record<string, boolean> = {}

  public constructor(registrar: Record<string, KuiPlugin>) {
    this.registrar = registrar
  }
}

/**
 * Override the standard ImplForPlugins with some extra state that we
 * need for scanning.
 *
 */
class CommandRegistrarForScan extends commandTree.ImplForPlugins {
  /** map to plugin *name* */
  public readonly cmdToPlugin: Record<string, string> = {}

  public constructor(plugin: string, private readonly scanCache: ScanCache) {
    super(plugin)
  }

  public subtreeSynonym<T extends KResponse, O extends ParsedOptions>(route: string, master: Command<T, O>) {
    if (route !== master.route) {
      this.scanCache.isSubtreeSynonym[route] = true
      this.scanCache.isSubtreeSynonym[master.route] = true
      return super.subtreeSynonym(route, master, {})
    }
  }

  public listen<T extends KResponse, O extends ParsedOptions>(
    route: string,
    handler: CommandHandler<T, O>,
    options: CommandOptions
  ) {
    this.cmdToPlugin[route] = this.plugin
    return super.listen(route, handler, options)
  }

  public subtree<T extends KResponse, O extends ParsedOptions>(route: string, options: CommandOptions): Command<T, O> {
    return super.subtree(
      route,
      Object.assign(
        {
          listen: this.listen.bind(this)
        },
        options
      )
    )
  }

  public synonym<T extends KResponse, O extends ParsedOptions>(
    route: string,
    handler: CommandHandler<T, O>,
    master: Command<T, O>,
    options: CommandOptions
  ) {
    this.cmdToPlugin[route] = this.plugin
    this.scanCache.isSynonym[route] = true
    return super.synonym(route, handler, master, options)
  }
}

/**
 * Load one plugin for the given plugin route, located in the given pluginPath on the local filesystem
 *
 */
const loadPlugin = async (route: string, pluginPath: string, scanCache: ScanCache) => {
  debug('loadPlugin %s', route)

  // create a CommandRegistrar instance for this one plugin load
  const ctree = new CommandRegistrarForScan(route, scanCache)

  const pluginLoaderRef: PluginRegistration | { default: PluginRegistration } = await import(pluginPath)
  function isDirect(loader: PluginRegistration | { default: PluginRegistration }): loader is PluginRegistration {
    return typeof loader === 'function'
  }
  const pluginLoader: PluginRegistration = isDirect(pluginLoaderRef) ? pluginLoaderRef : pluginLoaderRef.default

  if (typeof pluginLoader === 'function') {
    // invoke the plugin loader
    scanCache.registrar[route] = await pluginLoader(ctree, {} as { usage: PrescanUsage })

    // generate a mapping from commands (e.g. "/git/status" which is
    // hosted by the bash-like plugin) to plugin (e.g. "bash-like"),
    // which services that command
    const { cmdToPlugin } = ctree
    for (const k in cmdToPlugin) {
      if (scanCache.commandToPlugin[k]) {
        debug('override', k, cmdToPlugin[k], scanCache.commandToPlugin[k])
        scanCache.overrides[k] = cmdToPlugin[k]
      } else {
        debug('not override', k, cmdToPlugin[k])
      }
      scanCache.commandToPlugin[k] = cmdToPlugin[k]
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
  scanCache: ScanCache,
  pluginPaths: Record<string, string>,
  iter: number,
  lastError?: Error,
  lastErrorAlreadyEmitted?: boolean
): Promise<void> => {
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
  const unresolved: string[] = []
  for (const route in pluginPaths) {
    debug('resolving %s', route)
    try {
      const module = { route, path: pluginPaths[route] }
      await loadPlugin(route, pluginPaths[route], scanCache)
      scanCache.flat.push(module)
      delete pluginPaths[route]
    } catch (err) {
      const notFound = err.message.indexOf('Module not found') >= 0 || err.message.indexOf('Cannot find module') >= 0
      if ((!notFound || iter > 10) && lastError && lastError.message !== err.message) {
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
      debug('retry on', err)
      lastError = err
      nUnresolved++
      unresolved.push(route)
    }
  }

  if (nUnresolved > 0) {
    debug('nUnresolved', nUnresolved, unresolved)
    return topologicalSortForScan(scanCache, pluginPaths, iter + 1, lastError, lastErrorAlreadyEmitted)
  } else {
    debug('topologicalSortForScan done')
  }
}

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
    const plugins: Record<string, string> = {}
    const preloads: Record<string, string> = {}

    const doScan = ({
      modules,
      moduleDir,
      parentPath
    }: {
      modules: string[]
      moduleDir: string
      parentPath?: string
    }) => {
      debug('doScan', modules)

      modules.forEach(module => {
        const modulePath = path.join(moduleDir, module)
        const name = (parentPath ? `${parentPath}/` : '') + module

        if (module.charAt(0) === '@') {
          // support for @owner/repo style modules; see shell issue #260
          return doScan({
            modules: fs.readdirSync(modulePath),
            moduleDir: modulePath,
            parentPath: module
          })
        }

        function lookFor(filename: string, destMap: Record<string, string>, colorFn: (str: string) => string) {
          const pluginPath = path.join(moduleDir, module, filename)
          debug('lookFor', filename, pluginPath)

          if (fs.existsSync(pluginPath)) {
            if (!quiet) {
              debug('found', name)
              console.log(
                colors.green('  \u2713 ') + colorFn(filename.replace(/\..*$/, '')) + '\t' + path.basename(module)
              )
            }
            destMap[name] = pluginPath
          } else {
            const backupPluginPath = path.join(modulePath, 'dist', filename)
            debug('lookFor2', filename, backupPluginPath)

            if (fs.existsSync(backupPluginPath)) {
              if (!quiet) {
                debug('found2', name)
                console.log(
                  colors.green('  \u2713 ') + colorFn(filename.replace(/\..*$/, '')) + '\t' + path.basename(module)
                )
              }
              destMap[name] = backupPluginPath
            } else {
              // support for javascript-coded plugins (monorepo)
              const backupPluginPath = path.join(modulePath, 'src/plugin', filename)
              debug('lookFor3', filename, backupPluginPath)

              if (fs.existsSync(backupPluginPath)) {
                if (!quiet) {
                  debug('found3', name)
                  console.log(
                    colors.green('  \u2713 ') + colorFn(filename.replace(/\..*$/, '')) + '\t' + path.basename(module)
                  )
                }
                destMap[name] = backupPluginPath
              } else {
                // support for javascript-coded plugins (external client)
                const backupPluginPath = path.join(modulePath, 'plugin', filename)
                debug('lookFor4', filename, backupPluginPath)

                if (fs.existsSync(backupPluginPath)) {
                  if (!quiet) {
                    debug('found4', name)
                    console.log(
                      colors.green('  \u2713 ') + colorFn(filename.replace(/\..*$/, '')) + '\t' + path.basename(module)
                    )
                  }
                  destMap[name] = backupPluginPath
                  // console.error('Skipping plugin, because it does not have a plugin.js', module)
                }
              }
            }
          }
        }

        lookFor('plugin.js', plugins, colors.bold)
        lookFor('preload.js', preloads, colors.dim)
      })
    }

    // scan the app/plugins/modules directory
    const moduleDir = dir // path.join(dir, 'modules')
    debug('moduleDir', moduleDir)
    doScan({ modules: fs.readdirSync(moduleDir).filter(filter), moduleDir })

    return { plugins, preloads }
  } catch (err) {
    if (isCodedError<string>(err) && err.code !== 'ENOENT') {
      console.error('Error scanning for external plugins', err)
    }
    return {}
  }
}

/**
 * Look for plugins by scanning the local filesystem
 *
 */
const resolveFromLocalFilesystem = async (scanCache: ScanCache, opts: PrescanOptions = {}) => {
  debug('resolveFromLocalFilesystem')

  const { dirname, join } = await import('path')
  const pluginRootAbsolute = process.env.PLUGIN_ROOT || opts.pluginRoot || join(__dirname, pluginRoot) // filesystem path for the plugins
  debug('pluginRootAbsolute', pluginRootAbsolute)

  // this scan looks for plugins offered by the client
  const clientHosted = await scanForModules(opts.pluginRoot || pluginRootAbsolute)

  let plugins: Record<string, string> = clientHosted.plugins || {}
  let preloads: Record<string, string> = clientHosted.preloads || {}

  // this scan looks for plugins npm install'd by the client
  if (!opts.externalOnly) {
    let clientRequired: { plugins?: Record<string, string>; preloads?: Record<string, string> }
    try {
      const secondary = dirname(dirname(require.resolve('@kui-shell/core/package.json')))
      clientRequired = await scanForModules(secondary, false, (filename: string) => !!filename.match(/^plugin-/))
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('error scanning for client-required plugins', err)
      }
    }

    // we take the union of the client-provided plugins and the
    // client-required plugins note: place clientRequired first, so
    // that we process the registrations in clientRequired plugins
    // first (this processing occurs in topologicalSortForScan);
    // nodejs guarantees FIFO iteration order for object properties
    // https://github.com/IBM/kui/issues/3191
    plugins = Object.assign({}, clientRequired.plugins, clientHosted.plugins)
    preloads = Object.assign({}, clientRequired.preloads, clientHosted.preloads)
  }

  debug('availablePlugins %s', JSON.stringify(plugins))

  // then, we load the plugins
  await topologicalSortForScan(scanCache, plugins, 0)

  return preloads
}

/**
 * Generate a prescan model
 *
 */
export const generatePrescanModel = async (
  registrar: Record<string, KuiPlugin>,
  opts: PrescanOptions
): Promise<PrescanModel> => {
  debug('generatePrescanModel', opts)

  // this will store the state of a scan
  const scanCache = new ScanCache(registrar)

  // do the scan, which will populate that StateCache instance
  const preloads = await resolveFromLocalFilesystem(scanCache, opts)

  const disambiguator: Record<string, string | true> = {}
  for (const route in scanCache.commandToPlugin) {
    const A = route.split('/')
    for (let idx = 1; idx < A.length; idx++) {
      const cmd = `/${A.slice(idx).join('/')}`
      if (!disambiguator[cmd] && (route === cmd || !scanCache.commandToPlugin[route])) {
        // this is, so far, an unambiguous resolution, and we don't
        // have a specific resolution for this cmd
        disambiguator[cmd] = route
        scanCache.commandToPlugin[cmd] = scanCache.commandToPlugin[route]
      } else if (disambiguator[cmd]) {
        // a conflict. is it a subtree-synonym conflcit? if so ignore the conflict
        const subtree = route.substring(0, route.lastIndexOf('/'))
        if (!scanCache.isSubtreeSynonym[subtree]) {
          if (disambiguator[cmd] === cmd) {
            // rule in favor of what we have
          } else if (route === cmd) {
            // rule in favor of the new one
            disambiguator[cmd] = route
            scanCache.commandToPlugin[cmd] = scanCache.commandToPlugin[route]
          } else {
            // collision, remove the previous disambiguator
            disambiguator[cmd] = true
            delete scanCache.commandToPlugin[cmd]
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
    commandToPlugin: scanCache.commandToPlugin,
    topological: scanCache.topological,
    flat: scanCache.flat,
    overrides: scanCache.overrides,
    usage: scanCache.usage,
    disambiguator: undefined,
    catchalls: getModel().catchalls,
    docs: undefined // assembler.ts will fill this in
  }
}

interface PrescanOptions {
  assembly?: boolean
  pluginRoot?: string
  externalOnly?: boolean
}

/**
 * Assemble the plugins for faster loading
 *
 */
export const assemble = (registrar: Record<string, KuiPlugin>, opts: PrescanOptions): Promise<PrescanModel> => {
  return generatePrescanModel(registrar, Object.assign({ assembly: true }, opts))
}
