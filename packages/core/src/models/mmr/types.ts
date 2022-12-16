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

/* eslint-disable no-use-before-define */

import { ReactElement } from 'react'

import { Tab } from '../../webapp/tab'
import { Content } from './content-types'
import { MetadataBearing } from '../entity'
import { EvaluatorArgs as Arguments, ParsedOptions } from '../command'
import { ToolbarText } from '../../webapp/views/toolbar-text'
// import { SelectionController } from '../../webapp/bottom-stripe'

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
export interface View<Resource extends MetadataBearing> {
  /**
   * Each `Mode` is a different way to view the resource
   */
  modes: Mode<Resource>[]

  /**
   * Each view `Button` allows the user to interact with the content
   * of a Mode
   */
  buttons?: Button<Resource>[]

  /**
   * An optional selection of the default mode
   *
   */
  defaultMode?: string

  /** Arguments to pass through to the default mode? */
  argsForMode?: Arguments

  /** Optional equality function */
  comparator?(R1: MultiModalResponse, R2: MultiModalResponse): boolean
}

export type ModeOrButton<T = MetadataBearing> = Mode<T> | Button<T>

/**
 * A `Mode` is a `Label` plus some `Content` and `ModeTraits`
 *
 */
export type Mode<T = MetadataBearing> = Label & ModeTraits & VisibilityTraits & Content<T>

/**
 * Optional traits of a mode, e.g. a designation as the
 * `defaultMode` to display
 *
 */
export interface ModeTraits {
  /** should this mode be given preference as the default selected mode? */
  defaultMode?: boolean

  /** order in view; lower will be rendered further to the "left" for
   * LTR; default order registration order */
  order?: number

  /** registration tie-breaker: if more than one plugin offers the
   * same mode, the one with the highest numeric priority wins */
  priority?: number

  /** Optional toolbar text for a mode */
  toolbarText?: ToolbarText
}

/**
 * A `Button` is a `Label` plus a `command` and an optional request
 * that the user confirm before the command is executed
 *
 */
export type DrilldownButton<T = MetadataBearing> = Label &
  ModeTraits &
  Partial<IconTrait> &
  VisibilityTraits & {
    command:
      | string
      | Promise<string>
      | ((
          tab: Tab,
          resource: T,
          args: { argvNoOptions: string[]; parsedOptions: ParsedOptions }
        ) => string | Promise<string>)
    confirm?: boolean
    kind: 'drilldown'

    /** Execute the command in place of the current block? Default: execute in a new block */
    inPlace?: boolean

    /** Drilldown to related resource? */
    showRelatedResource?: boolean
  }

export type ViewButton<T = MetadataBearing> = Label &
  ModeTraits &
  Partial<IconTrait> &
  VisibilityTraits & {
    kind: 'view'
    command: (tab: Tab, resource: T, args: { argvNoOptions: string[]; parsedOptions: ParsedOptions }) => void
  }

export function isViewButton<T = MetadataBearing>(button: Button<T>): button is ViewButton<T> {
  return button.kind === 'view'
}

export type Button<T = MetadataBearing> = DrilldownButton<T> | ViewButton<T>

export function isButton<T extends MetadataBearing = MetadataBearing>(
  mode: Button<T> | Content<T> | Mode<T>
): mode is Button<T> {
  const button = mode as Button
  return button !== undefined && (button.kind === 'drilldown' || button.kind === 'view') && button.command !== undefined
}

/**
 * Both `Modes` and `Buttons` have Labels
 *
 */
export interface Label {
  mode: string
  label?: string

  balloon?: string
  balloonLength?: string

  fontawesome?: string
  labelBelow?: string
}

/**
 * `Button` can have visibility traits
 *
 */
export interface VisibilityTraits {
  visibleWhen?: string
  selected?: boolean
  // selectionController?: SelectionController
}

/**
 * `Button` can have an icon
 *
 */
export interface IconTrait {
  icon: ReactElement
}

export default MultiModalResponse
