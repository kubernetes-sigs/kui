/*
 * Copyright 2017 IBM Corporation
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

import * as Debug from 'debug'
import * as colors from 'colors/safe'

import { Capabilities, UI } from '@kui-shell/core'

const debug = Debug('plugins/plugin-manager/util')

/**
 * Return a message for the REPL, asking the user to reload
 *
 */
export const success = (operation, availableMessage, updatedCommands) => {
  const msg = document.createElement('div')
  const clicky = document.createElement('span')

  if (operation !== false) {
    const installed = operation ? `The plugin has been ${operation}.` : ''

    msg.appendChild(document.createTextNode(Capabilities.isHeadless() ? colors.blue(installed) : installed))
    if (!Capabilities.isHeadless()) {
      msg.appendChild(document.createTextNode(' Please '))
      msg.appendChild(clicky)
      msg.appendChild(document.createTextNode(' to complete the installation.'))
    }
  }

  clicky.innerText = 'reload'
  clicky.className = 'clickable clickable-blatant'
  clicky.onclick = () =>
    require('electron')
      .remote.getCurrentWindow()
      .reload()

  if (availableMessage && updatedCommands && updatedCommands.length > 0) {
    const available = document.createElement('div')
    const leadIn = document.createElement('span')
    const list = document.createElement('span')

    if (operation !== false) {
      available.style.paddingTop = '1em'
    }

    msg.appendChild(available)
    available.appendChild(leadIn)
    available.appendChild(list)

    leadIn.innerText = ` The following commands ${availableMessage}: `

    list.style.display = 'flex'
    list.style.flexWrap = 'wrap'

    updatedCommands.forEach((cmd, idx) => {
      const cmdDom = document.createElement('span')
      const sep = idx === 0 ? '' : ', '

      cmdDom.innerText = `${sep}${cmd}`
      cmdDom.className = 'clickable clickable-blatant'
      cmdDom.onclick = () => UI.LowLevel.partialInput(cmd)

      list.appendChild(cmdDom)
    })
  }

  return msg
}

debug('loading done')
