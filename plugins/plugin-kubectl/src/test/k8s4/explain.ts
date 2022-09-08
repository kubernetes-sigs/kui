/*
 * Copyright 2018 The Kubernetes Authors
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

import { Common } from '@kui-shell/test'
import { doHelp } from '../../../tests/lib/k8s/utils'

describe('kubectl explain', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const help = doHelp.bind(this)

  help('kubectl explain -h', ['kubectl', 'explain'], ['Introduction', 'Options'])

  help(
    'kubectl explain pod',
    ['API Resources', 'Pod'],
    ['Overview', 'apiVersion', 'kind', 'metadata', 'spec', 'status']
  )
  help(
    'kubectl explain PodSecurityPolicy',
    ['API Resources', 'extensions', 'Pod'],
    ['Overview', 'apiVersion', 'kind', 'metadata', 'spec']
  )
  help(
    'kubectl explain secrets',
    ['API Resources', 'Secret'],
    ['Overview', 'apiVersion', 'data', 'kind', 'metadata', 'stringData', 'type']
  )
  help(
    'kubectl explain deploy.metadata',
    ['API Resources', 'extensions', 'Deployment', 'metadata'],
    ['Overview', 'annotations', 'name']
  )
  help(
    'kubectl explain deploy.metadata.annotations',
    ['API Resources', 'extensions', 'Deployment', 'annotations'],
    ['Overview']
  )
})
