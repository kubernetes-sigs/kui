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

import { ISuite } from '../../../../../../../tests/lib/common'
import * as common from '../../../../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

describe('Change shell directory via lcd', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should execute lcd data', () => cli.do(`lcd data`, this.app)
    .then(cli.expectJustOK))

  it('should create an action in the data directory', () => cli.do(`action create long openwhisk/long.js`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('long'))
    .catch(common.oops(this)))

  it('should execute lcd - to change to previous dir', () => cli.do(`lcd -`, this.app)
    .then(cli.expectJustOK))

  // now we should be able to change back to data and re-do the action create
  it('should execute lcd data', () => cli.do(`lcd data`, this.app)
    .then(cli.expectJustOK))

  it('should create an action in the data directory', () => cli.do(`action create long2 openwhisk/long.js`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('long2'))
    .catch(common.oops(this)))

  it('should execute lcd without arguments', () => cli.do(`lcd`, this.app)
    .then(cli.expectJustOK))
})
