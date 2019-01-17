/*
 * Copyright 2018 IBM Corporation
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

import * as common from '@test/lib/common'
import * as ui from '@test/lib/ui'
import * as openwhisk from '@test/lib/openwhisk/openwhisk'
const { cli, selectors, sidecar } = ui
const { rp } = common

describe('Create api gateway', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should fail to create the api for a non-existent action', () => cli.do(`wsk api create /hello /world get echo`, this.app)
    .then(cli.expectError(404))
    .catch(common.oops(this)))

  it('should create an echo action', () => cli.do(`let echo = x=>x`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('echo'))
    .catch(common.oops(this)))

  it('should fail to create the api for a non-web-action', () => cli.do(`wsk api create /hello /world get echo`, this.app)
    .then(cli.expectError(412))
    .catch(common.oops(this)))

  it('should webbify the action', () => cli.do(`webbify`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('echo'))
    .catch(common.oops(this)))

  it('should create the api', () => cli.do(`wsk api create /hello /world get echo`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('echo'))
    .catch(common.oops(this)))

  it('should list and invoke the api', () => cli.do(`wsk api list`, this.app)
    .then(res => cli.expectOKWithOnly('/hello/world')(res)
      .then(() => res.count)
      .then(N => this.app.client.getAttribute(`${ui.selectors.LIST_RESULTS_N(N)} [data-key="url"]`, 'data-value')))

    // for localhost openwhisk, we have to make sure that the href is of the form http://${apihost}/...
    .then(href => href.replace(/(http:\/\/)?172\.17\.0\.1/, ui.apiHost.replace(/http(s)?:\/\//, '')))
    .then(href => {
      if (!href.startsWith('http')) {
        return `http://${href}`
      } else {
        return href
      }
    })
    .then(href => { console.error('api href', href); return href })

    .then(href => rp({ url: `${href}?foo=bar`, rejectUnauthorized: false }))
    .then(ui.expectSubset({ foo: 'bar' }))
    .catch(common.oops(this)))
})
