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

import pluginGet from './controller/get'
import pluginList from './controller/list'
import commandGet from './controller/command/get'
import commandList from './controller/command/list'
import repoGet from './controller/repo/get'
import repoList from './controller/repo/list'
import repoPlugins from './controller/repo/available'

export default async (registrar: Registrar) => {
  pluginGet(registrar)
  pluginList(registrar)
  commandGet(registrar)
  commandList(registrar)
  repoGet(registrar)
  repoList(registrar)
  repoPlugins(registrar)
}
