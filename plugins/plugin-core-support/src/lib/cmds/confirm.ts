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

import {
  Registrar,
  ExecType,
  UsageModel,
  eventBus,
  i18n,
  getCurrentPrompt,
  injectCSS,
  KeyCodes,
  Tab
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
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve, reject) => {
        const message = parsedOptions.asking || strings('areYouSure')
        const command = argvNoOptions[argvNoOptions.indexOf('confirm') + 1]

        injectCSS({
          css: require('@kui-shell/plugin-core-support/web/css/confirm.css'),
          key: 'plugin-core-support.kui-shell.org/confirm.css'
        })

        const confirm = () => {
          const modal = document.createElement('div')
          const header = document.createElement('div')
          const content = document.createElement('div')
          const footer = document.createElement('div')
          document.body.appendChild(modal)

          /** destroy the confirmation modal UI */
          const destroy = (success: boolean) => {
            cleanupMouseEvents() // eslint-disable-line @typescript-eslint/no-use-before-define

            setTimeout(() => {
              document.body.removeChild(modal)
              const prompt = getCurrentPrompt(tab)
              if (prompt) {
                prompt.readOnly = false
                prompt.focus()
              }
            }, 0)

            if (success) {
              resolve(strings('operationConfirmed'))
            } else {
              reject(strings('operationCancelled'))
            }
          }
          const cancel = () => destroy(false)
          const success = () => destroy(true)

          // the following bits handle mouse clicks on the underlying
          // page; we want the confirmation popup to disappear onclick
          let notAClick = false
          let currentClickX: number
          let currentClickY: number
          const blurryClick = () => {
            if (!notAClick) {
              cancel()
            }
          }
          const blurryMouseDown = (evt: MouseEvent) => {
            currentClickX = evt.screenX
            currentClickY = evt.screenY
          }
          const blurryMouseUp = (evt: MouseEvent) => {
            // if the total pixel movement is small, then we're ok calling this a click
            notAClick = Math.abs(evt.screenX - currentClickX) + Math.abs(evt.screenY - currentClickY) > 4
          }
          const cleanupMouseEvents = () => {
            // remove the underlying page blurry bit
            document.querySelector('.page').classList.remove('blurry')

            document.querySelector('.page').removeEventListener('click', blurryClick)
            document.querySelector('.page').removeEventListener('mousedown', blurryMouseDown)
            document.querySelector('.page').removeEventListener('mouseup', cancel)
          }
          const initMouseEvents = () => {
            // make the underlying page blurry while we have the snapshot overlay up
            document.querySelector('.page').classList.add('blurry')

            document.querySelector('.page').addEventListener('click', blurryClick)
            document.querySelector('.page').addEventListener('mousedown', blurryMouseDown)
            document.querySelector('.page').addEventListener('mouseup', blurryMouseUp)
          }
          initMouseEvents()

          const executeCommandForReal = () => REPL.pexec(command, { tab })
          const executeCommand = (thatTab: Tab) => {
            if (thatTab === tab) {
              executeCommandForReal()
              eventBus.off('/core/cli/install-block', executeCommand)
            }
          }
          const exec = () => {
            success()

            if (execOptions.type === ExecType.TopLevel) {
              eventBus.on('/core/cli/install-block', executeCommand)
            } else {
              executeCommandForReal()
            }
          }

          modal.id = 'confirm-dialog'
          modal.classList.add('bx--modal-container')
          modal.appendChild(header)
          modal.appendChild(content)
          modal.appendChild(footer)

          header.classList.add('bx--modal-header')

          const headerText = document.createElement('p')
          headerText.classList.add('bx--modal-header__heading')
          headerText.classList.add('bx--type-beta')
          headerText.innerText = strings('pleaseConfirm')

          header.appendChild(headerText)

          const closeButton = document.createElement('button')

          closeButton.classList.add('bx--modal-close')
          closeButton.classList.add('close-button')
          closeButton.setAttribute('type', 'button')
          closeButton.setAttribute('aria-label', 'close modal')
          closeButton.onclick = cancel
          closeButton.innerHTML =
            '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--modal-close__icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M12 4.7l-.7-.7L8 7.3 4.7 4l-.7.7L7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z"></path></svg>'
          header.appendChild(closeButton)

          content.classList.add('bx--modal-content')
          content.classList.add('confirm-content')
          const confirmMessage = document.createElement('div')
          confirmMessage.classList.add('confirm-message')
          confirmMessage.innerHTML = `<p>${strings('aboutToExecute')}<br><strong>${command}</strong><br>${message}</p>`
          content.appendChild(confirmMessage)

          footer.classList.add('bx--modal-footer')

          const cancelButton = document.createElement('button')
          const continueButton = document.createElement('button')
          footer.appendChild(cancelButton)
          footer.appendChild(continueButton)

          cancelButton.classList.add('bx--btn')
          cancelButton.classList.add('bx--btn--secondary')
          cancelButton.classList.add('button-custon')
          cancelButton.setAttribute('type', 'button')
          cancelButton.innerText = strings('cancel')
          cancelButton.onclick = cancel

          continueButton.classList.add('bx--btn')
          continueButton.classList.add('bx--btn--danger')
          continueButton.classList.add('button-custon')
          continueButton.setAttribute('type', 'button')
          continueButton.innerText = strings('yesIAmSure')
          continueButton.onclick = exec

          // temporarily disable the repl
          if (getCurrentPrompt(tab)) {
            getCurrentPrompt(tab).readOnly = true
          }

          // to capture the Escape key event
          const hiddenInput = document.createElement('input')
          hiddenInput.classList.add('hidden')
          hiddenInput.classList.add('grab-focus')
          modal.appendChild(hiddenInput)
          hiddenInput.focus()

          modal.addEventListener(
            'keyup',
            (evt: KeyboardEvent) => {
              if (evt.keyCode === KeyCodes.ESCAPE) {
                evt.preventDefault()
                cancel()
              }
            },
            { capture: true, once: true }
          )
        }

        setTimeout(confirm, 0)
      }),
    { usage, noAuthOk: true, inBrowserOk: true, incognito: ['popup'] }
  )
}
