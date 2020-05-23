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

import { v4 as uuid } from 'uuid'
import { Common, CLI, Keys, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'
import {
  createNS,
  allocateNS,
  deleteNS,
  waitForGreen,
  defaultModeForGet
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/kubectl-logs-two-containers.yaml'))
const inputEncoded = inputBuffer.toString('base64')
const podName = 'kui-two-containers'
const containerName = 'nginx'

// we will echo this text to this file
const ECHO_TEXT = `hello ${uuid()}`
const ECHO_FILE = '/tmp/kui-terminal-tab-test'

describe(`kubectl Terminal tab ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  allocateNS(this, ns)

  it(`should create sample pod from URL`, () => {
    return CLI.command(`echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`, this.app)
      .then(ReplExpect.okWithPtyOutput(podName))
      .catch(Common.oops(this, true))
  })

  if (process.env.USE_WATCH_PANE) {
    it(`should wait for the pod to come up`, () => {
      return CLI.command(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
        .then(async () => {
          await this.app.client.waitForExist(Selectors.WATCHER_N(1))
          await this.app.client.waitForExist(Selectors.WATCHER_N_GRID_CELL_ONLINE(1, podName))
        })
        .catch(Common.oops(this, true))
    })
  } else {
    it(`should wait for the pod to come up`, () => {
      return CLI.command(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
        .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(podName) }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })
  }

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

  it('should show terminal tab', async () => {
    try {
      await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('terminal'))
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('terminal'))
      await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED('terminal'))

      await SidecarExpect.toolbarText({ type: 'info', text: `Connected to container ${containerName}`, exact: false })(
        this.app
      )

      await new Promise(resolve => setTimeout(resolve, 5000))

      this.app.client.keys(`echo ${ECHO_TEXT} > ${ECHO_FILE}${Keys.ENTER}`)
      this.app.client.keys(`exit${Keys.ENTER}`)

      await SidecarExpect.toolbarText({ type: 'error', text: 'has closed', exact: false })(this.app)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('should confirm echoed text via kubectl exec', async () => {
    await CLI.command(`kubectl exec ${podName} -c ${containerName} -n ${ns} cat ${ECHO_FILE}`, this.app)
      .then(ReplExpect.okWithPtyOutput(ECHO_TEXT))
      .catch(Common.oops(this, true))
  })

  deleteNS(this, ns)
})
