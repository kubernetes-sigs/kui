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
 * read-only tests against the cli's help APIs
 *
 */

import { ISuite, before as commonBefore, after as commonAfter, oops, proxyIt } from '@kui-shell/core/tests/lib/common'

import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, sidecar } = ui

describe('Comments and blank line handling', function(this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  it('should handle blank lines', () => cli.do('', this.app).then(cli.expectBlank))

  it('should handle blank lines with prefix whitespace', () => cli.do('    ', this.app).then(cli.expectBlank))

  it('should handle comment-only lines', () => cli.do('# hello', this.app).then(cli.expectBlank))

  it('should handle comment-only lines with surrounding whitespace', () =>
    cli.do('  #hello  ', this.app).then(cli.expectBlank))

  proxyIt('should cd to the test dir', () =>
    cli
      .do(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(cli.expectOKWithString('packages/tests'))
      .catch(oops(this, true))
  )

  it('should handle a command with suffix comment', () =>
    cli
      .do(`open ../../README.md  #hello  `, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('Kui Shell', undefined, undefined, 'README.md')))

  it('should handle a command with suffix comment', () =>
    cli
      .do(`open ../../LICENSE ### ### # #    hello  `, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('LICENSE')))

  it('should handle a commented-out command', () =>
    cli
      .do(`#open ../../README.md`, this.app)
      .then(cli.expectBlank)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('LICENSE'))) // we should still showing LICENSE file in sidecar

  it('should handle a commented-out command with intermingled whitespace', () =>
    cli
      .do(`#     open ../../README.md`, this.app)
      .then(cli.expectBlank)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('LICENSE'))) // we should still showing LICENSE file in sidecar

  it('should handle a commented-out command with suffix comment', () =>
    cli
      .do(`#open ../../README.md ### ### # #    hello  `, this.app)
      .then(cli.expectBlank)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('LICENSE'))) // we should still showing LICENSE file in sidecar

  it('should handle a commented-out parse-error', () =>
    cli
      .do(`#openfoobar ../../README.md ### ### # #    hello  `, this.app)
      .then(cli.expectBlank)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('LICENSE'))) // we should still showing LICENSE file in sidecar

  it('should handle a commented-out parse-error 2', () =>
    cli
      .do(`#open ../../README.md =))))- -(((( x=>x ### ### # #    hello  `, this.app)
      .then(cli.expectBlank)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('LICENSE'))) // we should still showing LICENSE file in sidecar
})
