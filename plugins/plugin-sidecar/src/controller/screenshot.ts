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

import { i18n, UsageModel, Arguments, Tab } from '@kui-shell/core'

const strings = i18n('plugin-sidecar')

export const screenshotUsage: UsageModel = {
  strict: 'sidecar',
  command: 'sidecar',
  detailedExample: [{ command: 'screenshot sidecar', docs: strings('screenshotSidecarUsageDocs') }]
}

/**
 * Is the sidecar currently visible in the given tab
 *
 */
const isVisible = (tab: Tab): boolean => {
  const sidecar = tab.querySelector('sidecar')
  return !!(sidecar && sidecar.classList.contains('visible'))
}

export function doScreenshot({ tab, REPL }: Arguments) {
  if (!isVisible(tab)) {
    // sanity check: we can't take a screenshot of the sidecar, if it
    // is not currently visible
    throw new Error(strings('screenshotSidecarNotOpen'))
  }

  return REPL.qexec(`screenshot selector sidecar --context tab`)
}
