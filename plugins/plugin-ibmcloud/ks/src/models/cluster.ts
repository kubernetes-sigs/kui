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
import { WithRawData, WithSummary } from '@kui-shell/plugin-kubectl'

import WithVersion from './version'
import apiVersion from '../controller/apiVersion'

/**
 * ClusterState as represented by the `ibmcloud` CLI.
 *
 */
export const enum ClusterState {
  unsupported,
  normal,
  active
}

/**
 * This is the model passed back to us from the `ibmcloud` CLI.
 *
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBMCloudClusterRaw {
  location: string
  dataCenter: string
  multiAzCapable: boolean
  // vlans: null <-- not sure of type
  // worker_vlans: null <-- not sure of type
  workerZones: string[]
  id: string
  name: string
  region: string
  resourceGroup: string
  resourceGroupName: string
  serverURL: string
  state: string
  createdDate: string // 2018-10-28T02:00:36+0000
  modifiedDate: string // 2018-10-28T02:00:36+0000
  workerCount: number
  isPaid: boolean
  masterKubeVersion: string // 1.11.10_1561
  targetVersion: string // 1.14.9_1543
  ingressHostname: string
  ingressSecretName: string
  ownerEmail: string
  logOrg: string
  logOrgName: string
  logSpace: string
  logSpaceName: string
  apiUser: string
  monitoringURL: string
  // addons: null <-- not sure of type
  versionEOS: string
  disableAutoUpdate: boolean
  etcdPort: number
  masterStatus: string // e.g. Ready
  masterStatusModifiedDate: string // 2019-06-06T19:39:25+0000
  masterHealth: string // e.g. unsupported
  masterState: ClusterState // e.g. deployed
  keyProtectEnabled: boolean
  pullSecretApplied: boolean
  crn: string
  privateServiceEndpointEnabled: boolean
  privateServiceEndpointURL: string
  publicServiceEndpointEnabled: boolean
  publicServiceEndpointURL: string
  podSubnet: string
  serviceSubnet: string
  type: string // e.g. kubernetes
}

/**
 * A Kui resource model
 *
 */
export type IBMCloudCluster = ResourceWithMetadata &
  WithSummary &
  WithVersion &
  WithRawData & {
    apiVersion
    kind: 'Cluster'
    isSimulacrum: true
    raw: IBMCloudClusterRaw
  }

/**
 * Is the given resource an instance of a Kui ibmcloud cluster?
 *
 */
export function isIBMCloudCluster(resource: ResourceWithMetadata): resource is IBMCloudCluster {
  const cluster = resource as IBMCloudCluster
  return cluster.apiVersion === apiVersion && cluster.kind === 'Cluster'
}

export function hasAvailableUpdates(cluster: IBMCloudClusterRaw) {
  return cluster.masterKubeVersion !== cluster.targetVersion
}

export function isIBMCloudClusterWithAvailableUpdates(resource: ResourceWithMetadata): resource is IBMCloudCluster {
  return isIBMCloudCluster(resource) && hasAvailableUpdates(resource.raw)
}

export default IBMCloudClusterRaw
