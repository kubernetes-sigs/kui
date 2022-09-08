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

import * as assert from 'assert'
import { Application } from 'spectron'

import { Common, CLI, Keys, ReplExpect, Selectors } from '@kui-shell/test'
import { createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/kubectl-exec.yaml'))
const inputEncoded = inputBuffer.toString('base64')

/** The number of seconds to sleep while we wait for more log entries
 * to accumulate. Making this value larger will provide more test
 * stability, but also increase test time. */
const sleepTime = 8

function getTextContent(app: Application, selector) {
  return app.client.$(selector).then(_ => _.getText())
}

/** sleep for N seconds */
function sleep(N: number) {
  return new Promise(resolve => setTimeout(resolve, N * 1000))
}

const wdescribe = process.env.USE_WATCH_PANE ? describe : xdescribe

wdescribe(`kubectl logs follow via watch pane ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // needed to force the dom renderer for webpack/browser-based tests; see ExecIntoPod
  Common.setDebugMode.bind(this)()

  const ns: string = createNS()
  allocateNS(this, ns)

  const podName = 'vim'
  const containerName = 'alpine'
  it(`should create sample pod from URL`, () => {
    return CLI.command(`echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`, this.app)
      .then(ReplExpect.okWithPtyOutput(podName))
      .catch(Common.oops(this, true))
  })

  it(`should wait for the pod to come up`, () => {
    return CLI.command(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
      .then(async () => {
        await this.app.client.$(Selectors.CURRENT_GRID_ONLINE_FOR_SPLIT(2, podName)).then(_ => _.waitForExist())
      })
      .catch(Common.oops(this, true))
  })

  it(`should follow the logs`, async () => {
    try {
      const res = await CLI.command(`kubectl logs ${podName} ${containerName} -n ${ns} -f`, this.app).then(
        ReplExpect.ok
      )

      const rows = `${Selectors.SIDECAR_TAB_CONTENT(res.count)} .xterm-rows`

      await sleep(sleepTime)
      const text1 = await getTextContent(this.app, rows)
      const nRows1 = text1.split(/\n/).length
      console.log('nRows1', nRows1)

      await sleep(sleepTime)
      const text2 = await getTextContent(this.app, rows)
      const nRows2 = text2.split(/\n/).length
      console.log('nRows2', nRows2)
      assert.ok(nRows2 > nRows1, `${nRows2} is not > ${nRows1}`)

      await sleep(sleepTime)
      const text3 = await getTextContent(this.app, rows)
      const nRows3 = text3.split(/\n/).length
      console.log('nRows3', nRows3)
      assert.ok(nRows3 > nRows2, `${nRows3} is not > ${nRows2}`)

      // await this.app.client.click(rows)
      await this.app.client.keys(Keys.ctrlC)

      await sleep(sleepTime)
      const text4 = await getTextContent(this.app, rows)
      const nRows4 = text4.split(/\n/).length
      console.log('nRows4', nRows4)

      await sleep(sleepTime)
      const text5 = await getTextContent(this.app, rows)
      const nRows5 = text5.split(/\n/).length
      console.log('nRows5', nRows5)
      assert.strictEqual(nRows5, nRows4)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  deleteNS(this, ns)
})
