/*
 * Copyright 2019 The Kubernetes Authors
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

import { Common, ReplExpect, CLI as headfullCLI } from '@kui-shell/test'
import { cli as headlessCLI } from '@kui-shell/core/tests/lib/headless'

const isHeadless = process.env.MOCHA_RUN_TARGET === 'headless'

describe('bash-like host catchall', function (this: Common.ISuite) {
  before(Common.before(this, { noApp: isHeadless }))
  if (!isHeadless) {
    after(Common.after(this))
  }

  if (isHeadless) {
    it('should show some output for host google.com in headless mode', () =>
      headlessCLI.command('host google.com').then(headlessCLI.expectOK('has address')).catch(Common.oops(this)))
  } else {
    it('should show some output for host google.com in non-headless mode', () =>
      headfullCLI
        .command('host google.com', this.app)
        .then(ReplExpect.okWithPtyOutput('has address'))
        .catch(Common.oops(this)))
  }
})
