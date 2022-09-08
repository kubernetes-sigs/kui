/*
 * Copyright 2020 The Kubernetes Authors
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

import { CLI, Common, ReplExpect } from '@kui-shell/test'

describe(`no semicolon expansion ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should correctly detect no semicolon on command line', () =>
    CLI.command('nosemi test', this.app).then(ReplExpect.okWithString('no')).catch(Common.oops(this, true)))

  it('should correctly detect semicolon on command line', () =>
    CLI.command('nosemi test1;test2', this.app)
      .then(ReplExpect.okWithString('yes test1;test2'))
      .catch(Common.oops(this, true)))
})
