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
import type { KResponse, Registrar } from '@kui-shell/core'

import type { Options as BindOptions } from './controller/bind'
import type { Options as ValidateOptions } from './controller/validate'

export default async (registrar: Registrar) => {
  if (!isEnabled()) {
    return
  }

  ;['cos', 'cloud-object-storage'].forEach(cos => {
    registrar.listen<KResponse, ValidateOptions>(`/ibmcloud/${cos}/validate`, args =>
      import('./controller/validate').then(_ => _.default(args) as any)
    )
  })
  ;['cos', 'cloud-object-storage'].forEach(cos => {
    registrar.listen(`/ibmcloud/${cos}/service-instances`, args =>
      import('./controller/find').then(_ => _.default(args))
    )
  })
  ;['cos', 'cloud-object-storage'].forEach(cos => {
    registrar.listen<KResponse, BindOptions>(`/ibmcloud/${cos}/bind`, args =>
      import('./controller/bind').then(_ => _.default(args) as unknown)
    )
  })
  ;['cos', 'cloud-object-storage'].forEach(cos => {
    registrar.listen(`/ibmcloud/${cos}/endpoint`, args => import('./controller/endpoint').then(_ => _.default(args)))
  })
  ;['cos', 'cloud-object-storage'].forEach(cos => {
    registrar.listen(`/ibmcloud/${cos}/config/region/default`, args =>
      import('./controller/defaultRegion').then(_ => _.default(args))
    )
  })
}
