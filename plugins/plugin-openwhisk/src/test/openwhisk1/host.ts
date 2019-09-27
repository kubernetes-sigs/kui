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

import { Common, CLI, ReplExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

describe('openwhisk host tests', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should command not found on hosts set', () =>
    CLI.command('wsk hosts set', this.app)
      .then(ReplExpect.error(404, 'Command not found'))
      .catch(Common.oops(this)))

  it('bogus host from default context', () =>
    CLI.command(`wsk host set xxx`, this.app).then(
      ReplExpect.okWithCustom({
        selector: '',
        expect: `Before you can proceed, please provide an OpenWhisk auth key, using wsk auth add <AUTH_KEY>`
      })
    ))

  // clicking on the host in the upper right prefills some content;
  // if the user hits return, we want the operation to be cancelled
  // see shell issue #192
  it('should auto-cancel when using prefilled content', () =>
    CLI.command(`wsk host set <your_api_host>`, this.app).then(ReplExpect.error(0, 'Operation cancelled')))

  it(`should restore host to original setting: ${openwhisk.apihost}`, () =>
    CLI.command(`wsk host set ${openwhisk.apihost}`, this.app)
      .then(ReplExpect.ok)
      .then(() => CLI.command('wsk host get', this.app))
      .then(ReplExpect.okWithCustom({ expect: openwhisk.apihost }))
      .catch(Common.oops(this)))
})
