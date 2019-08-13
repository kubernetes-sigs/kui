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

import * as common from '@kui-shell/core/tests/lib/common'
import { cli as headfullCLI } from '@kui-shell/core/tests/lib/ui'
import { cli as headlessCLI } from '@kui-shell/core/tests/lib/headless'

const isHeadless = process.env.MOCHA_RUN_TARGET === 'headless'

describe('bash-like host catchall', function(this: common.ISuite) {
  before(common.before(this, { noApp: isHeadless }))
  if (!isHeadless) {
    after(common.after(this))
  }

  if (isHeadless) {
    it('should show some output for host google.com in headless mode', () =>
      headlessCLI
        .do('host google.com')
        .then(headlessCLI.expectOK('has address'))
        .catch(common.oops(this)))
  } else {
    it('should show some output for host google.com in non-headless mode', () =>
      headfullCLI
        .do('host google.com', this.app)
        .then(headfullCLI.expectOKWithString('has address'))
        .catch(common.oops(this)))
  }
})
