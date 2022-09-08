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

import { CLI, Common, ReplExpect } from '@kui-shell/test'

describe(`pipe stage parsing ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should show the first pipe stage', () =>
    CLI.command('kuiPipeStageParsing | b | c | d', this.app)
      .then(ReplExpect.okWithString('kuiPipeStageParsing'))
      .catch(Common.oops(this, true)))

  it('should show the second pipe stage', () =>
    CLI.command('kuiPipeStageParsing | b | c | d --stage 1', this.app)
      .then(ReplExpect.okWithString('b'))
      .catch(Common.oops(this, true)))

  it('should show the second pipe stage no whitespace', () =>
    CLI.command('kuiPipeStageParsing |b|c|d --stage 1', this.app)
      .then(ReplExpect.okWithString('b'))
      .catch(Common.oops(this, true)))

  it('should show the second pipe stage no whitespace single-quoted pipe', () =>
    CLI.command(`kuiPipeStageParsing '|'b|c|d --stage 1`, this.app)
      .then(ReplExpect.okWithString('c'))
      .catch(Common.oops(this, true)))

  it('should show the second pipe stage no whitespace double-quoted pipe', () =>
    CLI.command('kuiPipeStageParsing "|"b|c|d --stage 1', this.app)
      .then(ReplExpect.okWithString('c'))
      .catch(Common.oops(this, true)))

  it('should show the second pipe stage no whitespace escaped pipe', () =>
    CLI.command('kuiPipeStageParsing \\|b|c|d --stage 1', this.app)
      .then(ReplExpect.okWithString('c'))
      .catch(Common.oops(this, true)))

  it('should show the third pipe stage', () =>
    CLI.command('kuiPipeStageParsing | b | c | d --stage 2', this.app)
      .then(ReplExpect.okWithString('c'))
      .catch(Common.oops(this, true)))

  it('should show the fourth pipe stage', () =>
    CLI.command('kuiPipeStageParsing | b | c | d --stage 3', this.app)
      .then(ReplExpect.okWithString('d --stage 3'))
      .catch(Common.oops(this, true)))

  it('should show the prefix variant 1', () =>
    CLI.command('kuiPipeStageParsing --prefix -- | b | c | d > bar', this.app)
      .then(ReplExpect.okWithString('kuiPipeStageParsing --prefix'))
      .catch(Common.oops(this, true)))

  it('should show the prefix variant 2', () =>
    CLI.command('kuiPipeStageParsing -- --prefix | b | c | d > bar', this.app)
      .then(ReplExpect.okWithString('--prefix')) // because the -- blocks further option parsing
      .catch(Common.oops(this, true)))

  it('should show the redirect', () =>
    CLI.command('kuiPipeStageParsing --redirect | b | c | d > bar', this.app)
      .then(ReplExpect.okWithString('bar'))
      .catch(Common.oops(this, true)))

  it('should show no redirect due to quoting', () =>
    CLI.command('kuiPipeStageParsing --redirect | b | c | d ">" bar', this.app)
      .then(ReplExpect.okWithString('nope'))
      .catch(Common.oops(this, true)))

  it('should show no redirect due to backslash escape', () =>
    CLI.command('kuiPipeStageParsing --redirect | b | c | d \\> bar', this.app)
      .then(ReplExpect.okWithString('nope'))
      .catch(Common.oops(this, true)))
})
