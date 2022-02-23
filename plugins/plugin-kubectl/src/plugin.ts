/*
 * Copyright 2019 The Kubernetes Authors
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

import apiResources from './controller/kubectl/api-resources'
import contexts from './controller/kubectl/contexts'
import create from './controller/kubectl/create'
import deployment from './controller/kubectl/deployment'
import describe from './controller/kubectl/describe'
import diff from './controller/kubectl/diff'
import edit from './controller/kubectl/edit'
import explain from './controller/kubectl/explain'
import kdelete from './controller/kubectl/delete'
import kget from './controller/kubectl/get'
import kgetNs from './controller/kubectl/get-namespaces'
import kustomize from './controller/kubectl/kustomize'
import raw from './controller/kubectl/raw'
import run from './controller/kubectl/run'
import top from './controller/kubectl/top'
import config from './controller/kubectl/config'
import applySubcommands from './controller/kubectl/apply-subcommands'
import dashboard from './controller/kubectl/dashboard'

import fetchFile from './controller/fetch-file'
import catchall from './controller/kubectl/catchall'

export default async (registrar: Registrar) => {
  apiResources(registrar)
  contexts(registrar)
  create(registrar)
  describe(registrar)
  diff(registrar)
  explain(registrar)
  edit(registrar)
  kdelete(registrar)
  kget(registrar)
  kgetNs(registrar)
  deployment(registrar)
  kustomize(registrar)
  raw(registrar)
  run(registrar)
  top(registrar)
  config(registrar)
  applySubcommands(registrar)
  dashboard(registrar)

  fetchFile(registrar)
  catchall(registrar)
}
