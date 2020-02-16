/*
 * Copyright 2017-2020 IBM Corporation
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

import { UsageModel, i18n } from '@kui-shell/core'

const strings = i18n('plugin-core-support')

/**
 * Usage message
 *
 */
const usage: UsageModel = {
  strict: 'screenshot',
  command: 'screenshot',
  title: strings('screenshotUsageTitle'),
  header: strings('screenshotUsageHeader'),
  example: 'screenshot [which]',
  detailedExample: [
    { command: 'screenshot sidecar', docs: strings('screenshotSidecarUsageDocs') },
    { command: 'screenshot repl', docs: strings('screenshotReplUsageDocs') },
    {
      command: 'screenshot last',
      docs: strings('screenshotLastUsageDocs')
    },
    {
      command: 'screenshot full',
      docs: strings('screenshotFullUsageDocs')
    },
    {
      command: 'screenshot',
      docs: strings('screenshotUsageDocs')
    }
  ],
  optional: [
    {
      name: 'which',
      positional: true,
      docs: strings('screenshotWhichUsageDocs'),
      allowed: ['selector', 'repl', 'full', 'last', 'nth']
    },
    { name: '--nth', docs: strings('screenshotNUsageDocs'), numeric: true },

    // hidden so i18n not needed
    { name: '--selector', hidden: true, docs: 'capture a given selector' },
    { name: '--context', allowed: ['tab'], hidden: true, docs: 'for --selector, capture context' },
    { name: '--squish-selector', hidden: true, docs: 'for --selector, also squish' },
    { name: '--squish-css', hidden: true, docs: 'for --squish-selector, add this css class' }
  ]
}

export default usage
