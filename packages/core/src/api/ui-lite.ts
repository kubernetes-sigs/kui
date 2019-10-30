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

export { Tab, getTabFromTarget } from '../webapp/tab'
export { isPopup } from '../webapp/popup-core'
export { getCurrentPrompt } from '../webapp/prompt'
export { getCurrentBlock } from '../webapp/block'
export { removeAllDomChildren as empty } from '../webapp/util/dom'
export { default as Presentation } from '../webapp/views/presentation'
export { Mode as MultiModalMode, MultiModalResponse } from '../models/mmr/types'

import { Codes, isCursorMovement } from '../webapp/keys'
export const Keys = {
  Codes,
  isCursorMovement
}
