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

//
// tests that create an action and test that it shows up in the list UI
//    this test also covers toggling the sidecar
//

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const actionName = 'foo'
const packageName = 'ppp'
const triggerName = 'ttt'
const actionNameInPackage = `${packageName}/${actionName}`
const ruleName = `on_${triggerName}_do_${actionNameInPackage.replace(/\//g, '_')}`

describe('List all OpenWhisk entities', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this, () => CLI.command(`wsk rule delete ${ruleName}`, this.app)))

  // create action
  it('should create a packaged action', () =>
    CLI.command(`let ${actionNameInPackage} = x=>x`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName)))

  // create rule (and trigger)
  it('should create a rule', () =>
    CLI.command(`wsk on ${triggerName} do ${packageName}/${actionName}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(ruleName)))

  // list them all
  it('should list them all action', () => CLI.command('wsk list', this.app).then(ReplExpect.okWith(actionName)))
  it('should list them all trigger', () => CLI.command('wsk list', this.app).then(ReplExpect.okWith(triggerName)))
  it('should list them all rule', () => CLI.command('wsk list', this.app).then(ReplExpect.okWith(ruleName)))
  it('should list them all package', () => CLI.command('wsk list', this.app).then(ReplExpect.okWith(packageName)))
})
