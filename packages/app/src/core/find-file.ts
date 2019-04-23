/*
 * Copyright 2017 IBM Corporation
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

const debug = require('debug')('core/find-file')
debug('loading')

import { basename, dirname, join, resolve } from 'path'
import expandHomeDir = require('expand-home-dir')
import { inBrowser } from './capabilities'

/**
 * Maybe the given filepath is asar-relative, as indicated by a
 * leading @ character?
 *
 */
interface ISpecialPath {
  prefix: string
  filepath: string
}
const specialPaths: ISpecialPath[] = [] // any special paths added via self.addPath
const defaultSpecial = { filepath: join(__dirname, '..') } // default special is the app/ top-level

/**
 * If original has a trailing slash, make sure resolved has one, too
 *
 */
const withMatchingTrailingSlash = (original: string, resolved: string): string => {
  if (original.charAt(original.length - 1) === '/' &&
      resolved.charAt(resolved.length - 1) !== '/') {
    return `${resolved}/`
  } else {
    return resolved
  }
}

/**
 * Is this a special @ directory?
 *
 */
export const isSpecialDirectory = (filepath: string) => basename(filepath).charAt(0) === '@'

/**
 * Resolve @ and ~ files
 *
 * @param safe throw and exception if the file is not found
 * @param keepRelative don't expand ~
 */
export const findFile = (filepath: string, safe = false, keepRelative = false): string => {
  if (!filepath) {
    if (!safe) {
      throw new Error('Please specify a file')
    } else {
      // caller asked us to play nice
      return ''
    }
  } else if (filepath.charAt(0) === '@') {
    // the === '.' part handles the case where the call was e.g. findFile('@demos'), i.e. the special dir itself
    const desiredPrefix = dirname(filepath) === '.' ? filepath : dirname(filepath)
    const special = specialPaths.find(({ prefix }) => desiredPrefix.indexOf(prefix) === 0) || defaultSpecial

    debug('resolving @ file', filepath, desiredPrefix, special)
    return withMatchingTrailingSlash(filepath, join(special.filepath, filepath))
  } else if (keepRelative) {
    return filepath
  } else {
    debug('resolving normal file', filepath)
    return withMatchingTrailingSlash(filepath, resolve(expandHomeDir(filepath)))
  }
}

/**
 * Augment the module load path
 *
 */
export const addPath = (filepath: string): void => {
  if (!inBrowser()) {
    debug('addPath', filepath)
    try {
      // use app-module-path to augment the node module require path
      const appModulePath = require('app-module-path')
      appModulePath.addPath(resolve(filepath))
    } catch (err) {
      console.error('error in addPath', err)
    }
  }

  // remember this for self.findFile
  const prefix = basename(filepath)
  if (prefix.charAt(0) === '@') {
    specialPaths.push({ prefix, filepath: dirname(filepath) })
  }
}
