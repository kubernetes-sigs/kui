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

// this file defines the external API

import { Tabs } from '@kui-shell/core/api/ui'
import { ExecOptions } from '@kui-shell/core/api/commands'

export { language, extension } from './lib/file-types'
export { lockIcon, edit } from './lib/readonly'
export { Entity as EditorEntity, fetchFile, registerFetcher } from './lib/fetchers'
export { respondToRepl } from './lib/util'

export async function openEditor(tab: Tabs.Tab, name: string, options, execOptions: ExecOptions.ExecOptions) {
  const { openEditor } = await import('./lib/open')
  return openEditor(tab, name, options, execOptions)
}
