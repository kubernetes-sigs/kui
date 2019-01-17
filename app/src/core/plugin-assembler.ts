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

import * as Debug from 'debug'
const debug = Debug('core/plugin-assembler')
debug('loading')

import * as fs from 'fs-extra'
import * as path from 'path'
import * as events from 'events'
import mkdirp = require('mkdirp')
import { exec } from 'child_process'

import * as plugins from './plugins'
import * as commandTree from './command-tree'

const TMP = 'plugins' // we'll stash the original plugins here
const TMA = 'app' // we'll stash the original app here

if (typeof global['localStorage'] === 'undefined') {
  global['localStorage'] = { getItem: () => '{}' }
} else {
  // assignment to read-only properties is not allowed in strict mode
  Object.defineProperty(global['localStorage'], 'getItem', {
    value: () => '{}',
    writable: true,
    configurable: true
  })
}

if (typeof global['window'] === 'undefined') {
  global['window'] = { localStorage: global['localStorage'] }
} else {
  // assignment to read-only properties is not allowed in strict mode
  Object.defineProperty(global['window'], 'localStorage', {
    value: global['localStorage'],
    writable: true,
    configurable: true
  })
}

debug('modules loaded')

/**
 * Return the location of the pre-scanned cache file
 *
 */
const prescanned = (dir: string) => path.join(dir, '.pre-scanned.json')

/**
 * Write the plugin list to the .pre-scanned.json file in app/plugins/.pre-scanned.json
 *
 */
const writeToFile = async (dir: string, modules): Promise<void> => {
  debug('writeToFile', dir)

  let str
  if (process.env.UGLIFY) {
    str = JSON.stringify(modules)
  } else {
    str = JSON.stringify(modules, undefined, 4)
  }

  await fs.writeFile(prescanned(dir), str)
}

/**
 * Read the current .pre-scanned.json file
 *
 */
