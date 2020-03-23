/*
 * Copyright 2018-19 IBM Corporation
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

import commandPrefix from './command-prefix'
import { fetchFileString } from '../lib/util/fetch-file'

/**
 * A server-side shim to allow browser-based clients to fetch `-f`
 * file content.
 *
 */
export default (registrar: Registrar) => {
  registrar.listen(
    `/${commandPrefix}/_fetchfile`,
    async ({ argvNoOptions, tab }) => {
      const uri = argvNoOptions[argvNoOptions.indexOf('_fetchfile') + 1]
      return fetchFileString(tab, uri)
    },
    { requiresLocal: true }
  )
}
