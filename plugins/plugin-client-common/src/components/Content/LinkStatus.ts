/*
 * Copyright 2021 The Kubernetes Authors
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

import { Events } from '@kui-shell/core'

function strip(link: string) {
  return link.replace(/^kui-link-/, '')
}

export function linkUpdateChannel(id: string) {
  return `/link/status/update/${strip(id)}`
}

export function linkGetChannel(id: string) {
  return `/link/status/get/${strip(id)}`
}

export function subscribeToLinkUpdates(link: string, statusUpdateHandler: (status: number[], link?: string) => void) {
  Events.eventChannelUnsafe.on(linkUpdateChannel(link), statusUpdateHandler)

  // request the first update
  Events.eventChannelUnsafe.emit(linkGetChannel(link))
}

export function unsubscribeToLinkUpdates(link: string, statusUpdateHandler: (status: number[], link?: string) => void) {
  Events.eventChannelUnsafe.off(linkUpdateChannel(link), statusUpdateHandler)
}

export function emitLinkUpdate(link: string, status: 'success' | 'error' | 'in-progress' | 'blank') {
  Events.eventChannelUnsafe.emit(
    linkUpdateChannel(link),
    status === 'success'
      ? [1, 0, 0]
      : status === 'error'
      ? [0, 1, 0]
      : status === 'in-progress'
      ? [0, 0, 1]
      : [0, 0, 0],
    link
  )
}
