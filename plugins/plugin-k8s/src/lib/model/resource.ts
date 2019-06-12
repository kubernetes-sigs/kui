/*
 * Copyright 2018-19 IBM Corporation
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

export interface IKubeStatusCondition {
  lastProbeTime?: string
  lastUpdateTime: string
  lastTransitionTime: string
  status: string | boolean
  reason?: string
  message: string
  type: string
}

interface IKubeContainerStatus {
  name: string
  containerID: string
  restartCount: number
  ready: boolean
  state: any
}

export interface IKubeLoadBalancer {
  ingress: string
}

export interface IKubeStatus {
  message: string
  state?: string
  startTime?: string
  completionTime?: string
  phase?: string
  podIP?: string
  podName?: string // e.g. tekton PipelineRun or TaskRun
  qosClass?: string
  replicas?: number
  readyReplicas?: number
  availableReplicas?: number
  unavailableReplicas?: number
  updatedReplicas?: number
  loadBalancer?: IKubeLoadBalancer
  containerStatuses?: IKubeContainerStatus[]
  conditions?: IKubeStatusCondition[]
}
export class DefaultKubeStatus implements IKubeStatus {
  message = undefined
}

interface IOwnerReferences {
  kind: string
  name: string
}

export interface IKubeMetadata {
  name: string
  namespace?: string
  labels?: { [key: string]: string }
  annotations?: object
  creationTimestamp?: string
  generation?: string
  ownerReferences?: IOwnerReferences[]
}
export class DefaultKubeMetadata implements IKubeMetadata {
  kind = undefined
  name = undefined
}

interface RoleRule {
  apiGroups: string[]
  resources: string[]
  verbs: string[]
}

interface RoleRef {
  apiGroup: string
  kind: string
  name: string
}

export interface IKubeResource {
  apiVersion: string
  kind: string
  metadata?: IKubeMetadata
  status?: IKubeStatus
  spec?: any
  data?: object
}

/** Role */
interface IRole extends IKubeResource {
  rules: RoleRule[]
}
export function isRole (resource: IKubeResource): resource is IRole {
  const role = resource as IRole
  return role.rules !== undefined
}

/** RoleBinding */
interface IRoleBinding extends IKubeResource {
  roleRef: RoleRef
  subjects: { kind: string; name: string }[]
}
export function isRoleBinding (resource: IKubeResource): resource is IRoleBinding {
  const rb = resource as IRoleBinding
  return rb.roleRef !== undefined && rb.subjects !== undefined
}

/** ServiceAccount */
interface IServiceAccount extends IKubeResource {
  secrets: { name: string }[]
}
export function isServiceAccount (resource: IKubeResource): resource is IServiceAccount {
  const sa = resource as IServiceAccount
  return sa.secrets !== undefined
}

export interface ICRDResource extends IKubeResource {
  spec: {
    names: {
      kind: string
      shortnames: string[]
    }
  }
}

export interface IPod extends IKubeResource {
  spec: {
    containers: {
      args: string[]
      command: string[]
      env: { name: string; value: string }[]
      image: string
      imagePullPolicy: string
      name: string
      resource: Record<string, any>
      terminationMessagePath: string
      terminationMessagePolicy: string
      volumneMounts: { mountPath: string; name: string }[]
      workingDir: string
    }[]
  }
}

export interface IResource {
  filepathForDrilldown?: string
  kind?: string
  name?: string
  resource: IKubeResource
}

export default IResource
