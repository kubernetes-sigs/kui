/*
 * Copyright 2021 The Kubernetes Authors
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

import { join } from 'path'
import { REPL, flatten } from '@kui-shell/core'
import { VFS } from '@kui-shell/plugin-bash-like/fs'
import { getCurrentDefaultNamespace } from '@kui-shell/plugin-kubectl'
import { isInternalNamespace } from '@kui-shell/plugin-kubectl/heuristics'

import Pods from './workloads/Pods'
import Generic from './workloads/Generic'
import Deployments from './workloads/Deployments'

/**
 * Create semantic mounts for a given Kubernetes context
 *
 */
function initVFSForNamespace(contextName: string, ns: string, contextPath: string): VFS[] {
  return [
    new Pods(contextPath, contextName, ns),
    new Deployments(contextPath, contextName, ns),
    ...['replicasets'].map(kind => new Generic(contextPath, contextName, ns, kind))
  ]
}

async function getAllNamespaces(repl: REPL, contextName: string): Promise<{ internal: string[]; user: string[] }> {
  try {
    return (await repl.qexec<string>(`kubectl get ns --context ${contextName} -o name`))
      .split(/\n/)
      .map(_ => _.replace(/^namespace\//, ''))
      .reduce(
        (P, ns) => {
          if (isInternalNamespace(ns)) {
            P.internal.push(ns)
          } else {
            P.user.push(ns)
          }
          return P
        },
        { user: [], internal: [] }
      )
  } catch (err) {
    return {
      user: [await getCurrentDefaultNamespace({ REPL: repl, parsedOptions: { context: contextName } })],
      internal: []
    }
  }
}

/**
 * Create one mount per Kubernetes context
 *
 */
export default async function createNamespaceMounts(
  repl: REPL,
  contextName: string,
  contextPath: string
): Promise<VFS[]> {
  const { user, internal } = await getAllNamespaces(repl, contextName)
  return flatten([
    ...user.map(ns => initVFSForNamespace(contextName, ns, ns === contextName ? contextPath : join(contextPath, ns))),
    ...internal.map(ns => initVFSForNamespace(contextName, ns, join(contextPath, '.internal', ns)))
  ])
}
