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

import { Terminal } from 'xterm'

import { flatten } from '@kui-shell/core/core/utility'

import { cleanupTerminalAfterTermination } from './util'

/**
 * Remove trailing blank lines
 *
 */
function trim(strings: string[]) {
  let idx = strings.length - 1
  for (; idx >= 0; idx--) {
    if (strings[idx].length > 0) {
      break
    }
  }
  if (idx > 0) {
    return strings.slice(0, idx)
  } else {
    return strings
  }
}

/**
 * Here, we leverage xterm.js to format strings that may include control characters
 *
 */
export default function formatAsPty(_strings: string[], fontFamily: string, fontSize: number): Promise<HTMLElement> {
  return new Promise(resolve => {
    const strings = trim(flatten(_strings.map(_ => _.split(/[\n]/))))
    const cols = strings.reduce((max, str) => Math.max(max, str.length), 0)
    const rows = strings.length

    const terminal = new Terminal({
      rendererType: 'dom',
      cols,
      rows,
      fontFamily,
      fontSize
    })

    const container = document.createElement('div')
    terminal.open(container)

    strings.forEach(_ => {
      terminal.write(_)
      terminal.write('\n')
    })

    let cleanup: NodeJS.Timeout
    terminal.on('refresh', function() {
      if (cleanup) {
        clearTimeout(cleanup)
      }
      cleanup = setTimeout(() => {
        cleanupTerminalAfterTermination(terminal)
        const copy = terminal.element.cloneNode(true) as HTMLElement
        const viewport = copy.querySelector('.xterm-viewport')
        copy.removeChild(viewport)
        copy.classList.remove('enable-mouse-events')
        copy.classList.add('xterm-terminated')
        cleanup = undefined
        resolve(copy)
      }, 20)
    })
  })
}
