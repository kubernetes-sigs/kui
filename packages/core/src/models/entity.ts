/*
 * Copyright 2019 The Kubernetes Authors
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

import { isHTML } from '../util/types'
import { Abortable } from '../core/jobs/job'
import { isHeadless } from '../core/capabilities'
import { Table, Row, isTable } from '../webapp/models/table'
import { ToolbarText } from '../webapp/views/toolbar-text'
import { UsageModel } from '../core/usage-error'
import isMultiModalResponse from './mmr/is'
import MultiModalResponse from './mmr/types'
import { NavResponse, isNavResponse } from './NavResponse'
import { CommentaryResponse } from './CommentaryResponse'
import RadioTable from './RadioTable'
import Presentation from '../webapp/views/presentation'
import { ReactNode } from 'react'
import TabLayoutModificationResponse from './TabLayoutModificationResponse'
import { isXtermResponse, XtermResponse } from './XtermResponse'
import StatusModel from './StatusModel'

export interface MessageBearingEntity {
  message: string
}

export function isMessageBearingEntity(entity: Entity | MessageBearingEntity): entity is MessageBearingEntity {
  return (entity as MessageBearingEntity).message !== undefined
}

/**
 * The name part of a metadata bearing resource.
 *
 */
export interface MetadataNamedResource {
  kind?: string

  metadata?: {
    name: string
    namespace?: string
    generation?: string
    creationTimestamp?: string
    labels?: Record<string, string>
  }
}

/**
 * A minimal subset of a kubernetes-like resource specification that
 * identifies a resource
 *
 */
export interface MetadataBearing<Content = void> extends MetadataNamedResource {
  apiVersion?: string

  /** optional designation of resource version */
  version?: string

  /** name hash, e.g. the hash part of auto-generated names, or an openwhisk activation id */
  prettyName?: string
  nameHash?: string

  /** family of onclick handlers */
  onclick?: {
    kind?: string
    name?: string
    nameHash?: string
    namespace?: string
  }

  content?: Content
  contentType?: string
  toolbarText?: ToolbarText
  presentation?: Presentation
}

export type MetadataBearingWithContent<T extends any = any> = MetadataBearing<T>

export function isMetadataBearing(spec: MetadataBearing | Entity): spec is MetadataBearing {
  const meta = spec as MetadataBearing
  return meta !== undefined && meta.metadata !== undefined && meta.metadata.name !== undefined
}

export interface WithDisplayName extends MetadataBearing {
  spec: {
    displayName: string
  }
}

export function hasDisplayName(resource: MetadataBearing): resource is WithDisplayName {
  const res = resource as WithDisplayName
  return isMetadataBearing(resource) && res.spec !== undefined && typeof res.spec.displayName === 'string'
}

/**
 * Entity with a "resource" field that is MetadataBearing
 *
 */
export interface MetadataBearingByReference<Content = void> extends MetadataBearing<Content> {
  resource: MetadataBearing<Content>
}
export type MetadataBearingByReferenceWithContent<T extends any = any> = MetadataBearingByReference<T>
export function isMetadataBearingByReference<T extends MetadataBearingByReference>(
  spec: MetadataBearing | Entity | MetadataBearingWithContent | T
): spec is T {
  const ref = spec as T
  return ref !== undefined && ref.resource !== undefined && isMetadataBearing(ref.resource)
}

/**
 * A mostly scalar entity
 *
 */
export type SimpleEntity =
  | boolean
  | string
  | number
  | HTMLElement
  | /* MessageBearingEntity | */ Error
  | MarkdownResponse
  | ReactResponse

export type MarkdownResponse = { content: string; contentType: 'text/markdown' }

export function isMarkdownResponse(entity: Entity): entity is MarkdownResponse {
  const md = entity as MarkdownResponse
  return md && typeof md.content === 'string' && md.contentType === 'text/markdown'
}

export type ReactResponse = { react: ReactNode }

