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

import { Registrar } from '@kui-shell/core'

import bind, { bindGet } from './bind'

import * as Job from './controller/job'
import * as JobRun from './controller/jobrun'
import * as JobDef from './controller/jobdef'
import * as Secret from './controller/secret'
import * as ConfigMap from './controller/configmap'
import * as Application from './controller/application'

// special case to handle a Duration column
import KubectlGetJob from './controller/job/kubectl'
import { JobRunKind } from './controller/job/list'

// ibmcloud ce kubectl ... adds the kubeconfig for ce
import Kubectl from './controller/kubectl'

export default async (registrar: Registrar) => {
  const Bind = bind.bind(registrar)
  const BindGet = bindGet.bind(registrar)

  Bind(Application, 'app', 'application')
  Bind(Job, 'job')
  Bind(JobRun, 'jobrun')
  Bind(JobDef, 'jd', 'jobdef')
  Bind(ConfigMap, 'cm', 'configmap')
  Bind(Secret, 'secret')

  // special case to handle a Duration column
  BindGet(KubectlGetJob, JobRunKind)

  Kubectl(registrar)
}
