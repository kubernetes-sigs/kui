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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'
import { createNS, allocateNS, deleteNS, waitForTerminalText } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/kubectl-logs-two-containers.yaml'))
const inputEncoded = inputBuffer.toString('base64')

const inputBuffer2 = readFileSync(join(ROOT, 'data/k8s/kubectl-exec.yaml'))
const inputEncoded2 = inputBuffer2.toString('base64')

const sleepTime = 3

const commands = []

// not testing against oc until this bug (in oc) is fixed:
// https://github.com/openshift/oc/issues/365
/* if (process.env.NEEDS_OC) {
  commands.push('oc')
} */

/** sleep for N seconds */
function sleep(N: number) {
  return new Promise(resolve => setTimeout(resolve, N * 1000))
}

interface PodDesc {
  input: string
  podName: string
  containers: string[]
}

commands.forEach(command => {
  describe(`${command} Logs multiple pods via selector ${
    process.env.MOCHA_RUN_TARGET || ''
  }`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const waitForLogText = waitForTerminalText.bind(this)
    let res: ReplExpect.AppAndCount

    const ns: string = createNS()
    allocateNS(this, ns, command)

    // needed to force the dom renderer for webpack/browser-based tests; see ExecIntoPod
    Common.setDebugMode.bind(this)()

    const allContainers = 'All Containers'

    const pods: PodDesc[] = [
      { input: inputEncoded, podName: 'kui-two-containers', containers: ['nginx', 'vim'] },
      { input: inputEncoded2, podName: 'vim', containers: ['alpine'] }
    ]

    const fqn1 = `${pods[0].podName}:${pods[0].containers[0]}`
    const fqn2 = `${pods[0].podName}:${pods[0].containers[1]}`
    const containerName1 = pods[0].containers[0]
    const containerName2 = pods[0].containers[1]

    // this is the name we expect to represent all of the pods, when
    // queried by the label we will add in `addLabel()` below
    const allPods = pods.map(_ => _.podName).join(', ')

    const createPodWithoutWaiting = ({ input, podName }: PodDesc) => {
      it(`should create sample pod from URL`, async () => {
        try {
          res = await CLI.command(`echo ${input} | base64 --decode | ${command} create -f - -n ${ns}`, this.app)
          await ReplExpect.okWithPtyOutput(podName)(res)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const waitForPod = ({ podName }: PodDesc, waitIndex: number) => {
      it(`should wait for the pod to come up`, async () => {
        try {
          res = await CLI.command(`${command} get pod ${podName} -n ${ns} -w`, this.app)
          await this.app.client
            .$(Selectors.CURRENT_GRID_ONLINE_FOR_SPLIT(waitIndex + 2, podName))
            .then(_ => _.waitForExist())
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const addLabel = ({ podName }: PodDesc) => {
      it(`should add a label to pod ${podName}`, async () => {
        try {
          res = await CLI.command(`${command} label pod ${podName} -n ${ns} foo=bar`, this.app)
          await ReplExpect.okWithPtyOutput('labeled')(res)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const getLogsViaLabel = (containers: string) => {
      it(`should show the Logs tab via k logs -lfoo=bar`, async () => {
        try {
          res = await CLI.command(`${command} logs -lfoo=bar -n ${ns} ${containers}`, this.app)
            .then(ReplExpect.justOK)
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(allPods))
            .then(SidecarExpect.mode('logs'))
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const testLogsContent = (show: string[], notShow?: string[]) => {
      if (show) {
        show.forEach(showInLog => {
          it(`should show ${showInLog} in log output`, async () => {
            try {
              await sleep(sleepTime)
              await waitForLogText(res, (text: string) => text.indexOf(showInLog) !== -1)
            } catch (err) {
              return Common.oops(this, true)(err)
            }
          })
        })
      }

      if (notShow) {
        notShow.forEach(notShowInLog => {
          it(`should not show ${notShowInLog} in log output`, async () => {
            try {
              await sleep(sleepTime)
              await waitForLogText(res, (text: string) => text.indexOf(notShowInLog) === -1)
            } catch (err) {
              return Common.oops(this, true)(err)
            }
          })
        })
      }
    }

    const switchContainer = (container: string, showInLog: string[], notShowInLog: string[]) => {
      it(`should switch to container ${container}`, async () => {
        try {
          await this.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res.count, 'container-list')).then(async _ => {
            await _.waitForDisplayed()
            await _.click()
          })
          await this.app.client
            .$(`${Selectors.SIDECAR(res.count)} .bx--overflow-menu-options button[data-mode="${container}"]`)
            .then(async _ => {
              await _.waitForDisplayed()
              await _.click()
            })
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })

      testLogsContent(showInLog, notShowInLog)
    }

    /* Here comes the test */

    // create and label the pods
    pods.forEach((pod, idx) => {
      createPodWithoutWaiting(pod)
      waitForPod(pod, idx)
      addLabel(pod)
    })

    // use k get -lfoo=bar to show the Logs tab, all containers across all pods
    getLogsViaLabel('--all-containers')

    // expect the log messages for all containers across all pods
    // note how pod 0 uses the container names as the log messages
    // whereas pod 1 uses "hi"
    testLogsContent([containerName1, containerName2, 'hi'])

    // testing various combination here
    switchContainer(fqn1, [containerName1], [containerName2, 'hi'])
    switchContainer(fqn2, [containerName2], [containerName1, 'hi'])

    // note: due to the --tail flag, we don't expect to see
    // containerName1 in the logs -- it probably has flown off the top
    // of the xtermjs scrollback
    switchContainer(allContainers, [/* containerName1, */ containerName2, 'hi'], [])

    // use k get -lfoo=bar to show the Logs tab, the first container of the first pod
    getLogsViaLabel(`-c ${containerName1}`)
    testLogsContent([containerName1])

    // use k get -lfoo=bar to show the Logs tab, the second container of the first pod
    getLogsViaLabel(`-c ${containerName2}`)
    testLogsContent([containerName2])

    deleteNS(this, ns, command)
  })
})
