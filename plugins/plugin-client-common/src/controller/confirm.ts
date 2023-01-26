/*
 * Copyright 2019 The Kubernetes Authors
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

import type { Registrar } from '@kui-shell/core'

/**
 * This plugin introduces the /confirm command
 *
 */
export default async (commandTree: Registrar) => {
  commandTree.listen(
    '/confirm',
    async ({ tab, argvNoOptions, parsedOptions, execOptions, REPL }) => {
      const [{ i18n }, { ExecType }, { getPrimaryTabId }, { pexecInCurrentTab }, { eventChannelUnsafe }] =
        await Promise.all([
          import('@kui-shell/core/mdist/api/i18n'),
          import('@kui-shell/core/mdist/api/Command'),
          import('@kui-shell/core/mdist/api/Tab'),
          import('@kui-shell/core/mdist/api/Exec'),
          import('@kui-shell/core/mdist/api/Events')
        ])

      const strings = i18n('plugin-core-support')

      return new Promise((resolve, reject) => {
        const asking = parsedOptions.asking || strings('areYouSure')
        const command = argvNoOptions[argvNoOptions.indexOf('confirm') + 1]
        const { execUUID } = execOptions

        if (!command) {
          throw new Error('Usage: confirm command line')
        }

        const requestChannel = `/kui-shell/Confirm/v1/tab/${getPrimaryTabId(tab)}`
        const responseChannel = `${requestChannel}/execUUID/${execUUID}/confirmed`

        const onConfirm = ({ confirmed }: { confirmed: boolean }) => {
          if (!confirmed) {
            reject(strings('operationCancelled'))
          } else if (execOptions.type === ExecType.Nested) {
            pexecInCurrentTab(command, tab).then(resolve, reject)
          } else {
            REPL.qexec(command, undefined, undefined, { tab }).then(resolve, reject)
          }
        }

        eventChannelUnsafe.once(responseChannel, onConfirm)
        eventChannelUnsafe.emit(requestChannel, { command, asking, execUUID })
      })
    },
    { incognito: ['popup'] }
  )
}
