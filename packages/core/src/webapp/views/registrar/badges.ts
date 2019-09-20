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

import * as Debug from 'debug'

import { Tab } from '@kui-shell/core/webapp/cli'
import { MetadataBearing } from '@kui-shell/core/models/entity'
import { addBadge, BadgeSpec, BadgeOptions } from '@kui-shell/core/webapp/views/sidecar'
import { SidecarModeFilter } from '@kui-shell/core/webapp/views/registrar/modes'

const debug = Debug('webapp/views/registrar/badges')

/**
 * Interpretation: if the resource passes the given "when" filter,
 * then add the given sidecar badge
 *
 */
export interface BadgeRegistration<Resource extends MetadataBearing> {
  when: SidecarModeFilter<Resource> // when this filter returns true...
  badge: BadgeSpec | ((resource: Resource) => BadgeSpec) // either a badge spec, or a function that produces one
}

/** registered badge handlers */
const registrar: BadgeRegistration<MetadataBearing>[] = []

/**
 * Register a new badge
 *
 */
export function registerSidecarBadge<Resource extends MetadataBearing>(registration: BadgeRegistration<Resource>) {
  registrar.push(registration)
}
export default registerSidecarBadge

/**
 * Add all registered badges that are relevant to the given resource
 *
 */
export function apply<Resource extends MetadataBearing>(
  tab: Tab,
  entity: { resource: Resource },
  badgeOptions: BadgeOptions
) {
  registrar
    .filter(({ when }) => {
      // filter out any irrelevant badges (for this resource)
      try {
        return when(entity.resource)
      } catch (err) {
        debug('warning: registered badge threw an exception during filter', err)
        return false
      }
    })
    .forEach(({ badge }) => {
      // now add the badge
      if (typeof badge === 'function') {
        addBadge(tab, badge(entity.resource), badgeOptions)
      } else {
        addBadge(tab, badge, badgeOptions)
      }
    })
}
