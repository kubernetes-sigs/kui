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
import { cli, expectSubset, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import { createNS as create } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'
/** name of the namespace */
const nsName: string = create()

enum Status {
  Offline = 'red-background',
  Online = 'green-background'
}

/** after a cli.do (res), wait for a table row with the given status */
const waitForStatus = async function (this: common.ISuite, status: Status, res) {
  const selector = await cli.expectOKWithCustom({ selector: selectors.BY_NAME(nsName) })(res)
  const expectStatus = `${selector} span:not(.repeating-pulse) badge.${status}`

  await this.app.client.waitForExist(expectStatus)

  return expectStatus
}

/** create namespace, and expect status eventually to be green */
const createNS = async function (this: common.ISuite, kubectl: string) {
  it(`should create namespace from URL via ${kubectl}`, async () => {
    const waitForOnline = waitForStatus.bind(this, Status.Online)

    try {
      await waitForOnline(await cli.do(`${kubectl} create ns ${nsName}`, this.app))
    } catch (err) {
      common.oops(this)(err)
    }
  })
}

/** delete namespace, and expect status eventually to be green; or (if noExistOk=true) eventually to get a 404 */
const deleteNS = function (this: common.ISuite, kubectl: string, { noExistOk = false } = {}) {
  it(`should delete the namespace ${nsName} from URL via ${kubectl} with noExistOk=${noExistOk}`, async () => {
    try {
      const waitForOffline = waitForStatus.bind(this, Status.Offline)

      const res = await cli.do(`${kubectl} delete ns ${nsName}`, this.app)

      if (noExistOk) {
        return this.app.client.waitUntil(async () => {
          try {
            const maybe404 = `${selectors.OUTPUT_N(res.count)} .oops[data-status-code="404"]`
            const elt = await this.app.client.element(maybe404)
            if (elt.state === 'failure') {
              // no 404? then we'd better eventuallly see that the namespace is offline
              await waitForOffline(res)
              return true
            } else {
              // 404? that's ok! (noExistOk=true)
              return true
            }
          } catch (err) {
            return false
          }
        })
      } else {
        // noExistOk=false, then we'd better eventually see that the namespace is offline
        await waitForOffline(res)
        return
      }
    } catch (err) {
      common.oops(this)(err)
    }
  })
}

/** k get ns -w */
const watchNS = function (this: common.ISuite, kubectl: string) {
  it(`should watch namespaces via ${kubectl} get ns -w`, async () => {
    try {
      const waitForOnline = waitForStatus.bind(this, Status.Online)
      const waitForOffline = waitForStatus.bind(this, Status.Offline)

      const selector1 = await waitForOnline(await cli.do(`${kubectl} create ns ${nsName}`, this.app))
      const selector2 = await waitForOnline(await cli.do(`${kubectl} get ns -w`, this.app))
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
      const selector4 = await waitForOnline(await cli.do(`${kubectl} create ns ${nsName}`, this.app))

      // the "online" badge from the watch had better now exist again after the create
      // (i.e. we had better actually be watching!)
      await this.app.client.waitForExist(selector2)

      // and, conversely, that watch had better NOT show Offline
      await this.app.client.waitForExist(selector2ButOffline, 20000, true)
    } catch (err) {
      common.oops(this)(err)
    }
  })
}

const synonyms = ['kubectl', 'k']

describe('electron watch namespace', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  synonyms.forEach(kubectl => {
    const createIt = createNS.bind(this, kubectl)
    const deleteIt = deleteNS.bind(this, kubectl)
    const watchIt = watchNS.bind(this, kubectl)

    //
    // here come the tests
    //

    deleteIt({ noExistOk: true }) // delete the namespace, but it's ok if it doesn't exist
    createIt()
    deleteIt()
    watchIt()
  })
})
