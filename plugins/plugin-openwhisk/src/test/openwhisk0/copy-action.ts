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

/**
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import { Common, CLI, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = 'foo'
const actionName2 = 'foo2'
const actionName3 = 'foo3'

// TODO: webpack test
localDescribe('Copy actions using the wsk syntax', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    CLI.command(`wsk action create ${actionName} ${ROOT}/data/openwhisk/foo.js -p x 5 -p y 10`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(Util.switchToTab('parameters'))
      .then(
        SidecarExpect.yaml([
          { key: 'x', value: 5 },
          { key: 'y', value: 10 }
        ])
      )
      .catch(Common.oops(this, true)))

  it('should copy an action', () =>
    CLI.command(`wsk action create --copy ${actionName2} ${actionName} -p x 8`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .then(Util.switchToTab('parameters'))
      .then(
        SidecarExpect.yaml([
          { key: 'x', value: 8 },
          { key: 'y', value: 10 }
        ])
      )
      .catch(Common.oops(this, true)))

  it('should copy an action with --copy in an alternate spot', () =>
    CLI.command(`wsk action create ${actionName3} --copy  ${actionName} -p x 8 -p y 1`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName3))
      .then(Util.switchToTab('parameters'))
      .then(
        SidecarExpect.yaml([
          { key: 'x', value: 8 },
          { key: 'y', value: 1 }
        ])
      )
      .catch(Common.oops(this, true)))
})
