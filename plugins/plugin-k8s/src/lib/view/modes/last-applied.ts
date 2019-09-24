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
import { safeDump } from 'js-yaml'

import { i18n, Tab } from '@kui-shell/core'
import { CustomSpec } from '@kui-shell/core/webapp/views/sidecar'
import { ModeRegistration } from '@kui-shell/core/webapp/views/registrar/modes'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'

import { Resource, KubeResource } from '../../model/resource'

const strings = i18n('plugin-k8s')
const debug = Debug('k8s/view/modes/last-applied')

/**
 * Extract the last-applied-configuration annotation
 *
 */
function getLastAppliedRaw(resource: KubeResource): string {
  // kube stores the last applied configuration (if any) in a raw json string
  return (
    resource.metadata.annotations && resource.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration']
  )
}

/**
 * @return whether the given resource has a last applied configuration annotation
 *
 */
function hasLastApplied(resource: KubeResource): boolean {
  return getLastAppliedRaw(resource) !== undefined
}

/**
 * Add a Pods mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const lastAppliedMode: ModeRegistration<KubeResource> = {
  when: hasLastApplied,
  mode: (command: string, resource: Resource): SidecarMode => {
    debug('lastApplied', resource)
    try {
      return {
        mode: 'last applied',
        label: strings('lastApplied'),
        leaveBottomStripeAlone: true,
        direct: {
          plugin: 'k8s/dist/index',
          operation: 'renderAndViewLastApplied',
          parameters: { command, resource }
        }
      }
    } catch (err) {
      debug('error rendering last applied', err)
    }
  }
}

interface Parameters {
  command: string
  resource: Resource
}

/**
 * Respond to REPL
 *
 * @param lastRaw the last applied configuration, unparsed
 */
function toCustomSpec(lastRaw: string, fullResource: KubeResource): CustomSpec {
  // oof, it comes in as a JSON string, but we want a YAML string
  const resource: KubeResource = JSON.parse(lastRaw) // we will extract some parameters from this
  const content = safeDump(resource) // this is what we want to show up in the UI

  // add a startTime (after serializing the content, which is what
  // will be displayed in the editor body), so that the sidecar
  // renders with a toolbar text
  if (!resource.metadata.creationTimestamp) {
    resource.metadata.creationTimestamp = fullResource.metadata.creationTimestamp
  }

  return {
    type: 'custom',
    isEntity: true,
    name: resource.metadata.name,
    contentType: 'yaml',
    content,
    resource
  }
}

export const renderAndViewLastApplied = async (tab: Tab, parameters: Parameters) => {
  const { command, resource } = parameters
  debug('renderAndViewLastApplied', command, resource)

  return toCustomSpec(getLastAppliedRaw(resource.resource), resource.resource)
}
