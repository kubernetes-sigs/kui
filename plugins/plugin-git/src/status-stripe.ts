/*
 * Copyright 2019-2020 IBM Corporation
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

import { CodedError, PreloadRegistrar, Tab, i18n, StatusStripeController, StatusTextWithIcon } from '@kui-shell/core'

const strings = i18n('plugin-bash-like')

// a "branch" icon
const icon =
  '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M26,18a3.9955,3.9955,0,0,0-3.858,3H18a3.0033,3.0033,0,0,1-3-3V14a4.9514,4.9514,0,0,0-1.0256-3H22.142a4,4,0,1,0,0-2H9.858a4,4,0,1,0,0,2H10a3.0033,3.0033,0,0,1,3,3v4a5.0059,5.0059,0,0,0,5,5h4.142A3.9935,3.9935,0,1,0,26,18ZM26,8a2,2,0,1,1-2,2A2.0023,2.0023,0,0,1,26,8ZM6,12a2,2,0,1,1,2-2A2.002,2.002,0,0,1,6,12ZM26,24a2,2,0,1,1,2-2A2.0027,2.0027,0,0,1,26,24Z"></path><title>Branch</title></svg>'

/**
 * On default events (new tab, tab switch, command execution), we
 * will update the text element.
 *
 */
async function reportCurrentBranch(tab: Tab, controller: StatusStripeController, { text }: StatusTextWithIcon) {
  try {
    const [isDirty, branch] = await Promise.all([
      // exit 0/1 indicates clean/dirty
      tab.REPL.qexec('git diff-index --quiet HEAD --')
        .then(() => false)
        .catch(() => true),

      // exits with branch name
      tab.REPL.qexec<string>('git rev-parse --abbrev-ref HEAD')
    ])

    if (branch) {
      text.innerText = branch
    }

    // is the branch dirty?
    controller.showAs(isDirty ? 'warn' : 'normal')
  } catch (error) {
    const err = error as CodedError
    if (err.code !== 128) {
      // 128: not a git repository; don't report those as errors
      console.error('unable to determine git branch', err.code, typeof err.code, err)
    }

    // but, in either case, hide the entry
    text.innerText = strings('not a repo')
    controller.showAs('hidden')
  }
}

export default async function(registrar: PreloadRegistrar) {
  const fragment = {
    id: 'kui--plugin-bash-like--current-git-branch',
    icon,

    // this will contain the current branch name
    text: document.createElement('div'),

    // onclick handlers
    onclick: {
      icon: 'git status',
      text: 'git branch'
    }
  }

  // decorate status stripe with (icon, text)
  await registrar.registerContext({ fragment, listener: reportCurrentBranch })
}
