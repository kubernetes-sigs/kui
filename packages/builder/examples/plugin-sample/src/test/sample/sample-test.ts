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

/**
 * This is a sample plugin test.
 *
 */

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

describe('sample plugin', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should open sidecar', () =>
    CLI.command(`sample sidecar`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .catch(Common.oops(this)))

  it('should show hello', () =>
    CLI.command(`sample hello`, this.app)
      .then(ReplExpect.okKWithString('hello world'))
      .then(SidecarExpect.open)
      .catch(Common.oops(this)))

  it('should create an echo action', () =>
    CLI.command(`sample create action`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('echo'))
      .catch(Common.oops(this)))
})
