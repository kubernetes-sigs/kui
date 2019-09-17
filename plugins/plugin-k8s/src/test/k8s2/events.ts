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

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import {
  assertTableTitleMatches,
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

import * as assert from 'assert'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/event-generator.yaml'))
const inputEncoded = inputBuffer.toString('base64')

const podName = 'eventgen'
const sleepTime = 10

const synonyms = ['kubectl']

/** sleep for N seconds */
function sleep(N: number) {
  it(`should sleep for ${N} seconds`, () => new Promise(resolve => setTimeout(resolve, N * 1000)))
}

describe(`kubectl get events ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    /** error handling starts */
    it('should create pod that generates events', () =>
      cli
        .do(`echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`, this.app)
        .then(cli.expectOKWithString(podName))
        .catch(common.oops(this, true)))

    it('should open pod in sidecar', () =>
      cli
        .do(`${kubectl} get pod ${podName} -n ${ns} -o yaml`, this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(podName))
        .catch(common.oops(this, true)))

    sleep(sleepTime)

    it('should switch to events tab', async () => {
      try {
        await this.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON('events'))
        await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('events'))
        await this.app.client.waitForExist(selectors.SIDECAR_MODE_BUTTON_SELECTED('events'))

        // test events table has correct header
        const header = ['TYPE', 'REASON', 'LAST SEEN', 'FIRST SEEN', 'FROM', 'MESSAGE']
        header.forEach(async _header => {
          await this.app.client.waitForExist(
            `${selectors.SIDECAR_CUSTOM_CONTENT} .result-table .header-row .header-cell .cell-inner[data-key="${_header}"]`
          )
        })

        await this.app.client.waitForExist(
          `${selectors.SIDECAR_CUSTOM_CONTENT} .result-table badge[data-key="REASON"].yellow-background`
        )
      } catch (err) {
        return common.oops(this, true)
      }
    })

    deleteNS(this, ns)
  })
})
