/*
 * Copyright 2023 The Kubernetes Authors
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

// this file defines the external API

export {
  KubeResource,
  isKubeResource,
  isCrudableKubeResource,
  KubeResourceWithSummary,
  WithSummary,
  WithRawData,
  hasRawData,
  KubeResourceWithInvolvedObject,
  InvolvedObject,
  hasInvolvedObject,
  hasLabels,
  hasAnnotations,
  lastAppliedAnnotationKey,
  hasManagedFields,
  KubeResourceWithManagedFields,
  KubeStatus,
  KubeStatusAny,
  KubeStatusCondition,
  Pod,
  PodStatus,
  PodLikeSpec,
  isPod,
  Deployment,
  isDeployment,
  KubeItems,
  isKubeItems,
  isKubeItemsOfKind,
  KubePartial,
  PodList,
  isPodList,
  isPVCVolume,
  KubeContext,
  CustomResourceDefinition,
  isCustomResourceDefinition,
  ConfigMap,
  isConfigMap,
  Secret,
  isSecret,
  isSummarizableKubeResource,
  isKubeResourceWithItsOwnSummary,
  KubeResourceWithOwnerReferences,
  hasSingleOwnerReference,
  ReplicaSet,
  isReplicaSet,
  Job,
  isJob,
  Selector,
  Event,
  isEvent,
  Namespace,
  isNamespace,
  isNamespaced,
  AddressType,
  Node,
  isNode,
  Resource,
  hasResourceVersion,
  sameResourceVersion,
  isClusterScoped,
  isMetaTable,
  MetaTable,
  KubeContainerStatus,
  PVC,
  isPVC,
  isBoundPVC,
  Status,
  isStatus
} from './resource'

export { default as apiVersion } from './apiVersion'
export { default as TrafficLight, toTrafficLight } from './traffic-light'
export { default as KubeOptions, CustomFormat, EntityFormat, OutputFormat, TableFormat } from './options'
