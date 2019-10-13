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

import { Capabilities, Commands, i18n, Errors, Plugins } from '@kui-shell/core'

const strings = i18n('plugin-manager')

const usage: Errors.UsageModel = {
  docs: strings('the home directory for user-installed plugins')
}

export default function(commandTree: Commands.Registrar) {
  commandTree.listen(
    '/plugin/home',
    async ({ REPL }) => {
      const home = await Plugins.userHome()

      if (Capabilities.isHeadless()) {
        return home
      } else {
        const link = document.createElement('div')
        link.classList.add('clickable')
        link.innerText = home
        link.onclick = () => REPL.pexec(`ls ${REPL.encodeComponent(home)}`)
        return link
      }
    },
    { usage }
  )
}
