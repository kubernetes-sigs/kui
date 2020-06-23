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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'
import { waitForTerminalText, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/kubectl-exec.yaml'))
const inputEncoded = inputBuffer.toString('base64')

const wdescribe = process.env.USE_WATCH_PANE ? describe : xdescribe

wdescribe(`kubectl logs getty via watch pane ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()

  const inputs = [
    {
      podName: 'vim',
      containerName: 'alpine',
      hasLogs: true,
      expectString: true,
      cmdline: `echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`
    },
    {
      podName: 'nginx',
      containerName: 'nginx',
      label: 'name=nginx',
      hasLogs: false,
      expectString: false,
      cmdline: `kubectl create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`
    }
  ]

  const createPodExpectingString = (podName: string, cmdline: string) => {
    it(`should create ${podName} pod expect string`, () => {
      return CLI.command(cmdline, this.app)
        .then(ReplExpect.okWithPtyOutput(podName))
        .catch(Common.oops(this, true))
    })
  }

  const createPodExpectingTable = (podName: string, cmdline: string) => {
    it(`should create ${podName} pod expect table`, () => {
      return CLI.command(cmdline, this.app)
        .then(ReplExpect.okWith(podName))
        .catch(Common.oops(this, true))
    })
  }

  const waitForPod = (podName: string, splitIndex: number) => {
    it(`should wait for the pod ${podName} to come up`, () => {
      return CLI.command(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
        .then(async () => {
          await this.app.client.waitForExist(Selectors.CURRENT_GRID_ONLINE_FOR_SPLIT(splitIndex, podName))
        })
        .catch(Common.oops(this, true))
    })
  }

  const waitForLogText = waitForTerminalText.bind(this)

  const showLogs = (podName: string, containerName: string, label: string, hasLogs: boolean) => {
    const checkLogs = async (res: ReplExpect.AppAndCount) => {
      await Promise.resolve(res).then(ReplExpect.justOK)
      if (hasLogs) {
        await waitForLogText('hi')
      }
    }

    it(`should show logs for pod ${podName} container ${containerName}`, () => {
      return CLI.command(`kubectl logs ${podName} ${containerName} -n ${ns}`, this.app)
        .then(checkLogs)
        .catch(Common.oops(this, true))
    })

    if (label) {
      it(`should show logs for label selector ${label}`, () => {
        return CLI.command(`kubectl logs -l${label} -n ${ns}`, this.app)
          .then(checkLogs)
          .catch(Common.oops(this, true))
      })
    }
  }

  const doRetry = (hasLogs: boolean) => {
    it('should click retry button', async () => {
      try {
        await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('retry-streaming'))
        await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('retry-streaming'))

        if (hasLogs) {
          await waitForLogText('hi')
        }
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  allocateNS(this, ns)

  // needed to force the dom renderer for webpack/browser-based tests; see ExecIntoPod
  Common.setDebugMode.bind(this)()

  inputs.forEach((_, idx) => {
    if (_.expectString) {
      createPodExpectingString(_.podName, _.cmdline)
    } else {
      createPodExpectingTable(_.podName, _.cmdline)
    }
    waitForPod(_.podName, idx + 2)
    showLogs(_.podName, _.containerName, _.label, _.hasLogs)
    doRetry(_.hasLogs)
  })
  inputs.forEach(_ => {
    showLogs(_.podName, _.containerName, _.label, _.hasLogs)
  })
  deleteNS(this, ns)
})
