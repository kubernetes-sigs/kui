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

import { Arguments } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'

import ServiceInstance from '../model/ServiceInstance'

export async function findInstances(args: Arguments): Promise<ServiceInstance[]> {
  const content = JSON.parse(
    await doExecWithStdoutViaPty(
      Object.assign({}, args, { command: 'ibmcloud resource service-instances --output json' })
    )
  ) as ServiceInstance[]
  return content.filter(_ => /:cloud-object-storage:/.test(_.crn))
}

export default async function findServiceInstances(args: Arguments) {
  return {
    body: (await findInstances(args)).map(_ => ({
      name: _.name,
      onclick: `ibmcloud resource service-instance ${_.name}`,
      attributes: [
        { key: 'Location', value: _.region_id },
        { key: 'State', value: _.state }
      ]
    }))
  }
}
