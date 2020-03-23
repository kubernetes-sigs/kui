/*
 * Copyright 2019 IBM Corporation
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

import { Tab, i18n, encodeComponent } from '@kui-shell/core'
import { IBMCloudWorkerPool, isIBMCloudWorkerPool } from '../models/worker-pool'

const strings = i18n('plugin-ibmcloud/ks')

/**
 * Display resource version as a badge
 *
 */
export default {
  when: isIBMCloudWorkerPool,
  mode: {
    mode: 'show-workers-for-pool',
    label: strings('Show Workers'),
    command: (tab: Tab, pool: IBMCloudWorkerPool) =>
      `ibmcloud ks worker ls --cluster ${encodeComponent(pool.spec.cluster)}`,
    kind: 'drilldown' as const
  }
}
