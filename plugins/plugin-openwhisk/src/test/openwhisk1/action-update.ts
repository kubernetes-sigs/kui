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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { localIt } = Common

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = 'foo'

describe('wsk action update without input file', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an action', () =>
    CLI.command(`let ${actionName} = x=>x -p x 3`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  it('should switch to parameters mode', () =>
    CLI.command('wsk action parameters', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectStruct({ x: 3 }))
      .catch(Common.oops(this)))

  it('should update the action with no code via kuwsk action update', () =>
    CLI.command(`wsk action update ${actionName} -p y 5`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))
  it('should switch to parameters mode and verify updated params', () =>
    CLI.command('wsk action parameters', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectStruct({ y: 5 })) // note that the original parameter binding is expected to be overwritten
      .catch(Common.oops(this)))

  it('should update the action with no code via wsk action update', () =>
    CLI.command(`wsk action update ${actionName} -p y 6`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))
  it('should switch to parameters mode and verify updated params', () =>
    CLI.command('wsk action parameters', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectStruct({ y: 6 })) // note that the original parameter binding is expected to be overwritten
      .catch(Common.oops(this)))

  it('should update the action with no code', () =>
    CLI.command(`wsk action update ${actionName} -p y 4`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  it('should switch to parameters mode and verify updated params', () =>
    CLI.command('wsk action parameters', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectStruct({ y: 4 })) // note that the original parameter binding is expected to be overwritten
      .catch(Common.oops(this)))

  localIt('should update the action, this time with a file', () =>
    CLI.command(`wsk action update ${actionName} -p name updater ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this))
  )

  localIt('should switch to parameters mode and verify updated params', () =>
    CLI.command('wsk action parameters', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectStruct({ name: 'updater' })) // note that the original parameter binding is expected to be overwritten
      .catch(Common.oops(this))
  )

  localIt('should invoke the new code', () =>
    CLI.command(`wsk action invoke ${actionName}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(app => app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ name: 'Step1 updater' }))
      .catch(Common.oops(this))
  )
})
