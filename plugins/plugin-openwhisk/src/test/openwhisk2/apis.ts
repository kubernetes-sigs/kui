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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, sidecar } = ui
const { rp } = common

describe('Create api gateway', function(this: common.ISuite) {
  if (process.env.NO_OPENWHISK_API_MGMT) {
    console.log('Skipping OpenWhisk API management tests')
    return
  }

  before(openwhisk.before(this))
  after(common.after(this))

  it('should fail to create the api for a non-existent action', () =>
    cli
      .do(`wsk api create /hello /world get echo`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this)))

  it('should create an echo action', () =>
    cli
      .do(`let echo = x=>x`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('echo'))
      .catch(common.oops(this)))

  it('should fail to create the api for a non-web-action', () =>
    cli
      .do(`wsk api create /hello /world get echo`, this.app)
      .then(cli.expectError(412))
      .catch(common.oops(this)))

  it('should webbify the action', () =>
    cli
      .do(`webbify`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('echo'))
      .catch(common.oops(this)))

  it('should create the api', () =>
    cli
      .do(`wsk api create /hello /world get echo`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('echo'))
      .catch(common.oops(this)))

  it('should list and invoke the api', () =>
    cli
      .do(`wsk api list`, this.app)
      .then(res =>
        cli
          .expectOKWithOnly('/hello/world')(res)
          .then(() => res.count)
          .then(N =>
            this.app.client.getAttribute(
              `${ui.selectors.LIST_RESULTS_N(N)} [data-key="url"]`,
              'data-value'
            )
          )
      )

      .then(_href => {
        if (_href === null) {
          throw new Error('href attribute not found')
        } else {
          const x = _href as string // typescript weirdness https://github.com/Microsoft/TypeScript/issues/14889
          const href = x.replace(
            /(http:\/\/)?172\.17\.0\.1/,
            ui.apiHost.replace(/http(s)?:\/\//, '')
          )
          if (!href.startsWith('http')) {
            return `http://${href}`
          } else {
            return href
          }
        }
      })
      .then(href => {
        console.error('api href', href)
        return href
      })

      .then(href => rp({ url: `${href}?foo=bar`, rejectUnauthorized: false }))
      .then(ui.expectSubset({ foo: 'bar' }))
      .catch(common.oops(this)))
})
