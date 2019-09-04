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
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import * as ui from '@kui-shell/core/tests/lib/ui'
import {
  composerInput,
  verifyNodeExists,
  verifyEdgeExists,
  verifyTheBasicStuff
} from '@kui-shell/plugin-apache-composer/tests/lib/composer-viz-util'
const cli = ui.cli

// fuzz testing: eliminate auth
//    NOTE: since we have no wskprops, the expected API_HOST is going to be
//          a static default, hard-coded into openwhisk-core.js
const fuzz = {
  fuzz: {
    rules: ['noAuth'],
    prefs: { noAuthOk: true, API_HOST: process.env.API_HOST }
  }
}

/**
 * Here starts the test
 *
 */
describe('show the composer visualization with no wskauth', function(this: common.ISuite) {
  before(openwhisk.before(this, fuzz)) // fuzz testing: eliminate authentication bits
  after(common.after(this))

  const cmd = 'wsk app preview'
  const hello = { file: 'hello.js', path: '@demos/hello.js' }
  const If = composerInput('if.js')
  const whileSeq = composerInput('while-seq.js')

  /** test: load @demos/hello */
  it(`show visualization via ${cmd} from file ${hello.path}`, () =>
    cli
      .do(`${cmd} ${hello.path}`, this.app)
      .then(verifyTheBasicStuff(hello.file))
      .then(() => this.app.client.element('body.no-auth')) // make sure we have this indicator
      .catch(common.oops(this)))

  /** test: load an if.js */
  it(`show visualization via ${cmd} from FSM file ${If.file}`, () =>
    cli
      .do(`${cmd} ${If.path}`, this.app)
      .then(verifyTheBasicStuff(If.file))
      .then(verifyNodeExists('seq1'))
      .then(verifyNodeExists('seq2'))
      .then(verifyNodeExists('seq3'))
      .then(verifyNodeExists('seq4'))
      .then(verifyNodeExists('seq5'))
      .then(verifyEdgeExists('Entry', 'isTrue'))
      .then(verifyEdgeExists('seq1', 'seq2'))
      .then(verifyEdgeExists('seq2', 'seq3'))
      .then(verifyEdgeExists('seq4', 'seq5'))
      .then(verifyEdgeExists('seq3', 'dummy_0'))
      .then(verifyEdgeExists('seq5', 'dummy_0'))
      .then(verifyEdgeExists('dummy_0', 'Exit'))
      .then(() => this.app.client.element('body.no-auth')) // make sure we have this indicator
      .catch(common.oops(this)))

  /** test: while with nested sequence, from js file */
  it(`show visualization from javascript source ${whileSeq.path}`, () =>
    cli
      .do(`wsk app viz ${whileSeq.path}`, this.app)
      .then(verifyTheBasicStuff(whileSeq.file))
      .then(verifyNodeExists('seq1'))
      .then(verifyNodeExists('seq2'))
      .then(verifyNodeExists('seq3'))
      .then(verifyNodeExists('cond1'))
      .then(verifyNodeExists('cond2'))
      .then(verifyNodeExists('cond3'))
      .then(verifyNodeExists('action4'))
      .then(verifyEdgeExists('Entry', 'cond1'))
      .then(verifyEdgeExists('seq1', 'seq2'))
      .then(verifyEdgeExists('seq2', 'seq3'))
      .then(verifyEdgeExists('cond1', 'cond2'))
      .then(verifyEdgeExists('action4', 'cond3'))
      .then(verifyEdgeExists('cond3', 'Exit'))
      .then(() => this.app.client.element('body.no-auth')) // make sure we have this indicator
      .catch(common.oops(this)))
})
