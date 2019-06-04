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
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import * as assert from 'assert'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, selectors, sidecar } = ui

describe('host tests', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should command not found on hosts set', () => cli.do('wsk hosts set', this.app)
    .then(cli.expectError(404, 'Command not found'))
    .catch(common.oops(this)))

  it('bogus host from default context', () => cli.do(`wsk host set xxx`, this.app)
    .then(cli.expectOKWithCustom({ selector: '', expect: `Before you can proceed, please provide an OpenWhisk auth key, using wsk auth add <AUTH_KEY>` })))

  // clicking on the host in the upper right prefills some content;
  // if the user hits return, we want the operation to be cancelled
  // see shell issue #192
  it('should auto-cancel when using prefilled content', () => cli.do(`wsk host set <your_api_host>`, this.app)
    .then(cli.expectError(0, 'Operation cancelled')))

  /* const { apihostIsLocal } = openwhisk
  const apihost = apihostIsLocal && process.env.MOCHA_RUN_TARGET !== 'webpack' ? 'local' : openwhisk.apihost // NOTE: 'wsk host set local' doesn't work in webpack for now
  it(`should restore host to original setting: ${openwhisk.apihost}`, () => cli.do(`wsk host set ${apihost}`, this.app)
    .then(cli.expectOK)
    .then(() => cli.do('wsk host get', this.app))
    .then(cli.expectOKWithCustom({ expect: openwhisk.apihost }))
    .catch(common.oops(this))) */
})
