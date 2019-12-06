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

import { isHeadless, Registrar, i18n, UsageModel, pluginUserHome } from '@kui-shell/core'

const strings = i18n('plugin-manager')

const usage: UsageModel = {
  docs: strings('the home directory for user-installed plugins')
}

export default function(commandTree: Registrar) {
  commandTree.listen(
    '/plugin/home',
    async ({ REPL }) => {
      const home = await pluginUserHome()

      if (isHeadless()) {
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
