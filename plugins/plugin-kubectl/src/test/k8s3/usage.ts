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

const commonModes = ['Introduction']
const kubectlModes = commonModes.concat(['Basic  (Beginner)'])
const kubectlGetModes = commonModes.concat(['get pods'])

describe('kubectl dash h', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const help = doHelp.bind(this)

  help('k', ['kubectl'], kubectlModes)

  // help on kubectl
  // it('should refresh', () => Common.refresh(this))
  help('kubectl', ['kubectl'], kubectlModes, 'kubectl controls the Kubernetes cluster manager')

  // help on kubectl
  // it('should refresh', () => Common.refresh(this))
  help('k help', ['kubectl'], kubectlModes, 'kubectl controls the Kubernetes cluster manager')

  // help on kubectl with intentionally bogus verb that we expect to be a breadcrumb
  // it('should refresh', () => Common.refresh(this))
  help('k help fjdisoa', ['kubectl', 'fjdisoa'], kubectlModes)

  // help on help
  // it('should refresh', () => Common.refresh(this))
  help('k help -h', ['kubectl', 'help'], commonModes)

  // help on get
  // it('should refresh', () => Common.refresh(this))
  help('k help get', ['kubectl', 'get'], kubectlGetModes)

  // help on help! (not help on get!)
  // it('should refresh', () => Common.refresh(this))
  help('k help get -h', ['kubectl', 'help'], commonModes)

  // help on get
  // it('should refresh', () => Common.refresh(this))
  help('k get -h', ['kubectl', 'get'], kubectlGetModes)

  // help on get
  // it('should refresh', () => Common.refresh(this))
  help('kubectl get -h', ['kubectl', 'get'], kubectlGetModes)

  // help on oc
  // it('should refresh', () => Common.refresh(this))
  help('oc', ['oc'], commonModes)

  // oc -h
  // it('should refresh', () => Common.refresh(this))
  help('oc -h', ['oc'], commonModes.concat(['Basic']))

  // help on odo
  // it('should refresh', () => Common.refresh(this))
  // help('odo', ['odo'], commonModes)

  // odo -h
  // it('should refresh', () => Common.refresh(this))
  // help('odo -h', ['odo'], commonModes.concat(['Flags', 'Basic']))
})
