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

import { basename } from 'path'

import { inElectron } from '../core/capabilities'

export function installContext(block: HTMLElement) {
  if (inElectron()) {
    const cwd = process.cwd() === process.env.HOME ? '~' : basename(process.cwd())
    const promptContextContainer = block.querySelector('.repl-context') as HTMLElement
    promptContextContainer.innerText = cwd
  }
}
