/*
 * Copyright 2021 The Kubernetes Authors
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

import React from 'react'
import { isOfflineClient, isReadOnlyClient } from '@kui-shell/core'

export interface MutabilityState {
  /** This current tab allows the user to change the tab in various
   * ways such as adding/removing splits, input.... */
  editable: boolean

  /** This current tab allows the user to re-execute prior commands */
  executable: boolean
}

/** This is the default behavior for non-notebook tabs (i.e normal tabs) */
const defaultState: MutabilityState = { editable: true, executable: true }

const offline: MutabilityState = { editable: false, executable: false }

const notebookMode: MutabilityState = { editable: false, executable: true }

export { offline as MutabilityStateOffline }

// define initialization
export function initializeState(): MutabilityState {
  if (isOfflineClient()) {
    return offline
  } else if (isReadOnlyClient()) {
    return notebookMode
  } else {
    return defaultState
  }
}

export function setReadOnlyBit(state: MutabilityState, editable: boolean): MutabilityState {
  return { editable: editable, executable: state.executable }
}

export function toggleReadOnlyBit(state: MutabilityState): MutabilityState {
  return setReadOnlyBit(state, !state.editable)
}

/** Context variable to keep track of tab content viewing mode: edit or read only */
export const MutabilityContext = React.createContext(defaultState)
