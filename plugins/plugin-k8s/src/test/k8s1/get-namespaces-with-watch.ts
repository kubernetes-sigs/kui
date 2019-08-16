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
import { cli, selectors, AppAndCount } from '@kui-shell/core/tests/lib/ui'
import { waitForGreen, waitForRed, createNS as create } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'
/** name of the namespace */
const nsName: string = create()

enum Status {
  Offline = 'red-background',
  Online = 'green-background'
}

/** after a cli.do (res), wait for a table row with the given status */
const waitForStatus = async function(this: common.ISuite, status: Status, res): Promise<string> {
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
    const waitForOnline: (res: AppAndCount) => Promise<string> = waitForStatus.bind(this, Status.Online)

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
      const waitForOffline: (res: AppAndCount) => Promise<string> = waitForStatus.bind(this, Status.Offline)

      const res = await cli.do(`${kubectl} delete ns ${nsName}`, this.app)

      await waitForOffline(res)
    } catch (err) {
      await common.oops(this, false)(err)
    }
  })
}

/** k get ns -w */
const watchNS = function(this: common.ISuite, kubectl: string) {
  const watchCmds = [`${kubectl} get ns -w`, `${kubectl} get ns ${nsName} -w`]

  watchCmds.forEach(watchCmd => {
    it(`should watch namespaces via ${watchCmd}`, async () => {
      try {
        const waitForOnline = waitForStatus.bind(this, Status.Online)
        const waitForOffline = waitForStatus.bind(this, Status.Offline)

        const selector1 = await waitForOnline(await cli.do(`${kubectl} create ns ${nsName}`, this.app))
        const selector2 = await waitForOnline(await cli.do(watchCmd, this.app))
        const selector2ButOffline = selector2.replace(Status.Online, Status.Offline)
        const selector3 = await waitForOffline(await cli.do(`${kubectl} delete ns ${nsName}`, this.app))

        // the create and delete badges had better still exist
        await this.app.client.waitForExist(selector1)
        await this.app.client.waitForExist(selector3)

        // the "online" badge from the watch had better *NOT* exist after the delete
        // (i.e. we had better actually be watching!)
        await this.app.client.waitForExist(selector2, 20000, true)

        // and, conversely, that watch had better eventually show Offline
        await this.app.client.waitForExist(selector2ButOffline)

        // create again
        await waitForOnline(await cli.do(`${kubectl} create ns ${nsName}`, this.app))

        // the "online" badge from the watch had better now exist again after the create
        // (i.e. we had better actually be watching!)
        await this.app.client.waitForExist(selector2)

        // and, conversely, that watch had better NOT show Offline
        await this.app.client.waitForExist(selector2ButOffline, 20000, true)

        // delete again
        await waitForOffline(await cli.do(`${kubectl} delete ns ${nsName}`, this.app))

        // the "online" badge from the watch had better *NOT* exist after the delete
        // (i.e. we had better actually be watching!)
        await this.app.client.waitForExist(selector2, 20000, true)

        // and, conversely, that watch had better eventually show Offline
        await this.app.client.waitForExist(selector2ButOffline)
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
