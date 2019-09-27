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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const { rp } = openwhisk

describe('Create api gateway', function(this: Common.ISuite) {
  if (process.env.NO_OPENWHISK_API_MGMT) {
    console.log('Skipping OpenWhisk API management tests')
    return
  }

  before(openwhisk.before(this))
  after(Common.after(this))

  it('should fail to create the api for a non-existent action', () =>
    CLI.command(`wsk api create /hello /world get echo`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))

  it('should create an echo action', () =>
    CLI.command(`let echo = x=>x`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('echo'))
      .catch(Common.oops(this)))

  it('should fail to create the api for a non-web-action', () =>
    CLI.command(`wsk api create /hello /world get echo`, this.app)
      .then(ReplExpect.error(412))
      .catch(Common.oops(this)))

  it('should webbify the action', () =>
    CLI.command(`webbify`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('echo'))
      .catch(Common.oops(this)))

  it('should create the api', () =>
    CLI.command(`wsk api create /hello /world get echo`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('echo'))
      .catch(Common.oops(this)))

  it('should list and invoke the api', () =>
    CLI.command(`wsk api list`, this.app)
      .then(res =>
        ReplExpect.okWithOnly('/hello/world')(res)
          .then(() => res.count)
          .then(N => this.app.client.getAttribute(`${Selectors.LIST_RESULTS_N(N)} [data-key="url"]`, 'data-value'))
      )

      .then(_href => {
        if (_href === null) {
          throw new Error('href attribute not found')
        } else {
          const apiHost = process.env.API_HOST
          const x = _href as string // typescript weirdness https://github.com/Microsoft/TypeScript/issues/14889
          const href = x.replace(/(http:\/\/)?172\.17\.0\.1/, apiHost.replace(/http(s)?:\/\//, ''))
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
      .then(Util.expectSubset({ foo: 'bar' }))
      .catch(Common.oops(this)))
})
