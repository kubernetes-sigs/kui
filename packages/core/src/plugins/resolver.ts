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

import { PrescanModel } from './prescan'

import { mainPath, webpackPath } from './path'
import { proxy } from '../core/command-tree'
import { CommandBase } from '../models/command'
import { isHeadless } from '../core/capabilities'
import { KuiPlugin, PluginRegistration } from '../models/plugin'

const debug = Debug('core/plugins/resolver')

export interface PluginResolver {
  /**
   * Look for a plugin that might be able to handle the given
   * `route`. If `tryCatchalls` is true, then the caller is desperate,
   * and wants us to see if there are any plugins that might have a
   * catchall that could possibly service the given `route`.
   *
   */
  resolve: (route: string, options?: { subtree?: boolean; tryCatchalls: boolean }) => void

  disambiguate: (route: string) => CommandBase[]
  disambiguatePartial: (partial: string) => string[]

  /**
   * Unconditionally resolve the given named `plugin`
   *
   */
  resolveOne: (plugin: string) => Promise<KuiPlugin>

  /**
   * Has the given `route` been overridden by some plugin?
   *
   */
  isOverridden: (route: string) => boolean

  /**
   * Is the given `plugin` the definitive master of the given `route`?
   * it might not be, if some other plugin has overridden it
   */
  isAlpha: (route: string, plugin: string) => boolean
}

/** export the prequire function */
const prequire = async (
  route: string,
  prescan: PrescanModel,
  registrar: Record<string, KuiPlugin>,
  options?: object
) => {
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
            // webpack can be instructed to pull in the plugins into the build
            // see the corresponding NOTE in ./assembler.ts and ./preloader.ts
            const registrationRef =
              module.path.charAt(0) === '/'
                ? await import(/* webpackIgnore: true */ module.path)
                : isHeadless() && !process.env.KUI_HEADLESS_WEBPACK
                ? await import(/* webpackIgnore: true */ mainPath(module.path))
                : module.route === 'client'
                ? await import(
                    /* webpackChunkName: "client-plugin" */ /* webpackMode: "lazy" */ '@kui-shell/clien' +
                      webpackPath(module.route).slice(5) +
                      '/mdist/plugin'
                  )
                : await import(
                    /* webpackChunkName: "kui-plugins" */ /* webpackMode: "lazy" */ '@kui-shell/plugin-' +
                      webpackPath(module.route) +
                      '/mdist/plugin'
                  )
            const registration: PluginRegistration = registrationRef.default || registrationRef
            const combinedOptions = Object.assign({ usage: prescan.usage, docs: prescan.docs }, options)

            resolve(registration(proxy(route), combinedOptions))
          } catch (err) {
            console.error(`prequire error ${route}`, err)
            reject(err)
          }
        } else {
          reject(new Error(`Internal error: plugin ${route} not found`))
        }
      })
    }
  } catch (err) {
    debug('prequire failure', route)
    console.error(err)
  }

  return registrar[route]
}

/**
 * Make a plugin resolver from a given prescan model
 *
 */
export const makeResolver = (prescan: PrescanModel, registrar: Record<string, KuiPlugin>): PluginResolver => {
  /** memoize resolved plugins */
  const isResolved: Record<string, KuiPlugin> = {}

  /** resolve one given plugin */
  const resolveOne = async (plugin: string): Promise<KuiPlugin> => {
    try {
      if (!plugin) {
        return
      } else if (!isResolved[plugin]) {
        // eslint-disable-next-line no-async-promise-executor
        isResolved[plugin] = new Promise(async (resolve, reject) => {
          try {
            const prereqs = prescan.topological[plugin]
            if (prereqs) {
              await Promise.all(prereqs.map(route => prequire(route, prescan, registrar)))
            }

            const loadedPlugin = prequire(plugin, prescan, registrar)
            resolve(loadedPlugin)
          } catch (err) {
            console.error(`Error resolving plugin ${plugin}`, err)
            reject(err)
          }
        })
      }

      // NOTE: even if isResolved[plugin] already has an entry, we may
      // need to wait for it to complete, if there is a race between
      // two threads trying to load the plugin
      return isResolved[plugin]
    } finally {
      // debug('resolveOne done', plugin)
    }
  } /* resolveOne */

  /** a plugin resolver impl */
  const resolver = {
    isOverridden: (route: string): boolean => prescan.overrides[route] !== undefined,
    isAlpha: (route: string, plugin: string): boolean =>
      prescan.overrides[route] === undefined || prescan.overrides[route] === plugin,

    resolveOne,

    disambiguate: (command: string) => {
      return prescan.disambiguator[command]
    },

    /** given a partial command, do we have a disambiguation of it? e.g. "gr" => "grid" */
    disambiguatePartial: (partial: string): string[] => {
      const matches: string[] = []
      if (prescan.disambiguator) {
        for (const command in prescan.disambiguator) {
          if (command.indexOf(partial) === 0) {
            // const { route, plugin } = prescan.disambiguator[command]
            matches.push(command)
          }
        }
      }

      return matches
    },

    /** load any plugins required by the given command */
    resolve: async (command: string, { subtree = false, tryCatchalls = true } = {}): Promise<void> => {
      // subpath if we are looking for plugins for a subtree, e.g. for cd /auth
      let plugin: string
      let matchLen: number
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
        await resolveOne(plugin)
      } else if (prescan.catchalls.length > 0 && tryCatchalls) {
        // see if we have catchall
        await Promise.all(prescan.catchalls.map(_ => resolveOne(_.plugin))).catch(err => {
          console.error(
            'There seems to be an inconsistency in the prescan model versus the current state of the filesystem: the prescan model refers to a catchall that cannot currently be found',
            err
          )

          // Note: we hope for the best, and intentionally don't
          // rethrow the error. the upstream, in plugin.ts where it
          // calls resolver.resolve(), will handle the catastrophe
          // (which, at worst, will be a "command not found"), if it
          // ensues
        })
      }
    }
  } /* resolver */

  return resolver
}