const readFile = async (dir: string): Promise<IPrescan> => {
  try {
    const data = (await fs.readFile(prescanned(dir))).toString()

    if (data.trim().length === 0) {
      // it was empty
      return {}
    } else {
      return JSON.parse(data)
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      debug('no file to read %s', dir)
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
const diff = (beforeModel: IPrescan, afterModel: IPrescan, reverseDiff = false): PrescanDiff => {
  const { commandToPlugin: before } = beforeModel
  const { commandToPlugin: after } = afterModel

  const A = (reverseDiff ? after : before) || []
  const B = (reverseDiff ? before : after) || []

  const changes = []
  for (let key in B) {
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
const readDirRecursively = (dir: string): Array<string> => {
  const fs = require('fs')
  const path = require('path')

  if (path.basename(dir) !== 'helpers' &&
      path.basename(dir) !== 'bin' &&
      path.basename(dir) !== 'modules' &&
      path.basename(dir) !== 'node_modules' &&
      fs.statSync(dir).isDirectory()) {
    return Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirRecursively(path.join(dir, f))))
  } else {
    return [ dir ] // was dir
  }
}

/**
 * Scan the given directory, recursively, for javascript files
 *
 */
export const scanForJsFiles = (dir: string) => readDirRecursively(dir).filter(s => s.endsWith('.js'))

interface IFile {
  path: string
  root?: boolean
}

/**
 * Find js files in root/modules
 *
 */
const scanModules = (root: string): Array<IFile> => {
  const { plugins: modules } = plugins.scanForModules(root, true) // eslint-disable-line

  const files = []

  Object.keys(modules).map(route => {
    scanForJsFiles(path.join(modules[route], '..'))
      .filter(file => !file.match(/tests\/data/) && !file.match(/\/@/))
      .forEach(file => {
        files.push({ path: file.replace(root + '/', '') })
      })
  })

  debug('scanModules', files)
  return files
}

/**
 * Scan files in app/build
 */
const scanRoot = (root: string): Array<IFile> => {
  const files = []
  scanForJsFiles(path.join(root, 'build')).forEach(f => {
    const subdirs = f.split('/')
    files.push({ root: true, path: f.replace(root + '/', '') })
  })

  debug('scanRoot', files)
  return files
}
/**
 * Uglify the javascript
 *
 */
const uglify = modules => modules.flat.map(module => new Promise((resolve, reject) => {
  if (process.env.UGLIFY !== 'true') return resolve()

  const src = module.root ? path.join(__dirname, '..', '..', module.path) : path.join(__dirname, '../../../plugins', module.path)
  const target = src // we'll copy it aside, and overwrite the original
  const tmpPath = module.root ? path.join(TMA, module.path) : path.join(path.join(TMA, TMP), module.path)
  const tmpDir = path.join(tmpPath, '..') // we want the name of the enclosing directory

  debug('uglify %s %s', module.path, tmpPath)

  mkdirp(tmpDir, async err => {
    if (err) {
      reject(err)
    } else {
      debug('copying', src, tmpPath)
      try {
        await fs.copy(src, tmpPath)

        debug('calling terser')
        exec(`${path.join(__dirname, '..', '..', 'node_modules', '.bin', 'terser')} --compress --mangle -o "${target}" -- "${tmpPath}"`,
             (err, stdout, stderr) => {
               if (err) reject(err)
               else resolve()
             })
      } catch (err) {
        debug('error', err)
        reject(err)
      }
    }
  })
}))

interface ILeaf {
  route: string
  usage?: Object
  docs?: string
}
interface IPrescan {
  commandToPlugin?: Object
}
type PrescanDiff = Array<string>

/**
 * Make a tree out of a flat map.
 * e.g. take "/wsk" and "/wsk/actions" and make a tree out of that flat
 * structure based on the "/path/hierarchy"
 *
 */
const makeTree = (map, docs) => {
  const keys = Object.keys(map)

  // sort the keys lexicographically
  keys.sort()

  /** create new node */
  const node = (route: string): ILeaf => ({ route })
  const inner = route => Object.assign(node(route), { children: {} })

  /** get or create a subtree */
  const getOrCreate = (tree, pathPrefix) => {
    if (!tree.children) {
      tree.children = {}
    }
    const entry = tree.children[pathPrefix]
    if (!entry) {
      tree.children[pathPrefix] = inner(pathPrefix)
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
    const leaf = subtree.children[route] = node(route)
    leaf.usage = map[route]
    leaf.docs = map[route].header || docs[route]

    return tree
  }, inner('/'))

  return tree.children[''].children[''].children
}

/**
 * Scan the registered commands for usage docs, so that we can stash
 * them away in the compiled plugin registry. This will allow us to
 * present docs in a general way, not only in response to evaluation
 * of commands.
 *
 */
const amendWithUsageModels = modules => {
  modules.docs = {}
  modules.usage = {}

  commandTree.getModel().forEachNode(({ route, options, synonyms }) => {
    if (options && options.usage) {
      modules.usage[route] = options.usage
      if (options.needsUI) modules.usage[route].needsUI = true
      if (options.requiresLocal) modules.usage[route].requiresLocal = true
      if (options.noAuthOk) modules.usage[route].noAuthOk = true
      if (options.synonymFor) modules.usage[route].synonymFor = options.synonymFor.route
      if (synonyms) modules.usage[route].synonyms = Object.keys(synonyms).map(route => synonyms[route].key)
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

export default async (rootDir: string, externalOnly = false, reverseDiff = false) => {
  /**
   * assemble the list of plugins, then minify the plugins, if we can,
   * and write the list to the .pre-scanned.json file
   *
   */
  const pluginRoot = path.join(__dirname, plugins.pluginRoot)

  debug('rootDir is %s', rootDir)
  debug('pluginRoot is %s', pluginRoot)
  debug('externalOnly is %s', externalOnly)

  const before = await readFile(pluginRoot)
  debug('before', before)

  if (!externalOnly) {
    // uglify
    await Promise.all([
      ...uglify({ flat: scanRoot(rootDir) }),
      ...uglify({ flat: scanModules(pluginRoot) })
    ])
  }

  const modules = await plugins.assemble({ pluginRoot, externalOnly })

  /** make the paths relative to the root directory */
  const fixupOnePath = filepath => {
    // NOTE ON @kui-plugin relativization: this is important so that
    // webpack can be isntructed to pull in the plugins into the build
    // see the corresponding NOTE in ./plugins.ts and ./preloader.ts
    return path.relative(path.join(__dirname, '../../../plugins'), filepath)
  }
  const fixupPaths = pluginList => pluginList.map(plugin => Object.assign(plugin, {
    path: fixupOnePath(plugin.path)
  }))

  const model = Object.assign(modules, {
    preloads: fixupPaths(modules.preloads),
    flat: fixupPaths(modules.flat)
  })

  const modelWithUsage = amendWithUsageModels(model)

  await Promise.all([
    writeToFile(path.join(__dirname, plugins.buildRoot), modelWithUsage)
    // ...uglify(modelWithUsage)
  ])

  // resolve with what is new
  return diff(before, modelWithUsage, reverseDiff)
}

debug('loading done')
