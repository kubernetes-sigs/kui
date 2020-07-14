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

import { ResourceWithMetadata } from '@kui-shell/core'
import { WithSummary } from '@kui-shell/plugin-kubectl'

import apiVersion from '../controller/apiVersion'

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBMCloudInstalledRepositoryRaw {
  Name: string
  URL: string
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBMCloudInstalledRepositoriesRaw {
  PluginRepos: IBMCloudInstalledRepositoryRaw[]
}

export type IBMCloudRepository = ResourceWithMetadata &
  WithSummary & {
    apiVersion
    kind: 'Repository'
    isSimulacrum: true
    raw: IBMCloudInstalledRepositoryRaw
  }

/**
 * Is the given resource an instance of a Kui ibmcloud plugin repository?
 *
 */
export function isIBMCloudRepository(resource: ResourceWithMetadata): resource is IBMCloudRepository {
  const plugin = resource as IBMCloudRepository
  return plugin.apiVersion === apiVersion && plugin.kind === 'Repository'
}

export default IBMCloudRepository
