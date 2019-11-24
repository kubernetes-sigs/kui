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
import { ToolbarText } from '../webapp/views/toolbar-text'
import { UsageModel } from '../core/usage-error'
import { MultiModalResponse } from './mmr/types'

export interface MessageBearingEntity {
  message: string
}

export function isMessageBearingEntity(entity: Entity): entity is MessageBearingEntity {
  return (entity as MessageBearingEntity).message !== undefined
}

/**
 * A minimal subset of a kubernetes-like resource specification that
 * identifies a resource
 *
 */
export interface MetadataBearing<Content = void> {
  kind?: string
  metadata?: {
    name: string
    namespace?: string

    generation?: string

    creationTimestamp?: string
  }

  /** optional designation of resource version */
  version?: string

  /** name hash, e.g. the hash part of auto-generated names, or an openwhisk activation id */
  prettyName?: string
  nameHash?: string

  /** family of onclick handlers */
  onclick?: {
    name?: string
    nameHash?: string
    namespace?: string
  }

  content?: Content
  contentType?: string
  toolbarText?: ToolbarText
  spec?: {
    displayName?: string
  }
}
export function isMetadataBearing(spec: MetadataBearing | Entity): spec is MetadataBearing {
  const meta = spec as MetadataBearing
  return meta !== undefined && meta.metadata !== undefined && meta.metadata.name !== undefined
}

/**
 * Entity with a "resource" field that is MetadataBearing
 *
 */
export interface MetadataBearingByReference<Content = void> extends CustomSpec<Content> {
  resource: MetadataBearing<Content>
}
export function isMetadataBearingByReference(
  spec: MetadataBearing | MetadataBearingByReference | Entity
): spec is MetadataBearingByReference {
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

export interface VerbEntity {
  verb: 'delete'
  type: string
  name: string
  namespace?: string
}

export function isVerbEntity(entity: Entity): entity is VerbEntity {
  const verby = entity as VerbEntity
  return verby.verb === 'delete' && typeof verby.type === 'string' && typeof verby.name === 'string'
}

/**
 * A potentially more complex entity with a "spec"
 *
 */
export type Entity<Content = void> =
  | SimpleEntity
  | MetadataBearing<Content>
  | VerbEntity
  | CustomSpec
  | MixedResponse
  | MultiModalResponse
  | boolean
  | Table
  | MultiTable
  | LowLevelLoop
  | UsageModel
