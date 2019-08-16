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
import { cli, ctrlC, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import {
  assertTableTitleMatches,
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

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

describe(`kubectl logs follow ${process.env.MOCHA_RUN_TARGET}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const ns: string = createNS()
  allocateNS(this, ns)

  const podName = 'vim'
  const containerName = 'alpine'
  it(`should create sample pod from URL`, () => {
    return cli
      .do(`echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`, this.app)
      .then(cli.expectOKWithString(podName))
      .catch(common.oops(this, true))
  })

  it(`should wait for the pod to come up`, () => {
    return cli
      .do(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(podName) }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(common.oops(this, true))
  })

  it(`should follow the logs`, async () => {
    try {
      const res = await cli.do(`kubectl logs ${podName} ${containerName} -n ${ns} -f`, this.app)

      const rows = selectors.xtermRows(res.count)

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

      await this.app.client.click(rows)
      await this.app.client.keys(ctrlC)

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
      await common.oops(this, true)(err)
    }
  })

  deleteNS(this, ns)
})
