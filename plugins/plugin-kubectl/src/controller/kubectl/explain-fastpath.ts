/*
 * Copyright 2021 IBM Corporation
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

/**
 * This is a performance optimization. See
 * https://github.com/IBM/kui/issues/6700
 *
 */

import { Explained } from './explain'

const Pod = {
  kind: 'Pod',
  version: 'v1',
  isClusterScoped: false
}

const Namespace = {
  kind: 'Namespace',
  version: 'v1',
  isClusterScoped: true
}

const Node = {
  kind: 'Node',
  version: 'v1',
  isClusterScoped: true
}

const PersistentVolume = {
  kind: 'PersistentVolume',
  version: 'v1',
  isClusterScoped: true
}

const ControllerRevision = {
  kind: 'ControllerRevision',
  version: 'apps/v1',
  isClusterScoped: false
}

const DaemonSet = {
  kind: 'DaemonSet',
  version: 'apps/v1',
  isClusterScoped: false
}

const ReplicaSet = {
  kind: 'ReplicaSet',
  version: 'apps/v1',
  isClusterScoped: false
}

const StatefulSet = {
  kind: 'StatefulSet',
  version: 'apps/v1',
  isClusterScoped: false
}

const Deployment = {
  kind: 'Deployment',
  version: 'apps/v1',
  isClusterScoped: false
}

const Service = {
  kind: 'Service',
  version: 'v1',
  isClusterScoped: false
}

const Event = {
  kind: 'Event',
  version: 'v1',
  isClusterScoped: false
}

const fastPathCases: Record<string, Explained> = {
  po: Pod,
  pod: Pod,
  pods: Pod,
  Pod: Pod,
  Pods: Pod,

  ns: Namespace,
  namespace: Namespace,
  namespaces: Namespace,
  Namespace: Namespace,
  Namespaces: Namespace,

  svc: Service,
  service: Service,
  services: Service,
  Service: Service,
  Services: Service,

  controllerrevision: ControllerRevision,
  controllerrevisions: ControllerRevision,
  ControllerRevision: ControllerRevision,
  'ControllerRevision.v1.apps': ControllerRevision,
  ControllerRevisions: ControllerRevision,

  ds: DaemonSet,
  daemonset: DaemonSet,
  daemonsets: DaemonSet,
  DaemonSet: DaemonSet,
  'DaemonSet.v1.apps': DaemonSet,
  DaemonSets: DaemonSet,

  rs: ReplicaSet,
  replicaset: ReplicaSet,
  replicasets: ReplicaSet,
  ReplicaSet: ReplicaSet,
  'ReplicaSet.v1.apps': ReplicaSet,
  ReplicaSets: ReplicaSet,

  sts: StatefulSet,
  statefulset: StatefulSet,
  statefulsets: StatefulSet,
  StatefulSet: StatefulSet,
  'StatefulSet.v1.apps': StatefulSet,
  StatefulSets: StatefulSet,

  deploy: Deployment,
  deployment: Deployment,
  deployments: Deployment,
  Deployment: Deployment,
  'Deployment.v1.apps': Deployment,
  Deployments: Deployment,

  no: Node,
  node: Node,
  nodes: Node,
  Node: Node,
  Nodes: Node,

  ev: Event,
  event: Event,
  events: Event,
  Event: Event,
  Events: Event,

  pv: PersistentVolume,
  persistentvolume: PersistentVolume,
  persistentvolumes: PersistentVolume,
  Persistentvolume: PersistentVolume,
  Persistentvolumes: PersistentVolume
}

export default fastPathCases
