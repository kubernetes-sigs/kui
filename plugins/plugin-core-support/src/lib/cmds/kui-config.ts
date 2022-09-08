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

import { Registrar } from '@kui-shell/core'

const key = 'kui-shell/v1/kui-config'

/** Fetch and deserialize the settings map */
function load(): Record<string, string> {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : {}
}

/** Persist the given settings map */
function store(settings: Record<string, string>) {
  localStorage.setItem(key, JSON.stringify(settings))
}

/** Update the map to have the key->value mapping */
function set(key: string, value: string) {
  store(Object.assign(load(), { [key]: value }))
}

/** Remove the given key */
function unset(key: string) {
  const map = load()
  delete map[key]
  store(map)
}

export default function (registrar: Registrar) {
  registrar.listen('/kuiconfig/set', args => {
    // Note how `kuiconfig set foo` defaults to setting the key "foo"
    // to value "true"
    const key = args.argvNoOptions[2]
    const value = args.argvNoOptions[3] || 'true'

    set(key, value)
    return true
  })

  registrar.listen('/kuiconfig/get', args => {
    const key = args.argvNoOptions[2]
    return load()[key] || ''
  })

  registrar.listen('/kuiconfig/unset', args => {
    const key = args.argvNoOptions[2]
    unset(key)
    return true
  })

  registrar.listen('/kuiconfig/is/set', args => {
    const key = args.argvNoOptions[3]
    return load()[key] !== undefined
  })

  registrar.listen('/kuiconfig/not/set', args => {
    const key = args.argvNoOptions[3]
    return load()[key] === undefined
  })
}
