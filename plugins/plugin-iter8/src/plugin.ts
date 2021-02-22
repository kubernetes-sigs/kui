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

import { Registrar } from '@kui-shell/core'
import { printiter8about } from './modes/about'
import { getConfig } from './modes/config'

// Registers a custom command
export default async (registrar: Registrar) => {
  registrar.listen(
    '/iter8/create/experiment',
    () => ({
      kind: 'Command',
      metadata: { name: 'Experiment Creation' },
      modes: []
    }),
    { isExperimental: true }
  )

  registrar.listen(
    '/iter8/metrics',
    () => ({
      kind: 'Command',
      metadata: { name: 'Metric Command', namespace: 'Use: kubectl get configmaps -n iter8' },
      modes: []
    }),
    { isExperimental: true }
  )

  registrar.listen('/iter8/about', () => printiter8about, { isExperimental: true })

  registrar.listen('/iter8/config/verify', getConfig, { isExperimental: true })
}
