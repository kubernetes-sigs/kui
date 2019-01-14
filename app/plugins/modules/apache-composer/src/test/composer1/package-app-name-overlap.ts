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

import { ISuite } from '@test/lib/common'
import { join } from 'path'
const ROOT = process.env.TEST_ROOT
const common = require(join(ROOT, 'lib/common'))
const openwhisk = require(join(ROOT, 'lib/openwhisk/openwhisk'))
const ui = require(join(ROOT, 'lib/ui'))
// sharedURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
const cli = ui.cli
const sidecar = ui.sidecar

describe('app create where app name is also a package name', function (this: ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should create a package named foo', () => cli.do('wsk package create foo', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should create an app named foo in package foo', () => cli.do('app create foo/foo @demos/hello.js', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should app get mo expecting 409', () => cli.do('app get foo', this.app)
    .then(cli.expectError(409))
    .catch(common.oops(this)))

  it('should app get /_/mo expecting 409', () => cli.do('app get /_/foo', this.app)
    .then(cli.expectError(409))
    .catch(common.oops(this)))

  it('should app list then click on foo/foo', () => cli.do('app list', this.app)
    .then(cli.expectOKWithCustom({ selector: '.entity[data-name="foo"][data-package-name="foo"] .entity-name.clickable', passthrough: true }))
    .then(ui.selectors.OUTPUT_N)
    .then(selector => this.app.client.click(selector))
    .then(() => this.app)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo', undefined, undefined, 'foo'))
    .catch(common.oops(this)))
})
