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

/**
 * This is a sample plugin test.
 *
 */

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, sidecar } = ui

describe('sample plugin', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should open sidecar', () => cli.do(`sample sidecar`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .catch(common.oops(this)))

  it('should show hello', () => cli.do(`sample hello`, this.app)
    .then(cli.expectOKWithString('hello world'))
    .then(sidecar.expectOpen)
    .catch(common.oops(this)))

  it('should create an echo action', () => cli.do(`sample create action`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('echo'))
    .catch(common.oops(this)))
})
