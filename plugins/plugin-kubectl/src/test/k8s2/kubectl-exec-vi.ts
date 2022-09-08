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

import { Common, CLI, Keys, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'
import { createNS, allocateNS, deleteNS, typeSlowly, waitForGreen } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/kubectl-exec.yaml'))
const inputEncoded = inputBuffer.toString('base64')

/** we have a custom vimrc, to make sure INSERT shows up */
// const vimrc = join(dirname(require.resolve('@kui-shell/plugin-bash-like/tests/data/marker.json')), 'vimrc')

/** sleep for N seconds */
function sleep(N: number) {
  return new Promise(resolve => setTimeout(resolve, N * 1000))
}

describe(`kubectl exec vi ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  allocateNS(this, ns)

  const podName = 'vim'
  it(`should create sample pod from URL`, () => {
    return CLI.command(`echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`, this.app)
      .then(ReplExpect.okWithPtyOutput(podName))
      .catch(Common.oops(this))
  })

  if (!process.env.USE_WATCH_PANE) {
    it(`should wait for the pod to come up`, () => {
      return CLI.command(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(podName) }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })
  } else {
    it(`should wait for the pod to come up`, () => {
      return CLI.command(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
        .then(async () => {
          await this.app.client.$(Selectors.CURRENT_GRID_ONLINE_FOR_SPLIT(2, podName)).then(_ => _.waitForExist())
        })
        .catch(Common.oops(this, true))
    })
  }

  it('should reload', () => Common.refresh(this))

  // needed to force the dom renderer for webpack/browser-based tests;
  // see ExecIntoPod; careful to place this after the refresh!!!
  Common.setDebugMode.bind(this)()

  /* it(`should copy the vimrc to the current container`, () => {
    return CLI
      .command(`kubectl cp ${vimrc} -n ${ns} ${ns}/${podName}:/root/.vimrc`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  }) */

  const filename = '/tmp/foo.txt'
  const typeThisText = 'hello there'

  it(`should use kubectl exec vi through pty`, async () => {
    try {
      const res = await CLI.command(`kubectl exec -it ${podName} -n ${ns} -- vim -i NONE ${filename}`, this.app).then(
        ReplExpect.ok
      )

      const rows = `${Selectors.SIDECAR_TAB_CONTENT(res.count)} .xterm-rows`
      const focusArea = `${Selectors.SIDECAR_TAB_CONTENT(res.count)} .xterm-helper-textarea`
      const lastRowSelector = `${rows} > div:last-child`

      const lastRow = async (): Promise<string> => {
        return this.app.client.$(lastRowSelector).then(_ => _.getText())
      }

      await sleep(3)

      // wait for vi to come up
      await this.app.client.$(rows).then(_ => _.waitForExist())

      // click the sidecar tab content
      await this.app.client.$(rows).then(_ => _.click())

      await this.app.client.waitUntil(
        async () => {
          return this.app.client.$(focusArea).then(_ => _.isFocused())
        },
        { timeout: CLI.waitTimeout }
      )

      // enter insert mode, and wait for INSERT to appear at the bottom
      let iter = 0
      await this.app.client.keys('i')
      await this.app.client.waitUntil(async () => {
        const txt = await lastRow()
        if (++iter > 5) {
          console.error(`kubectl exec vi still waiting for Insert mode; actualText='${txt}'`)
        }
        return /INSERT/i.test(txt)
      })

      // type our input
      await typeSlowly(this.app, typeThisText)

      // exit vi input mode
      iter = 0
      await this.app.client.keys(Keys.ESCAPE)
      await this.app.client.waitUntil(async () => {
        const txt = await lastRow()
        if (++iter > 5) {
          console.error('kubectl exec vi still waiting to exit insert mode', txt)
        }
        return !/INSERT/i.test(txt)
      })

      // wait for vi to exit and the next prompt block to appear
      iter = 0
      await this.app.client.waitUntil(async () => {
        await this.app.client.keys(Keys.ESCAPE)
        await typeSlowly(this.app, `:wq${Keys.ENTER}`)

        try {
          await SidecarExpect.toolbarText({ type: 'error', text: 'closed', exact: false })(res)
          return true
        } catch (err) {
          console.error(`hmm, the view has not yet indicated the pty has closed at iter ${iter++}`)
          return false
        }
      })
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should use kubectl exec to cat the file we just edited', async () => {
    return CLI.command(`kubectl exec ${podName} -n ${ns} -- cat ${filename}`, this.app)
      .then(ReplExpect.okWithString(typeThisText))
      .catch(Common.oops(this, true))
  })

  deleteNS(this, ns)
})
