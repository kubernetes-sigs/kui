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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const appName1 = 'foo1'
const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

describe('confirm that app update preserves annotations and parameters', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  /* {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => CLI.command(cmd, this.app)
            .then(ReplExpect.okWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(Common.oops(this)))
    } */

  it('should create an app', () =>
    CLI.command(`wsk app create ${appName1} ${ROOT}/data/composer/composer-source/if.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(appName1))
      .catch(Common.oops(this)))

  it('should webbify the app', () =>
    CLI.command(`wsk action webbify ${appName1}`, this.app)
      .then(ReplExpect.okWithCustom({ selector: '.entity-web-export-url' }))
      .then(() => this.app)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(appName1))
      .then(() => this.app.client.getText(`${Selectors.SIDECAR} .entity-web-export-url.has-url`))
      .catch(Common.oops(this)))

  it('should update an app', () =>
    CLI.command(`wsk app update ${appName1} ${ROOT}/data/composer/composer-source/if.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(appName1))
      // .then(() => this.app.client.getText(`${Selectors.SIDECAR} .entity-web-export-url.has-url`)) // TODO
      .catch(Common.oops(this)))
})
