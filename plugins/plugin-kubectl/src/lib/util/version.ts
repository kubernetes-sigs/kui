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

import { Arguments } from '@kui-shell/core'

import { getCommandFromArgs } from './util'
import { withKubeconfigFrom, KubeOptions } from '../../controller/kubectl/options'

/**
 * A major and minor version pair
 *
 */
export interface KubernetesVersion {
  major: number
  minor: number
}

/**
 * @return the { major, minor } of the Kubernetes server associated
 * with the context specified by the given command line `args`. If the
 * command line does not specify a context or kubeconfig, the default
 * association, of `kubectl` to a cluster, will be observed.
 *
 */
export default function kubeServerVersion(args: Arguments<KubeOptions>): Promise<KubernetesVersion> {
  return args.REPL.qexec(withKubeconfigFrom(args, `${getCommandFromArgs(args)} version -o json`))
    .then(_ => (typeof _ === 'string' ? JSON.parse(_) : _))
    .then(({ serverVersion }) => ({
      major: parseInt(serverVersion.major, 10),
      minor: parseInt(serverVersion.minor, 10)
    }))
}
