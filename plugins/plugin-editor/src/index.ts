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

import { Tab, ExecOptions } from '@kui-shell/core'

export { respondToRepl } from './lib/util'
export { lockIcon, edit } from './lib/readonly'
export { language, extension } from './lib/file-types'
export { Entity as EditorEntity } from './lib/entity'
export { fetchFile, registerFetcher } from './lib/fetchers'

export async function openEditor(tab: Tab, name: string, options, execOptions: ExecOptions) {
  const { openEditor } = await import('./lib/open')
  return openEditor(tab, name, options, execOptions)
}
