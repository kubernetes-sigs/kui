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

import {
  ISuite,
  before as commonBefore,
  after as commonAfter,
  oops,
  pit,
  waitForSession
} from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, selectors } = ui

/*
 * Report on export testcases
 * yes: export FOO=bar; echo $FOO -> bar
 * no: export FOO=(3 4); echo $FOO => 3
 * yes: export FOO="bar baz"; echo $FOO -> bar baz
 * no: export FOO=bar=baz; echo $FOO -> bar=baz
 * no: export FOO=bar" "baz; echo $FOO -> bar baz
 * yes: export FOO=bar\ baz; echo $FOO -> bar baz
 */

const value1 = 'nnnnnn'
const value2 = 'bar baz'
const value3 = 'mmmmmm'

describe('export command', function(this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  pit(`should export foo=${value1}`, () =>
    cli
      .do(`export foo=${value1}`, this.app)
      .then(cli.expectJustOK)
      .then(() => cli.do('printenv foo', this.app).then(cli.expectOKWithString(value1)))
      .catch(oops(this))
  )

  pit('should export foo bar baz with space in string', () =>
    cli
      .do(`export foo="${value2}"`, this.app)
      .then(cli.expectJustOK)
      .then(() => cli.do('printenv foo', this.app).then(cli.expectOKWithString(value2)))
      .catch(oops(this))
  )

  pit('should open new tab', () =>
    cli
      .do('tab new', this.app)
      .then(() => waitForSession(this))
      .catch(oops(this))
  )

  pit('should show no value for foo in the new tab', () =>
    cli
      .do('printenv foo', this.app)
      .then(cli.expectBlank)
      .catch(oops(this))
  )

  pit(`should export foo ${value3}`, () =>
    cli
      .do(`export foo=${value3}`, this.app)
      .then(cli.expectJustOK)
      .catch(oops(this))
  )

  pit('should printenv the new value for foo in the second tab', () =>
    cli
      .do('printenv foo', this.app)
      .then(cli.expectOKWithString(value3))
      .catch(oops(this))
  )

  pit('should switch back to the first tab', () =>
    cli
      .do('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(1)))
      .catch(oops(this))
  )

  pit('should show the first-tab value for foo in the first tab', () =>
    cli
      .do('printenv foo', this.app)
      .then(cli.expectOKWithString(value2))
      .catch(oops(this))
  )

  pit('should switch back to the second tab', () =>
    cli
      .do('tab switch 2', this.app)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .catch(oops(this))
  )

  pit('should show the second-tab value for foo in the second tab', () =>
    cli
      .do('printenv foo', this.app)
      .then(cli.expectOKWithString(value3))
      .catch(oops(this))
  )
})
