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

import BaseOptions from '../options'

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IBMCloudCodeEngineOptions {
  'code-engine-project': string // CodeEngine project to use [default: select first in list]
}

type IBMCloudOptions = BaseOptions &
  IBMCloudCodeEngineOptions & {
    ibm: boolean
    sso: boolean // request ibmcloud provide a URL to obtain a one-time password to log in
    'cos-instance': string // choose a cos instance if there's more than one cos instances in your ibmcloud account
    'resource-group': string // ibmcloud resource group to use
    region: string // ibmcloud region to use
  }

export default IBMCloudOptions
