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

import { join } from 'path'

import store from '../models/store'
import expandHomeDir from '../util/home'
import { inBrowser } from '../core/capabilities'
const debug = Debug('core/userdata')

interface Preferences {
  [key: string]: string
}

/**
 * Get the userdata directory
 *
 */
export const userDataDir = (): string => {
  if (inBrowser()) {
    throw new Error('Unsupported operation')
  } else {
    // headless
    const name = '@kui-shell/settings'

    switch (process.platform) {
      case 'darwin':
        return join(process.env.HOME, 'Library', 'Application Support', name)
      case 'linux': {
        const home = process.env.XDG_CONFIG_HOME || expandHomeDir('~/.config')
        return join(home, name)
      }
      case 'win32':
        return join(process.env.APPDATA, name)
    }
  }
}

/** filepath to persisted preference model */
const preferencesFilepath = () => join(userDataDir(), 'prefs.json')

/**
 * Sync the preferences to disk
 *
 * @return passes through the preference model
 *
 */
const fsyncPreferences = async (prefs: Preferences): Promise<Preferences> => {
  if (inBrowser()) {
    store().setItem('kui.userprefs', JSON.stringify(prefs))
  } else {
    const { mkdirp, writeFile } = await import('fs-extra')
    await mkdirp(userDataDir())
    await writeFile(preferencesFilepath(), JSON.stringify(prefs))
  }

  return prefs
}

async function readFile(filepath: string): Promise<string> {
  const { readFile } = await import('fs')
  return new Promise((resolve, reject) => {
    readFile(filepath, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    })
  })
}

/**
 * Read the preference model
 *
 */
const preferences = async (): Promise<Preferences> => {
  if (inBrowser()) {
    debug('reading preferences from browser localStorage')

    const prefs = store().getItem('kui.userprefs')
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
    const filepath = preferencesFilepath()
    debug('reading persisted preference model', filepath)
    const raw = await readFile(filepath)
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
 * Purge the preference model
 *
 */
export const purgePreferences = async (): Promise<void> => {
  debug('purgePreferences')

  if (inBrowser()) {
    store().removeItem('kui.userprefs')
  } else {
    const { unlink } = await import('fs-extra')
    await unlink(preferencesFilepath())
  }
}

/**
 * Remove the preference associated with the given key
 *
 * @return the prior value
 *
 */
export const clearPreference = async (key: string): Promise<string> => {
  debug('clearPreference', key)
  const prefs = await preferences()
  const value = prefs[key]
  delete prefs[key]
  await fsyncPreferences(prefs)
  return value
}

/**
 * Get a persisted preference
 *
 * @return the preference value
 *
 */
export const getPreference = async (key: string): Promise<string> => {
  const prefs = await preferences()
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
export const setPreference = async (key: string, value: string): Promise<string> => {
  debug('setPreference', key, value)
  const prefs = await preferences()
  prefs[key] = value
  await fsyncPreferences(prefs)
  return value
}

export async function getOrSetPreference(
  key: string,
  defaultValue: string | (() => string | Promise<string>)
): Promise<string> {
  const prefs = await preferences()
  if (prefs[key]) {
    return prefs[key]
  } else {
    const value = typeof defaultValue === 'string' ? defaultValue : await defaultValue()
    prefs[key] = value
    await fsyncPreferences(prefs)
    return value
  }
}
