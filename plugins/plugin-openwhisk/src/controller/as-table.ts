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

import { encodeComponent, Tab, Table } from '@kui-shell/core'

import { fqn, fqnOfPath } from './fqn'
import { bg as trafficLightColor } from '../views/traffic-light'
import { current as currentNamespace } from '../models/namespace'
import { hasKind, hasVersion, hasStatus, hasAction, hasTrigger, OpenWhiskResource } from '../models/resource'

function maybeKind(resource: OpenWhiskResource, value = resource && resource.kind) {
  return resource && hasKind(resource) && { key: 'kind', value }
}

function maybeVersion(resource: OpenWhiskResource, value = resource && resource.version) {
  return resource && hasVersion(resource) && { key: 'version', value, css: 'hide-with-sidecar' }
}

function maybeAction(
  resource: OpenWhiskResource,
  value = resource && hasAction(resource) && fqnOfPath(resource.action)
) {
  return resource && hasAction(resource) && { key: 'action', value, css: 'hide-with-sidecar' }
}

function maybeTrigger(
  resource: OpenWhiskResource,
  value = resource && hasTrigger(resource) && fqnOfPath(resource.trigger)
) {
  return resource && hasTrigger(resource) && { key: 'trigger', value, css: 'hide-with-sidecar' }
}

function maybeStatus(
  resource: OpenWhiskResource,
  value = resource && hasStatus(resource) && resource.status.toString(),
  header = false
) {
  return (
    resource &&
    hasStatus(resource) && {
      key: 'status',
      value: value.charAt(0).toUpperCase() + value.slice(1),
      tag: !header && 'badge',
      css: !header && hasStatus(resource) && trafficLightColor(resource)
    }
  )
}

export default async function asTable<T extends OpenWhiskResource>(tab: Tab, resources: T[]): Promise<Table> {
  const pattern = new RegExp(`^/${await currentNamespace(tab)}/`)
  return {
    header: {
      name: 'name',
      attributes: [
        maybeKind(resources[0], 'kind'),
        maybeVersion(resources[0], 'version'),
        maybeStatus(resources[0], 'status', true),
        maybeAction(resources[0], 'action'),
        maybeTrigger(resources[0], 'trigger')
      ].filter(_ => _)
    },
    body: resources.map(resource =>
      Object.assign({}, resource, {
        name: fqn(resource).replace(pattern, ''),
        onclick: `wsk ${resource.kind.toLowerCase()} get ${encodeComponent(fqn(resource))}`,
        attributes: [
          maybeKind(resource),
          maybeVersion(resource),
          maybeStatus(resource),
          maybeAction(resource),
          maybeTrigger(resource)
        ].filter(_ => _)
      })
    )
  }
}
