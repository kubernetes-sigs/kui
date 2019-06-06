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

import { qexec as $$ } from '@kui-shell/core/core/repl'
import { ITab } from '@kui-shell/core/webapp/cli'
import drilldown from '@kui-shell/core/webapp/picture-in-picture'
import { formatMultiListResult } from '@kui-shell/core/webapp/views/table'
import { ISidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { ICustomSpec } from '@kui-shell/core/webapp/views/sidecar'
import { Table } from '@kui-shell/core/webapp/models/table'

import { IResource, IKubeResource } from '../../model/resource'

import { ModeRegistration } from '@kui-shell/plugin-k8s/lib/view/modes/registrar'

const debug = Debug('k8s/view/modes/last-applied')

/**
 * Add a Pods mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const lastAppliedMode: ModeRegistration = {
  when: hasLastApplied,
  mode: (command: string, resource: IResource) => {
    debug('lastApplied', resource)
    try {
      return {
        mode: 'last applied',
        leaveBottomStripeAlone: true,
        direct: {
          plugin: 'k8s',
          module: 'lib/view/modes/last-applied',
          operation: 'renderAndViewLastApplied',
          parameters: { command, resource }
        }
      }
    } catch (err) {
      debug('error rendering pods button')
      console.error(err)
    }
  }
}

/**
 * Extract the last-applied-configuration annotation
 *
 */
function getLastAppliedRaw (resource: IKubeResource): string {
  // kube stores the last applied configuration (if any) in a raw json string
  return resource.metadata.annotations &&
    resource.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration']
}

/**
 * @return whether the given resource has a last applied configuration annotation
 *
 */
function hasLastApplied (resource: IKubeResource): boolean {
  return getLastAppliedRaw(resource) !== undefined
}

interface IParameters {
  command: string
  resource: IResource
}

export const renderAndViewLastApplied = async (tab: ITab, parameters: IParameters) => {
  const { command, resource } = parameters
  debug('renderAndViewLastApplied', command, resource)

  return toCustomSpec(getLastAppliedRaw(resource.resource))
}

function toCustomSpec (raw: string): ICustomSpec {
  // oof, it comes in as a JSON string, but we want a YAML string
  const resource: IKubeResource = JSON.parse(raw) // we will extract some parameters from this
  const content = safeDump(resource) // this is what we want to show up in the UI

  return {
    type: 'custom',
    isEntity: true,
    name: resource.metadata.name,
    packageName: resource.metadata.namespace,
    namespace: resource.metadata.namespace,
    contentType: 'yaml',
    content
  }
}
