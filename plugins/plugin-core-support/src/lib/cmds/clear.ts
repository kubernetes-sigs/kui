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

import { Events, isHeadless, getTabId, Arguments, Registrar } from '@kui-shell/core'

const clear = ({ tab }: Arguments) => {
  if (!isHeadless()) {
    setTimeout(() => {
      Events.eventChannelUnsafe.emit(`/terminal/clear/${getTabId(tab)}`)
      Events.eventChannelUnsafe.emit(`/close/views/${getTabId(tab)}`)
    })
  }

  return true
}

/**
 * This plugin introduces the /clear command, which clear the consoles
 *
 */
export default (registrar: Registrar) => {
  registrar.listen('/clear', clear)
}
