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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

// import { expectRule } from '@kui-shell/plugin-apache-composer/tests/lib/composer-viz-util'
const { cli, sidecar } = ui

const actionName = 'foo'
const actionName2 = 'foo2'
const triggerName = 'ttt'
const triggerName2 = 'ttt2'
const ruleName = `on_${triggerName}_do_${actionName}`
const ruleName2 = `on_${triggerName}_do_${actionName2}`
const ruleName3 = `on_${triggerName2}_do_${actionName2}`

describe('Create a rule via on', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should create an action via let without extension', () =>
    cli
      .do(`let ${actionName2} = x=>({y:x.y})`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2))
      .catch(common.oops(this)))

  it('should create an action via let with extension', () =>
    cli
      .do(`let ${actionName}.js = x=>({y:x.y})`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .catch(common.oops(this)))

  it('should create a trigger', () =>
    cli
      .do(`wsk trigger update ${triggerName2}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(triggerName2))
      .catch(common.oops(this)))

  it('should create a rule via on, using a new trigger', () =>
    cli
      .do(`on ${triggerName} do ${actionName}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(ruleName))
//      .then(expectRule({ triggerName, actionName }))
      .catch(common.oops(this)))

  it('should create a rule via on, using the trigger created by the first on', () =>
    cli
      .do(`on ${triggerName} do ${actionName2}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(ruleName2))
//      .then(expectRule({ triggerName, actionName: actionName2 }))
      .catch(common.oops(this)))

  it('should create a rule via on, using a pre-existing trigger', () =>
    cli
      .do(`on ${triggerName2} do ${actionName2}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(ruleName3))
//      .then(expectRule({ triggerName: triggerName2, actionName: actionName2 }))
      .catch(common.oops(this)))
})
