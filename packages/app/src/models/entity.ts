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

import { Table } from '../webapp/models/table'
import { ICustomSpec } from '../webapp/views/sidecar'
import { ISidecarMode } from '../webapp/bottom-stripe'

export interface IEntitySpec {
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
  modes?: ISidecarMode[]

  version?: string
  duration?: number
  namespace?: string
  annotations?: { key: string; value: any }[]
}

export interface IMessageBearingEntity {
  message: string
}

export function isMessageBearingEntity (entity: Entity): entity is IMessageBearingEntity {
  return (entity as IMessageBearingEntity).message !== undefined
}

export function isEntitySpec (entity: Entity): entity is IEntitySpec {
  const spec = entity as IEntitySpec
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
    creationTimestamp?: string
  }
}
export function isMetadataBearing (spec: IEntitySpec): spec is MetadataBearing {
  const meta = spec as MetadataBearing
  return meta !== undefined &&
    meta.kind !== undefined &&
    meta.metadata !== undefined &&
    meta.metadata.name !== undefined
}

/**
 * A mostly scalar entity
 *
 */
export type SimpleEntity = Error | string | number | HTMLElement | IMessageBearingEntity

/**
 * A potentially more complex entity with a "spec"
 *
 * Note: Array<any> will go away once we have fully typed tables
 *
 */
export type Entity = SimpleEntity | IEntitySpec | ICustomSpec | boolean | any[] | Table
