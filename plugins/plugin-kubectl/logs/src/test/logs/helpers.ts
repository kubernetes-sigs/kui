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

import { CLI, Common, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'
import { defaultModeForGet, waitForGreen } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

export function create(this: Common.ISuite, ns: string, inputEncoded: string, podName: string) {
  it(`should create sample pod from URL`, () => {
    return CLI.command(`echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`, this.app)
      .then(ReplExpect.okWithPtyOutput(podName))
      .catch(Common.oops(this, true))
  })
}

export function wait(this: Common.ISuite, ns: string, podName: string, splitIndex?: number) {
  if (process.env.USE_WATCH_PANE) {
    it(`should wait for the pod to come up`, () => {
      return CLI.command(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
        .then(async () => {
          await this.app.client.waitForExist(Selectors.CURRENT_GRID_ONLINE_FOR_SPLIT(splitIndex, podName))
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
}

export function get(this: Common.ISuite, ns: string, podName: string, wait = true) {
  it(`should get pod ${podName} via kubectl then click`, async () => {
    try {
      const selector: string = await CLI.command(`kubectl get pods ${podName} -n ${ns}`, this.app).then(
        ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(podName) })
      )

      if (wait) {
        // wait for the badge to become green
        await waitForGreen(this.app, selector)
      }

      // now click on the table row
      await this.app.client.click(`${selector} .clickable`)
      await SidecarExpect.open(this.app)
        .then(SidecarExpect.mode(defaultModeForGet))
        .then(SidecarExpect.showing(podName))
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })
}

export async function clickRetry(this: Common.ISuite) {
  await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('retry-streaming'))
  await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('retry-streaming'))
}

async function waitUntilPreviousIs(this: Common.ISuite, type: 'info' | 'warning', previous: boolean) {
  const click = clickRetry.bind(this)

  await this.app.client.waitUntil(async () => {
    if (!this.app.client.isExisting(Selectors.SIDECAR_TOOLBAR_TEXT(type))) {
      await click()
      return false
    } else {
      return true
    }
  })

  await SidecarExpect.toolbarText({ type, text: previous ? 'previous instance' : '' })
}

export function logs(
  this: Common.ISuite,
  ns: string,
  podName: string,
  containerName: string,
  type: 'info' | 'warning',
  previous: boolean
) {
  const wait = waitUntilPreviousIs.bind(this, type, previous)

  it(`should get logs for ${podName} with previous=${previous} via command`, async () => {
    try {
      await CLI.command(
        `kubectl logs ${podName} -c ${containerName} -n ${ns} ${previous ? '--previous' : ''}`,
        this.app
      )
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(podName, undefined, undefined, ns))
        .then(SidecarExpect.mode('logs'))

      await wait()
    } catch (err) {
      await Common.oops(this, true)
    }
  })
}

export function clickPrevious(this: Common.ISuite, type: 'info' | 'warning', previous: boolean) {
  const wait = waitUntilPreviousIs.bind(this, type, previous)

  it(`should click the previous toggle button and expect previous=${previous}`, async () => {
    const mode = 'kubectl-logs-previous-toggle'
    await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON(mode))
    await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON(mode))
    await wait()
  })
}
