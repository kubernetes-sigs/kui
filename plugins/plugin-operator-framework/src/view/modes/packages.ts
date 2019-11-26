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

import { Tab } from '@kui-shell/core/api/ui-lite'
import { Table } from '@kui-shell/core/api/table-models'
import { ModeRegistration } from '@kui-shell/core/api/registrars'
import { outerCSSForKey, cssForKey } from '@kui-shell/core/webapp/util/ascii-to-table'
import { KubeResource } from '@kui-shell/plugin-k8s'

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

function content(tab: Tab, resource: PackageBearer): Table {
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

/**
 * Show status.packages as a Table
 *
 */
const packagesMode: ModeRegistration<KubeResource> = {
  when: isPackageBearer,
  mode: {
    mode: 'Packages',
    content
  }
}

export default packagesMode
