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

/**
 * tests wsk package bind
 *
 */

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

describe('wsk trigger fire tests', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create an action, using the implicit entity type
  it('should create trigger', () =>
    CLI.command(`wsk trigger create ttt -p tvar 2`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('ttt'))
      .catch(Common.oops(this)))

  it('should create action', () =>
    CLI.command('let aaa = x=>x -p avar 3', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('aaa'))
      .catch(Common.oops(this)))

  it('should create rule', () =>
    CLI.command(`wsk rule create rrr ttt aaa`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('rrr'))
      .catch(Common.oops(this)))

  it('should fire the trigger with fire parameter', () =>
    CLI.command('wsk trigger fire ttt -p fvar 4', this.app)
      .then(ReplExpect.okWithString('fired trigger'))
      .catch(Common.oops(this)))
})