export function isReactResponse(entity: Entity): entity is ReactResponse {
  if (isHeadless()) {
    return false
  } else {
    const { isValidElement } = require('react')
    const response = entity as ReactResponse
    return response && response.react && isValidElement(response.react)
  }
}

/**
 * The plugin returns a mix of types; e.g. `helm status` returns
 * [string, Table, string], where the status `Table` is sandwiched by
 * preface and trailing `string` messages
 *
 */
export type MixedResponsePart = number | boolean | string | Table | HTMLElement
export type MixedResponse = MixedResponsePart[]

export function isMixedResponse(response: Entity): response is MixedResponse {
  return (
    Array.isArray(response) &&
    response.length > 0 &&
    (typeof response[0] === 'string' ||
      typeof response[0] === 'number' ||
      typeof response[0] === 'boolean' ||
      isTable(response[0]) ||
      isHTML(response[0]) ||
      isXtermResponse(response[0]))
  )
}

/**
 * Transforms optional fields to required fields
 *
 */
type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined
}

/**
 * This allows commands to pass through raw responses from their backend
 *
 */
export type RawContent = any // eslint-disable-line @typescript-eslint/no-explicit-any
export interface RawResponse<Content extends RawContent> {
  mode: 'raw'
  content: Content
}

export function isRawResponse<Content extends RawContent>(entity: Entity<Content>): entity is RawResponse<Content> {
  const raw = entity as RawResponse<Content>
  return raw.mode === 'raw' && raw.content !== undefined
}

type RandomErrorResponse1 = { code: string }
export function isRandomErrorResponse1(response: Entity): response is RandomErrorResponse1 {
  return typeof (response as RandomErrorResponse1).code === 'string'
}

type RandomErrorResponse2 = { errno: string | number }
export function isRandomErrorResponse2(response: Entity): response is RandomErrorResponse2 {
  const { errno } = response as RandomErrorResponse2
  return typeof errno === 'string' && typeof errno === 'number'
}

/**
 * This type covers all responses with no complex internal structure
 * that views may wish to interpret into fancier views.
 *
 */
export type ScalarResponse<RowType extends Row = Row> =
  | SimpleEntity
  | (Table<RowType> & Partial<WithSourceReferences>)
  | MixedResponse
  | CommentaryResponse
  | TabLayoutModificationResponse
  | XtermResponse
  | StatusModel
  | RandomErrorResponse1
  | RandomErrorResponse2

export function isScalarResponse(response: Entity): response is ScalarResponse {
  return !isMultiModalResponse(response) && !isNavResponse(response)
}

export type ViewableResponse = MultiModalResponse | NavResponse | RadioTable

export type StructuredResponse<
  Content = void,
  SomeSortOfResource extends MetadataBearing<Content> = MetadataBearing<Content>
> = ViewableResponse | UsageModel | SomeSortOfResource | RawResponse<Content> | SomeSortOfResource[]

export interface SourceRef {
  templates: { filepath: string; data: string; isFor: string; kind?: 'source' | 'template'; contentType?: string }[]
  customization?: { filepath: string; data: string; isFor: string }
}

export interface WithSourceReferences {
  kuiSourceRef: SourceRef
}

export function hasSourceReferences(
  response: Partial<WithSourceReferences>
): response is Required<WithSourceReferences> {
  const trait = response as WithSourceReferences
  return trait && trait.kuiSourceRef !== undefined
}

type AbortableResponse<T extends ScalarResponse = ScalarResponse> = Abortable & { response: T }
export function isAbortableResponse(entity: Entity): entity is AbortableResponse {
  return typeof (entity as AbortableResponse).abort === 'function'
}

/**
 * A potentially more complex entity with a "spec"
 *
 */
export type Entity<
  Content = void,
  RowType extends Row = Row,
  SomeSortOfResource extends MetadataBearing<Content> = MetadataBearing<Content>
> = ScalarResponse | AbortableResponse | StructuredResponse<Content, SomeSortOfResource>
