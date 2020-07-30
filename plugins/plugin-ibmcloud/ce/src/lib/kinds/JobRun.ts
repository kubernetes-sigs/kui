/*
 * Copyright 2020 IBM Corporation
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

import { KubeResource, PodLikeSpec } from '@kui-shell/plugin-kubectl'

export default interface JobRun extends KubeResource {
  apiVersion: 'codeengine.cloud.ibm.com/v1alpha1'
  kind: 'JobRun'
  spec: PodLikeSpec
}

export function isJobRun(resource: KubeResource): resource is JobRun {
  return resource.kind === 'JobRun' && /^codeengine\.cloud\.ibm\.com/.test(resource.apiVersion)
}
