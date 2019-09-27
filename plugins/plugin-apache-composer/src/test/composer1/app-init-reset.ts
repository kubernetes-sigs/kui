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

import { Common } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
// sharedURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

/**
 * Here starts the test
 *
 */
describe('app init --reset', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  /** app config; v1 validates the redis URL; v2 validates the type (private versus shared) */
  // const assertConfig = (v1, v2) => it(`should show valid app configuration`, () => CLI.command('wsk app config', this.app)
  //   .then(ReplExpect.okWithCustom({ selector: 'code' })) // extract the JSON bit
  //   .then(selector => this.app.client.getText(selector))
  //   .then(ui.expectSubset({ redis: v1, type: v2 })) // validate redis and type fields, using the provided validators
  //   .catch(Common.oops(this)))

  /* {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => CLI.command(cmd, this.app)
            .then(ReplExpect.okWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(Common.oops(this)))
    }
    assertConfig(is(sharedURL), is('url')) */

  /* {
        const cmd = 'app init --reset --auto'
        it(`should ${cmd}`, () => CLI.command(cmd, this.app)
            .then(ReplExpect.okWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(Common.oops(this)))

    }

    assertConfig(isNot(sharedURL), is('private')) */
})
