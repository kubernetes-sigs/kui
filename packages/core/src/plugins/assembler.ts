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
import { join, relative, sep } from 'path'
import { ensureFile, writeFile } from 'fs-extra'

import * as plugins from './plugins'
import { assemble } from './scanner'
import { PrescanCommandDefinitions, PrescanDocs, PrescanNode, PrescanModel, PrescanUsage } from './prescan'

import eventChannelUnsafe from '../core/events'
import { initIfNeeded, getModel } from '../commands/tree'

const debug = Debug('core/plugins/assembler')

/**
 * Return the location of the serialized `PrescanModel` that
 * represents the model that ships with a client (as opposed to the
 * model that represents user-installed plugins)
 *
 */
const prescanned = (): string => join(process.env.CLIENT_HOME, 'node_modules/@kui-shell/prescan.json')

/**
 * Serialize a `PrescanModel` to disk
 *
 */
const writePrescanned = async (modules: PrescanModel, destFile = prescanned()): Promise<void> => {
  debug('writePrescanned', process.cwd(), destFile, modules)

  const str = JSON.stringify(modules)
  await ensureFile(destFile)
  await writeFile(destFile, str)
}

/**
 * Make a tree out of a flat map.
 * e.g. take "/wsk" and "/wsk/actions" and make a tree out of that flat
 * structure based on the "/path/hierarchy"
 *
 */
const makeTree = (map: PrescanUsage, docs: PrescanDocs) => {
  const keys = Object.keys(map)
  if (keys.length === 0) {
    debug('interesting, not a single command registered a usage model')
    // this isn't the end of the world, but probably a sign of
    // incomplete plugin design; so let's warn the developer (note
    // that this command is executed as part of plugin precompilation
    // so the user in this case is the plugin developer)
    console.error('Warning: none of your commands registered a usage model')
    return {}
  }

  // sort the keys lexicographically
  keys.sort()

  /** create new node */
  const newLeaf = (route: string): PrescanNode => ({ route })
  const newNode = (route: string): PrescanNode => Object.assign(newLeaf(route), { children: {} })

  /** get or create a subtree */
  const getOrCreate = (tree: PrescanNode, pathPrefix: string) => {
    if (!tree.children) {
      tree.children = {}
    }
    const entry = tree.children[pathPrefix]
    if (!entry) {
      tree.children[pathPrefix] = newNode(pathPrefix)
      return tree.children[pathPrefix]
    } else {
      return entry
    }
  }

  const tree = keys.reduce((tree, route) => {
    const split = route.split(/\//)

    let subtree = tree
    for (let idx = 0; idx < split.length; idx++) {
      const pathPrefix = split.slice(0, idx).join('/')
      subtree = getOrCreate(subtree, pathPrefix)
    }

    if (!subtree.children) subtree.children = {}
    const leaf = (subtree.children[route] = newLeaf(route))
    leaf.usage = map[route]
    leaf.docs = (leaf.usage && leaf.usage.header) || docs[route]

    return tree
  }, newNode('/'))

  return tree.children[''].children[''].children
}

/**
 * Scan the registered commands for usage docs, so that we can stash
 * them away in the compiled plugin registry. This will allow us to
 * present docs in a general way, not only in response to evaluation
 * of commands.
 *
 */
const amendWithUsageModels = (modules: PrescanModel) => {
  modules.docs = {}
  modules.usage = {}

  getModel().forEachNode(({ route, options, synonyms }) => {
    if (options && options.usage) {
      modules.usage[route] = Object.assign({ route }, options.usage)

      if (options.needsUI) modules.usage[route].needsUI = true
      if (options.requiresLocal) modules.usage[route].requiresLocal = true
      // if (options.noAuthOk) modules.usage[route].noAuthOk = true
      if (options.synonymFor) modules.usage[route].synonymFor = options.synonymFor.route
      if (synonyms) modules.usage[route].synonyms = Object.keys(synonyms).map(route => synonyms[route].key)
      if (options.usage.docs) {
        modules.docs[route] = options.usage.docs
      }
    }

    if (options && options.docs) {
      modules.docs[route] = options.docs
    }
  })

  // modules.usage right not is flat, i.e. it may contain entries
  // for "/wsk" and "/wsk/actions"; make a tree out of that flat
  // structure based on the "/path/hierarchy"
  modules.usage = makeTree(modules.usage, modules.docs)

  return modules
}

/**
 * Assemble the plugin `PrescanModel`, and serialize it to disk. This
 * code is called both for assembling the model that is shipped with a
 * client, and (via `compileUserInstalled`, below) for assembling, on
 * the fly, the registry for user-installed plugins.
 *
 */
export const compile = async (
  pluginRoot = process.env.PLUGIN_ROOT || join(__dirname, plugins.pluginRoot),
  externalOnly = false
) => {
  debug('pluginRoot is %s', pluginRoot)
  debug('externalOnly is %s', externalOnly)

  initIfNeeded()
  const modules = await assemble(plugins.registrar, { externalOnly, pluginRoot })
  debug('modules', modules)

  /** make the paths relative to the root directory */
  const fixupOnePath = (filepath: string): string => {
    // NOTE ON relativization: this is important so that webpack can
    // be instructed to pull in the plugins into the build see the
    // corresponding NOTE in ./plugins.ts and ./preloader.ts
    const pattern = new RegExp(`^(.*\\${sep})(client.*|plugin-.*)$`)
    const fixed = externalOnly ? filepath : relative(pluginRoot, filepath).replace(pattern, '$2')
    return fixed
  }
  const fixupPaths = (pluginList: PrescanCommandDefinitions) =>
    pluginList.map(plugin =>
      Object.assign(plugin, {
        path: fixupOnePath(plugin.path)
      })
    )

  const model: PrescanModel = Object.assign(modules, {
    preloads: fixupPaths(modules.preloads),
    flat: fixupPaths(modules.flat)
  })

  const modelWithUsage = amendWithUsageModels(model)

  const destFile =
    process.env.KUI_PRESCAN || (externalOnly ? join(pluginRoot, '@kui-shell/prescan.json') : prescanned())
  await Promise.all([writePrescanned(modelWithUsage, destFile)])

  if (externalOnly) {
    // then this is a live install, we need to smash it into the live model
    plugins._useUpdatedUserPrescan(modelWithUsage)
  }
}

/**
 * The entry point for recompiling the user-installed plugin registry
 *
 */
export async function compileUserInstalled(pluginToBeRemoved?: string) {
  debug('compileUserInstalled', pluginToBeRemoved)

  const home = await plugins.userInstalledHome()
  const pluginRoot = join(home, 'node_modules')
  await compile(pluginRoot, true)
  eventChannelUnsafe.emit('/plugin/compile/done')
}

export default compile

debug('loading done')
