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

export type Annotation = { key: string; value: string | number | boolean }
export type Annotations = Annotation[]

export interface OpenWhiskEntity extends EntitySpec {
  name: string
  namespace: string
  annotations: Annotations
  exec?: {
    kind: string
    code?: string
    binary?: boolean
  }
}

type PrimitiveValue = string | number | boolean
export type Value = PrimitiveValue | Record<string, PrimitiveValue> // want Value, coming in 3.7.0 https://github.com/microsoft/TypeScript/pull/33050
export type Parameter = { key: string; value: Value }
export type Parameters = Parameter[]

export interface Action extends OpenWhiskEntity {
  parameters: Parameters
  limits: { key: 'concurrency' | 'logs' | 'memory' | 'timeout'; value: number }
  exec: {
    kind: string
    code?: string
    binary?: boolean
    components?: string[]
  }
}

export function currentSelection(tab: UI.Tab) {
  return Models.Selection.current(tab) as OpenWhiskEntity
}

export interface ActivationResponse {
  success: boolean
  result: Object // eslint-disable-line @typescript-eslint/ban-types
}

export interface Rule extends OpenWhiskEntity {
  status: boolean
  trigger: { name: string; path: string }
  action: { name: string; path: string }
}

export interface Package extends OpenWhiskEntity {
  actions: { name: string }[]
  feeds: { name: string }[]
}
