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

import { UI } from '@kui-shell/core'
import sidecarSelector from '@kui-shell/core/webapp/views/sidecar-selector'
import pictureInPicture from '@kui-shell/core/webapp/picture-in-picture'

export const drilldownWith = (
  tab: UI.Tab,
  returnTo: string,
  command: string | (() => Promise<string>),
  highlightThis?: HTMLElement,
  callThese = []
) => event => {
  // invoke any precursor functions
  callThese.forEach(_ => _())

  const container = sidecarSelector(tab, '.custom-content .activation-viz-plugin')
  return pictureInPicture(tab, command, highlightThis, container, returnTo)(event)
}
