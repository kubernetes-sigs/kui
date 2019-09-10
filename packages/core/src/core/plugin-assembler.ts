/*
 * Copyright 2017-18 IBM Corporation
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

import { readFile, readdirSync, statSync, writeFile } from 'fs-extra'
import { basename, join, relative } from 'path'

import { PrescanCommandDefinitions, PrescanDocs, PrescanModel, PrescanUsage } from './prescan'
import * as plugins from './plugins'
import { getModel, cullFromDisambiguator } from './command-tree'

const debug = Debug('core/plugin-assembler')

/**
 * Return the location of the pre-scanned cache file
 *
 */
const prescanned = (): string => require.resolve('@kui-shell/prescan')

/**
 * Write the plugin list to the .pre-scanned.json file in app/plugins/.pre-scanned.json
 *
 */
const writePrescanned = async (modules: PrescanModel, destFile = prescanned()): Promise<void> => {
  debug('writePrescanned', process.cwd(), destFile, modules)

  const str = JSON.stringify(modules)
  await writeFile(destFile, str)
}

/**
 * Read the current .pre-scanned.json file
 *
 */
const readPrescanned = async (): Promise<Prescan> => {
  try {
    const data = (await readFile(prescanned())).toString()

    if (data.trim().length === 0) {
      // it was empty
      return {}
    } else {
      return JSON.parse(data)
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      debug('no file to read %s')
      return {}
    } else {
      console.error(err)
      throw err
    }
  }
}

/**
 * Find what's new in after versus before, two structures
 *
 */
const diff = (beforeModel: Prescan, afterModel: Prescan, reverseDiff = false): PrescanDiff => {
  const { commandToPlugin: before } = beforeModel
  const { commandToPlugin: after } = afterModel

  const A = (reverseDiff ? after : before) || []
  const B = (reverseDiff ? before : after) || []

  const changes = []
  for (const key in B) {
    if (!(key in A)) {
      changes.push(key.replace(/^\//, '').replace('/', ' '))
    }
  }

  return changes
}

/**
 * Generic filesystem scanning routine
 *     Note that, when scanning for plugins, we ignore subdirectories named "helpers"
 *
 */
const readDirRecursively = (dir: string): string[] => {
  if (
    basename(dir) !== 'helpers' &&
    basename(dir) !== 'bin' &&
    basename(dir) !== 'modules' &&
    basename(dir) !== 'node_modules' &&
    statSync(dir).isDirectory()
  ) {
    return Array.prototype.concat(...readdirSync(dir).map((f: string) => readDirRecursively(join(dir, f))))
  } else {
    return [dir] // was dir
  }
}

/**
 * Scan the given directory, recursively, for javascript files
 *
 */
export const scanForJsFiles = (dir: string) => readDirRecursively(dir).filter(s => s.endsWith('.js'))

interface File {
  path: string
  root?: boolean
}

interface Node {
  route: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  usage?: Object
  docs?: string
  children?: { [key: string]: Node }
}

interface Prescan {
  // eslint-disable-next-line @typescript-eslint/ban-types
  commandToPlugin?: Object
}

type PrescanDiff = string[]

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
  const newLeaf = (route: string): Node => ({ route })
  const newNode = (route: string): Node => Object.assign(newLeaf(route), { children: {} })

  /** get or create a subtree */
  const getOrCreate = (tree: Node, pathPrefix: string) => {
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
    leaf.docs = map[route].header || docs[route]

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
      modules.usage[route] = options.usage
      if (options.needsUI) modules.usage[route].needsUI = true
      if (options.requiresLocal) modules.usage[route].requiresLocal = true
      if (options.noAuthOk) modules.usage[route].noAuthOk = true
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
 * assemble the list of plugins, then minify the plugins, if we can,
 * and write the list to the .pre-scanned.json file
 *
 */
export const compile = async (
  pluginRoot = process.env.PLUGIN_ROOT || join(__dirname, plugins.pluginRoot),
  externalOnly = false,
  reverseDiff = false
) => {
  debug('pluginRoot is %s', pluginRoot)
  debug('externalOnly is %s', externalOnly)

  const before = await readPrescanned()
  debug('before', before)

  // const modules = await plugins.assemble({ pluginRoot, externalOnly })
  const modules = await plugins.assemble({ externalOnly, pluginRoot })

  /** make the paths relative to the root directory */
  const fixupOnePath = (filepath: string): string => {
    // NOTE ON relativization: this is important so that webpack can
    // be instructed to pull in the plugins into the build see the
    // corresponding NOTE in ./plugins.ts and ./preloader.ts
    const fixed = externalOnly ? filepath : relative(pluginRoot, filepath).replace(/^(.*\/)(plugin-.*)$/, '$2')
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

  const destFile = externalOnly ? join(pluginRoot, '@kui-shell/prescan.json') : prescanned()
  await Promise.all([writePrescanned(modelWithUsage, destFile)])

  if (externalOnly) {
    // then this is a live install, we need to smash it into the live model
    plugins._useUpdatedUserPrescan(modelWithUsage)
  }

  // resolve with what is new
  return diff(before, modelWithUsage, reverseDiff)
}

export async function compileUserInstalled(pluginToBeRemoved?: string) {
  debug('compileUserInstalled', pluginToBeRemoved)

  if (pluginToBeRemoved) {
    cullFromDisambiguator(pluginToBeRemoved)
  }

  const home = await plugins.userInstalledHome()
  await compile(join(home, 'node_modules'), true)
}

export default compile

debug('loading done')
