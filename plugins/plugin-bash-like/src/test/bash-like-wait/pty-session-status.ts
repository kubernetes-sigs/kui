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

import { ISuite, before as commonBefore, after as commonAfter, oops } from '@kui-shell/core/tests/lib/common'

import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli } = ui

import { readFile } from 'fs-extra'
import { execSync } from 'child_process'

/** skip the tests if we aren't doing a webpack+proxy test run */
const runTheTests = process.env.MOCHA_RUN_TARGET === 'webpack' && process.env.KUI_USE_PROXY === 'true'
const pit = runTheTests ? it : xit

/** the proxy should come back online within 10 seconds; add some slop */
const timeItTakesForProxyToComeBack = 30000

describe('pty session status offline after start', function(this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  pit('should echo hi', () =>
    cli
      .do('echo hi', this.app)
      .then(cli.expectOKWithString('hi'))
      .catch(oops(this))
  )

  pit('should not be showing an offline indicator', () => {
    return this.app.client.waitForExist('.kui--plugin-bash-like--pty-offline-indicator', 5000, true).catch(oops(this))
  })

  pit('should kill the proxy and show an offline indicator', async () => {
    try {
      const proxyPid = (await readFile('/tmp/kuiproxy.pid')).toString()
      execSync(`kill -HUP ${proxyPid}`)

      await this.app.client.waitForExist('.kui--plugin-bash-like--pty-offline-indicator')
      await this.app.client.waitForExist(
        '.kui--plugin-bash-like--pty-offline-indicator',
        timeItTakesForProxyToComeBack,
        true
      )
    } catch (err) {
      oops(this)(err)
    }
  })
})

describe('pty session status offline at start', function(this: ISuite) {
  before(
    commonBefore(this, {
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
  after(commonAfter(this))

  // we expect the offline indicator initially
  pit('should be showing an offline indicator at startup because we killed the proxy', () => {
    return this.app.client.waitForExist('.kui--plugin-bash-like--pty-offline-indicator').catch(oops(this, true))
  })

  // but we also expect it to go away eventually
  pit('should eventually not show an offline indicator', async () => {
    try {
      await this.app.client.waitForExist('.kui--plugin-bash-like--pty-offline-indicator', 20000, true)

      await ui.cli.waitForRepl(this.app)
    } catch {
      await oops(this, true)
    }
  })

  pit('should be not showing an offline indicator at startup because the proxy auto-restarts', () => {
    // then it should come back online within 10 seconds; add a few seconds of slop
    return this.app.client
      .waitForExist('.kui--plugin-bash-like--pty-offline-indicator', timeItTakesForProxyToComeBack, true)
      .catch(oops(this, true))
  })

  pit('should cd to the test dir', () =>
    cli
      .do(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(cli.expectOKWithString('packages/test'))
      .catch(oops(this, true))
  )

  pit('should ls now that the proxy is online', () =>
    cli
      .do('ls ../..', this.app)
      .then(cli.expectOKWith('package.json'))
      .catch(oops(this, true))
  )

  pit('should echo hi now that the proxy is online', () =>
    cli
      .do('echo hi', this.app)
      .then(cli.expectOKWithString('hi'))
      .catch(oops(this, true))
  )
})
