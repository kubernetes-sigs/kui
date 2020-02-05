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

/**
 * read-only tests against the CLI's help APIs
 *
 */

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

describe('Comments and blank line handling', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should handle blank lines', () => CLI.command('', this.app).then(ReplExpect.blank))

  it('should handle blank lines with prefix whitespace', () => CLI.command('    ', this.app).then(ReplExpect.blank))

  it('should handle comment-only lines', () => CLI.command('# hello', this.app).then(ReplExpect.blank))

  it('should handle comment-only lines with surrounding whitespace', () =>
    CLI.command('  #hello  ', this.app).then(ReplExpect.blank))

  Common.proxyIt('should cd to the test dir', () =>
    CLI.command(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(ReplExpect.okWithString('packages/test'))
      .catch(Common.oops(this, true))
  )

  it('should handle a command with suffix comment', () =>
    CLI.command(`open ../../README.md  #hello  `, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('README.md')))

  it('should handle a command with suffix comment', () =>
    CLI.command(`open ../../LICENSE ### ### # #    hello  `, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('LICENSE')))

  it('should handle a commented-out command', () =>
    CLI.command(`#open ../../README.md`, this.app)
      .then(ReplExpect.blank)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('LICENSE'))) // we should still showing LICENSE file in sidecar

  it('should handle a commented-out command with intermingled whitespace', () =>
    CLI.command(`#     open ../../README.md`, this.app)
      .then(ReplExpect.blank)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('LICENSE'))) // we should still showing LICENSE file in sidecar

  it('should handle a commented-out command with suffix comment', () =>
    CLI.command(`#open ../../README.md ### ### # #    hello  `, this.app)
      .then(ReplExpect.blank)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('LICENSE'))) // we should still showing LICENSE file in sidecar

  it('should handle a commented-out parse-error', () =>
    CLI.command(`#openfoobar ../../README.md ### ### # #    hello  `, this.app)
      .then(ReplExpect.blank)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('LICENSE'))) // we should still showing LICENSE file in sidecar

  it('should handle a commented-out parse-error 2', () =>
    CLI.command(`#open ../../README.md =))))- -(((( x=>x ### ### # #    hello  `, this.app)
      .then(ReplExpect.blank)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('LICENSE'))) // we should still showing LICENSE file in sidecar
})
