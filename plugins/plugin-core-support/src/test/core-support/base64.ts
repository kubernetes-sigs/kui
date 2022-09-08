/*
 * Copyright 2018 The Kubernetes Authors
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

describe('base64 command', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should base64 decode variant 1', () =>
    CLI.command('base64 --decode ZGVHZkZBdFM0dA==', this.app)
      .then(ReplExpect.okWithString('deGfFAtS4t'))
      .catch(Common.oops(this)))

  it('should base64 decode variant 2', () =>
    CLI.command('base64 -d ZGVHZkZBdFM0dA==', this.app)
      .then(ReplExpect.okWithString('deGfFAtS4t'))
      .catch(Common.oops(this)))

  it('should base64 decode with break 1', () =>
    CLI.command('base64 -d ZGVHZkZBdFM0dA== --break 1', this.app)
      .then(
        ReplExpect.okWithString(`d
e
G
f
F
A
t
S
4
t`)
      )
      .catch(Common.oops(this)))

  it('should base64 decode with break 2', () =>
    CLI.command('base64 -d ZGVHZkZBdFM0dA== -b 2', this.app)
      .then(
        ReplExpect.okWithString(`de
Gf
FA
tS
4t`)
      )
      .catch(Common.oops(this)))

  it('should base64 decode with break 3', () =>
    CLI.command('base64 -d ZGVHZkZBdFM0dA== -b 3', this.app)
      .then(
        ReplExpect.okWithString(`deG
fFA
tS4
t`)
      )
      .catch(Common.oops(this)))

  it('should base64 decode with break 4', () =>
    CLI.command('base64 -d ZGVHZkZBdFM0dA== -b 4', this.app)
      .then(
        ReplExpect.okWithString(`deGf
FAtS
4t`)
      )
      .catch(Common.oops(this)))

  it('should base64 decode with break 40', () =>
    CLI.command('base64 -d ZGVHZkZBdFM0dA== --break 40', this.app)
      .then(ReplExpect.okWithString('deGfFAtS4t'))
      .catch(Common.oops(this)))
})
