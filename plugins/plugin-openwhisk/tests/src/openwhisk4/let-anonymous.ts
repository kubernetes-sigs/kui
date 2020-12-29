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

import { Common, CLI, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const actionName1 = 'foo1'
const actionName2 = 'foo2'
const seqName1 = 's1'
const seqName2 = 's2'

describe('Create anonymous actions via let', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an anonymous function with () param', () =>
    CLI.command(`let ${actionName1} = () => ({x:3})`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1)))
  it('should do an invoke of the action, using implicit context', () =>
    CLI.command(`wsk action invoke -p y 8fdsfdas`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1))
      .then(Util.getValueFromMonaco)
      .then(Util.expectYAML({ x: 3 })))

  it('should create an anonymous function with _ param', () =>
    CLI.command(`let ${actionName2} = _ => ({xx:33})`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2)))
  it('should do an invoke of the action, using implicit context', () =>
    CLI.command(`wsk action invoke -p y 8fdsfdas`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .then(Util.getValueFromMonaco)
      .then(Util.expectYAML({ xx: 33 })))

  it('should create an anonymous packaged function with () param', () =>
    CLI.command(`let ${seqName1} = ()=>({z:4}) -> x=>x`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1)))
  it('should do an invoke of the action, using implicit context', () =>
    CLI.command(`wsk action invoke -p y 8fdsfdas`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .then(Util.getValueFromMonaco)
      .then(Util.expectYAML({ z: 4 })))

  it('should create an anonymous packaged function with _ param', () =>
    CLI.command(`let ${seqName2} = _=>({zz:44}) -> x=>x`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName2)))
  it('should do an invoke of the action, using implicit context', () =>
    CLI.command(`wsk action invoke -p y 8fdsfdas`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName2))
      .then(Util.getValueFromMonaco)
      .then(Util.expectYAML({ zz: 44 })))
})
