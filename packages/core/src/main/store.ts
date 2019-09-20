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

import * as Debug from 'debug'
const debug = Debug('main/localStorage')
debug('loading')

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { userDataDir } from '../core/userdata'

debug('modules loaded')

/**
 * This module implements a simple localStorage layer for headless mode
 *
 */
export default () => {
  debug('init')

  const userData = join(userDataDir(), 'kui-local-storage.json')

  debug('userData %s', userData)

  let data
  try {
    const raw = readFileSync(userData).toString()
    try {
      data = JSON.parse(raw)
    } catch (err) {
      debug('error parsing userData', raw)
      throw err
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      data = {}
    } else {
      debug('error reading userData')
      throw err
    }
  }

  debug('parsed userData')

  /**
   * Flush the model to disk
   *
   */
  const flush = () => {
    try {
      debug('flush')
      writeFileSync(userData, JSON.stringify(data))
      debug('flush done')
    } catch (err) {
      if (err.code === 'ENOENT') {
        debug('we decided not to initialize the store, but a plugin is trying to write to it')
      } else {
        console.error(err)
      }
    }
  }

  const self = {
    /**
     * Retrieve an entry from localStorage. The LocalStorage API
     * says to return null if there's no such key, to distinguish
     * from the something being of value `undefined`.
     *
     */
    getItem: (key: string): string => data[key] || null,

    /**
     * Update an entry in localStorage
     *
     */
    setItem: (key: string, val: string): string => {
      debug('setItem', key, val)
      data[key] = val
      flush()
      return val
    },

    /**
     * Remove an entry from localStorage
     *
     */
    removeItem: (key: string): string => {
      const val = data[key]
      delete data[key]
      flush()
      return val
    }
  }

  debug('init done')
  return self
}
