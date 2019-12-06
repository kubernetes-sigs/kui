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

import Debug from 'debug'
const debug = Debug('webapp/cli')
debug('loading')

import { setStatus } from './status'
export { setStatus }

import doCancel from './cancel'
export { doCancel }

import { isPopup } from './popup-core'
export { isPopup }

import { listen } from './listen'
export { listen }

import { Tab, isTab, getTabId, sameTab, getTabFromTarget, getCurrentTab } from './tab'
export { Tab, isTab, getTabId, sameTab, getTabFromTarget, getCurrentTab }

import {
  Prompt,
  getBlockOfPrompt,
  getPrompt,
  getBottomPrompt,
  getInitialPrompt,
  getCurrentPrompt,
  getPromptFromTarget,
  getPromptLeft,
  getCurrentPromptLeft
} from './prompt'
export {
  Prompt,
  getBlockOfPrompt,
  getPrompt,
  getBottomPrompt,
  getInitialPrompt,
  getCurrentPrompt,
  getPromptFromTarget,
  getPromptLeft,
  getCurrentPromptLeft
}

import { installBlock, getInitialBlock, getCurrentBlock, getCurrentProcessingBlock } from './block'
export { installBlock, getInitialBlock, getCurrentBlock, getCurrentProcessingBlock }

export { ok } from './print'

debug('finished loading modules')
