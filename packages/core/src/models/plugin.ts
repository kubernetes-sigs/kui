/*
 * Copyright 2018 IBM Corporation
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

import { CommandRegistrar } from './command'
import { PrescanUsage } from '../plugins/prescan'
import { MetadataBearing } from '../models/entity'
import { BadgeRegistration } from '../webapp/views/registrar/badges'
import { ModeRegistration } from '../webapp/views/registrar/modes'
import { SessionInitializer } from '../session/registrar'

export type KuiPlugin = void | Promise<void>

export type PluginRegistration = (commandTree: CommandRegistrar, options?: { usage: PrescanUsage }) => KuiPlugin

export interface PreloadRegistrar extends CommandRegistrar {
  /** sidecar modes */
  registerMode<Resource extends MetadataBearing>(registration: ModeRegistration<Resource>): void
  registerModes<Resource extends MetadataBearing>(...registrations: ModeRegistration<Resource>[]): void

  /** sidecar badges */
  registerBadge<Resource extends MetadataBearing>(registration: BadgeRegistration<Resource>): void
  registerBadges<Resource extends MetadataBearing>(...registrations: BadgeRegistration<Resource>[]): void

  /** session initializers */
  registerSessionInitializer(init: SessionInitializer): void
}

export type PreloadRegistration = (registrar: PreloadRegistrar) => Promise<void | void[]>

export type CapabilityRegistration = (registrar: PreloadRegistrar) => void | Promise<void>
