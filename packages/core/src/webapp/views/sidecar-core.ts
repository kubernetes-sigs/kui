/*
 * Copyright 2017-19 IBM Corporation
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

import { Tab } from '../tab'
import { Badge } from './badge'
import { ToolbarText } from './toolbar-text'

import Formattable from './formattable'
import Presentation from './presentation'

import { SidecarMode } from '../bottom-stripe'
import { MetadataBearing } from '../../models/entity'

export type CustomContent =
  | string
  | Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  | HTMLElement
  | Promise<HTMLElement>

export interface CustomSpec<Content = void> extends /* EntitySpec, */ MetadataBearing<CustomContent> {
  /** noZoom: set to true for custom content to control the zoom event handler */
  type: 'custom'
  noZoom?: boolean

  isREPL?: boolean
  presentation?: Presentation
  renderAs?: string
  subtext?: Formattable
  toolbarText?: ToolbarText
  content: CustomContent
  badges?: Badge[]
  resource?: MetadataBearing<Content>
  createdOnString?: string

  prettyType?: string
  displayOptions?: string[]
  controlHeaders?: boolean | string[]
  sidecarHeader?: boolean
  modes?: SidecarMode[]
  uuid?: string
}

/**
 * Return the sidecar model
 *
 */
export interface Sidecar extends HTMLElement {
  entity: MetadataBearing | CustomSpec
  uuid?: string
}

export const getSidecar = (tab: Tab): Sidecar => {
  return tab.querySelector('sidecar') as Sidecar
}
