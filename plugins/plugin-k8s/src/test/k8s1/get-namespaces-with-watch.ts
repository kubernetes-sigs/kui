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
import { cli, selectors, AppAndCount, sidecar } from '@kui-shell/core/tests/lib/ui'
import {
  waitForGreen,
  waitForRed,
  createNS as create,
  defaultModeForGet
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'
/** name of the namespace */
const nsName: string = create()

enum Status {
  Offline = 'red-background',
  Online = 'green-background'
}

/** after a cli.do (res), wait for a table row with the given status */
const waitForStatus = async function(
  this: common.ISuite,
  status: Status,
  nsName: string,
  res: AppAndCount
): Promise<string> {
  const selector = await cli.expectOKWithCustom({
    selector: selectors.BY_NAME(nsName)
  })(res)
  if (status === Status.Offline) {
    return waitForRed(this.app, selector)
  } else {
    return waitForGreen(this.app, selector)
  }
}

/** create namespace, and expect status eventually to be green */
const createNS = async function(this: common.ISuite, kubectl: string) {
  it(`should create namespace from URL via ${kubectl}`, async () => {
    const waitForOnline: (res: AppAndCount) => Promise<string> = waitForStatus.bind(this, Status.Online, nsName)

    try {
      await waitForOnline(await cli.do(`${kubectl} create ns ${nsName}`, this.app))
    } catch (err) {
      await common.oops(this, false)(err)
    }
  })
}

/** delete namespace, and expect status eventually to be red; */
const deleteNS = function(this: common.ISuite, kubectl: string) {
  it(`should delete the namespace ${nsName} from URL via ${kubectl}`, async () => {
    try {
      const waitForOffline: (res: AppAndCount) => Promise<string> = waitForStatus.bind(this, Status.Offline, nsName)

      const res = await cli.do(`${kubectl} delete ns ${nsName}`, this.app)

      await waitForOffline(res)
    } catch (err) {
      await common.oops(this, false)(err)
    }
  })
}

/**
 * Drilldown to a given namespace from the watch table
 *
 */
const testDrilldown = async (nsName: string, res: AppAndCount) => {
  const selector = await cli.expectOKWithCustom({
    selector: selectors.BY_NAME(nsName)
  })(res)

  await res.app.client.click(`${selector} .entity-name`)

  await sidecar
    .expectOpen(res.app)
    .then(sidecar.expectMode(defaultModeForGet))
    .then(sidecar.expectShowing(nsName))

  await res.app.client.click(selectors.SIDECAR_FULLY_CLOSE_BUTTON)
  await sidecar.expectClosed(res.app)
}

/** k get ns -w */
const watchNS = function(this: common.ISuite, kubectl: string) {
  const watchCmds = [`${kubectl} get ns -w`, `${kubectl} get ns ${nsName} -w`, `${kubectl} get -w ns ${nsName}`]

  watchCmds.forEach((_watchCmd, idx) => {
    const nsNameForIter = `${nsName}-${idx}`
    const watchCmd = _watchCmd.replace(nsName, nsNameForIter)

    it('should reload', () => common.refresh(this))

    it(`should watch namespaces via ${watchCmd}`, async () => {
      try {
        const waitForOnline = waitForStatus.bind(this, Status.Online, nsNameForIter)
        const waitForOffline = waitForStatus.bind(this, Status.Offline, nsNameForIter)

        const createBadge = await waitForOnline(await cli.do(`${kubectl} create ns ${nsNameForIter}`, this.app))

        const testWatch = await cli.do(watchCmd, this.app)
        const watchBadge = await waitForOnline(testWatch)
        const watchBadgeButOffline = watchBadge.replace(Status.Online, Status.Offline)
        await testDrilldown(nsNameForIter, testWatch)

        const deleteBadge = await waitForOffline(await cli.do(`${kubectl} delete ns ${nsNameForIter}`, this.app))

        // the create and delete badges had better still exist
        await this.app.client.waitForExist(createBadge)
        await this.app.client.waitForExist(deleteBadge)

        // the "online" badge from the watch had better *NOT* exist after the delete
        // (i.e. we had better actually be watching!)
        await this.app.client.waitForExist(watchBadge, 20000, true)

        // and, conversely, that watch had better eventually show Offline
        await this.app.client.waitForExist(watchBadgeButOffline)

        // create again
        await waitForOnline(await cli.do(`${kubectl} create ns ${nsNameForIter}`, this.app))

        // the "online" badge from the watch had better now exist again after the create
        // (i.e. we had better actually be watching!)
        await this.app.client.waitForExist(watchBadge)

        // and, conversely, that watch had better NOT show Offline
        await this.app.client.waitForExist(watchBadgeButOffline, 20000, true)

        // delete again
        await waitForOffline(await cli.do(`${kubectl} delete ns ${nsNameForIter}`, this.app))

        // the "online" badge from the watch had better *NOT* exist after the delete
        // (i.e. we had better actually be watching!)
        await this.app.client.waitForExist(watchBadge, 20000, true)

        // and, conversely, that watch had better eventually show Offline
        await this.app.client.waitForExist(watchBadgeButOffline)
      } catch (err) {
        await common.oops(this, false)(err)
      }
    })
  })
}

const synonyms = ['kubectl']

describe(`kubectl watch namespace ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  synonyms.forEach(kubectl => {
    const createIt: () => Promise<void> = createNS.bind(this, kubectl)
    const deleteIt: () => void = deleteNS.bind(this, kubectl)
    const watchIt: () => void = watchNS.bind(this, kubectl)
    //
    // here come the tests
    //
    createIt()
    deleteIt()
    watchIt()
  })
})
