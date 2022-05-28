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

import { isEnabled } from '@kui-shell/plugin-s3'
import { CommandHandler, KResponse, ParsedOptions, Registrar, UsageModel } from '@kui-shell/core'

function On(this: Registrar, command: string, handler: CommandHandler<KResponse, ParsedOptions>, usage?: UsageModel) {
  ;['cos', 'cloud-object-storage'].forEach(cos => {
    this.listen(`/ibmcloud/${cos}/${command}`, handler, usage ? { usage } : undefined)
  })
}

export default async (registrar: Registrar) => {
  if (!isEnabled()) {
    return
  }

  const on = On.bind(registrar)

  const [validateConfig, findServiceInstances, findAndBindCredentials, setEndpoint, defaultRegion] = await Promise.all([
    import('./controller/validate').then(_ => _.default),
    import('./controller/find').then(_ => _.default),
    import('./controller/bind').then(_ => _.default),
    import('./controller/endpoint').then(_ => _.default),
    import('./controller/defaultRegion').then(_ => _.default)
  ])

  on('service-instances', findServiceInstances)
  on('bind', findAndBindCredentials)
  on('endpoint', setEndpoint)
  on('validate', validateConfig)
  on('config/region/default', defaultRegion)
}
