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
import { waitForGreen, waitForRed, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'
import { theme } from '@kui-shell/core/core/settings'
import * as assert from 'assert'

/** name of the pod */
const podName = 'nginx'
/** final polling rate (do not increase the interval beyond this!) */
const finalPolling = (theme && theme.tablePollingInterval) || 5000

/** source for the resource spec */
const url = 'https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod'

enum Status {
  Offline = 'red-background',
  Online = 'green-background'
}

/** after a cli.do (res), wait for a table row with the given status */
const waitForStatus = async function(this: common.ISuite, status: Status, res) {
  const selector = await cli.expectOKWithCustom({
    selector: selectors.BY_NAME(podName)
  })(res)

  if (status === Status.Offline) {
    return waitForRed(this.app, selector)
  } else {
    return waitForGreen(this.app, selector)
  }
}

/** create, then delete; the create table status had better not change */
const createAndDeletePod = function(this: common.ISuite, kubectl: string, ns: string) {
  it(`should create then delete sample pod from URL via ${kubectl}`, async () => {
    try {
      const waitForOnline: (res: AppAndCount) => Promise<string> = waitForStatus.bind(this, Status.Online)

      const waitForOffline: (res: AppAndCount) => Promise<string> = waitForStatus.bind(this, Status.Offline)

      const selector1 = await waitForOnline(await cli.do(`${kubectl} create -f ${url} -n ${ns}`, this.app))
      const selector2 = await waitForOffline(await cli.do(`${kubectl} delete -f ${url} -n ${ns}`, this.app))

      // the first badge.Online selector had better still exist after the delete
      await this.app.client.waitForExist(selector1)

      const selector3 = await waitForOnline(await cli.do(`${kubectl} create -f ${url} -n ${ns}`, this.app))

      // that second badge.Offline selector had better still exist after the (second) create
      await this.app.client.waitForExist(selector2)

      // one last delete...
      await waitForOffline(await cli.do(`${kubectl} delete -f ${url} -n ${ns}`, this.app))

      // the previous badges had all better still exist after that second delete
      await this.app.client.waitForExist(selector1)
      await this.app.client.waitForExist(selector2)
      await this.app.client.waitForExist(selector3)
    } catch (err) {
      await common.oops(this, true)(err)
    }
  })
}

/** k get pods -w */
const watchPods = function(this: common.ISuite, kubectl: string, ns: string) {
  it(`should watch pods via ${kubectl} get pods -w`, async () => {
    try {
      const waitForOnline: (res: AppAndCount) => Promise<string> = waitForStatus.bind(this, Status.Online)
      const waitForOffline: (res: AppAndCount) => Promise<string> = waitForStatus.bind(this, Status.Offline)

      const selector1 = await waitForOnline(await cli.do(`${kubectl} create -f ${url} -n ${ns}`, this.app))
      const selector2 = await waitForOnline(await cli.do(`${kubectl} get pods -w -n ${ns}`, this.app))
      const selector2ButOffline = selector2.replace(Status.Online, Status.Offline)
      const selector3 = await waitForOffline(await cli.do(`${kubectl} delete -f ${url} -n ${ns}`, this.app))

      // the create and delete badges had better still exist
      await this.app.client.waitForExist(selector1)
      await this.app.client.waitForExist(selector3)

      // the "online" badge from the watch had better *NOT* exist after the delete
      // (i.e. we had better actually be watching!)
      await this.app.client.waitForExist(selector2, 20000, true)

      // and, conversely, that watch had better eventually show Offline
      await this.app.client.waitForExist(selector2ButOffline)

      // create again
      await waitForOnline(await cli.do(`${kubectl} create -f ${url} -n ${ns}`, this.app))

      // the "online" badge from the watch had better now exist again after the create
      // (i.e. we had better actually be watching!)
      await this.app.client.waitForExist(selector2)

      // and, conversely, that watch had better NOT show Offline
      await this.app.client.waitForExist(selector2ButOffline, 20000, true)
    } catch (err) {
      await common.oops(this, true)(err)
    }
  })
}

const checkWatchableJobs = function(
  this: common.ISuite,
  kubectl: string,
  ns: string,
  jobCount: number,
  createResource: boolean
) {
  if (createResource) {
    it(`should create a watchable job via ${kubectl} get pods -w`, async () => {
      try {
        const waitForOnline: (res: AppAndCount) => Promise<string> = waitForStatus.bind(this, Status.Online)
        await waitForOnline(await cli.do(`${kubectl} get pods -w -n ${ns}`, this.app))
      } catch (err) {
        await common.oops(this, true)(err)
      }
    })
  }

  it(`should have ${jobCount} watchable jobs in the tab`, async () => {
    try {
      const watchableJobsRaw = await this.app.client.execute(() => {
        return document.querySelector('tab.visible')['state'].jobs
      })
      const jobs = watchableJobsRaw.value

      if (jobCount === undefined) {
        // tab.state.jobs shouldn't be initialized
        assert.ok(!jobs)
      } else {
        // tab.state.jobs should be an array of length jobCount and every job in the array has an id
        // console.log(jobs)
        assert.ok(
          Array.isArray(jobs) && jobs.length === jobCount && jobs.filter(job => job._id === undefined).length === 0
        )
        // check the maximum watch timeout
        if (jobs.some(job => job.timeout > finalPolling + 100)) {
          throw Error(`timeout for the watchable job exceeds ${finalPolling}`)
        }
      }
    } catch (err) {
      await common.oops(this, true)(err)
    }
  })
}

const synonyms = ['k']

describe(`kubectl watch pod ${process.env.MOCHA_RUN_TARGET}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    const createAndDeleteIt: () => void = createAndDeletePod.bind(this, kubectl, ns)
    const watchIt: () => void = watchPods.bind(this, kubectl, ns)
    const checkJob: (jobCount: number, createResource: boolean) => void = checkWatchableJobs.bind(this, kubectl, ns)

    //
    // here come the tests
    //
    allocateNS(this, ns)
    createAndDeleteIt()

    // the current tab should have jobs = [] due to watcher being collected after reaching final-state
    checkJob(0, false)

    watchIt()

    // the current tab should only contain 1 watching job for `k get pods -w`
    checkJob(1, false)

    // create a new watchable job and expect 2 jobs in the tab
    checkJob(2, true)

    it('should add new tab via command', () =>
      cli
        .do('tab new', this.app)
        .then(() => this.app.client.waitForVisible('.left-tab-stripe-button-selected[data-tab-button-index="2"]'))
        .then(() => cli.waitForRepl(this.app)) // should have an active repl
        .catch(common.oops(this, true)))

    // undefined means that the new tab shouldn't have jobs even initialized
    checkJob(undefined, false)

    it(`should switch back to first tab via command`, () =>
      cli.do('tab switch 1', this.app).catch(common.oops(this, true)))

    // the original tab should still have 2 jobs running
    checkJob(2, false)

    it('should close tab via "tab close" command', () =>
      cli
        .do('tab close', this.app)
        .then(() =>
          this.app.client.waitForExist('.left-tab-stripe-button-selected[data-tab-button-index="2"]', 20000, true)
        )
        .then(() => this.app.client.waitForExist('.left-tab-stripe-button-selected[data-tab-button-index="1"]'))
        .then(() => cli.waitForRepl(this.app)) // should have an active repl
        .catch(common.oops(this, true)))

    // undefined means that the current tab shouldn't have jobs even initialized
    checkJob(undefined, false)

    // create a new watchable job and expect 1 jobs in the tab
    checkJob(1, true)

    deleteNS(this, ns)
  })
})
