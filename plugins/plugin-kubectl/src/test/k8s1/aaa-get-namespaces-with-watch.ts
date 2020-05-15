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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import {
  waitForGreen,
  waitForRed,
  createNS as create,
  defaultModeForGet
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { Application } from 'spectron'
import * as assert from 'assert'

/** name of the namespace */
const nsName: string = create()

enum Status {
  Offline = 'red-background',
  Online = 'green-background'
}

/** after a CLI.command (res), wait for a table row with the given status */
const waitForStatus = async function(
  this: Common.ISuite,
  status: Status,
  nsName: string,
  res: ReplExpect.AppAndCount
): Promise<string> {
  const selector = await ReplExpect.okWithCustom({
    selector: Selectors.BY_NAME(nsName)
  })(res)
  if (status === Status.Offline) {
    return waitForRed(this.app, selector)
  } else {
    return waitForGreen(this.app, selector)
  }
}

/** create namespace, and expect status eventually to be green */
const createNS = async function(this: Common.ISuite, kubectl: string) {
  it(`should create namespace from URL via ${kubectl}`, async () => {
    const waitForOnline: (res: ReplExpect.AppAndCount) => Promise<string> = waitForStatus.bind(
      this,
      Status.Online,
      nsName
    )

    try {
      await waitForOnline(await CLI.command(`${kubectl} create ns ${nsName}`, this.app))
    } catch (err) {
      await Common.oops(this, false)(err)
    }
  })
}

/** delete namespace, and expect status eventually to be red; */
const deleteNS = function(this: Common.ISuite, kubectl: string) {
  it(`should delete the namespace ${nsName} from URL via ${kubectl}`, async () => {
    try {
      const waitForOffline: (res: ReplExpect.AppAndCount) => Promise<string> = waitForStatus.bind(
        this,
        Status.Offline,
        nsName
      )

      const res = await CLI.command(`${kubectl} delete ns ${nsName}`, this.app)

      await waitForOffline(res)
    } catch (err) {
      await Common.oops(this, false)(err)
    }
  })
}

/**
 * Drilldown to a given namespace from the watch table
 *
 */
const testDrilldown = async (nsName: string, badgeSelector: string, app: Application) => {
  await app.client.click(`${badgeSelector}`)

  await SidecarExpect.open(app)
    .then(SidecarExpect.mode(defaultModeForGet))
    .then(SidecarExpect.showing(nsName))

  await app.client.waitForVisible(Selectors.TERMINAL_SIDECAR_WATCHER_BUTTON)

  await app.client.click(Selectors.SIDECAR_FULLY_CLOSE_BUTTON)
  await SidecarExpect.fullyClosed(app)

  await app.client.waitForVisible(Selectors.TERMINAL_AND_WATCHER_BUTTON)
}

/** k get ns -w */
const watchNS = function(this: Common.ISuite, kubectl: string) {
  const watchCmds = [
    //    `${kubectl} get ns -w`, <-- not guaranteed to work locally, due to table pagination
    `${kubectl} get ns ${nsName} -w`,
    `${kubectl} get -w=true --watch ns ${nsName} --watch=true -w`
  ]

  watchCmds.forEach((_watchCmd, idx) => {
    const nsNameForIter = `${nsName}-${idx}`
    const watchCmd = _watchCmd.replace(nsName, nsNameForIter)

    it('should reload', () => Common.refresh(this))

    it(`should watch namespaces via ${watchCmd}`, async () => {
      try {
        const waitForOnline = waitForStatus.bind(this, Status.Online, nsNameForIter)
        const waitForOffline = waitForStatus.bind(this, Status.Offline, nsNameForIter)

        console.error('wait for create')
        const createBadge = await waitForOnline(await CLI.command(`${kubectl} create ns ${nsNameForIter}`, this.app))

        console.error('start watching')
        // execute the watch command, and expect ok in repl
        const watchReplResult = await CLI.command(watchCmd, this.app)
        await ReplExpect.justOK(watchReplResult)

        console.error('wait for watcher1')
        await this.app.client.waitForExist(Selectors.WATCHER_N(1))

        console.error('wait for terminalAndWather button')
        await this.app.client.waitForExist(Selectors.TERMINAL_AND_WATCHER_BUTTON)

        console.error('wait for watch title')
        // expect watcher1 has title pod
        await this.app.client.waitForExist(Selectors.WATCHER_N_TITLE(1)) // or watcher1, assert
        const title = await this.app.client.getText(Selectors.WATCHER_N_TITLE(1))
        assert.strictEqual(title, 'Namespace')

        const watchBadge = Selectors.WATCHER_N_GRID_CELL_ONLINE(1, nsNameForIter)
        const watchBadgeButOffline = Selectors.WATCHER_N_GRID_CELL_OFFLINE(1, nsNameForIter)

        console.error('wait for badge online')
        await this.app.client.waitForExist(watchBadge)

        console.error('drilldown from badge')
        await testDrilldown(nsNameForIter, watchBadge, this.app)

        console.error('click showAsTable')
        // click dropdown
        await this.app.client.click(Selectors.WATCHER_N_DROPDOWN(1))
        const showAsTableButton = Selectors.WATCHER_N_SHOW_AS_TABLE(1)
        await this.app.client.waitForVisible(showAsTableButton)

        console.error('wait for table shown in terminal')
        await this.app.client.click(showAsTableButton)
        await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(nsNameForIter) })({
          app: this.app,
          count: watchReplResult.count + 1
        })

        console.error('wait for delete')
        const deleteBadge = await waitForOffline(await CLI.command(`${kubectl} delete ns ${nsNameForIter}`, this.app))

        // the create and delete badges had better still exist
        await this.app.client.waitForExist(createBadge)
        await this.app.client.waitForExist(deleteBadge)

        // the "online" badge from the watch had better *NOT* exist after the delete
        // (i.e. we had better actually be watching!)
        await this.app.client.waitForExist(watchBadge, 20000, true)

        // and, conversely, that watch had better eventually show Offline
        await this.app.client.waitForExist(watchBadgeButOffline)

        // create again
        await waitForOnline(await CLI.command(`${kubectl} create ns ${nsNameForIter}`, this.app))

        // the "online" badge from the watch had better now exist again after the create
        // (i.e. we had better actually be watching!)
        await this.app.client.waitForExist(watchBadge)

        // and, conversely, that watch had better NOT show Offline
        await this.app.client.waitForExist(watchBadgeButOffline, 20000, true)

        // delete again
        await waitForOffline(await CLI.command(`${kubectl} delete ns ${nsNameForIter}`, this.app))

        // the "online" badge from the watch had better *NOT* exist after the delete
        // (i.e. we had better actually be watching!)
        await this.app.client.waitForExist(watchBadge, 20000, true)

        // and, conversely, that watch had better eventually show Offline
        await this.app.client.waitForExist(watchBadgeButOffline)

        await this.app.client.waitForExist(Selectors.WATCHER_N_DROPDOWN(1))
        await this.app.client.click(Selectors.WATCHER_N_DROPDOWN(1))
        await this.app.client.waitForVisible(Selectors.WATCHER_N_CLOSE(1))
        await this.app.client.click(Selectors.WATCHER_N_CLOSE(1))
        await this.app.client.waitForExist(Selectors.WATCHER_N(1), 500, true)
      } catch (err) {
        await Common.oops(this, false)(err)
      }
    })
  })
}

const synonyms = ['kubectl']

describe(`kubectl watch namespace ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

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
