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

function doCdTests(this: Common.ISuite) {
  const initialPWD = process.cwd()

  it('should cd to /test', () =>
    CLI.command(`cd /test`, this.app)
      .then(ReplExpect.okWithString('/test'))
      .catch(Common.oops(this, true)))

  it('execute "test string" command via ./string', () =>
    CLI.command('./string', this.app)
      .then(ReplExpect.okWithString('hello world'))
      .catch(Common.oops(this, true)))

  it('should cd back to the initial working directory', () =>
    CLI.command(`cd "${initialPWD}"`, this.app)
      .then(ReplExpect.okWithString(initialPWD))
      .catch(Common.oops(this, true)))
}

describe(`CommandFS: ls command subdirectories ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('ls /test and see string* command', () =>
    CLI.command('ls /test', this.app)
      .then(ReplExpect.okWithString('string*'))
      .catch(Common.oops(this, true)))

  it('ls /test and see bin/ directory', () =>
    CLI.command('ls /test', this.app)
      .then(ReplExpect.okWithString('bin/'))
      .catch(Common.oops(this, true)))

  it('ls /test/bin and see testing-subdirectory* command', () =>
    CLI.command('ls /test/bin', this.app)
      .then(ReplExpect.okWithString('testing-subdirectory*'))
      .catch(Common.oops(this, true)))
})

describe(`CommandFS: execute commands via slashes ${process.env.MOCHA_RUN_TARGET ||
  ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('execute "test string" command via /test/string', () =>
    CLI.command('/test/string', this.app)
      .then(ReplExpect.okWithString('hello world'))
      .catch(Common.oops(this, true)))

  doCdTests.bind(this)()
})

/**
 * This test ensures that the CommandsFS is populated from prescan, so
 * that we don't need to execute a command in a plugin before its
 * command tree is instantiated.
 */
describe(`CommandFS: cd to kui command directory before executing any commands ${process.env.MOCHA_RUN_TARGET ||
  ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  doCdTests.bind(this)()
})
