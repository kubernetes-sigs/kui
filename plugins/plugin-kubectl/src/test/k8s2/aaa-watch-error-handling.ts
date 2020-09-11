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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'
import { createNS, waitForGreen, waitForRed, defaultModeForGet } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const wdescribe = process.env.USE_WATCH_PANE ? describe : xdescribe

wdescribe(`kubectl watch error handler via watch pane ${process.env.MOCHA_RUN_TARGET || ''}`, function(
  this: Common.ISuite
) {
  before(Common.before(this))
  after(Common.after(this))

  const testResourceNotFound = (watchCmd: string, resourceType: string, resourceName: string) => {
    const errorMessage = `Error from server (NotFound): ${resourceType} "${resourceName}" not found`

    it(`should error out when watching a non-existent ${resourceType}`, () => {
      return CLI.command(watchCmd, this.app)
        .then(ReplExpect.error(404, errorMessage))
        .catch(Common.oops(this, true))
    })
  }

  const testWrongCommand = (watchCmd: string, code: number, errMessage?: string) => {
    it(`should error out with wrong command ${watchCmd}`, () => {
      return CLI.command(watchCmd, this.app)
        .then(errMessage ? ReplExpect.error(code, errMessage) : ReplExpect.error(code))
        .catch(Common.oops(this, true))
    })
  }

  // here comes the tests that expect failure due to non-existent resources
  const flags = ['-w', '--watch=true', '-w -w -w']
  flags.forEach(watch => {
    testResourceNotFound(`k get ns shouldNotExist ${watch}`, 'namespaces', 'shouldNotExist')
    testResourceNotFound(`k get ns ${watch} shouldNotExist`, 'namespaces', 'shouldNotExist')

    testResourceNotFound(`k get pod shouldNotExist ${watch}`, 'pods', 'shouldNotExist')
    testResourceNotFound(`k get ${watch} pod shouldNotExist`, 'pods', 'shouldNotExist')

    testResourceNotFound(`k get pods shouldNotExist -n shouldNotExist ${watch}`, 'namespaces', 'shouldNotExist')
  })

  // here comes the tests that expect failure due to wrong flag
  const wrongFlags = ['--watch true', '-w true']
  wrongFlags.forEach(watch => {
    testResourceNotFound(`k get pod ${watch}`, 'pods', 'true') // the command is parsed as `kubectl get pod true`
    testWrongCommand(`k get ${watch} pod`, 404, 'error: the server doesn\'t have a resource type "true"') // the command is parsed as `kubectl get true pod`
  })

  testWrongCommand(`k -w get pod`, 500)

  // test wrong resource type
  testWrongCommand(`k get shouldNotExist -w`, 404, 'error: the server doesn\'t have a resource type "shouldNotExist"')
  testWrongCommand(
    `k get shouldNotExist --watch -n shouldNotExist`,
    404,
    'error: the server doesn\'t have a resource type "shouldNotExist"'
  )

  // here comes the tests should start watching successfully
  const ns = createNS()
  const NUM_PIN = 4

  /** create a pod */
  const createPod = () => {
    return CLI.command(
      `k create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`,
      this.app
    )
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
      .then(status => waitForGreen(this.app, status))
  }

  /** delete the pod */
  const deletePod = () => {
    return CLI.command(`k delete pods nginx -n ${ns}`, this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
      .then(status => waitForRed(this.app, status))
  }

  /** wait for the pod */
  const watchPod = async (splitCount: number) => {
    // start to watch pods in a non-existent namespace
    const res = await CLI.command(`k get pods -w -n ${ns}`, this.app)
    await ReplExpect.okWithString('Output has been pinned to a watch pane')(res)
    await ReplExpect.splitCount(splitCount)(this.app)
    return res.count
  }

  const resultHasEmptyWatchText = async (count: number, positive = true) => {
    await this.app.client.waitForExist(Selectors.SPLIT_N_OUTPUT(count), CLI.waitTimeout)

    await this.app.client.waitUntil(async () => {
      const emptyWatchText = await this.app.client.getText(Selectors.SPLIT_N_OUTPUT(count))
      if (positive) {
        return emptyWatchText.includes('No resources')
      } else {
        return !emptyWatchText.includes('No resources')
      }
    }, CLI.waitTimeout)
  }

  it('should reload', () => Common.refresh(this))

  it(`should watch pods, starting from an non-existent namespace`, async () => {
    try {
      console.error('watch from non-existent namespace 0')
      // start to watch pods in a non-existent namespace
      await CLI.command(`k get pods -w -n ${ns}`, this.app)

      // the empty watch table should be pinned and show 'No resources'
      await resultHasEmptyWatchText(2)

      console.error('watch from non-existent namespace 1')
      // create the namespace
      await CLI.command(`k create ns ${ns}`, this.app)
        .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(ns) }))
        .then(status => waitForGreen(this.app, status))

      console.error('watch from non-existent namespace 2')
      await createPod()

      console.error('watch from non-existent namespace 3')

      // the watch table should have the new pods with online status, and 'No resources' should go away
      await this.app.client.waitForExist(Selectors.CURRENT_GRID_BY_NAME_FOR_SPLIT(2, 'nginx'))

      console.error('watch from non-existent namespace 3.5')
      await this.app.client.waitForExist(Selectors.CURRENT_GRID_ONLINE_FOR_SPLIT(2, 'nginx'))

      console.error('watch from non-existent namespace 4')
      await resultHasEmptyWatchText(2, false)

      await deletePod()

      console.error('watch from non-existent namespace 5')
      // the watch table should have the new pods with offline status
      await this.app.client.waitForExist(Selectors.CURRENT_GRID_OFFLINE_FOR_SPLIT(2, 'nginx'), CLI.waitTimeout)

      console.error('watch from non-existent namespace 6')
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should reload', () => Common.refresh(this))

  it('should watch pods and hit the maximum limit of pinned views', async () => {
    try {
      await createPod()

      // open three watchers
      await watchPod(NUM_PIN)
      await watchPod(NUM_PIN)
      await watchPod(NUM_PIN)

      // fail on the fourth watcher
      await CLI.command(`k get pods -w -n ${ns}`, this.app)
        .then(
          ReplExpect.error(
            500,
            'You have reached the maximum number of pinned views. Consider either closing one, or re-executing the command in a new tab.'
          )
        )
        .then(() => ReplExpect.splitCount(NUM_PIN)(this.app))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  // continue the last test
  it('should exit terminal when three watcher panes are active', async () => {
    try {
      await CLI.command('exit', this.app)

      // still have four splits
      await ReplExpect.splitCount(NUM_PIN)(this.app)

      // still watching
      await this.app.client.waitForExist(Selectors.CURRENT_GRID_BY_NAME_FOR_SPLIT(2, 'nginx'))
      await this.app.client.waitForExist(Selectors.CURRENT_GRID_BY_NAME_FOR_SPLIT(3, 'nginx'))
      await this.app.client.waitForExist(Selectors.CURRENT_GRID_BY_NAME_FOR_SPLIT(4, 'nginx'))

      // unpin the watcher
      await this.app.client.click(Selectors.SPLIT_N_MENU(4))
      await this.app.client.waitForVisible(Selectors.BLOCK_UNPIN_BUTTON)
      await this.app.client.click(Selectors.BLOCK_UNPIN_BUTTON)

      await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') })({ app: this.app, count: 0 })

      await deletePod()

      // the watch table should have the new pods with offline status
      const watchStatus = `${Selectors.OUTPUT_N(1)} ${Selectors.BY_NAME('nginx')}`
      await this.app.client.waitForExist(watchStatus, CLI.waitTimeout)
      await waitForRed(this.app, watchStatus)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should reload', () => Common.refresh(this))

  // continue the last test
  it('should open sidecar via watch pane, and click the sidecar title to pexec in terminal', async () => {
    try {
      await createPod()
      const N = await watchPod(NUM_PIN)

      // click grid to open sidecar
      await this.app.client.click(Selectors.CURRENT_GRID_BY_NAME_FOR_SPLIT(2, 'nginx'))

      await SidecarExpect.open(this.app)
        .then(SidecarExpect.mode(defaultModeForGet))
        .then(SidecarExpect.showing('nginx'))

      // click sidecar title: nginx
      await this.app.client.click(Selectors.SIDECAR_TITLE)
      await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') })({ app: this.app, count: N + 1 })

      // still have four splits
      await ReplExpect.splitCount(NUM_PIN)(this.app)

      // still watching
      await this.app.client.waitForExist(Selectors.CURRENT_GRID_BY_NAME_FOR_SPLIT(2, 'nginx'))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should reload', () => Common.refresh(this))

  it('should watch pod, remove the original block and unpin the watcher', async () => {
    try {
      const N = await watchPod(NUM_PIN)

      // remove the original block
      this.app.client.click(Selectors.PROMPT_BLOCK_MENU(N))
      await this.app.client.waitForVisible(Selectors.BLOCK_REMOVE_BUTTON(N))
      this.app.client.click(Selectors.BLOCK_REMOVE_BUTTON(N))

      // unpin the last watcher
      await this.app.client.click(Selectors.SPLIT_N_MENU(2))
      await this.app.client.waitForVisible(Selectors.BLOCK_UNPIN_BUTTON)
      await this.app.client.click(Selectors.BLOCK_UNPIN_BUTTON)
      await this.app.client.waitForExist(Selectors.CURRENT_GRID_BY_NAME_FOR_SPLIT(2, 'nginx'), 500, true)

      // should have the third output
      await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') })({ app: this.app, count: N })
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  // continue the last test
  it('should watch pod and close the pod watcher', async () => {
    try {
      await watchPod(NUM_PIN)

      await this.app.client.click(Selectors.SPLIT_N_MENU(2))
      await this.app.client.waitForVisible(Selectors.WATCHER_CLOSE_BUTTON(2))
      await this.app.client.click(Selectors.WATCHER_CLOSE_BUTTON(2))

      // should only have one split when sidecar open
      await ReplExpect.splitCount(1)(this.app)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should delete the namespace', () =>
    CLI.command(`k delete ns ${ns}`, this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(ns) }))
      .then(nsStatus => waitForRed(this.app, nsStatus))
      .catch(Common.oops(this, true)))
})
