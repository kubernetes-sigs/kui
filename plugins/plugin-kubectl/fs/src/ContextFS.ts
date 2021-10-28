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
import { KubeContext } from '@kui-shell/plugin-kubectl'

import createNamespaceMounts from './namespace-scoped'

/** Where should we situate this `KubeContext` in the directory structure? */
function pathFor(context: KubeContext) {
  const { name } = context.metadata
  const { user } = context.spec
  const { cluster } = context.spec

  const ibmDotDash = /cloud[.-]ibm[.-]com/

  const A = name.split(/\//)
  if (A.length === 3 && A[1] === cluster) {
    // probably namespace/cluster/user; openshift does this?
    const oscp = join('openshift', A[1], A[2])
    if (ibmDotDash.test(cluster) || ibmDotDash.test(user)) {
      return join('ibm', oscp)
    } else {
      return oscp
    }
  } else if (/codeengine\.cloud\.ibm\.com/.test(cluster)) {
    return join('ibm', 'codeengine', name)
  } else if (ibmDotDash.test(cluster) || ibmDotDash.test(user)) {
    return join('ibm', 'ks', name)
  } else if (/^(docker-desktop|microk8s|kind-kind)$/.test(name)) {
    return join('local', name)
  } else {
    return name
  }
}

/**
 * Create semantic mounts for a given Kubernetes context
 *
 */
async function initVFSForContext(repl: REPL, context: KubeContext): Promise<VFS[]> {
  const contextName = context.metadata.name
  const contextPath = pathFor(context)

  return flatten([await Promise.all([...(await createNamespaceMounts(repl, contextName, contextPath))])])
}

/**
 * Create one mount per Kubernetes context
 *
 */
export default async function createContextMounts(repl: REPL): Promise<VFS[]> {
  const { getAllContexts } = await import('@kui-shell/plugin-kubectl')
  const contexts = await getAllContexts({ REPL: repl })

  return flatten(await Promise.all(contexts.map(context => initVFSForContext(repl, context))))
}
