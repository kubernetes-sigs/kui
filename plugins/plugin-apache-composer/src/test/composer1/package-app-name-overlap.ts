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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

// sharedURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

describe('app create where app name is also a package name', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create a package named foo', () =>
    CLI.command('wsk package create foo', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should create an app named foo in package foo', () =>
    CLI.command('wsk app create foo/foo @demos/hello.js', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should app get mo expecting 409', () =>
    CLI.command('wsk app get foo', this.app)
      .then(ReplExpect.error(409))
      .catch(Common.oops(this)))

  it('should app get /_/mo expecting 409', () =>
    CLI.command('wsk app get /_/foo', this.app)
      .then(ReplExpect.error(409))
      .catch(Common.oops(this)))

  it('should app list then click on foo/foo', () =>
    CLI.command('wsk app list', this.app)
      .then(
        ReplExpect.okWithCustom({
          selector: '.entity[data-name="foo"][data-package-name="foo"] .entity-name.clickable',
          passthrough: true
        })
      )
      .then(Selectors.OUTPUT_N)
      .then(selector => this.app.client.click(selector))
      .then(() => this.app)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo', undefined, undefined, 'foo'))
      .catch(Common.oops(this)))
})
