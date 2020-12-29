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

import { CLI, ReplExpect, SidecarExpect, Common, Selectors, Util } from '@kui-shell/test'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const crashy: SidecarExpect.ExpectedTree[] = [
  {
    id: 'All Resources',
    children: [
      {
        id: 'Unlabeled Resources',
        children: [
          {
            id: 'Pod',
            children: [
              {
                id: 'kui-crashy'
              }
            ]
          }
        ]
      }
    ]
  }
]

const modifiedCrashyDryRun: SidecarExpect.ExpectedTree[] = [
  {
    id: 'All Resources',
    children: [
      {
        id: 'Unlabeled Resources',
        children: [
          {
            id: 'Pod',
            children: [
              {
                id: 'kui-crashy'
              }
            ]
          }
        ]
      }
    ]
  }
]

const guestbook = [
  {
    id: 'Tiers',
    children: [
      {
        id: 'Frontend',
        children: [
          {
            id: 'Apps',
            children: [
              {
                id: 'Guestbook'
              }
            ]
          }
        ]
      },
      {
        id: 'Backend',
        children: [
          {
            id: 'Apps2',
            children: [
              {
                id: 'Redis'
              }
            ]
          }
        ]
      }
    ]
  }
]

const currentEventCount = async (res: ReplExpect.AppAndCount): Promise<number> => {
  const events = await res.app.client.$$(Selectors.TREE_EVENT_MESSAGES(res.count))
  return !events ? 0 : events.length
}

const drilldown = async (res: ReplExpect.AppAndCount, id: string, expectText?: string) => {
  const node = await res.app.client.$(Selectors.TREE_LIST_AS_BUTTON(res.count, id))
  await node.waitForDisplayed()
  await node.click()

  return SidecarExpect.openInBlockAfter(res)
    .then(SidecarExpect.mode('diff'))
    .then(res => (expectText ? SidecarExpect.textPlainContentFromMonaco(expectText, false)(res) : res))
}

const clickApplyButton = async (
  getRes: ReplExpect.AppAndCount,
  prevRes: ReplExpect.AppAndCount,
  waitForResourceName: string
) => {
  const button = await getRes.app.client.$(Selectors.SIDECAR_TOOLBAR_BUTTON(getRes.count, 'apply'))
  await button.waitForDisplayed()
  await button.click()
  if (waitForResourceName) {
    const tableRes = ReplExpect.blockAfter(prevRes)
    const selector = await ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(waitForResourceName) })(
      tableRes
    )
    return waitForGreen(prevRes.app, selector)
  }
  return prevRes
}

const hasEvents = async (res: ReplExpect.AppAndCount) => {
  let idx = 0
  await res.app.client.waitUntil(
    async () => {
      const actualEventCount = await currentEventCount(res)
      if (++idx > 5) {
        console.error('still waiting for events 1', actualEventCount)
      }
      return actualEventCount > 0
    },
    { timeout: CLI.waitTimeout }
  )
  return res
}

const commands = ['kubectl']

commands.forEach(command => {
  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  describe(`${command} get dashF ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    allocateNS(this, ns)

    const getOfflineFile = (
      file: string,
      dryRun: SidecarExpect.ExpectedTree[],
      waitForApply?: string,
      drilldownId?: string,
      expectDiffText?: string
    ) => {
      it(`should get -f offline file and apply ${process.env.MOCHA_RUN_TARGET || ''}`, () =>
        CLI.command(`${command} get -f ${file} ${inNamespace}`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.mode('sources'))
          .then(SidecarExpect.toolbarText({ type: 'info', text: 'Offline', exact: false }))
          .then(Util.switchToTab('dry run'))
          .then(SidecarExpect.tree(dryRun))
          .then(SidecarExpect.toolbarText({ type: 'info', text: 'Previewing', exact: false }))
          .then(async sidecar1Res => {
            if (drilldownId) {
              const sidecar2Res = await drilldown(sidecar1Res, drilldownId, expectDiffText)
              return clickApplyButton(sidecar1Res, sidecar2Res, waitForApply)
            } else {
              return clickApplyButton(sidecar1Res, sidecar1Res, waitForApply)
            }
          })
          .catch(Common.oops(this, true)))
    }

    const getLiveFile = (
      file: string,
      deploy: SidecarExpect.ExpectedTree[],
      clickApply?: boolean,
      waitForApply?: string,
      drilldownId?: string,
      expectDiffText?: string
    ) => {
      it(`should get -f online file, expect events ${process.env.MOCHA_RUN_TARGET || ''}`, () =>
        CLI.command(`${command} get -f ${file} ${inNamespace}`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.mode('deployed resources'))
          .then(hasEvents)
          .then(SidecarExpect.tree(deploy))
          .then(Util.switchToTab('sources'))
          .then(SidecarExpect.toolbarText({ type: 'info', text: 'Live', exact: false }))
          .then(Util.switchToTab('deployed resources'))
          .then(SidecarExpect.tree(deploy))
          .then(async sidecar1Res => {
            if (drilldownId) {
              const sidecar2Res = await drilldown(sidecar1Res, drilldownId, expectDiffText)
              return clickApply ? clickApplyButton(sidecar1Res, sidecar2Res, waitForApply) : sidecar2Res
            } else {
              return clickApply ? clickApplyButton(sidecar1Res, sidecar1Res, waitForApply) : sidecar1Res
            }
          })
          .catch(Common.oops(this, true)))
    }

    getOfflineFile(`${ROOT}/data/k8s/crashy.yaml`, crashy, 'kui-crashy', 'kui-crashy')
    getLiveFile(`${ROOT}/data/k8s/crashy.yaml`, crashy)
    getLiveFile(
      `${ROOT}/data/k8s/diff/modified-crashy.yaml`,
      modifiedCrashyDryRun,
      true,
      'kui-crashy',
      'kui-crashy',
      'foo'
    )

    getOfflineFile(`${ROOT}/data/k8s/application/guestbook`, guestbook)
    getLiveFile(`${ROOT}/data/k8s/application/guestbook`, guestbook)

    deleteNS(this, ns)
  })
})
