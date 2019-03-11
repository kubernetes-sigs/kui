/*
 * Copyright 2018 IBM Corporation
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

interface IKubeStatusCondition {
  lastProbeTime?: string
  lastTransitionTime: string
  status: string
  type: string
}

interface IKubeContainerStatus {
  name: string
  restartCount: number
  ready: boolean
  state: any
}

export interface IKubeStatus {
  message: string
  startTime?: string
  phase?: string
  podIP?: string
  qosClass?: string
  replicas?: number
  readyReplicas?: number
  availableReplicas?: number
  unavailableReplicas?: number
  updatedReplicas?: number
  containerStatuses?: Array<IKubeContainerStatus>
  conditions?: Array<IKubeStatusCondition>
}
export class DefaultKubeStatus implements IKubeStatus {
  message = undefined
  constructor () {
    // empty
  }
}

interface IOwnerReferences {
  kind: string
  name: string
}

export interface IKubeMetadata {
  kind: string
  name: string
  namespace?: string
  labels?: { [key: string]: string },
  annotations?: object
  creationTimestamp?: string
  generation?: string
  ownerReferences?: Array<IOwnerReferences>
}
export class DefaultKubeMetadata implements IKubeMetadata {
  kind = undefined
  name = undefined
}

export interface IKubeResource {
  apiVersion: string
  kind: string
  metadata?: IKubeMetadata
  status?: IKubeStatus
  spec?: any
}

export interface IResource {
  filepathForDrilldown?: string
  kind?: string
  name?: string
  yaml: IKubeResource
}

export default IResource
