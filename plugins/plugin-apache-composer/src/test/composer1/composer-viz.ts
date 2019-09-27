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

import * as fs from 'fs'
import { Application } from 'spectron'

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import {
  input,
  composerInput,
  composerErrorInput,
  verifyNodeExists,
  verifyEdgeExists,
  verifyOutgoingEdgeExists,
  verifyTheBasicStuff
} from '@kui-shell/plugin-apache-composer/tests/lib/composer-viz-util'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

/**
 * Define the input files
 *
 */
const fsm = input('fsm.json')
const fsmStruct = JSON.parse(fs.readFileSync(fsm.path).toString())
const baseComposerInputs = [composerInput('composer1.js')]
const seq = composerInput('seq.js')
const demoSeq = { path: '@demos/seq.js', file: 'seq.js' }
const If = composerInput('if.js')
const whileSeq = composerInput('while-seq.js')
const looper = { file: 'looper.js', path: '@demos/looper.js' }
const demo = composerInput('demo.js')
const demoRetain = composerInput('demo-retain.js')
const mask = composerInput('mask.js')
const requireAbsolute = composerInput('require-absolute.js')
const requireRelative = composerInput('require-relative.js')
const fsRead = composerInput('fs-read.js')
const addSubscription = composerErrorInput('addSubscription.js')
const owComposerErr = composerErrorInput('openwhisk-composer-throw-err.js')

const verifyPreviewNoticeExist = (checkExist = true) => (app: Application) => {
  return app.client.waitUntil(async () => {
    const actualText = await app.client.getText('.sidecar-toolbar-text-content')
    return /^This is a preview of your composition, it is not yet deployed/.test(actualText) || !checkExist
  }, 2000)
}
/**
 * Here starts the test
 *
 */
