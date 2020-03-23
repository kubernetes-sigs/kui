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
import WithCluster from './with-cluster'
import { ClusterState } from './cluster'
import apiVersion from '../controller/apiVersion'

/**
 * WorkerState as represented by the `ibmcloud` CLI.
 *
 */
export type WorkerState = ClusterState

/**
 * WorkerStatus as represented by the `ibmcloud` CLI.
 *
 */
export const enum WorkerStatus {
  Ready
}

/**
 * WorkerIsolation as represented by the `ibmcloud` CLI.
 *
 */
export const enum WorkerIsolation {
  public
}

/**
 * This is the model passed back to us from the `ibmcloud` CLI.
 *
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBMCloudWorkerRaw {
  privateVlan: string
  publicVlan: string
  privateIP: string
  publicIP: string
  machineType: string
  location: string
  id: string
  state: WorkerState
  status: WorkerStatus
  statusDate: string
  statusDetails: string
  errorMessage: string
  errorMessageDate: string
  isolation: WorkerIsolation
  kubeVersion: string
  targetVersion: string
  reasonForDelete: string
  versionEOS: string
  masterVersionEOS: string
  trustedStatus: WorkerStatus
  poolid: string
  poolName: string
  pendingOperation: string
}

/**
 * A Kui resource model
 *
 */
export type IBMCloudWorker = ResourceWithMetadata<IBMCloudWorkerRaw> &
  WithSummary &
  WithCluster<IBMCloudWorkerRaw> &
  WithRawData<IBMCloudWorkerRaw> &
  WithVersion<IBMCloudWorkerRaw> & {
    apiVersion
    kind: 'Worker'
    isSimulacrum: true
  }

/**
 * Is the given resource an instance of a Kui ibmcloud worker?
 *
 */
export function isIBMCloudWorker(resource: ResourceWithMetadata): resource is IBMCloudWorker {
  const worker = resource as IBMCloudWorker
  return worker.apiVersion === apiVersion && worker.kind === 'Worker'
}

export function hasAvailableUpdates(worker: IBMCloudWorkerRaw) {
  return worker.kubeVersion !== worker.targetVersion
}

export function isIBMCloudWorkerWithAvailableUpdates(resource: ResourceWithMetadata): resource is IBMCloudWorker {
  return isIBMCloudWorker(resource) && hasAvailableUpdates(resource.content)
}

export default IBMCloudWorkerRaw
