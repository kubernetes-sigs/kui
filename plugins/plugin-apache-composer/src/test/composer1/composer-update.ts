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

import * as common from '@kui-shell/core/tests/lib/common'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import * as ui from '@kui-shell/core/tests/lib/ui'

import { dirname } from 'path'
const cli = ui.cli
const sidecar = ui.sidecar
const appName1 = 'foo1'
const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

describe('confirm that app update preserves annotations and parameters', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  /* {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => cli.do(cmd, this.app)
            .then(cli.expectOKWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(common.oops(this)))
    } */

  it('should create an app', () =>
    cli
      .do(`wsk app create ${appName1} ${ROOT}/data/composer/composer-source/if.js`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(appName1))
      .catch(common.oops(this)))

  it('should webbify the app', () =>
    cli
      .do(`webbify ${appName1}`, this.app)
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(appName1))
      .then(() => this.app.client.getText(`${ui.selectors.SIDECAR} .entity-web-export-url.has-url`))
      .catch(common.oops(this)))

  it('should update an app', () =>
    cli
      .do(`wsk app update ${appName1} ${ROOT}/data/composer/composer-source/if.js`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(appName1))
      // .then(() => this.app.client.getText(`${ui.selectors.SIDECAR} .entity-web-export-url.has-url`)) // TODO
      .catch(common.oops(this)))
})
