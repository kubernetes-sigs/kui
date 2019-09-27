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

import { Common, CLI, ReplExpect } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

describe('composer config', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  /** app config */
  const getConfig = cmd =>
    it(`should show app configuration via "${cmd}"`, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.okWithCustom({ expect: 'Composer version' }))
        .catch(Common.oops(this)))

  getConfig('wsk app properties')
  getConfig('wsk app props')
  getConfig('wsk app config')
})
