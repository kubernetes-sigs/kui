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

import { Commands, Models } from '@kui-shell/core'

export interface KubeStatusCondition {
  lastProbeTime?: string
  lastUpdateTime: string
  lastTransitionTime: string
  status: string | boolean
  reason?: string
  message: string
  type?: string
  phase?: string
}

interface KubeContainerStatus {
  name: string
  containerID: string
  restartCount: number
  ready: boolean
  state: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface KubeLoadBalancer {
  ingress: string
}

export interface KubeStatus {
  message?: string
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
  loadBalancer?: KubeLoadBalancer
  containerStatuses?: KubeContainerStatus[]
  conditions?: KubeStatusCondition[]
}
export class DefaultKubeStatus implements KubeStatus {
  public message = undefined
}

interface OwnerReferences {
  kind: string
  name: string
}

export interface KubeMetadata {
  name: string
  namespace?: string
  labels?: { [key: string]: string }
  annotations?: object
  creationTimestamp?: string
  generation?: string
  ownerReferences?: OwnerReferences[]
}
export class DefaultKubeMetadata implements KubeMetadata {
  public kind = undefined

  public name = undefined
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

export interface KubeResource<Status = KubeStatus> extends Models.ResourceWithMetadata {
  apiVersion: string
  kind: string
  metadata?: KubeMetadata
  status?: Status
  spec?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  data?: object
}
export function isKubeResource(entity: Commands.Response): entity is KubeResource {
  const kube = entity as KubeResource
  return kube.apiVersion !== undefined && kube.kind !== undefined
}

/** Role */
interface Role extends KubeResource {
  rules: RoleRule[]
}
export function isRole(resource: KubeResource): resource is Role {
  const role = resource as Role
  return role.rules !== undefined
}

/** RoleBinding */
interface RoleBinding extends KubeResource {
  roleRef: RoleRef
  subjects: { kind: string; name: string }[]
}
export function isRoleBinding(resource: KubeResource): resource is RoleBinding {
  const rb = resource as RoleBinding
  return rb.roleRef !== undefined && rb.subjects !== undefined
}

/** ServiceAccount */
interface ServiceAccount extends KubeResource {
  secrets: { name: string }[]
}
export function isServiceAccount(resource: KubeResource): resource is ServiceAccount {
  const sa = resource as ServiceAccount
  return sa.secrets !== undefined
}

export interface CRDResource extends KubeResource {
  spec: {
    names: {
      kind: string
      shortnames: string[]
    }
  }
}

export interface Pod extends KubeResource {
  spec: {
    containers: {
      args: string[]
      command: string[]
      env: { name: string; value: string }[]
      image: string
      imagePullPolicy: string
      name: string
      resource: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
      terminationMessagePath: string
      terminationMessagePolicy: string
      volumneMounts: { mountPath: string; name: string }[]
      workingDir: string
    }[]
  }
}

export interface Resource<T = KubeResource> {
  filepathForDrilldown?: string
  kind?: string
  name?: string
  resource: T
}

export default Resource
