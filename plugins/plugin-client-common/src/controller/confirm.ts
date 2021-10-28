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

import {
  Events,
  getPrimaryTabId,
  Registrar,
  ExecType,
  UsageModel,
  i18n,
  pexecInCurrentTab
} from '@kui-shell/core'

const strings = i18n('plugin-core-support')

const usage: UsageModel = {
  command: 'confirm',
  strict: 'confirm',
  example: 'confirm [--asking <confirmation message>] <your-command-to-execute>',
  docs: 'Confirmation Modal',
  optional: [
    {
      name: '--asking',
      docs: strings('confirmationMessage')
    }
  ],
  required: [
    {
      name: 'command',
      docs: strings('commandToBeExecuted')
    }
  ]
}

/**
 * This plugin introduces the /confirm command
 *
 */
export default async (commandTree: Registrar) => {
  commandTree.listen(
    '/confirm',
    ({ tab, argvNoOptions, parsedOptions, execOptions, REPL }) =>
      new Promise((resolve, reject) => {
        const asking = parsedOptions.asking || strings('areYouSure')
        const command = argvNoOptions[argvNoOptions.indexOf('confirm') + 1]
        const { execUUID } = execOptions

        const requestChannel = `/kui-shell/Confirm/v1/tab/${getPrimaryTabId(tab)}`
        const responseChannel = `${requestChannel}/execUUID/${execUUID}/confirmed`

        const onConfirm = ({ confirmed }: { confirmed: boolean }) => {
          if (!confirmed) {
            reject(strings('operationCancelled'))
          } else if (execOptions.type === ExecType.Nested) {
            pexecInCurrentTab(command).then(resolve, reject)
          } else {
            REPL.qexec(command, undefined, undefined, { tab }).then(resolve, reject)
          }
        }

        Events.eventChannelUnsafe.once(responseChannel, onConfirm)
        Events.eventChannelUnsafe.emit(requestChannel, { command, asking, execUUID })
      }),
    { usage, incognito: ['popup'] }
  )
}
