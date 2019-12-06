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
import { getSidecar } from './sidecar-core'

/**
 * View State of the sidecar of a tab
 *
 */
export enum SidecarState {
  NotShown,
  Minimized,
  Open,
  FullScreen
}

/**
 * @return the view state of the sidecar in a given tab
 *
 */
export const getSidecarState = (tab: Tab): SidecarState => {
  const sidecar = getSidecar(tab)
  if (tab.classList.contains('sidecar-full-screen')) {
    return SidecarState.FullScreen
  } else if (sidecar.classList.contains('visible')) {
    return SidecarState.Open
  } else if (sidecar.classList.contains('minimized')) {
    return SidecarState.Minimized
  } else {
    return SidecarState.NotShown
  }
}
