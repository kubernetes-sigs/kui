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

import { ClusterState } from './cluster'
import { WorkerIsolation } from './worker'
import WithCluster from './with-cluster'
import apiVersion from '../controller/apiVersion'

export const kind = 'Worker Pool'

/**
 * WorkerState as represented by the `ibmcloud` CLI.
 *
 */
export type WorkerPoolState = ClusterState

/**
 * This is the model passed back to us from the `ibmcloud` CLI.
 *
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBMCloudWorkerPoolRaw {
  name: string
  sizePerZone: number
  machineType: string
  isolation: WorkerIsolation
  labels: Record<string, string>
  id: string
  region: string
  state: WorkerPoolState
  reasonForDelete: string
  isBalanced: boolean
  autoscaleEnabled: boolean
  zones: [
    {
      privateVlan: number
      publicVlan: number
      id: string
      workerCount: number
    }
  ]
}

/**
 * A Kui resource model
 *
 */
export type IBMCloudWorkerPool = ResourceWithMetadata<IBMCloudWorkerPoolRaw> &
  WithSummary &
  WithCluster<IBMCloudWorkerPoolRaw> &
  WithRawData<IBMCloudWorkerPoolRaw> & {
    apiVersion
    kind
    isSimulacrum: true
  }

/**
 * Is the given resource an instance of a Kui ibmcloud worker?
 *
 */
export function isIBMCloudWorkerPool(resource: ResourceWithMetadata): resource is IBMCloudWorkerPool {
  const worker = resource as IBMCloudWorkerPool
  return worker.apiVersion === apiVersion && worker.kind === kind
}

export default IBMCloudWorkerPoolRaw
