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
import { KubeResource, KubeItems } from '@kui-shell/plugin-kubectl'

export default class GetKubeInfo {
  private rawOutput = ''

  public async getNamespace(args: Pick<Arguments, 'REPL'>): Promise<{ id: string; text: string }[]> {
    return (await args.REPL.qexec<KubeItems<KubeResource>>(`kubectl get ns -o json`)).items
      .map(ns => ns.metadata.name)
      .map((name, i) => ({
        id: `ns-${i}`,
        text: name
      }))
  }

  public async getSvc(ns: string, args: Pick<Arguments, 'REPL'>): Promise<{ id: string; text: string }[]> {
    return (await args.REPL.qexec<KubeItems<KubeResource>>(`kubectl get svc -n ${ns} -o yaml`)).items
      .map(svc => svc.metadata.name)
      .map((name, i) => ({
        id: `svc-${i}`,
        text: name
      }))
  }

  public async getDeployment(
    ns: string,
    svc: string,
    args: Pick<Arguments, 'REPL'>
  ): Promise<{ id: string; text: string }[]> {
    return (await args.REPL.qexec<KubeItems<KubeResource>>(`kubectl get deployments -n ${ns} -o yaml`)).items
      .map(d => d.metadata.name)
      .map((name, i) => ({
        id: `d-${i}`,
        text: name
      }))
  }
}
