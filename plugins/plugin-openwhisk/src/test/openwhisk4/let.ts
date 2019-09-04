/*
 * Copyright 2017-19 IBM Corporation
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

import { readFile } from 'fs'
import * as assert from 'assert'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { cli, sidecar } = ui
const { rp } = common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const CSS_INPUT = `${ROOT}/data/openwhisk/style.css`

const actionName = 'foo'
const actionName2 = 'foo2'
const actionName3 = 'foo3'
const actionName4 = 'foo4'
const actionName5 = 'foo5'
const actionName6 = 'foo6'
const actionName7 = 'foo7'
const actionName8 = 'foo8'
const actionName9 = 'foo9'
const actionName10 = 'foo10'
const actionName11 = 'foo11'
const actionName12 = 'foo12'
const actionName13 = 'foo13'
const actionName14 = 'foo14'
const actionName15 = 'foo15'
const actionName17 = 'foo17'
const actionName19 = 'foo19'
const actionName21 = 'foo21'
const actionName22 = 'foo22'
const actionName23 = 'foo23'
const seqName1 = 's1'
const seqName2 = 's2'
const seqName3 = 's3'
const seqName4 = 's4'
const seqName5 = 's5'
const packageName1 = 'ppp1'
const packageName2 = 'ppp2'
const packageName3 = 'ppp3'

describe('Create an action via let core tests', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should create a sequence via let with annotations', () =>
    cli
      .do(`let ${seqName5} = x=>x -> x=>x -a foo bar -a xxx 333`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName5)))
  it('should switch to annotations mode', () =>
    cli
      .do('wsk action annotations', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName5))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectSubset({ foo: 'bar', xxx: 333, exec: 'sequence' })))

  it('should create an action via let without extension', () =>
    cli
      .do(`let ${actionName2} = x=>({y:x.y})`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2)))

  it('should create an action via let with an explicit kind', () =>
    cli
      .do(`let ${actionName23} = ${ROOT}/data/openwhisk/echo.js --kind nodejs:8`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName23))
      .then(app =>
        app.client.getText(`${ui.selectors.SIDECAR} .sidecar-header-secondary-content .action-content .kind`)
      )
      .then(kindString => assert.ok(kindString.indexOf('nodejs:8') >= 0)))

  it('should create an packaged action with new package that has a dot in its name', () =>
    cli
      .do(`let ${packageName3}/${actionName17} = x=>x`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName17, undefined, undefined, packageName3)))

  it('should create a packaged action with new package', () =>
    cli
      .do(`let ${packageName1}/${actionName12} = x=>({y:x.y})`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName12, undefined, undefined, packageName1)))

  it('should create a package', () =>
    cli
      .do(`wsk package update ${packageName2}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(packageName2)))

  it('should create a packaged action with existing package', () =>
    cli
      .do(`let ${packageName2}/${actionName13} = x=>({y:x.y})`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName13, undefined, undefined, packageName2)))

  it('should create a sequence with inline file', () =>
    cli
      .do(`wsk action let ${seqName1} = ${actionName2} -> ${ROOT}/data/openwhisk/hello.html`, this.app)
      .then(cli.expectOKWithString('http')) // some web address, as this is a web action
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName1)))

  it('should create a sequence with inline anonymous and inline file', () =>
    cli
      .do(`wsk action let ${seqName2} = x=>x -> ${ROOT}/data/openwhisk/hello.html`, this.app)
      .then(cli.expectOKWithString('http')) // some web address, as this is a web action
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName2)))

  it('should create a sequence with inline anonymous and inline file (no whitespace)', () =>
    cli
      .do(`wsk action let ${seqName3}=x=>x->${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName3)))

  it('should create a sequence with two inline files', () =>
    cli
      .do(`wsk action let ${seqName4}=${ROOT}/data/openwhisk/foo.js-> ${ROOT}/data/openwhisk/hello.html`, this.app)
      .then(cli.expectOKWithString('http')) // some web address, as this is a web action
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName4)))

  it('should create an anonymous action via wsk action let', () =>
    cli
      .do(`wsk action let ${actionName9} = x=>({y:x.y})`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName9)))

  it('should create a file action via wsk action let', () =>
    cli
      .do(`wsk action let ${actionName10} = ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName10)))

  it('should create a sequence via wsk action let from activation context', () =>
    cli
      .do(`wsk action let ${actionName11} = ${actionName9}->${actionName10}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName11)))

  it('should create an HTML web action via let', () =>
    cli
      .do(`let ${actionName3} = ${ROOT}/data/openwhisk/hello.html`, this.app)
      .then(cli.expectOKWithAny)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName3))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_WEB_ACTION_URL)))

  it('should create a packaged HTML web action via let', () =>
    cli
      .do(`let ${packageName3}/${actionName14} = ${ROOT}/data/openwhisk/hello.html`, this.app)
      .then(cli.expectOKWithString(actionName14)) // actionName14 will be part of the URL that appears in the command line response
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName14, undefined, undefined, packageName3))
      .then(sidecar.expectBadge('web'))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_WEB_ACTION_URL)))

  it('should create an anonymous function with -p and -a', () =>
    cli
      .do(`let ${actionName22} = x=>x -a x 3 -p y 4`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName22)))
  it('should switch to parameters mode', () =>
    cli
      .do('wsk action parameters', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName22))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectStruct({ y: 4 })))
  it('should switch to annotations mode', () =>
    cli
      .do('wsk action annotations', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName22))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectSubset({ x: 3 })))

  it('should create an HTML web action via let, with actions and parameters', () =>
    cli
      .do(`let ${actionName8} = ${ROOT}/data/openwhisk/hello.html -a x 3 -p y 4`, this.app)
      .then(cli.expectOKWithString(actionName8)) // actionName8 will be part of the URL in the command line response
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName8))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_WEB_ACTION_URL)))
  it('should switch to parameters mode', () =>
    cli
      .do('wsk action parameters', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName8))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectStruct({ y: 4 })))
  it('should switch to annotations mode', () =>
    cli
      .do('wsk action annotations', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName8))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(
        ui.expectSubset({
          x: 3,
          'web-export': true,
          'content-type-extension': 'html'
        })
      ))

  it('should create an SVG web action via let', () =>
    cli
      .do(`let icon = ${ROOT}/data/openwhisk/icon.svg`, this.app)
      .then(cli.expectOKWithString('icon.svg')) // icon.svg will be part of the URL in the command line response
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('icon'))
      .then(sidecar.expectBadge('web'))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_WEB_ACTION_URL)))

  it('should create a JSON web action via let', () =>
    cli
      .do(`let ${actionName15}.json = x=>x`, this.app)
      .then(cli.expectOKWithString(actionName15)) // actionName15 will be part of teh URL in the command line response
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName15))
      .then(sidecar.expectBadge('web'))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_WEB_ACTION_URL)))

  //
  // css action
  //
  it('should create a css action via let', () =>
    cli
      .do(`let ${actionName19}.css = ${CSS_INPUT}`, this.app)
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => rp({ url: href, rejectUnauthorized: false }))
      .then(content =>
        readFile(CSS_INPUT, (err, data) => {
          if (err) throw err
          else assert.strictEqual(content, data.toString())
        })
      )
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName19))
      .then(sidecar.expectBadge('web')))

  //
  // inline action with quotes
  //
  const body = '<Response><Message>OK</Message></Response>'
  it('should create an inline function with quotes in the body', () =>
    cli
      .do(`let ${actionName21}.html = x=>({ html: "${body}" })`, this.app)
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => rp({ url: href, rejectUnauthorized: false }))
      .then(content => assert.strictEqual(content, body))
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName21))
      .then(sidecar.expectBadge('web')))

  //
  // png action
  //
  /* if (false) { // openwhisk broken on 20170831
    it('should create a png action via let', () => cli.do(`let ${actionName20} = ${PNG_INPUT}`, this.app)
      .then(cli.expectOKWithCustom({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => rp({ url: href, rejectUnauthorized: false }))
      .then(content => fs.readFile(PNG_INPUT, (err, data) => {
        if (err) throw err
        else assert.equal(content, data)
      }))
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName20))
      .then(sidecar.expectBadge('web')))
  } */

  it('should create an action via let', () =>
    cli
      .do(`let ${actionName4} = x=>({y:x.y})`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName4)))
  it('should switch to parameters mode', () =>
    cli
      .do('wsk action parameters', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName4))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(text => assert.strictEqual(text, 'This entity has no parameters')))
  it('should switch to annotations mode', () =>
    cli
      .do('wsk action annotations', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName4))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectSubset({})))
  it('should switch to parameters mode via params', () =>
    cli
      .do('wsk action params', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName4))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(text => assert.strictEqual(text, 'This entity has no parameters')))

  // let from file with annotations and parameters
  it('should create an action via let, with annotations and parameters', () =>
    cli
      .do(`let ${actionName5} = ${ROOT}/data/openwhisk/foo.js -a x 3 -p y 4`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName5)))
  it('should switch to parameters mode', () =>
    cli
      .do('wsk action parameters', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName5))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectStruct({ y: 4 })))
  it('should switch to annotations mode', () =>
    cli
      .do('wsk action annotations', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName5))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectSubset({ x: 3 })))

  // let from file with multiple annotations and parameters
  it('should create an action via let, with annotations and parameters', () =>
    cli
      .do(`let ${actionName6} = ${ROOT}/data/openwhisk/foo.js -a x 3 -p y 4 -a xx 33 -p yy 44`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName6)))
  it('should switch to parameters mode', () =>
    cli
      .do('wsk action parameters', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName6))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectStruct({ y: 4, yy: 44 })))
  it('should switch to annotations mode', () =>
    cli
      .do('wsk action annotations', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName6))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectSubset({ x: 3, xx: 33 })))

  // anonymous let from with annotations and parameters
  it('should create an anonymous action via let, with annotations and parameters', () =>
    cli
      .do(`let ${actionName7} = x => x -a x 3 -p y 4`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName7)))
  it('should switch to parameters mode', () =>
    cli
      .do('wsk action parameters', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName7))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectStruct({ y: 4 })))
  it('should switch to annotations mode', () =>
    cli
      .do('wsk action annotations', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName7))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
      .then(ui.expectSubset({ x: 3 })))

  it('should create an action via let with extension', () =>
    cli
      .do(`let ${actionName}.js = x=>({y:x.y})`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName)))

  // invoke it
  it('should do an async of the action, using implicit context', () =>
    cli.do(`wsk action async -p y 3`, this.app).then(cli.expectOKWithString(actionName))) // e.g. "invoked `actionName` with id:"

  // call await
  it('should await successful completion of the activation', () =>
    cli
      .do(`wsk $ await`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ y: 3 })))
})
