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

import { ITab } from '@kui-shell/core/webapp/cli'
import { IEntitySpec } from '@kui-shell/core/models/entity'
import { currentSelection as baseSelection } from '@kui-shell/core/webapp/views/sidecar'

export interface IOpenWhiskEntity extends IEntitySpec {
  namespace: string
  exec?: {
    kind: string
    code?: string
    binary?: boolean
  }
}

export function currentSelection (tab: ITab) {
  return baseSelection(tab) as IOpenWhiskEntity
}

export interface IActivationResponse {
  success: boolean
  result: Object
}

export interface IActivation {
  entity?: IEntitySpec
  activationId: string
  response: IActivationResponse
}

export function isActivationSpec (response: IActivation | IEntitySpec): response is IActivation {
  const activation = response as IActivation
  return activation.response !== undefined && activation.activationId !== undefined
}

export function isAsyncActivationSpec (response: IActivation | IEntitySpec): response is IActivation {
  const activation = response as IActivation
  return activation.response === undefined && activation.activationId !== undefined
}
