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

import { Table, MultiTable, isTable, isMultiTable } from '../webapp/models/table'
import { CustomSpec } from '../webapp/views/sidecar'
import { SidecarMode } from '../webapp/bottom-stripe'
import { MultiModalResponse } from './MultiModalResponse'

export interface EntitySpec {
  type?: string
  kind?: string

  verb?: string
  viewName?: string
  isEntity?: boolean
  name?: string
  packageName?: string
  prettyName?: string
  prettyType?: string
  prettyKind?: string
  show?: string
  displayOptions?: string[]
  controlHeaders?: boolean | string[]
  uuid?: string
  sidecarHeader?: boolean
  modes?: SidecarMode[]

  version?: string
  duration?: number
  namespace?: string
  annotations?: { key: string; value: any }[] // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface MessageBearingEntity {
  message: string
}

export function isMessageBearingEntity(entity: Entity): entity is MessageBearingEntity {
  return (entity as MessageBearingEntity).message !== undefined
}

export function isEntitySpec(entity: Entity): entity is EntitySpec {
  const spec = entity as EntitySpec
  return spec.verb !== undefined || spec.type !== undefined || spec.name !== undefined
}

/**
 * A minimal subset of a kubernetes-like resource specification that
 * identifies a resource
 *
 */
export interface MetadataBearing {
  kind?: string
  metadata?: {
    name: string
    namespace?: string

    generation?: string

    creationTimestamp?: string
  }
  spec?: {
    displayName?: string
  }
}
export function isMetadataBearing(spec: Entity): spec is MetadataBearing {
  const meta = spec as MetadataBearing
  return meta !== undefined && meta.metadata !== undefined && meta.metadata.name !== undefined
}

/**
 * Entity with a "resource" field that is MetadataBearing
 *
 */
export interface MetadataBearingByReference extends CustomSpec {
  resource: MetadataBearing
}
export function isMetadataBearingByReference(spec: Entity): spec is MetadataBearingByReference {
  const ref = spec as MetadataBearingByReference
  return ref !== undefined && ref.resource !== undefined && isMetadataBearing(ref.resource)
}

/**
 * A mostly scalar entity
 *
 */
export type SimpleEntity = Error | string | number | HTMLElement | MessageBearingEntity

/**
 * The plugin returns a mix of types; e.g. `helm status` returns
 * [string, Table, string], where the status `Table` is sandwiched by
 * preface and trailing `string` messages
 *
 */
export type MixedResponsePart = string | Table | MultiTable | HTMLElement
export type MixedResponse = MixedResponsePart[]

export function isMixedResponse(response: Entity): response is MixedResponse {
  return (
    Array.isArray(response) &&
    response.length > 0 &&
    (typeof response[0] === 'string' || isTable(response[0]) || isMultiTable(response[0]))
  )
}

/**
 * We will do away with this at some point; but, for now, the
 * cli.prompt takes over the REPL temporarily.
 *
 */
export interface LowLevelLoop {
  mode: 'prompt'
}
export function isLowLevelLoop(entity: Entity): entity is LowLevelLoop {
  const looper = entity as LowLevelLoop
  return looper.mode === 'prompt'
}

/**
 * A potentially more complex entity with a "spec"
 *
 */
export type Entity =
  | SimpleEntity
  | EntitySpec
  | CustomSpec
  | MixedResponse
  | MultiModalResponse
  | boolean
  | Table
  | MultiTable
  | LowLevelLoop
