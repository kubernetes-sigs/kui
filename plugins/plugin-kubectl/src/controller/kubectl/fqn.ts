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

import { KubeResource } from '../../lib/model/resource'

/**
 * A way to uniquely identify a resource in a cluster
 *
 */
export interface ResourceRef {
  group?: string
  version?: string
  kind: string
  name: string
  namespace: string
}

/**
 * Extract the group and version from an `apiVersion` string
 *
 */
export function versionOf(apiVersion: string): { group: string; version: string } {
  const [group, version] = apiVersion.split('/')
  if (!version) {
    // e.g. 'v1' which has no group part; here, kubectl does not
    // accept queries of the form Pod.v1; so we just drop the
    // apiVersion part from the query.
    // Hypothesis: kind.version doesn't work
    return { group: '', version: '' }
  } else {
    // e.g. 'tekton.dev/v1alpha1' which is of the form 'group/version'
    // turn this into .version.group, so that a query can be made of
    // the form kind.version.group
    return { group, version }
  }
}

function versionString(apiVersion: string): string {
  const { group, version } = versionOf(apiVersion)
  return group.length > 0 ? `.${version}.${group}` : ''
}

export function fqn(apiVersion: string, kind: string, name: string, namespace: string) {
  return `${kind}${versionString(apiVersion)} ${namespace === '<none>' ? '' : `-n ${namespace}`} ${name}`
}

export function fqnOf(resource: KubeResource) {
  return fqn(resource.apiVersion, resource.kind, resource.metadata.name, resource.metadata.namespace)
}

export function fqnOfRef({ group, version, kind, name, namespace }: ResourceRef) {
  return `${kind}${group ? `.${version}.${group}` : ''} ${namespace === '<none>' ? '' : `-n ${namespace}`} ${name}`
}

export default fqn
