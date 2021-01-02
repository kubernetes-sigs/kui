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

import { Arguments } from '@kui-shell/core'

import { Explained } from '../../kubectl/explain'
import { KubeOptions, getLabel, getNamespace, isForAllNamespaces } from '../../kubectl/options'

export type URLFormatter = (includeKind?: boolean, includeQueries?: boolean, name?: string) => string

export async function urlFormatterFor(
  args: Arguments<KubeOptions>,
  { kind, version, isClusterScoped }: Explained
): Promise<URLFormatter> {
  const namespace = await getNamespace(args)

  const kindOnPath = `/${encodeURIComponent(kind.toLowerCase() + (/s$/.test(kind) ? '' : 's'))}`

  // e.g. "apis/apps/v1" for deployments
  const apiOnPath = version === 'v1' ? 'api/v1' : `apis/${encodeURIComponent(version)}`

  // a bit complex: "kubectl get ns", versus "kubectl get ns foo"
  // the "which" is "foo" in the second case
  const namespaceOnPath = isForAllNamespaces(args.parsedOptions)
    ? ''
    : kind === 'Namespace'
    ? ''
    : isClusterScoped
    ? ''
    : `/namespaces/${encodeURIComponent(namespace)}`

  // we will accumulate queries
  const queries: string[] = []

  // labelSelector query
  const label = getLabel(args)
  if (label) {
    const push = (query: string) => queries.push(`labelSelector=${encodeURIComponent(query)}`)
    if (Array.isArray(label)) {
      label.forEach(push)
    } else {
      push(label)
    }
  }

  // limit query
  if (typeof args.parsedOptions.limit === 'number') {
    queries.push(`limit=${args.parsedOptions.limit}`)
  }

  // format a url
  return (includeKind = false, includeQueries = false, name?: string) =>
    `kubernetes:///${apiOnPath}${namespaceOnPath}${!includeKind ? '' : kindOnPath}${
      !name ? '' : `/${encodeURIComponent(name)}`
    }${!includeQueries || queries.length === 0 ? '' : '?' + queries.join('&')}`
}

export default URLFormatter
