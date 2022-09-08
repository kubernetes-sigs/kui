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

import { Common, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'
import {
  createNS,
  allocateNS,
  deleteNS,
  waitForTerminalText,
  deletePodByName
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { res, create, get, clickRetry, wait } from './helpers'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer1 = readFileSync(join(ROOT, 'data/k8s/kubectl-logs-two-containers.yaml'))
const inputEncoded1 = inputBuffer1.toString('base64')
const inputBuffer2 = readFileSync(join(ROOT, 'data/k8s/bunch/pod.yaml'))
const inputEncoded2 = inputBuffer2.toString('base64')

const sleepTime = 3

/** sleep for N seconds */
function sleep(N: number) {
  return new Promise(resolve => setTimeout(resolve, N * 1000))
}

const wdescribe = process.env.USE_WATCH_PANE ? describe : xdescribe

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  wdescribe(`${command} Logs tab ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    allocateNS(this, ns, command)

    // needed to force the dom renderer for webpack/browser-based tests; see ExecIntoPod
    Common.setDebugMode.bind(this)()

    const waitForLogText = waitForTerminalText.bind(this)
    const createPodWithoutWaiting = create.bind(this, ns, command)
    const waitForPod = wait.bind(this, ns, command)
    const getPodViaClick = get.bind(this, ns, command)
    const click = clickRetry.bind(this)

    const podName1 = 'kui-two-containers'
    const allContainers = 'All Containers'
    const containerName1 = 'nginx'
    const containerName2 = 'vim'
    const podName2 = 'nginx'

    const testLogsContent = (res: ReplExpect.AppAndCount, show: string[], notShow?: string[]) => {
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

    const doRetry = (showInLog: string[], toolbar: { text: string; type: string }) => {
      it('should hit retry', async () => {
        try {
          await click()
          await SidecarExpect.toolbarText({ text: toolbar.text, type: toolbar.type, exact: false })(res)
          testLogsContent(res, showInLog)
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })
    }

    const switchToLogsTab = (showInLog: string[], toolbar: { text: string; type: string }) => {
      it('should show logs tab', async () => {
        try {
          await Util.switchToTab('logs')(res).then(
            SidecarExpect.toolbarText({ type: toolbar.type, text: toolbar.text, exact: false })
          )

          testLogsContent(res, showInLog)
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })
    }

    const switchContainer = (
      container: string,
      showInLog: string[],
      notShowInLog: string[],
      toolbar: { text: string; type: string }
    ) => {
      it(`should switch to container ${container}`, async () => {
        try {
          await Util.clickSidecarModeButton(this, res, 'container-list')
          await Util.clickSidecarButtonCustomized(
            this,
            res,
            `.bx--overflow-menu-options button[data-mode="${container}"]`
          )
          await SidecarExpect.toolbarText({ type: toolbar.type, text: toolbar.text, exact: false })(res)
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })

      testLogsContent(res, showInLog, notShowInLog)
    }

    const toggleStreaming = (changeToLive: boolean) => {
      it('should toggle streaming', async () => {
        try {
          await sleep(sleepTime)
          await Util.clickSidecarModeButton(this, res, 'toggle-streaming')

          if (changeToLive) {
            await SidecarExpect.toolbarText({ type: 'info', text: 'Logs are live', exact: false })(res)
          } else {
            await SidecarExpect.toolbarText({ type: 'warning', text: 'Log streaming is paused', exact: false })(res)
          }
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })
    }

    /* Here comes the test */

    createPodWithoutWaiting(inputEncoded2, podName2)
    waitForPod(podName2, 2)
    getPodViaClick(podName2)
    switchToLogsTab(['No log data'], { text: 'Logs are live', type: 'info' })

    createPodWithoutWaiting(inputEncoded1, podName1)
    waitForPod(podName1, 3)
    getPodViaClick(podName1)
    switchToLogsTab([containerName1, containerName2], { text: 'Logs are live', type: 'info' })

    /** testing various combination here */
    switchContainer(containerName1, [containerName1], [containerName2], { text: containerName1, type: 'info' })

    switchContainer(containerName2, [containerName2], [containerName1], { text: containerName2, type: 'info' })

    switchContainer(allContainers, [containerName1, containerName2], [], {
      text: allContainers.toLowerCase(),
      type: 'info'
    })

    switchContainer(containerName2, [containerName2], [containerName1], { text: containerName2, type: 'info' })

    switchContainer(allContainers, [containerName1, containerName2], [], {
      text: allContainers.toLowerCase(),
      type: 'info'
    })

    switchContainer(containerName2, [containerName2], [containerName1], { text: containerName2, type: 'info' })

    toggleStreaming(false) // hit pause button

    toggleStreaming(true) // hit resume button

    toggleStreaming(false) // hit pause button

    // switch to container, streaming should be live
    switchContainer(containerName1, [containerName1], [containerName2], {
      text: `Logs are live streaming. Showing container ${containerName1}`,
      type: 'info'
    })

    switchContainer(allContainers, [containerName1, containerName2], [], {
      text: allContainers.toLowerCase(),
      type: 'info'
    })

    deletePodByName(this, podName1, ns, command)

    it('should see log streaming stopped', async () => {
      try {
        await sleep(sleepTime)
        await SidecarExpect.toolbarText({ type: 'warning', text: 'Log streaming stopped', exact: false })(res)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    const showError = 'Log streaming stopped abnormally.'

    doRetry(['not found'], {
      text: showError,
      type: 'error'
    })

    switchContainer(containerName1, ['not found'], [], {
      text: showError,
      type: 'error'
    })
    switchContainer(containerName2, ['not found'], [], {
      text: showError,
      type: 'error'
    })
    switchContainer(allContainers, ['not found'], [], {
      text: showError,
      type: 'error'
    })

    doRetry(['not found'], {
      text: showError,
      type: 'error'
    })

    /*  this part isn't stable, and doesn't really test what we want, reliably: if the create is fast, then "without waiting' won't matter
  createPodWithoutWaiting(inputEncoded1, podName1) // recreate this pod
  getPodViaYaml(podName1) // NOTE: immediately open sidecar when pod is in creation

  switchToLogsTab(['not found'], {
    text: showError,
    type: 'error'
  })

  waitForPod(podName1, 4) // wait for pod ready

  doRetry([containerName1, containerName2], {
    text: 'Logs are live',
    type: 'info'
  })
  */

    deleteNS(this, ns, command)
  })
})
