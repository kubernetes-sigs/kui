/*
 * Copyright 2017 IBM Corporation
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

/**
 * A simple test to verify a visible window is opened with a title
 *
 */

import * as assert from 'assert'

import { ISuite } from '@test/lib/common'
import * as common from '@test/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@test/lib/ui'
import * as openwhisk from '@test/lib/openwhisk/openwhisk'
const { cli, sidecar } = ui

const { validateNamespace, expectedNamespace } = ui

const API_HOST = process.env.API_HOST || 'openwhisk.ng.bluemix.net'
const APP_TITLE = process.env.APP_TITLE || 'Kui Shell'
// const CLI_PLACEHOLDER = process.env.CLI_PLACEHOLDER || 'enter your command'

const selectors = {
  APIHOST: '#openwhisk-api-host',
  NAMESPACE: '#openwhisk-namespace'
}

describe('openwhisk namespace display', function (this: ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('execute wsk namespace current', () => {
    return cli.do('wsk namespace current', this.app)
      .then(cli.expectOKWithString(expectedNamespace()))
      .catch(common.oops(this))
  })

  it('has a well-formed apihost', () => {
    return this.app.client.waitUntil(async () => {
      const apihost = await this.app.client.getHTML(selectors.APIHOST, false)
      return apihost.toLowerCase().replace(/^http[s]?:\/\//, '') === API_HOST.toLowerCase().replace(/^http[s]?:\/\//, '')
    })
      .catch(common.oops(this))
  })

  it('has a well-formed namespace', () => {
    return this.app.client.waitUntil(async () => {
      const namespace = await this.app.client.getHTML(selectors.NAMESPACE, false)
      try {
        validateNamespace(namespace)
        return true
      } catch (err) {
        return false
      }
    })
      .catch(common.oops(this))
  })
})
