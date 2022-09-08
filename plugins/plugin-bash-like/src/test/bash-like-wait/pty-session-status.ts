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

import { Common, CLI, ReplExpect } from '@kui-shell/test'

import { readFile } from 'fs-extra'
import { execSync } from 'child_process'

/** skip the tests if we aren't doing a webpack+proxy test run */
const runTheTests = process.env.MOCHA_RUN_TARGET === 'webpack' && process.env.KUI_USE_PROXY === 'true'
const pit = runTheTests ? it : xit

/** the proxy should come back online within 10 seconds; add some slop */
const timeItTakesForProxyToComeBack = 30000

describe('pty session status offline after start', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  pit('should echo hi', () =>
    CLI.command('echo hi', this.app).then(ReplExpect.okWithPtyOutput('hi')).catch(Common.oops(this, true))
  )

  pit('should not be showing an offline indicator', () => {
    return this.app.client
      .$('#kui--plugin-bash-like--pty-offline-indicator')
      .then(_ => _.waitForExist({ timeout: 5000, reverse: true }))
      .catch(Common.oops(this, true))
  })

  pit('should kill the proxy and show an offline indicator', async () => {
    try {
      const proxyPid = (await readFile('/tmp/kuiproxy.pid')).toString()
      execSync(`kill -HUP ${proxyPid}`)

      await this.app.client.$('#kui--plugin-bash-like--pty-offline-indicator').then(_ => _.waitForExist())
      await this.app.client.$('#kui--plugin-bash-like--pty-offline-indicator').then(_ =>
        _.waitForExist({
          timeout: timeItTakesForProxyToComeBack,
          reverse: true
        })
      )
    } catch (err) {
      Common.oops(this)(err)
    }
  })
})

describe('pty session status offline at start', function (this: Common.ISuite) {
  before(
    Common.before(this, {
      noProxySessionWait: true, // because we expect it to be offline at startup
      beforeStart: async () => {
        if (runTheTests) {
          console.log('killing the proxy')
          const proxyPid = (await readFile('/tmp/kuiproxy.pid')).toString()
          execSync(`kill -HUP ${proxyPid}`)

          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    })
  )
  after(Common.after(this))

  // we expect the offline indicator initially
  pit('should be showing an offline indicator at startup because we killed the proxy', () => {
    return this.app.client
      .$('#kui--plugin-bash-like--pty-offline-indicator')
      .then(_ => _.waitForExist())
      .catch(Common.oops(this, true))
  })

  // but we also expect it to go away eventually
  pit('should eventually not show an offline indicator', async () => {
    try {
      await this.app.client
        .$('#kui--plugin-bash-like--pty-offline-indicator')
        .then(_ => _.waitForExist({ timeout: 20000, reverse: true }))

      await CLI.waitForRepl(this.app)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  pit('should be not showing an offline indicator at startup because the proxy auto-restarts', () => {
    // then it should come back online within 10 seconds; add a few seconds of slop
    return this.app.client
      .$('#kui--plugin-bash-like--pty-offline-indicator')
      .then(_ => _.waitForExist({ timeout: timeItTakesForProxyToComeBack, reverse: true }))
      .catch(Common.oops(this, true))
  })

  pit('should cd to the test dir', () =>
    CLI.command(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(ReplExpect.okWithString('packages/test'))
      .catch(Common.oops(this, true))
  )

  pit('should ls now that the proxy is online', () =>
    CLI.command('ls -l ../..', this.app).then(ReplExpect.okWith('package.json')).catch(Common.oops(this, true))
  )

  pit('should echo hi now that the proxy is online', () =>
    CLI.command('echo hi', this.app).then(ReplExpect.okWithPtyOutput('hi')).catch(Common.oops(this, true))
  )
})
