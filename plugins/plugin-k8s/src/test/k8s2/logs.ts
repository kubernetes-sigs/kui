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

import * as assert from 'assert'
import { Application } from 'spectron'

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/kubectl-exec.yaml'))
const inputEncoded = inputBuffer.toString('base64')

/** The number of seconds to sleep while we wait for more log entries
 * to accumulate. Making this value larger will provide more test
 * stability, but also increase test time. */
const sleepTime = 8

function getTextContent(app: Application, selector) {
  return app.client.getText(selector)
}

/** sleep for N seconds */
function sleep(N: number) {
  return new Promise(resolve => setTimeout(resolve, N * 1000))
}

describe(`kubectl logs ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

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
      return cli
        .do(cmdline, this.app)
        .then(cli.expectOKWithString(podName))
        .catch(common.oops(this, true))
    })
  }

  const waitForPod = (podName: string) => {
    it(`should wait for the pod ${podName} to come up`, () => {
      return cli
        .do(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(podName) }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(common.oops(this, true))
    })
  }

  const showLogs = (podName: string, containerName: string) => {
    it(`should show logs for pod ${podName} container ${containerName}`, () => {
      return cli
        .do(`kubectl logs ${podName} ${containerName} -n ${ns}`, this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(containerName))
        .catch(common.oops(this, true))
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
