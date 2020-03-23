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

import { Registrar } from '@kui-shell/core'

import raw from './controller/raw'
import clusterGet from './controller/cluster/get'
import clusterList from './controller/cluster/list'
import workerGet from './controller/worker/get'
import workerList from './controller/worker/list'
import workerPoolGet from './controller/worker-pool/get'

export default async (registrar: Registrar) => {
  raw(registrar)
  clusterGet(registrar)
  clusterList(registrar)
  workerGet(registrar)
  workerList(registrar)
  workerPoolGet(registrar)

  // temporarily
  registrar.listen(
    '/kuiopen',
    ({ argvNoOptions }) => {
      window.open(argvNoOptions[1])
      return true
    },
    { inBrowserOk: true }
  )
}
