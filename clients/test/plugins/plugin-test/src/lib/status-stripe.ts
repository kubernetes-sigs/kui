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

import { Tab, StatusStripeController, StatusTextWithIcon } from '@kui-shell/core'

// a "flag" icon just for fun
const icon =
  '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M6,30H4V2H28l-5.8,9L28,20H6ZM6,18H24.33L19.8,11l4.53-7H6Z"></path><title>Flag</title></svg>'

interface MyFragment extends StatusTextWithIcon {
  counter: number
}

/** turn the fragment model into text to be displayed */
function render(fragment: MyFragment) {
  return `count: ${fragment.counter}`
}

/** just for fun, cycle through colors */
export const colors = ['ok' as const, 'warn' as const, 'error' as const, 'normal' as const]

/** an id we want to attach to our fragment, to help with tests */
export const id = 'test-client-counter-fragment'

/**
 * On default events (new tab, tab switch, command execution), we
 * will update the text element.
 *
 */
async function listener(tab: Tab, controller: StatusStripeController<MyFragment>, fragment: MyFragment) {
  // alternate between error, warn,  and normal presentation
  controller.showAs(colors[fragment.counter % colors.length])

  fragment.counter++
  fragment.text.innerText = render(fragment)
}

export default function() {
  const text = document.createElement('div')

  const fragment = {
    id,
    counter: 0,
    icon,
    text,
    onclick: {
      icon: 'echo hi',
      text: 'echo ho'
    }
  }

  text.innerText = render(fragment)

  return { fragment, listener }
}
