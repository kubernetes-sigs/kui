/*
 * Copyright 2020 The Kubernetes Authors
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

import prettyPrintDuration from 'pretty-ms'
import { REPL, Table } from '@kui-shell/core'

import toMap from '../../table-to-map'
import toDescriptionList from './convert'
import { KubeResource } from '../../../../model/resource'

export function none() {
  return '<none>'
}

export function age({ metadata }: KubeResource, now: string | Date = new Date()) {
  return prettyPrintDuration(
    (typeof now === 'string' ? new Date(now) : now).getTime() - new Date(metadata.creationTimestamp).getTime()
  )
}

export default async function GenericSummary(resource: KubeResource, repl: REPL) {
  // a command that will fetch a single-row table
  const { withKubeconfigFrom } = await import('../../../../../controller/kubectl/options')
  const cmd = withKubeconfigFrom(
    resource.originatingCommand,
    `kubectl get ${resource.kind} ${resource.metadata.name} -n ${resource.metadata.namespace} -o wide`
  )

  return toDescriptionList(toMap(await repl.qexec<Table>(cmd)))
}
