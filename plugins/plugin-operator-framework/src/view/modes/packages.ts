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
import { Table } from '@kui-shell/core/webapp/models/table'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { ModeRegistration } from '@kui-shell/core/webapp/views/registrar/modes'
import { outerCSSForKey, cssForKey } from '@kui-shell/core/webapp/util/ascii-to-table'

import { Resource, KubeResource } from '@kui-shell/plugin-k8s'

const debug = Debug('plugin/operator-framework/view/modes/packages')

interface PackageBearerStatus {
  packages: string
}

/**
 * e.g. OperatorSource
 *
 */
export type PackageBearer = KubeResource<PackageBearerStatus>

function isPackageBearer(
  resource: KubeResource<any> // eslint-disable-line @typescript-eslint/no-explicit-any
): resource is PackageBearer {
  const bearer = resource as PackageBearer
  return (
    bearer !== undefined &&
    bearer.status !== undefined &&
    bearer.status.packages !== undefined &&
    typeof bearer.status.packages === 'string'
  )
}

/**
 * Show status.packages as a Table
 *
 */
export const packagesMode: ModeRegistration<KubeResource> = {
  when: isPackageBearer,
  mode: (command: string, resource: Resource): SidecarMode => {
    try {
      return {
        mode: 'Packages',
        leaveBottomStripeAlone: true,
        direct: {
          plugin: 'operator-framework/dist/index',
          operation: 'renderAndViewPackages',
          parameters: { command, resource }
        }
      }
    } catch (err) {
      debug('error rendering description button')
      console.error(err)
    }
  }
}

interface Parameters {
  command: string
  resource: Resource<PackageBearer>
}

function toTable(resource: PackageBearer): Table {
  return {
    title: 'Packages',
    header: {
      name: 'NAME',
      outerCSS: outerCSSForKey.NAME,
      css: cssForKey.NAME
    },
    body: resource.status.packages.split(/,/).map(name => ({
      name,
      outerCSS: outerCSSForKey.NAME,
      css: cssForKey.NAME
    }))
  }
}

export const renderAndView = (tab: Tab, parameters: Parameters): Table => {
  const { command, resource } = parameters
  debug('renderAndView', command, resource)

  return toTable(resource.resource)
}
