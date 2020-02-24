/*
 * Copyright 2017-19 IBM Corporation
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

import { getCurrentTab } from './tab'
import { Block } from './models/block'

export const getCurrentBlock = (tab = getCurrentTab()): Block => {
  return tab.querySelector('.repl .repl-active')
}

export const getCurrentProcessingBlock = (tab = getCurrentTab()): HTMLElement => {
  return tab.querySelector('.repl .repl-block.processing')
}

/**
 * Install a sub-block of output in the given block
 *
 */
export function subblock() {
  const block = document.createElement('div')
  const blockResult = document.createElement('div')

  blockResult.classList.add('repl-result')
  block.classList.add('processing')
  block.classList.add('kui--repl-subblock')
  block.appendChild(blockResult)

  return block
}
