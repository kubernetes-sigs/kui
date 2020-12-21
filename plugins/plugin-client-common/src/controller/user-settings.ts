/*
 * Copyright 2020 IBM Corporation
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

import { CodedError, Registrar, i18n } from '@kui-shell/core'

import KuiConfiguration from '../components/Client/KuiConfiguration'
import { get, reset, set, unset } from '../components/Client/UserSettings'

const strings = i18n('plugin-client-common/user-settings')
const settings: (keyof KuiConfiguration)[] = ['prompt']

/**
 * This plugin introduces the /card command
 *
 */
export default async (registrar: Registrar) => {
  /** Remove all user setting overrides */
  registrar.listen('/kuiconfig/reset', async () => {
    await reset()
    return true
  })

  settings.forEach(setting => {
    /** Read out a given user setting override */
    registrar.listen(`/kuiconfig/get/${setting}`, async () => {
      const value = await get(setting)
      if (!value) {
        const error: CodedError = new Error(strings('You have not specified a value for this setting'))
        error.code = 404
        throw error
      } else if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
        return value
      } else {
        return value.toString()
      }
    })

    /** Update a given user setting override */
    registrar.listen(`/kuiconfig/set/${setting}`, async args => {
      await set(setting, args.argvNoOptions[3])
      return true
    })

    /** Remove a given user setting override */
    registrar.listen(`/kuiconfig/unset/${setting}`, async () => {
      await unset(setting)
      return true
    })
  })
}
