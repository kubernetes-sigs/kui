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

import { Capabilities } from '@kui-shell/core'

/**
 * Register the welcome notebook
 *
 */
export default async () => {
  if (!Capabilities.isHeadless() || Capabilities.inProxy()) {
    const { notebookVFS } = await import('@kui-shell/plugin-core-support')
    notebookVFS.cp(
      undefined,
      [
        'plugin://plugin-client-common/notebooks/code-blocks.md',
        'plugin://plugin-client-common/notebooks/expandable-section.md',
        'plugin://plugin-client-common/notebooks/hints.md',
        'plugin://plugin-client-common/notebooks/tabs.md',
        'plugin://plugin-client-common/notebooks/welcome.md',
        'plugin://plugin-client-common/notebooks/welcome.json',
        'plugin://plugin-client-common/notebooks/playground.md',
        'plugin://plugin-client-common/notebooks/wizard.md',
        'plugin://plugin-client-common/notebooks/make-notebook.md',
        'plugin://plugin-client-common/notebooks/make-notebook.json'
      ],
      '/kui'
    )
  }
}
