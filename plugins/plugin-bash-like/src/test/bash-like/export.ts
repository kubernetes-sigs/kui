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

import { ISuite, before as commonBefore, after as commonAfter, oops, pit } from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli } = ui

/*
 * Report on export testcases
 * yes: export FOO=bar; echo $FOO -> bar
 * no: export FOO=(3 4); echo $FOO => 3
 * yes: export FOO="bar baz"; echo $FOO -> bar baz
 * no: export FOO=bar=baz; echo $FOO -> bar=baz
 * no: export FOO=bar" "baz; echo $FOO -> bar baz
 * yes: export FOO=bar\ baz; echo $FOO -> bar baz
 */

describe('export command', function(this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  pit('should export foo bar', () =>
    cli
      .do('export foo=bar', this.app)
      .then(cli.expectJustOK)
      .then(() => cli.do('echo $foo', this.app).then(cli.expectOKWithString('bar')))
      .catch(oops(this))
  )

  pit('should export foo bar baz with space in string', () =>
    cli
      .do('export foo="bar baz"', this.app)
      .then(cli.expectJustOK)
      .then(() => cli.do('echo $foo', this.app).then(cli.expectOKWithString('bar baz')))
      .catch(oops(this))
  )
})
