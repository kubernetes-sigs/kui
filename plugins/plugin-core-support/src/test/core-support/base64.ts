/*
 * Copyright 2018 IBM Corporation
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

import { ISuite } from '@kui-shell/core/tests/lib/common'
import * as common from '@kui-shell/core/tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, selectors, sidecar } = ui

describe('base64 command', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should base64 decode variant 1', () => cli.do('base64 --decode ZGVHZkZBdFM0dA==', this.app)
    .then(cli.expectOKWithString('deGfFAtS4t'))
    .catch(common.oops(this)))

  it('should base64 decode variant 2', () => cli.do('base64 -d ZGVHZkZBdFM0dA==', this.app)
    .then(cli.expectOKWithString('deGfFAtS4t'))
    .catch(common.oops(this)))

  it('should base64 decode with break 1', () => cli.do('base64 -d ZGVHZkZBdFM0dA== --break 1', this.app)
    .then(cli.expectOKWithString(`d
e
G
f
F
A
t
S
4
t`))
    .catch(common.oops(this)))

  it('should base64 decode with break 2', () => cli.do('base64 -d ZGVHZkZBdFM0dA== -b 2', this.app)
    .then(cli.expectOKWithString(`de
Gf
FA
tS
4t`))
    .catch(common.oops(this)))

  it('should base64 decode with break 3', () => cli.do('base64 -d ZGVHZkZBdFM0dA== -b 3', this.app)
    .then(cli.expectOKWithString(`deG
fFA
tS4
t`))
    .catch(common.oops(this)))

  it('should base64 decode with break 4', () => cli.do('base64 -d ZGVHZkZBdFM0dA== -b 4', this.app)
    .then(cli.expectOKWithString(`deGf
FAtS
4t`))
    .catch(common.oops(this)))

  it('should base64 decode with break 40', () => cli.do('base64 -d ZGVHZkZBdFM0dA== --break 40', this.app)
    .then(cli.expectOKWithString('deGfFAtS4t'))
    .catch(common.oops(this)))
})
