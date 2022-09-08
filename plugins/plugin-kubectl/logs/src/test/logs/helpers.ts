/*
 * Copyright 2020 The Kubernetes Authors
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

import { CLI, Common, ReplExpect, Selectors, SidecarExpect, Util } from '@kui-shell/test'
import { defaultModeForGet, openSidecarByList, waitForGreen } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

export let res: ReplExpect.AppAndCount

export function create(this: Common.ISuite, ns: string, command: string, inputEncoded: string, podName: string) {
  it(`should create sample pod from URL`, () => {
    return CLI.command(`echo ${inputEncoded} | base64 --decode | ${command} create -f - -n ${ns}`, this.app)
      .then(ReplExpect.okWithPtyOutput(podName))
      .catch(Common.oops(this, true))
  })
}

export function wait(this: Common.ISuite, ns: string, command: string, podName: string, splitIndex?: number) {
  if (process.env.USE_WATCH_PANE) {
    it(`should wait for the pod to come up`, async () => {
      try {
        res = await CLI.command(`${command} get pod ${podName} -n ${ns} -w`, this.app)
        await this.app.client
          .$(Selectors.CURRENT_GRID_ONLINE_FOR_SPLIT(splitIndex, podName))
          .then(_ => _.waitForExist())
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  } else {
    it(`should wait for the pod to come up`, () => {
      return CLI.command(`${command} get pod ${podName} -n ${ns} -w`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(podName) }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })
  }
}

export function get(this: Common.ISuite, ns: string, command: string, podName: string, wait = true) {
  it(`should get pod ${podName} via ${command} then click`, async () => {
    try {
      await openSidecarByList(this, `${command} get pods ${podName} -n ${ns}`, podName, wait, defaultModeForGet)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })
}

export async function clickRetry(this: Common.ISuite, res: ReplExpect.AppAndCount) {
  await Util.clickSidecarModeButton(this, res, 'retry-streaming')
}

async function waitUntilPreviousIs(
  this: Common.ISuite,
  type: 'info' | 'warning',
  previous: boolean,
  res: ReplExpect.AppAndCount
) {
  const click = clickRetry.bind(this)

  await new Promise(resolve => setTimeout(resolve, 2000))
  await this.app.client.waitUntil(async () => {
    if (!(await this.app.client.$(Selectors.SIDECAR_TOOLBAR_TEXT(res.count, type)).then(_ => _.isExisting()))) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await click(res)
      await new Promise(resolve => setTimeout(resolve, 2000))
      return false
    } else {
      return true
    }
  })

  await SidecarExpect.toolbarText({ type, text: previous ? 'previous instance' : '' })(res)
}

export function logs(
  this: Common.ISuite,
  ns: string,
  command: string,
  podName: string,
  containerName: string,
  type: 'info' | 'warning',
  previous: boolean
) {
  const wait = waitUntilPreviousIs.bind(this, type, previous)

  it(`should get logs for ${podName} with previous=${previous} via command`, async () => {
    try {
      res = await CLI.command(
        `${command} logs ${podName} -c ${containerName} -n ${ns} ${previous ? '--previous' : ''}`,
        this.app
      )
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(podName, undefined, undefined, ns))
        .then(SidecarExpect.mode('logs'))

      await wait(res)
    } catch (err) {
      await Common.oops(this, true)
    }
  })
}

export function clickPrevious(this: Common.ISuite, type: 'info' | 'warning', previous: boolean) {
  const wait = waitUntilPreviousIs.bind(this, type, previous)

  it(`should click the previous toggle button and expect previous=${previous}`, async () => {
    const mode = 'kubectl-logs-previous-toggle'
    await Util.clickSidecarModeButton(this, res, mode)
    await wait(res)
  })
}
