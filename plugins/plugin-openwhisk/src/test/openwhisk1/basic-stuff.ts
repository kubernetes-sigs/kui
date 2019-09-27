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

import { Common, CLI, ReplExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const API_HOST = process.env.API_HOST
// const APP_TITLE = process.env.APP_TITLE || 'Kui Shell'
// const CLI_PLACEHOLDER = process.env.CLI_PLACEHOLDER || 'enter your command'

const selectors = {
  APIHOST: '#openwhisk-api-host',
  NAMESPACE: '#openwhisk-namespace'
}

describe('openwhisk namespace display', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('execute wsk namespace current', () => {
    return CLI.command('wsk namespace current', this.app)
      .then(ReplExpect.okWithString(openwhisk.expectedNamespace()))
      .catch(Common.oops(this))
  })

  it('has a well-formed apihost', () => {
    return this.app.client
      .waitUntil(async () => {
        const apihost = await this.app.client.getHTML(selectors.APIHOST, false)
        return (
          apihost.toLowerCase().replace(/^http[s]?:\/\//, '') === API_HOST.toLowerCase().replace(/^http[s]?:\/\//, '')
        )
      })
      .catch(Common.oops(this))
  })

  it('has a well-formed namespace', () => {
    return this.app.client
      .waitUntil(async () => {
        const namespace = await this.app.client.getHTML(selectors.NAMESPACE, false)
        try {
          openwhisk.validateNamespace(namespace)
          return true
        } catch (err) {
          return false
        }
      })
      .catch(Common.oops(this))
  })
})