describe('show the composer visualization without creating openwhisk assets', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should show error thrown by openwhisk-composer node_module', () =>
    CLI.command(`preview ${owComposerErr.path}`, this.app)
      .then(ReplExpect.error(0, `no such file or directory, open 'doesnotexist.js'`))
      .catch(Common.oops(this)))

  it('should preview an empty composition', () =>
    CLI.command(`wsk app preview ${ROOT}/data/composer/composer-source/empty.js`, this.app)
      .then(verifyTheBasicStuff('empty.js'))
      .then(verifyEdgeExists('Entry', 'Exit'))
      .then(verifyPreviewNoticeExist())
      .catch(Common.oops(this)))

  /** test: @demos/seq.js file */
  if (!process.env.LOCAL_OPENWHISK) {
    // no openwhisk catalog in local openwhisk travis
    it(`show visualization from javascript source ${demoSeq.path}`, () =>
      CLI.command(`wsk app viz ${demoSeq.path}`, this.app)
        .then(verifyTheBasicStuff(demoSeq.file))
        .then(verifyNodeExists('date', true))
        .then(verifyNodeExists('echo', true))
        .then(verifyEdgeExists('Entry', 'date'))
        .then(verifyOutgoingEdgeExists('date'))
        .then(verifyEdgeExists('echo', 'Exit'))
        .then(verifyPreviewNoticeExist())
        .catch(Common.oops(this)))
  }

  /** test: load an FSM */
  const syns = ['preview', 'wsk app viz', 'wsk app preview']
  syns.forEach(cmd => {
    it(`show visualization via ${cmd} from FSM file ${fsm.path}`, () =>
      CLI.command(`${cmd} ${fsm.path}`, this.app)
        .then(verifyTheBasicStuff(fsm.file))
        .then(verifyNodeExists('foo1'))
        .then(verifyNodeExists('foo2'))
        .then(verifyNodeExists('foo3'))
        .then(verifyEdgeExists('Entry', 'foo1'))
        .then(verifyEdgeExists('foo1', 'foo2'))
        .then(verifyEdgeExists('foo2', 'foo3'))
        .then(verifyEdgeExists('foo3', 'Exit'))
        .then(verifyPreviewNoticeExist())
        .catch(Common.oops(this)))
  })

  /** test: app preview on its own should show usage */
  it(`should show usage for "app preview"`, () =>
    CLI.command('wsk app preview', this.app)
      .then(ReplExpect.error(497)) // 497 insufficient required parameters
      .catch(Common.oops(this)))

  /** test: load an AST, but show the raw AST */
  it(`show raw AST from AST file ${fsm.path}`, () =>
    CLI.command(`wsk app viz --ast ${fsm.path}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(fsm.file))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectStruct(fsmStruct))
      .catch(Common.oops(this)))

  /** test: ibid, but alternate placement of --fsm on command line */
  it(`show raw AST from AST file ${fsm.path}, alterate option placement`, () =>
    CLI.command(`wsk app viz ${fsm.path} --ast`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(fsm.file))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectStruct(fsmStruct))
      .catch(Common.oops(this)))

  /** tests: we have a bunch of variants of a simple input js file; here we iterate over the variants */
  baseComposerInputs.forEach(input => {
    it(`show visualization from javascript source ${input.path}`, () =>
      CLI.command(`wsk app viz ${input.path}`, this.app)
        .then(verifyTheBasicStuff(input.file))
        .then(verifyNodeExists('RandomError', false)) // is not deployed
        .then(verifyEdgeExists('Entry', 'Try-Catch'))
        .then(verifyEdgeExists('Try-Catch', 'Exit'))
        .then(verifyPreviewNoticeExist())
        .catch(Common.oops(this)))
  })
  //
  // /* it('should initialize composer', () => CLI.command(`wsk app init --url ${sharedURL} --cleanse`, this.app) // cleanse important here for counting sessions in `sessions`
  //       .then(ReplExpect.okWithCustom({expect: 'Successfully initialized and reset the required services. You may now create compositions.'}))
  //      .catch(Common.oops(this))) */
  //
  /** test: sequence js file */
  it(`show visualization from javascript source ${seq.path}`, () =>
    CLI.command(`wsk app viz ${seq.path}`, this.app)
      .then(verifyTheBasicStuff(seq.file))
      .then(verifyNodeExists('seq1'))
      .then(verifyNodeExists('seq2'))
      .then(verifyNodeExists('seq3'))
      .then(verifyEdgeExists('seq1', 'seq2'))
      .then(verifyEdgeExists('seq2', 'seq3'))
      .catch(Common.oops(this)))

  /** test: viz, then create with no args, testing for handling of implicit entity */
  it(`should create with implicit entity`, () =>
    CLI.command('wsk app create', this.app)
      .then(verifyTheBasicStuff(seq.file))
      .then(verifyNodeExists('seq1', false)) // not deployed
      .then(verifyNodeExists('seq2', false)) // not deployed
      .then(verifyNodeExists('seq3', false)) // not deployed
      .then(verifyEdgeExists('seq1', 'seq2'))
      .then(verifyEdgeExists('seq2', 'seq3'))
      .then(verifyPreviewNoticeExist(false))
      .catch(Common.oops(this)))

  /** test: preview wookiechat */
  it(`show visualization from javascript source ${seq.path}`, () =>
    CLI.command(`wsk app preview @demos/wookie/app.js`, this.app)
      .then(verifyTheBasicStuff('app.js'))
      .then(verifyNodeExists('swapi', false)) // not yet deployed
      .then(verifyNodeExists('stapi', false)) // not yet deployed
      .then(verifyNodeExists('validate-swapi', false)) // not yet deployed
      .then(verifyNodeExists('validate-stapi', false)) // not yet deployed
      .then(verifyNodeExists('report-swapi', false)) // not yet deployed
      .then(verifyNodeExists('report-stapi', false)) // not yet deployed
      .then(verifyNodeExists('report-empty', false)) // not yet deployed
      .then(verifyEdgeExists('report-swapi', 'dummy_1'))
      .then(verifyEdgeExists('report-stapi', 'dummy_0'))
      .then(verifyEdgeExists('report-empty', 'dummy_0'))
      .then(verifyEdgeExists('dummy_0', 'dummy_1'))
      .then(verifyEdgeExists('dummy_1', 'Exit'))
      .then(verifyPreviewNoticeExist())
      .catch(Common.oops(this)))

  /** test: viz, then create with -r, testing for handling of implicit entity and auto-deploy */
  it(`should create wookiechat and dependent actions with implicit entity`, () =>
    CLI.command('wsk app update', this.app)
      .then(verifyTheBasicStuff('app.js'))
      .then(verifyNodeExists('swapi', false)) // expect not to be deployed
      .then(verifyNodeExists('stapi', false)) // expect not to be deployed
      .then(verifyNodeExists('validate-swapi', false)) // expect not to be deployed
      .then(verifyNodeExists('validate-stapi', false)) // expect not to be deployed
      .then(verifyNodeExists('report-swapi', false)) // expect not to be deployed
      .then(verifyNodeExists('report-stapi', false)) // expect not to be deployed
      .then(verifyNodeExists('report-empty', false)) // expect not to be deployed
      .then(verifyPreviewNoticeExist(false))
      .catch(Common.oops(this)))

  // /** test: if js file */
  it(`show visualization from javascript source ${If.path}`, () =>
    CLI.command(`wsk app viz ${If.path}`, this.app)
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
      .then(verifyPreviewNoticeExist())
      .catch(Common.oops(this)))

  /** test: while with nested sequence, from js file */
  // note that we also have this in the @demos/looper.js; make sure to test that, too
  const loopers = [whileSeq, looper]
  loopers.forEach(({ file, path }) => {
    it(`show visualization from javascript source ${path}`, () =>
      CLI.command(`wsk app viz ${path}`, this.app)
        .then(verifyTheBasicStuff(file))
        .then(verifyNodeExists('seq1'))
        .then(verifyNodeExists('seq2'))
        .then(verifyNodeExists('seq3'))
        .then(verifyNodeExists('cond1'))
        .then(verifyNodeExists('cond2'))
        .then(verifyNodeExists('cond3'))
        .then(verifyNodeExists('action4'))
        .then(verifyEdgeExists('Entry', 'cond1'))
        .then(verifyEdgeExists('cond1', 'cond2'))
        .then(verifyEdgeExists('seq1', 'seq2'))
        .then(verifyEdgeExists('seq2', 'seq3'))
        .then(verifyEdgeExists('seq3', 'cond1'))
        .then(verifyEdgeExists('cond2', 'cond3'))
        .then(verifyEdgeExists('cond3', 'action4'))
        .then(verifyEdgeExists('action4', 'cond3'))
        .then(verifyEdgeExists('cond3', 'Exit'))
        .catch(Common.oops(this)))
  })

  /* this one manifests a wskflow bug, disabling for now
    it(`show visualization from javascript source ${retry5Times.path}`, () => CLI.command(`wsk app viz ${retry5Times.path}`, this.app)
       .then(verifyTheBasicStuff(retry5Times.file))
       .catch(Common.oops(this)))
    */

  /** test: from the openwhisk-composer/samples directory */
  it(`show visualization from javascript source ${demo.path}`, () =>
    CLI.command(`wsk app viz ${demo.path}`, this.app)
      .then(verifyTheBasicStuff(demo.file))
      .then(verifyNodeExists('isNotOne'))
      .then(verifyNodeExists('isEven'))
      .then(verifyNodeExists('DivideByTwo'))
      .then(verifyNodeExists('TripleAndIncrement'))
      .then(verifyOutgoingEdgeExists('TripleAndIncrement')) // if we find a way to name the "dummy" node, change this to verifyEdge
      .then(verifyOutgoingEdgeExists('DivideByTwo')) // ibid
      .catch(Common.oops(this)))

  /** test: from the openwhisk-composer/samples directory */
  it(`show visualization from javascript source ${demoRetain.path}`, () =>
    CLI.command(`wsk app viz ${demoRetain.path}`, this.app)
      .then(verifyTheBasicStuff(demoRetain.file))
      .then(verifyNodeExists('DivideByTwo'))
      .then(verifyNodeExists('TripleAndIncrement'))
      .then(verifyEdgeExists('TripleAndIncrement', 'DivideByTwo'))
      .then(verifyOutgoingEdgeExists('DivideByTwo'))
      .catch(Common.oops(this)))

  /** test: from the openwhisk-composer/samples directory */
  it(`show visualization from javascript source ${mask.path}`, () =>
    CLI.command(`wsk app viz ${mask.path}`, this.app)
      .then(verifyTheBasicStuff(mask.file))
      .then(verifyNodeExists('echo1'))
      .then(verifyNodeExists('echo2'))
      .then(verifyEdgeExists('echo1', 'echo2'))
      .catch(Common.oops(this)))

  /** test: from the openwhisk-composer/samples directory */
  it(`show visualization from javascript source ${requireAbsolute.path}`, () =>
    CLI.command(`wsk app viz ${requireAbsolute.path}`, this.app)
      .then(verifyTheBasicStuff(requireAbsolute.file))
      .then(verifyNodeExists('echo1'))
      .then(verifyNodeExists('echo2'))
      .then(verifyEdgeExists('echo1', 'echo2'))
      .catch(Common.oops(this)))

  /** test: from the openwhisk-composer/samples directory */
  it(`show visualization from javascript source ${requireRelative.path}`, () =>
    CLI.command(`wsk app viz ${requireRelative.path}`, this.app)
      .then(verifyTheBasicStuff(requireRelative.file))
      .then(verifyNodeExists('echo1'))
      .then(verifyNodeExists('echo2'))
      .then(verifyEdgeExists('echo1', 'echo2'))
      .then(verifyPreviewNoticeExist())
      .catch(Common.oops(this)))

  /** test: from the openwhisk-composer/samples directory */
  it(`show visualization from javascript source ${fsRead.path}`, () =>
    CLI.command(`wsk app viz ${fsRead.path}`, this.app)
      .then(verifyTheBasicStuff(fsRead.file))
      .catch(Common.oops(this)))

  it(`fail to show visualization for addSubscription without -e for env var assignment`, () =>
    CLI.command(`preview ${addSubscription.path}`, this.app)
      .then(ReplExpect.error(0, 'SLACK_TOKEN required in environment'))
      .then(verifyPreviewNoticeExist())
      .catch(Common.oops(this)))

  it(`fail to show visualization for addSubscription with partial -e for env var assignment`, () =>
    CLI.command(`preview ${addSubscription.path} -e SLACK_TOKEN yo`, this.app)
      .then(ReplExpect.error(0, 'CLOUDANT_PACKAGE_BINDING required in environment'))
      .catch(Common.oops(this)))

  it(`show visualization for addSubscription using -e for env var assignment`, () =>
    CLI.command(`preview ${addSubscription.path} -e SLACK_TOKEN yo -e CLOUDANT_PACKAGE_BINDING mo`, this.app)
      .then(verifyTheBasicStuff(addSubscription.file))
      .then(verifyNodeExists('write'))
      .then(verifyNodeExists('read-document'))
      .then(verifyNodeExists('post'))
      .then(verifyEdgeExists('post', 'Exit'))
      .catch(Common.oops(this)))
})
