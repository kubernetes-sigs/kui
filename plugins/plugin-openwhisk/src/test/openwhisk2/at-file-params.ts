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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const paramsFileContent = require('@kui-shell/plugin-openwhisk/tests/data/openwhisk/params.json')
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = 'foo'
const actionName2 = 'foo2'
const actionName3 = 'foo3'
const seqName = 'sss'

describe('@file params and annotations', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // action via wsk action create
  it('should create an action with --param-file', () =>
    CLI.command(
      `wsk action create ${actionName2} ${ROOT}/data/openwhisk/foo.js --param-file ${ROOT}/data/openwhisk/params.json`,
      this.app
    )
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2)))
  it('should switch to parameters mode via "params" and show the @file params', () =>
    CLI.command('wsk action params', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectStruct(paramsFileContent)))

  // action via wsk action create -P
  it('should create an action with -P', () =>
    CLI.command(
      `wsk action create ${actionName3} ${ROOT}/data/openwhisk/foo.js -P ${ROOT}/data/openwhisk/params.json`,
      this.app
    )
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName3)))
  it('should switch to parameters mode via "params" and show the @file params', () =>
    CLI.command('wsk action params', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName3))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectStruct(paramsFileContent)))

  // action via let
  it('should create an action via let with @file parameters', () =>
    CLI.command(`let ${actionName} = x=>x -p xxx @${ROOT}/data/openwhisk/params.json`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName)))
  it('should switch to parameters mode via "params" and show the @file params', () =>
    CLI.command('wsk action params', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectStruct({ xxx: paramsFileContent })))

  // sequence
  it('should create a sequence via let with @file annotations', () =>
    CLI.command(`let ${seqName} = x=>x -> x=>x -a xxx @${ROOT}/data/openwhisk/params.json`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName)))
  it('should switch to annotations mode via "annotations" and show the @file annotations', () =>
    CLI.command('wsk action annotations', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ xxx: paramsFileContent })))
})
