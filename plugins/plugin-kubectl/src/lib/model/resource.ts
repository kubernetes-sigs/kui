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

import { ResourceWithMetadata } from '@kui-shell/core'

import kubeuiApiVersion from '../../controller/kubectl/apiVersion'

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

export interface WithRawData<Content = void> extends ResourceWithMetadata<Content> {
  data?: string // the raw data
}

export function hasRawData(resource: ResourceWithMetadata) {
  const withData = resource as WithRawData
  return typeof withData.data === 'string'
}

/**
 * The basic Kubernetes resource
 *
 */
export type KubeResource<Status = KubeStatus> = ResourceWithMetadata &
  WithRawData & {
    apiVersion: string
    kind: string
    metadata?: KubeMetadata
    status?: Status
    spec?: any // eslint-disable-line @typescript-eslint/no-explicit-any

    // TODO we should factor these out into a trait
    originatingCommand: string // the command that generated this raw data
    isSimulacrum?: boolean // is this a manufactured resource that does not exist on the api server?
    isKubeResource: true // this tag helps `isKubeResource()` to check if an `Entity` is KubeResource
  }

/** is the resource Namespaced? */
export function isNamespaced(resource: KubeResource) {
  return resource.metadata !== undefined && resource.metadata.namespace !== undefined
}

/** is the command response a Kubernetes resource? note: excluding any ones we simulate in kubeui */
export function isKubeResource(entity: ResourceWithMetadata): entity is KubeResource {
  const kube = entity as KubeResource
  return (
    kube.isKubeResource === true &&
    kube.apiVersion !== undefined &&
    kube.apiVersion !== kubeuiApiVersion &&
    kube.kind !== undefined
  )
}

/** is the command response a kube resource that can responds to "kubectl delete", etc.? */
export function isCrudableKubeResource(entity: ResourceWithMetadata): entity is KubeResource {
  return isKubeResource(entity) && !(entity as KubeResource).isSimulacrum
}

export interface WithSummary {
  summary: {
    content: string
    contentType?: 'yaml' | 'text/markdown'
  }
}

/**
 * `KubeResourceWithSummary` allows plugins to provide their own
 * Summary. Otherwise lib/views/modes/summary will try to fetch one
 * automatically.
 *
 */
export type KubeResourceWithSummary<Status = KubeStatus> = KubeResource<Status> & WithSummary

export function isKubeResourceWithItsOwnSummary(resource: KubeResource): resource is KubeResourceWithSummary {
  return resource !== undefined && (resource as KubeResourceWithSummary).summary !== undefined
}

/**
 * This allows us to exclude certain resource kinds from auto-summarization
 *
 */
export function isSummarizableKubeResource(resource: KubeResource): boolean {
  return (
    isKubeResource(resource) &&
    (isKubeResourceWithItsOwnSummary(resource) ||
      (resource.kind !== undefined && resource.kind !== 'List' && resource.kind !== 'CustomResourceDefinition'))
  )
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

/**
 * Kubernetes Pod resource type
 *
 */
export interface Pod extends KubeResource {
  apiVersion: 'v1'
  kind: 'Pod'
  spec: {
    nodeName: string
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

/**
 * @return whether the given resource is an instance of a Pod
 *
 */
export function isPod(resource: KubeResource): resource is Pod {
  return resource.apiVersion === 'v1' && resource.kind === 'Pod'
}

/**
 * Kubernetes Namespace resource type
 *
 */
export interface Namespace extends KubeResource {
  apiVersion: 'v1'
  kind: 'Namespace'
}

/**
 * @return whether the given resource is an instance of a Namespace
 *
 */
export function isNamespace(resource: KubeResource): resource is Namespace {
  return resource.apiVersion === 'v1' && resource.kind === 'Namespace'
}

/**
 * Kubernetes Job resource type
 *
 */
export interface Job extends KubeResource {
  apiVersion: 'batch/v1'
  kind: 'Job'
}

/**
 * @return whether the given resource is an instance of a Deploymemt
 *
 */
export function isJob(resource: KubeResource): resource is Job {
  return resource.apiVersion === 'batch/v1' && resource.kind === 'Job'
}

/**
 * Kubernetes Deployment resource type
 *
 */
export interface Deployment extends KubeResource {
  apiVersion: 'extensions/v1beta1'
  kind: 'Deployment'
}

/**
 * @return whether the given resource is an instance of a Deploymemt
 *
 */
export function isDeployment(resource: KubeResource): resource is Deployment {
  return resource.apiVersion === 'extensions/v1beta1' && resource.kind === 'Deployment'
}

/**
 * Trait that defines an involvedObject, e.g. for Events
 *
 */
export interface InvolvedObject {
  involvedObject: {
    apiVersion: string
    kind: string
    name: string
    namespace: string
    uid?: string
    fieldPath?: string
    resourceVersion?: string
  }
}
export type KubeResourceWithInvolvedObject = KubeResource & InvolvedObject

export function hasInvolvedObject(
  resource: KubeResource | KubeResourceWithInvolvedObject
): resource is KubeResourceWithInvolvedObject {
  const io = resource as KubeResourceWithInvolvedObject
  return (
    io.involvedObject !== undefined &&
    typeof io.involvedObject.apiVersion === 'string' &&
    typeof io.involvedObject.kind === 'string' &&
    typeof io.involvedObject.name === 'string'
  )
}

/**
 * Kubernetes Event resource type
 *
 */
export type Event = KubeResourceWithInvolvedObject & {
  apiVersion: 'v1'
  kind: 'Event'
  firstTimestamp: string
  lastTimestamp: string
  count: number
  reason: string
  type: 'Normal' | 'Warning' | 'Error'
}

/**
 * @return whether the given resource is an instance of an Event
 *
 */
export function isEvent(resource: KubeResource): resource is Event {
  return resource.apiVersion === 'v1' && resource.kind === 'Event'
}

/**
 * e.g. `kubectl get pods -o json` will return a kind: items
 *
 */
export interface KubeItems<Item extends KubeResource = KubeResource> extends KubeResource {
  apiVersion: 'v1'
  kind: 'List'
  items: Item[]
}

export function isKubeItems(resource: KubeResource): resource is KubeItems {
  return resource.apiVersion === 'v1' && resource.kind === 'List'
}

/** Scope */
type Scope = 'Namespaced' | 'Cluster'

/**
 * CustomResourceDefinition
 *
 */
export type CustomResourceDefinition = KubeResource & {
  apiVersion: 'apiextensions.k8s.io/v1' | 'apiextensions.k8s.io/v1beta1'
  kind: 'CustomResourceDefinition'
  spec: {
    scope: Scope
    group: string
    version: string
    names: {
      categories: Record<string, string>
      kind: string
      listKind: string
      plural: string
      singular: string
    }
  }
}

/**
 * @return whether the given resource is an instance of a CustomResourceDefinition
 *
 */
export function isCustomResourceDefinition(resource: KubeResource): resource is CustomResourceDefinition {
  return (
    (resource.apiVersion === 'apiextensions.k8s.io/v1' || resource.apiVersion === 'apiextensions.k8s.io/v1beta1') &&
    resource.kind === 'CustomResourceDefinition'
  )
}

/**
 * Kubernetes context
 *
 */
export interface KubeContext extends KubeResource {
  apiVersion: typeof kubeuiApiVersion
  kind: 'Context'
  spec: {
    user: string
    cluster: string
  }
}

export interface Resource<T = KubeResource> {
  filepathForDrilldown?: string
  kind?: string
  name?: string
  resource: T
}

export default KubeResource
