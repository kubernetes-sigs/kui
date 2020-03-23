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

import get from './controller/helm/get'
import raw from './controller/helm/raw'
import list from './controller/helm/list'
import repo from './controller/helm/repo'
import search from './controller/helm/search'
import status from './controller/helm/status'
import install from './controller/helm/install'
import history from './controller/helm/history'
import catchall from './controller/helm/catchall'

export default async (registrar: Registrar) => {
  get(registrar)
  raw(registrar)
  list(registrar)
  repo(registrar)
  search(registrar)
  status(registrar)
  install(registrar)
  history(registrar)
  catchall(registrar)
}
