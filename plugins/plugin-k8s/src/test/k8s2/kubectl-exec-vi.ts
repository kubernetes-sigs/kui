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
import { cli, keys, selectors } from '@kui-shell/core/tests/lib/ui'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/kubectl-exec.yaml'))
const inputEncoded = inputBuffer.toString('base64')

/** we have a custom vimrc, to make sure INSERT shows up */
const vimrc = join(dirname(require.resolve('@kui-shell/plugin-bash-like/tests/data/marker.json')), 'vimrc')

describe(`kubectl exec vi ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const ns: string = createNS()
  allocateNS(this, ns)

  const podName = 'vim'
  it(`should create sample pod from URL`, () => {
    return cli
      .do(`echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`, this.app)
      .then(cli.expectOKWithString(podName))
      .catch(common.oops(this))
  })

  it(`should wait for the pod to come up`, () => {
    return cli
      .do(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(podName) }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(common.oops(this))
  })

  /* it(`should copy the vimrc to the current container`, () => {
    return cli
      .do(`kubectl cp ${vimrc} -n ${ns} ${ns}/${podName}:/root/.vimrc`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this))
  }) */

  const filename = '/tmp/foo.txt'
  const typeThisText = 'hello there'

  it(`should use kubectl exec vi through pty`, async () => {
    try {
      const res = await cli.do(`kubectl exec -it ${podName} -n ${ns} -- vi ${filename}`, this.app)

      const rows = selectors.xtermRows(res.count)

      // wait for vi to come up
      await this.app.client.waitForExist(rows)

      // wait for vi to come up in alt buffer mode
      await this.app.client.waitForExist(`tab.visible.xterm-alt-buffer-mode`)

      const lastRow = async (): Promise<string> => {
        const text = await this.app.client.getText(`${rows} > div:not(.xterm-hidden-row)`)
        return text[text.length - 1]
      }

      // enter insert mode, and wait for INSERT to appear at the bottom
      await this.app.client.keys('i')
      await this.app.client.waitUntil(async () => {
        const txt = await lastRow()
        return txt && /^I/i.test(txt)
      })

      // type our input
      for (let idx = 0; idx < typeThisText.length; idx++) {
        await this.app.client.keys(typeThisText.charAt(idx))
        await new Promise(resolve => setTimeout(resolve, 5))
      }
      await this.app.client.keys(keys.ESCAPE)
      await this.app.client.waitUntil(async () => {
        const txt = await lastRow()
        return txt && !/^I/i.test(txt)
      })

      await this.app.client.keys(':wq')
      await this.app.client.keys(keys.ENTER)

      await cli.expectBlank(res)
    } catch (err) {
      return common.oops(this)(err)
    }
  })

  it('should use kubectl exec to cat the file we just edited', async () => {
    return cli
      .do(`kubectl exec ${podName} -n ${ns} -- cat ${filename}`, this.app)
      .then(cli.expectOKWithString(typeThisText))
      .catch(common.oops(this))
  })

  deleteNS(this, ns)
})
