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
const debug = Debug('core/userdata')

import { join } from 'path'

import { inBrowser, inElectron } from '../core/capabilities'

type Preferences = { [key: string]: string }

/**
 * Get the userdata directory
 *
 */
export const userDataDir = (): string => {
  if (inBrowser()) {
    throw new Error('Unsupported operation')
  } else {
    // headless
    const { join } = require('path')
    const { name } = require('@kui-shell/settings/package.json')

    switch (process.platform) {
      case 'darwin':
        return join(process.env.HOME, 'Library', 'Application Support', name)
      case 'linux':
        const home = process.env.XDG_CONFIG_HOME || require('expand-home-dir')('~/.config')
        return join(home, name)
      case 'win32':
        return join(process.env.APPDATA, name)
    }
  }
}

/** filepath to persisted preference model */
const preferencesFilepath = () => join(userDataDir(), 'prefs.json')

/**
 * Read the preference model
 *
 */
const preferences = (): Preferences => {
  if (inBrowser()) {
    debug('reading preferences from browser localStorage')

    const prefs = localStorage.getItem('kui.userprefs')
    if (!prefs) {
      return {}
    } else {
      try {
        return JSON.parse(prefs)
      } catch (err) {
        debug('error parsing preference model', prefs)
        console.error('error parsing preference model', err)
        return {}
      }
    }
  }

  try {
    const { readFileSync } = require('fs-extra')

    const filepath = preferencesFilepath()
    debug('reading persisted preference model', filepath)
    const raw = readFileSync(filepath).toString()
    try {
      return JSON.parse(raw)
    } catch (err) {
      debug('error parsing preference model', raw)
      console.error('error parsing preference model', err)
      return {}
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      return fsyncPreferences({})
    } else {
      throw err
    }
  }
}

/**
 * Sync the preferences to disk
 *
 * @return passes through the preference model
 *
 */
const fsyncPreferences = (prefs: Preferences): Preferences => {
  if (inBrowser()) {
    localStorage.setItem('kui.userprefs', JSON.stringify(prefs))
  } else {
    const { mkdirp, writeFileSync } = require('fs-extra')
    mkdirp(userDataDir())
    writeFileSync(preferencesFilepath(), JSON.stringify(prefs))
  }

  return prefs
}

/**
 * Purge the preference model
 *
 */
const purgePreferences = (): void => {
  debug('purgePreferences')

  if (inBrowser()) {
    localStorage.removeItem('kui.userprefs')
  } else {
    const { unlinkSync } = require('fs-extra')
    unlinkSync(preferencesFilepath())
  }
}

/**
 * Remove the preference associated with the given key
 *
 * @return the prior value
 *
 */
export const clearPreference = (key: string): string => {
  debug('clearPreference', key)
  const prefs = preferences()
  const value = prefs[key]
  delete prefs[key]
  fsyncPreferences(prefs)
  return value
}

/**
 * Get a persisted preference
 *
 * @return the preference value
 *
 */
export const getPreference = (key: string): string => {
  const prefs = preferences()
  const value = prefs[key]
  debug('getPreference', key, value)
  return value
}

/**
 * Set a persisted preference
 *
 * @return the preference value
 *
 */
export const setPreference = (key: string, value: string): string => {
  debug('setPreference', key, value)
  const prefs = preferences()
  prefs[key] = value
  fsyncPreferences(prefs)
  return value
}
