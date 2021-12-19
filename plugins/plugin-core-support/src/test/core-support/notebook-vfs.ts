/*
 * Copyright 2021 The Kubernetes Authors
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

describe(`notebook vfs ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('ls -l / should show /kui', () =>
    CLI.command('ls -l /', this.app)
      .then(ReplExpect.okWith('kui'))
      .catch(Common.oops(this, true)))

  it('should open /kui', () =>
    CLI.command('open /kui', this.app)
      .then(ReplExpect.okWithString('welcome.md'))
      .catch(Common.oops(this, true)))

  it('should open /kui/kubernetes', () =>
    CLI.command('open /kui/kubernetes', this.app)
      .then(ReplExpect.okWithString('crud-operations.md'))
      .catch(Common.oops(this, true)))
})
