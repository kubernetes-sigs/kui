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

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

// import { expectRule } from '@kui-shell/plugin-apache-composer/tests/lib/composer-viz-util'

const actionName = 'foo'
const actionName2 = 'foo2'
const triggerName = 'ttt'
const triggerName2 = 'ttt2'
const ruleName = `on_${triggerName}_do_${actionName}`
const ruleName2 = `on_${triggerName}_do_${actionName2}`
const ruleName3 = `on_${triggerName2}_do_${actionName2}`

describe('Create a rule via on', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an action via let without extension', () =>
    CLI.command(`let ${actionName2} = x=>({y:x.y})`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .catch(Common.oops(this)))

  it('should create an action via let with extension', () =>
    CLI.command(`let ${actionName}.js = x=>({y:x.y})`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  it('should create a trigger', () =>
    CLI.command(`wsk trigger update ${triggerName2}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(triggerName2))
      .catch(Common.oops(this)))

  it('should create a rule via on, using a new trigger', () =>
    CLI.command(`on ${triggerName} do ${actionName}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(ruleName))
      //      .then(expectRule({ triggerName, actionName }))
      .catch(Common.oops(this)))

  it('should create a rule via on, using the trigger created by the first on', () =>
    CLI.command(`on ${triggerName} do ${actionName2}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(ruleName2))
      //      .then(expectRule({ triggerName, actionName: actionName2 }))
      .catch(Common.oops(this)))

  it('should create a rule via on, using a pre-existing trigger', () =>
    CLI.command(`on ${triggerName2} do ${actionName2}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(ruleName3))
      //      .then(expectRule({ triggerName: triggerName2, actionName: actionName2 }))
      .catch(Common.oops(this)))
})
