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

import { EvaluatorArgs as Arguments, ParsedOptions } from '../command'
import { ReactElement } from 'react'
import { Tab } from '../../webapp/tab'
import { Table, isTable } from '../../webapp/models/table'
import { Entity, MetadataBearing } from '../entity'
import { isHTML } from '../../util/types'
import { ModeOrButton, Button } from './types'
import { ToolbarText } from '../../webapp/views/toolbar-text'
import { Editable } from '../editable'
import DescriptionList, { isDescriptionList } from '../DescriptionList'

/**
 * A `ScalarResource` is Any kind of resource that is directly
 * represented, as opposed to being implicitly represented by a
 * function call.
 *
 */
export type ScalarResource = string | HTMLElement | Table | DescriptionList
export interface ScalarContent<T = ScalarResource> {
  content: T
}

export type ToolbarProps = {
  willUpdateToolbar?: (toolbarText: ToolbarText, extraButtons?: Button[], extraButtonsOverride?: boolean) => void
}
export type ReactProvider = { react: (props: ToolbarProps) => ReactElement<any> }
export function isReactProvider(entity: ScalarLike<MetadataBearing>): entity is ReactProvider {
  const provider = entity as ReactProvider
  return typeof provider.react === 'function'
}

type ScalarLike<T extends MetadataBearing> =
  | Entity
  | ScalarResource
  | ScalarContent
  | Content<T>
  | MetadataBearing
  | ModeOrButton<T>
  | ReactProvider
export function isScalarContent<T extends MetadataBearing>(entity: ScalarLike<T>): entity is ScalarContent {
  const content = (entity as ScalarContent).content
  return (
    isReactProvider(entity) ||
    (content !== undefined &&
      (typeof content === 'string' || isTable(content) || isHTML(content) || isDescriptionList(content)))
  )
}

/**
 * Supported String content types
 *
 */
export type SupportedStringContent = 'yaml' | 'text/markdown' | 'text/html' | 'json' | 'shell' | 'text/plain'

export function isSupportedContentType(contentType: string) {
  return (
    contentType === 'yaml' ||
    contentType === 'text/markdown' ||
    contentType === 'text/html' ||
    contentType === 'text/plain' ||
    contentType === 'json' ||
    contentType === 'shell'
  )
}

/**
 * Trait that provides optional contentType for string content
 *
 */
interface WithOptionalContentType<ContentType = SupportedStringContent> {
  contentType?: ContentType
}

/**
 * Special case of `ScalarContent` for strings; string content may
 * optionally provide a `contentType`.
 *
 */
export type StringContent<ContentType = SupportedStringContent> = ScalarContent<string> &
  WithOptionalContentType<ContentType> &
  Partial<Editable>

export function isStringWithOptionalContentType<T extends MetadataBearing>(
  entity: Entity | Content<T> | MetadataBearing | ModeOrButton<T>
): entity is StringContent {
  const str = entity as StringContent
  return !!(
    str &&
    typeof str.content === 'string' &&
    (str.contentType === undefined || typeof str.contentType === 'string')
  )
}

/**
 * Compare 2 `StringContent`
 *
 */
export type StringDiffContent<ContentType = SupportedStringContent> = {
  content: {
    a: string
    b: string
  }
  contentType: ContentType
}

export function isStringDiffContent<T extends MetadataBearing>(
  entity: Entity | Content<T> | MetadataBearing | ModeOrButton<T>
): entity is StringDiffContent {
  const str = entity as StringDiffContent
  return !!(
    str &&
    str.content &&
    typeof str.content.a === 'string' &&
    typeof str.content.b === 'string' &&
    isSupportedContentType(str.contentType)
  )
}

/**
 * `Content` as `FunctionThatProducesContent<T>` is a function that
 * takes a `T` and produces either a resource or some { content,
 * contentType } wrapper.
 *
 */
export type FunctionThatProducesContent<T extends MetadataBearing = MetadataBearing> = (
  tab: Tab,
  entity: T,
  args: {
    argsForMode?: Arguments
    argvNoOptions: string[]
    parsedOptions: ParsedOptions
  }
) =>
  | ReactProvider
  | ScalarResource
  | ScalarContent
  | Promise<ScalarResource | ScalarContent | ReactProvider>
  | CommandStringContent

export interface FunctionContent<T extends MetadataBearing> {
  content: FunctionThatProducesContent<T>
}

export function isFunctionContent<T extends MetadataBearing = MetadataBearing>(
  content: Entity | Content<T> | MetadataBearing | ModeOrButton<T>
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
export type CommandStringContent = WithOptionalContentType<SupportedStringContent> & {
  contentFrom: string
}

export function isCommandStringContent<T extends MetadataBearing>(
  content: ScalarResource | Content<T> | MetadataBearing | ModeOrButton<T>
): content is CommandStringContent {
  const command = content as CommandStringContent
  return (
    !!command &&
    typeof command.contentFrom === 'string' &&
    (command.contentType === undefined || isSupportedContentType(command.contentType))
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
export type Content<T extends MetadataBearing = MetadataBearing> =
  | ScalarContent
  | StringContent
  | StringDiffContent
  | FunctionContent<T>
  | CommandStringContent
  | ReactProvider

export function hasContent<T extends MetadataBearing>(
  resource: ScalarResource | Content<T> | ModeOrButton<T>
): resource is Content<T> {
  return (
    Object.prototype.hasOwnProperty.call(resource, 'content') ||
    Object.prototype.hasOwnProperty.call(resource, 'react') ||
    isCommandStringContent(resource)
  )
}
