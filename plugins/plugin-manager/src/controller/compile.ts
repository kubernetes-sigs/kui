/*
 * Copyright 2019 IBM Corporation
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

import { Registrar, UsageModel, eventChannelUnsafe, i18n } from '@kui-shell/core'

const strings = i18n('plugin-manager')

/**
 * Usage model for plugin remove
 *
 */
const usage: UsageModel = {
  strict: 'compile',
  command: 'compile',
  docs: strings('for advanced use: recompile plugin registry'),
  example: 'plugin compile',
  optional: [{ name: 'pluginToBeRemoved', positional: true }]
}

export default (commandTree: Registrar) => {
  commandTree.listen(
    '/plugin/compile',
    async ({ argvNoOptions }) =>
      new Promise(resolve => {
        eventChannelUnsafe.once('/plugin/compile/done', () => resolve(true))
        eventChannelUnsafe.emit('/plugin/compile/request', argvNoOptions[argvNoOptions.indexOf('compile') + 1])
      }),
    { usage }
  )
}
