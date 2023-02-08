/*
 * Copyright 2019 The Kubernetes Authors
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

import { KubeResource, hasInvolvedObject } from '@kui-shell/plugin-kubectl-core'

/**
 * Separate the app and generated parts of a resource name
 *
 */
export default function extract(resource: KubeResource) {
  const metadata = resource && resource.metadata

  const appFromNameAndInstance =
    metadata &&
    metadata.labels &&
    metadata.labels['app.kubernetes.io/name'] &&
    metadata.labels['app.kubernetes.io/instance'] &&
    `${metadata.labels['app.kubernetes.io/instance']}-${metadata.labels['app.kubernetes.io/name']}`

  const app: string | false =
    appFromNameAndInstance ||
    (metadata && metadata.labels && metadata.labels.app) ||
    (hasInvolvedObject(resource) && resource.involvedObject.name)

  if (app) {
    const version = metadata && metadata.labels && metadata.labels.version
    const pattern = `(^${app})[-.](${version}-)?([0-9a-zA-Z]+-.+|[0-9a-z]{16})`
    const match = resource.metadata.name.match(new RegExp(pattern))
    const name = match && match[1]
    const nameHash = match && match[3]

    if (name && nameHash) {
      return { app, name, nameHash, version }
    }
  }
  // intentional fall through

  const templateHash = metadata && metadata.labels && metadata.labels['pod-template-hash']
  if (templateHash) {
    const version = metadata && metadata.labels && metadata.labels.version
    const pattern = `(.*)-(${templateHash}.*$)`
    const match = resource.metadata.name.match(new RegExp(pattern))
    const name = match && match[1]
    const nameHash = match && match[2]

    if (name && nameHash) {
      return { name, nameHash, version }
    }
  }
  // intentional fall through

  // TODO: maybe utilize resource.metadata.generateName?
  return {}
}
