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

import { Models, UI } from '@kui-shell/core'
import { EntitySpec } from '@kui-shell/core/models/entity'

export interface OpenWhiskEntity extends EntitySpec {
  namespace: string
  annotations: { key: string; value: string | number | boolean }[]
  exec?: {
    kind: string
    code?: string
    binary?: boolean
  }
}

export function currentSelection(tab: UI.Tab) {
  return Models.Selection.current(tab) as OpenWhiskEntity
}

export interface ActivationResponse {
  success: boolean
  result: Object // eslint-disable-line @typescript-eslint/ban-types
}

export interface Activation {
  entity?: OpenWhiskEntity
  activationId: string
  response: ActivationResponse
}

export function isActivationSpec(response: Activation | OpenWhiskEntity): response is Activation {
  const activation = response as Activation
  return activation.response !== undefined && activation.activationId !== undefined
}

export function isAsyncActivationSpec(response: Activation | OpenWhiskEntity): response is Activation {
  const activation = response as Activation
  return activation.response === undefined && activation.activationId !== undefined
}
