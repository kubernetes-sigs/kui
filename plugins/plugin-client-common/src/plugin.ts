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

import type { CodedError, KResponse, Registrar } from '@kui-shell/core'

import type { CardOptions } from './controller/card'
import type { AlertOptions } from './controller/alert'
import type { CommentaryOptions } from './controller/commentary'
import type { CommandLineOptions as SplitOptions } from './controller/split'
import type KuiConfiguration from './components/Client/KuiConfiguration'

function settings(registrar: Registrar) {
  const settings: (keyof KuiConfiguration)[] = ['prompt', '_for_testing_']

  /** Remove all user setting overrides */
  registrar.listen('/kuiconfig/reset', async () => {
    const { reset } = await import('./components/Client/UserSettings')
    await reset()
    return true
  })

  settings.forEach(setting => {
    /** Read out a given user setting override */
    registrar.listen(`/kuiconfig/get/${setting}`, async () => {
      const { get } = await import('./components/Client/UserSettings')
      const { i18n } = await import('@kui-shell/core/mdist/api/i18n')
      const strings = i18n('plugin-client-common/user-settings')

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
      const { set } = await import('./components/Client/UserSettings')
      await set(setting, args.argvNoOptions[3])
      return true
    })

    /** Does the given setting have a value? */
    registrar.listen(`/kuiconfig/is/set/${setting}`, async () => {
      const { get } = await import('./components/Client/UserSettings')
      const value = await get(setting)
      return value !== undefined
    })

    /** Does the given setting not have a value? */
    registrar.listen(`/kuiconfig/not/set/${setting}`, async () => {
      const { get } = await import('./components/Client/UserSettings')
      const value = await get(setting)
      return value === undefined
    })

    /** Remove a given user setting override */
    registrar.listen(`/kuiconfig/unset/${setting}`, async () => {
      const { unset } = await import('./components/Client/UserSettings')
      await unset(setting)
      return true
    })
  })
}

export default function registerPluginClientCommonControllers(registrar: Registrar) {
  registrar.listen('/confirm', args => import('./controller/confirm').then(_ => _.default(args)), {
    incognito: ['popup']
  })

  registrar.listen<KResponse, SplitOptions>('/split', args => import('./controller/split').then(_ => _.default(args)), {
    flags: { boolean: ['inverse'], alias: { split: ['s'] } }
  })
  registrar.listen('/split-debug', args => import('./controller/split').then(_ => _.debug(args)))
  registrar.listen('/split-count', ({ tab }) => tab.splitCount())
  registrar.listen('/is-split', ({ tab }) => tab.hasSideBySideTerminals())

  const flags = {
    boolean: ['edit', 'header', 'preview', 'readonly', 'replace', 'simple']
  }
  const commentaryFlags = { outputOnly: true, flags }
  const hashFlags = { outputOnly: true, flags, noCoreRedirect: true }
  const commentaryDelegateFlags = { outputOnly: true, needsUI: true }
  registrar.listen<KResponse, AlertOptions>('/alert', args => import('./controller/alert').then(_ => _.default(args)))
  registrar.listen<KResponse, CardOptions>('/card', args => import('./controller/card').then(_ => _.default(args)))

  registrar.listen<KResponse, CommentaryOptions>(
    '/commentary',
    args => import('./controller/commentary').then(_ => _.addComment(args)),
    commentaryFlags
  )
  registrar.listen<KResponse, CommentaryOptions>(
    '/#',
    args => import('./controller/commentary').then(_ => _.addComment(args)),
    hashFlags
  )
  registrar.listen<KResponse, CommentaryOptions>(
    '/commentary/delegate',
    args => import('./controller/commentary').then(_ => _.delegate(args)),
    commentaryDelegateFlags
  )

  settings(registrar)
}
