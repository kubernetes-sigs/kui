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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'
import {
  createNS,
  allocateNS,
  deleteNS,
  waitForGreen,
  waitForRed,
  defaultModeForGet
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/kubectl-logs-two-containers.yaml'))
const inputEncoded = inputBuffer.toString('base64')

const sleepTime = 3

/** sleep for N seconds */
function sleep(N: number) {
  return new Promise(resolve => setTimeout(resolve, N * 1000))
}

const wdescribe = process.env.USE_WATCH_PANE ? describe : xdescribe

wdescribe(`kubectl container logs via watch pane ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  allocateNS(this, ns)

  const podName = 'kui-two-containers'
  const allContainers = 'All Containers'
  const containerName1 = 'nginx'
  const containerName2 = 'vim'

  it(`should create sample pod from URL`, () => {
    return CLI.command(`echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`, this.app)
      .then(ReplExpect.okWithPtyOutput(podName))
      .catch(Common.oops(this, true))
  })

  it(`should wait for the pod to come up`, () => {
    return CLI.command(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
      .then(async () => {
        await this.app.client.waitForExist(Selectors.WATCHER_N(1))
        await this.app.client.waitForExist(Selectors.WATCHER_N_GRID_CELL_ONLINE(1, podName))
      })
      .catch(Common.oops(this, true))
  })

  it(`should get pods via kubectl then click`, async () => {
    try {
      const selector: string = await CLI.command(`kubectl get pods ${podName} -n ${ns}`, this.app).then(
        ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(podName) })
      )

      // wait for the badge to become green
      await waitForGreen(this.app, selector)

      // now click on the table row
      await this.app.client.click(`${selector} .clickable`)
      await SidecarExpect.open(this.app)
        .then(SidecarExpect.mode(defaultModeForGet))
        .then(SidecarExpect.showing(podName))
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('should show logs tab', async () => {
    try {
      await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('logs'))
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('logs'))
      await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED('logs'))

      await SidecarExpect.toolbarText({ type: 'info', text: 'Logs are live', exact: false })(this.app)

      await sleep(sleepTime)
      const text = await this.app.client.getText(`${Selectors.SIDECAR} .kui--sidecar-text-content`)
      assert.ok(
        text.includes(containerName1) && text.includes(containerName2),
        `${text} should have ${containerName1} and ${containerName2}`
      )
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  const switchContainer = (
    container: string,
    _showInLog: string[],
    _notShowInLog: string[],
    toolbar: { text: string; type: string }
  ) => {
    it(`should switch to container ${container}`, async () => {
      try {
        await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('container-list'))
        await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('container-list'))
        await this.app.client.waitForVisible(`.bx--overflow-menu-options button[data-mode="${container}"]`)
        await this.app.client.click(`.bx--overflow-menu-options button[data-mode="${container}"]`)

        await SidecarExpect.toolbarText({ type: toolbar.type, text: toolbar.text, exact: false })(this.app)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    _showInLog.forEach(showInLog => {
      it(`should show ${showInLog} in log output`, async () => {
        try {
          await sleep(sleepTime)
          const text = await this.app.client.getText(`${Selectors.SIDECAR} .kui--sidecar-text-content`)
          assert.ok(text.indexOf(showInLog) !== -1, `${text} should have ${showInLog}`)
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })
    })

    _notShowInLog.forEach(notShowInLog => {
      it(`should not show ${notShowInLog} in log output`, async () => {
        try {
          await sleep(sleepTime)
          const text = await this.app.client.getText(`${Selectors.SIDECAR} .kui--sidecar-text-content`)
          assert.ok(text.indexOf(notShowInLog) === -1, `${text} should not have ${notShowInLog}`)
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })
    })
  }

  const toggleStreaming = (changeToLive: boolean) => {
    it('should toggle streaming', async () => {
      try {
        await sleep(sleepTime)
        await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('toggle-streaming'))
        await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('toggle-streaming'))
        if (changeToLive) {
          await SidecarExpect.toolbarText({ type: 'info', text: 'Logs are live', exact: false })(this.app)
        } else {
          await SidecarExpect.toolbarText({ type: 'warning', text: 'Log streaming is paused', exact: false })(this.app)
        }
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

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

  it(`should delete the pod ${podName} by name via kubectl`, () => {
    return CLI.command(`kubectl delete pod ${podName} -n ${ns}`, this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(podName) }))
      .then(selector => waitForRed(this.app, selector))
      .catch(Common.oops(this))
  })

  it('should see log streaming stopped', async () => {
    try {
      await sleep(sleepTime)

      await SidecarExpect.toolbarText({ type: 'warning', text: 'Log streaming stopped', exact: false })(this.app)

      const text1 = await this.app.client.getText(`${Selectors.SIDECAR} .kui--sidecar-text-content`)
      await sleep(sleepTime)
      const text2 = await this.app.client.getText(`${Selectors.SIDECAR} .kui--sidecar-text-content`)

      assert.ok(text1.length === text2.length, `logs streaming should be stopped`)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  const showError = 'Log streaming stopped abnormally. Showing'
  switchContainer(containerName1, ['not found'], [], {
    text: `${showError} container ${containerName1}`,
    type: 'error'
  })
  switchContainer(containerName2, ['not found'], [], {
    text: `${showError} container ${containerName2}`,
    type: 'error'
  })
  switchContainer(allContainers, ['not found'], [], {
    text: `${showError} ${allContainers.toLowerCase()}`,
    type: 'error'
  })

  deleteNS(this, ns)
})
