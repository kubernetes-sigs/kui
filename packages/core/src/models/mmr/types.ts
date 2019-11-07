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
import { Content } from './content-types'
import { MetadataBearing } from '../entity'
import { SidecarMode } from '../../webapp/bottom-stripe'

/**
 * A `MultiModalResponse` has all the fields of a class of `Resource`
 * plus a way to `View` those resources.
 *
 */
export type MultiModalResponse<Resource = MetadataBearing> = Resource & View<Resource>

/**
 * A `View` over a given `Resource` consists of a set of `Mode`, an
 * optional set of view-oriented `Button`, and an optional set of
 * resource-oriented `Button`.
 *
 * View-oriented buttons might e.g. refresh the content of the mode
 * view, whereas resource-oriented buttons might e.g. offer to delete
 * the resource, or to drill down to a completely different way of
 * viewing that resource (e.g. show me the logs or events associated
 * with the resource).
 *
 * Whether an associated way of viewing a resource is a `Mode` of the
 * resource, or a drilldown from the resource is a design choice that
 * is left up to the plugin. Logs, for example, might themselves me a
 * multi-modal view.
 *
 */
interface View<Resource extends MetadataBearing> {
  /**
   * Each `Mode` is a different way to view the resource
   */
  modes: Mode<Resource>[]

  /**
   * Each view `Button` allows the user to interact with the content
   * of a Mode
   */
  buttons?: Button[]
}

/**
 * A `Mode` is a `Label` plus some `Content` and `ModeTraits`
 *
 */
export type Mode<T = MetadataBearing> = Label & Content<T> & ModeTraits

/**
 * Optional traits of a mode, e.g. a designation as the
 * `defaultMode` to display
 *
 */
export interface ModeTraits {
  /** should this mode be given preference as the default selected mode? */
  defaultMode?: boolean

  /** sort order; default is as given */
  order?: number
}

/**
 * A `Button` is a `Label` plus a `command` and an optional request
 * that the user confirm before the command is executed
 *
 */
export type Button<T = MetadataBearing> = Label & {
  command: string | ((tab: Tab, resource: T) => string)
  confirm?: boolean
  kind: 'view' | 'drilldown'
}

export type DrilldownButton = Button & {
  kind: 'drilldown'
}

export function isButton<T extends MetadataBearing>(mode: Button<T> | Content<T> | SidecarMode): mode is Button<T> {
  return (mode as Button).command !== undefined
}

/**
 * Both `Modes` and `Buttons` have Labels
 *
 */
export interface Label {
  mode: string
  label?: string
}
