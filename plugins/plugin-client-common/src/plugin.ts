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

import { Capabilities, Registrar } from '@kui-shell/core'

export default async (registrar: Registrar) => {
  if (!Capabilities.isHeadless()) {
    await import('./controller/confirm').then(_ => _.default(registrar))
    await import('./controller/split').then(_ => {
      registrar.listen('/split', _.default, { flags: { boolean: ['inverse'], alias: { split: ['s'] } } })
      registrar.listen('/split-debug', _.debug)
      registrar.listen('/split-count', ({ tab }) => tab.splitCount())
      registrar.listen('/is-split', ({ tab }) => tab.hasSideBySideTerminals())
    })
    await import('./controller/alert').then(_ => _.default(registrar))
    await import('./controller/card').then(_ => _.default(registrar))
    await import('./controller/commentary').then(_ => _.default(registrar))
    await import('./controller/user-settings').then(_ => _.default(registrar))
  }
}
