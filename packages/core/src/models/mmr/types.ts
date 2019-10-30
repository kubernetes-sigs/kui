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

import { Content } from './content-types'
import { MetadataBearing } from '../entity'

/**
 * A `MultiModalResponse` has all the fields of a class of `Resource`
 * (whose default type is `MetadataBearing`), plus `modes` and
 * `buttons`.
 *
 */
export type MultiModalResponse<Resource = MetadataBearing> = Resource & View<Resource>

interface View<Resource extends MetadataBearing> {
  modes: Mode<Resource>[]
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
  defaultMode?: boolean
}

/**
 * A `Button` is a `Label` plus a `command` and an optional request
 * that the user confirm before the command is executed
 *
 */
export type Button = Label & {
  command: string
  confirm?: boolean
}

/**
 * Both `Modes` and `Buttons` have Labels
 *
 */
export interface Label {
  mode: string
  label?: string
}
