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

import { KResponse, Registrar } from '@kui-shell/core'

import { doGet, usage, Options } from './get'
import { synonyms } from '../../models/synonyms'

export default (registrar: Registrar) => {
  synonyms('activations').forEach(syn => {
    registrar.listen<KResponse, Options>(
      `/wsk/${syn}/trace`,
      async args => Object.assign({}, await doGet('trace', args), { defaultMode: 'logs' }),
      usage(syn)
    )
  })
}
