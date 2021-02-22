/*
 * Copyright 2020 The Kubernetes Authors
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

import EventEmitter from 'events'
import KuiConfiguration from './KuiConfiguration'

/** These are internal, they may be changed without breaking the API */
const eventBus = new EventEmitter()
const channel = '/UserSettings/change'

/** DO NOT CHANGE. This is the localStorage key for user settings overrides */
const userSettingsLocalStorageKey = 'kui-shell/v1/user.settings'

/** The type of the handler for listeners to changes to user settings overrides */
type ChangeHandler = (evt: 'set' | 'reset' | 'unset') => void

/** Responding to a change in user settings overrides */
export function on(handler: ChangeHandler) {
  eventBus.on(channel, handler)
}

/** Stop responding to a change in user settings overrides */
export function off(handler: ChangeHandler) {
  eventBus.off(channel, handler)
}

/** Respond once to a change in user settings overrides */
export function once(handler: ChangeHandler) {
  eventBus.once(channel, handler)
}

/** @return Any user overrides of the base KuiConfiguration */
export default function load() {
  return JSON.parse(localStorage.getItem(userSettingsLocalStorageKey) || '{}') as KuiConfiguration
}

/** Read out one user setting */
export function get<K extends keyof KuiConfiguration>(key: K): KuiConfiguration[K] {
  return load()[key]
}

/** Update one user setting */
export function set<K extends keyof KuiConfiguration>(key: K, value: KuiConfiguration[K]) {
  let val = value.toString()

  if (typeof value === 'string' && /\\u/.test(value)) {
    // e.g. \u2771 => %u2771
    // hello future citizens: if you can find a more elegant solution, please fix!
    val = unescape(value.replace(/\\u/g, '%u'))
  }

  localStorage.setItem(userSettingsLocalStorageKey, JSON.stringify(Object.assign(load(), { [key]: val })))
  eventBus.emit(channel, 'set')
}

/** Remove one user setting */
export function unset<K extends keyof KuiConfiguration>(key: K) {
  const config = load()
  delete config[key]
  localStorage.setItem(userSettingsLocalStorageKey, JSON.stringify(config))
  eventBus.emit(channel, 'unset')
}

/** Remove all user settings */
export function reset<K extends keyof KuiConfiguration>() {
  localStorage.removeItem(userSettingsLocalStorageKey)
  eventBus.emit(channel, 'reset')
}
