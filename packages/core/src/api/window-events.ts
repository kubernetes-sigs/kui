/*
 * Copyright 2020 The Kubernetes Authors
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

import { Capabilities } from '..'

/** Signals that indicate we are being terminated */
const signals = ['SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'] as const

/** Interface with process.on/off */
async function toggle(op: 'on' | 'off', handler: () => void) {
  if (op === 'on') {
    process.on('exit', handler)
  } else {
    process.off('exit', handler)
  }

  signals.forEach(signal => {
    if (op === 'on') {
      process.on(signal, handler)
    } else {
      process.off(signal, handler)
    }
  })
}

export function onQuit(handler: () => void) {
  if (Capabilities.isHeadless()) {
    toggle('on', handler)
  } else if (typeof window.addEventListener === 'function') {
    window.addEventListener('beforeunload', handler)
  }
}

export function offQuit(handler: () => void) {
  if (Capabilities.isHeadless()) {
    toggle('off', handler)
  } else if (typeof window.removeEventListener === 'function') {
    window.removeEventListener('beforeunload', handler)
  }
}
