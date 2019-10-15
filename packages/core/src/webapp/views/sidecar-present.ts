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

import { Tab } from '../tab'
import { isPopup } from '../popup-core'
import Presentation from './presentation'
import { setMaximization, remove } from './sidecar-visibility'

export default (tab: Tab, presentation?: Presentation) => {
  if (presentation || presentation === Presentation.Default) {
    document.body.setAttribute('data-presentation', Presentation[presentation].toString())
    if (!isPopup() && presentation === Presentation.Default && tab.getAttribute('maximization-cause') !== 'user') {
      setMaximization(tab, remove)
    }
  } else {
    document.body.removeAttribute('data-presentation')
  }
}
