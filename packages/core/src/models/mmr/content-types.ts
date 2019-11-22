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

import { Tab } from '../../webapp/tab'
import { Table, MultiTable, isTable, isMultiTable } from '../../webapp/models/table'
import { Entity, MetadataBearing } from '../entity'
import { CustomSpec } from '../../webapp/views/sidecar-core'
import { isCustomSpec } from '../../webapp/views/custom-content'
import { SidecarMode } from '../../webapp/bottom-stripe'

/**
 * A `ScalarResource` is Any kind of resource that is directly
 * represented, as opposed to being implicitly represented by a
 * function call.
 *
 */
export type ScalarResource = CustomSpec | string | HTMLElement | Table | MultiTable
export interface ScalarContent<T = ScalarResource> {
  content: T
}

export function isScalarContent<T extends MetadataBearing>(
  entity: Entity | ScalarResource | ScalarContent | Content<T> | MetadataBearing | SidecarMode
): entity is ScalarContent {
  const content = (entity as ScalarContent).content
  return (
    content !== undefined &&
    (typeof content === 'string' || isTable(content) || isMultiTable(content) || isCustomSpec(content))
  )
}

/**
 * Special case of `ScalarContent` for strings; string content may
 * optionally provide a `contentType`.
 *
 */
export interface StringContent<ContentType = 'yaml' | 'text/markdown' | 'text/html'> extends ScalarContent<string> {
  contentType?: ContentType
}

export function isStringWithOptionalContentType<T extends MetadataBearing>(
  entity: Entity | Content<T> | MetadataBearing | SidecarMode
): entity is StringContent {
  const str = entity as StringContent
  return (
    str && typeof str.content === 'string' && (str.contentType === undefined || typeof str.contentType === 'string')
  )
}

/**
 * `Content` as `FunctionThatProducesContent<T>` is a function that
 * takes a `T` and produces either a resource or some { content,
 * contentType } wrapper.
 *
 */
export type FunctionThatProducesContent<T extends MetadataBearing> = (
  tab: Tab,
  entity: T
) => ScalarResource | ScalarContent | Promise<ScalarResource> | Promise<ScalarContent>
export interface FunctionContent<T extends MetadataBearing> {
  content: FunctionThatProducesContent<T>
}
export function isFunctionContent<T extends MetadataBearing>(
  content: Entity | Content<T> | MetadataBearing | SidecarMode
): content is FunctionContent<T> {
  const func = content as FunctionContent<T>
  return !!func && !!func.content && typeof func.content === 'function'
}

/**
 * `Content` as `CommandStringContent` will be executed via a
 * REPL.qexec; the command is assumed to return either
 * `ScalarRersource` or `ScalarContent`.
 *
 */
type CommandStringContent = StringContent<'command'>
export function isCommandStringContent<T extends MetadataBearing>(
  content: Content<T>
): content is CommandStringContent {
  return (
    !!content &&
    !!content.content &&
    typeof (content as CommandStringContent).content === 'string' &&
    (content as CommandStringContent).contentType === 'command'
  )
}

/**
 * The classes of supported `Content` are:
 * - `ScalarContent`: such as pre-formatted HTML, or or `Table` model
 * - `StringContent`: a string with an optional `contentType`
 * - `FunctionContent<T>`: a function that takes a `T` and produces `ScalarContent`
 * - `CommandStringContent`: a string to be executed as a Kui command, and producing `ScalarContent`
 *
 */
export type Content<T extends MetadataBearing> =
  | ScalarContent
  | StringContent
  | FunctionContent<T>
  | CommandStringContent

export function hasContent<T extends MetadataBearing>(
  resource: ScalarResource | Content<T> | SidecarMode
): resource is Content<T> {
  return Object.prototype.hasOwnProperty.call(resource, 'content')
}
