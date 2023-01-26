/*
 * Copyright 2022 The Kubernetes Authors
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

import type { Arguments } from '@kui-shell/core'

/** TODO: move to core Tab api? */
export async function setTabReadonly({ tab }: Pick<Arguments, 'tab'>) {
  const [{ eventBus }, { getPrimaryTabId }] = await Promise.all([
    import('@kui-shell/core/mdist/api/Events'),
    import('@kui-shell/core/mdist/api/Tab')
  ])
  eventBus.emitWithTabId('/kui/tab/edit/unset', getPrimaryTabId(tab))
}

/** TODO: move to core Tab api? */
export async function setTabReadWrite({ tab }: Pick<Arguments, 'tab'>) {
  const [{ eventBus }, { getPrimaryTabId }] = await Promise.all([
    import('@kui-shell/core/mdist/api/Events'),
    import('@kui-shell/core/mdist/api/Tab')
  ])
  eventBus.emitWithTabId('/kui/tab/edit/set', getPrimaryTabId(tab))
}
