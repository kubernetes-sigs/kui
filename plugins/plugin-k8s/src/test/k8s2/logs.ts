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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/kubectl-exec.yaml'))
const inputEncoded = inputBuffer.toString('base64')

describe(`kubectl logs ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()

  const inputs = [
    {
      podName: 'vim',
      containerName: 'alpine',
      cmdline: `echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`
    },
    {
      podName: 'nginx',
      containerName: 'nginx',
      cmdline: `kubectl create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`
    }
  ]

  const createPod = (podName: string, cmdline: string) => {
    it(`should create ${podName} pod`, () => {
      return CLI.command(cmdline, this.app)
        .then(ReplExpect.okWithString(podName))
        .catch(Common.oops(this, true))
    })
  }

  const waitForPod = (podName: string) => {
    it(`should wait for the pod ${podName} to come up`, () => {
      return CLI.command(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
        .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(podName) }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })
  }

  const showLogs = (podName: string, containerName: string) => {
    it(`should show logs for pod ${podName} container ${containerName}`, () => {
      return CLI.command(`kubectl logs ${podName} ${containerName} -n ${ns}`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(containerName))
        .catch(Common.oops(this, true))
    })
  }

  allocateNS(this, ns)
  inputs.forEach(_ => {
    createPod(_.podName, _.cmdline)
    waitForPod(_.podName)
    showLogs(_.podName, _.containerName)
  })
  inputs.forEach(_ => {
    showLogs(_.podName, _.containerName)
  })
  deleteNS(this, ns)
})
