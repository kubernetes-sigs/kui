/*
 * Copyright 2019 The Kubernetes Authors
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

import Debug from 'debug'
import { eventChannelUnsafe } from '@kui-shell/core/mdist/api/Events'

/**
 * Update the UI to inform the user that the connection to the proxy is offline
 *
 */
export function setOffline() {
  const debug = Debug('plugins/bash-like/pty/ui')
  debug('setOffline')
  eventChannelUnsafe.emit('/proxy/offline')
}

/**
 * Update the UI to inform the user that the connection to the proxy is online
 *
 */
export function setOnline() {
  const debug = Debug('plugins/bash-like/pty/ui')
  debug('setOnline')
  eventChannelUnsafe.emit('/proxy/online')
}
