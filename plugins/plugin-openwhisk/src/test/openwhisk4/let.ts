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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const { rp } = openwhisk
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const CSS_INPUT = `${ROOT}/data/openwhisk/style.css`

const actionName = 'foo'
const actionName2 = 'foo2'
// const actionName3 = 'foo3'
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
// const actionName14 = 'foo14'
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

describe('Create an action via let core tests', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create a sequence via let with annotations', () =>
    CLI.command(`let ${seqName5} = x=>x -> x=>x -a foo bar -a xxx 333`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName5)))
  xit('should switch to annotations mode', () =>
    CLI.command('wsk action annotations', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName5))
      .then(Util.getValueFromMonaco)
      .then(Util.expectYAMLSubset({ foo: 'bar', xxx: 333, exec: 'sequence' })))

  it('should create an action via let without extension', () =>
    CLI.command(`let ${actionName2} = x=>({y:x.y})`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2)))

  xit('should create an action via let with an explicit kind', () =>
    CLI.command(`let ${actionName23} = ${ROOT}/data/openwhisk/echo.js --kind nodejs:8`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName23))
      .then(res =>
        res.app.client.$(`${Selectors.SIDECAR(res.count)} .sidecar-header-secondary-content .action-content .kind`)
      )
      .then(_ => _.getText())
      .then(kindString => assert.ok(kindString.indexOf('nodejs:8') >= 0)))

  it('should create an packaged action with new package that has a dot in its name', () =>
    CLI.command(`let ${packageName3}/${actionName17} = x=>x`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName17, packageName3)))

  it('should create a packaged action with new package', () =>
    CLI.command(`let ${packageName1}/${actionName12} = x=>({y:x.y})`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName12, packageName1)))

  it('should create a package', () =>
    CLI.command(`wsk package update ${packageName2}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(packageName2)))

  it('should create a packaged action with existing package', () =>
    CLI.command(`let ${packageName2}/${actionName13} = x=>({y:x.y})`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName13, packageName2)))

  xit('should create a sequence with inline file', async () => {
    const res = await CLI.command(
      `wsk action let ${seqName1} = ${actionName2} -> ${ROOT}/data/openwhisk/hello.html`,
      this.app
    )
    await ReplExpect.okWithString('http')(res) // some web address, as this is a web action
    await SidecarExpect.open(res).then(SidecarExpect.showing(seqName1))
  })

  xit('should create a sequence with inline anonymous and inline file', async () => {
    const res = await CLI.command(`wsk action let ${seqName2} = x=>x -> ${ROOT}/data/openwhisk/hello.html`, this.app)
    await ReplExpect.okWithString('http')(res) // some web address, as this is a web action
    await SidecarExpect.open(res).then(SidecarExpect.showing(seqName2))
  })

  xit('should create a sequence with inline anonymous and inline file (no whitespace)', () =>
    CLI.command(`wsk action let ${seqName3}=x=>x->${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName3)))

  xit('should create a sequence with two inline files', async () => {
    const res = await CLI.command(
      `wsk action let ${seqName4}=${ROOT}/data/openwhisk/foo.js-> ${ROOT}/data/openwhisk/hello.html`,
      this.app
    )
    await ReplExpect.okWithString('http')(res) // some web address, as this is a web action
    await SidecarExpect.open(res).then(SidecarExpect.showing(seqName4))
  })

  it('should create an anonymous action via wsk action let', () =>
    CLI.command(`wsk action let ${actionName9} = x=>({y:x.y})`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName9)))

  it('should create a file action via wsk action let', () =>
    CLI.command(`wsk action let ${actionName10} = ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName10)))

  it('should create a sequence via wsk action let from activation context', () =>
    CLI.command(`wsk action let ${actionName11} = ${actionName9}->${actionName10}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName11)))

  /* xit('should create an HTML web action via let', () =>
    CLI.command(`let ${actionName3} = ${ROOT}/data/openwhisk/hello.html`, this.app)
      .then(ReplExpect.okWithAny)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName3))
      .then(() => this.app.client.waitForExist(Selectors.SIDECAR_WEB_ACTION_URL))) */

  /* xit('should create a packaged HTML web action via let', () =>
    CLI.command(`let ${packageName3}/${actionName14} = ${ROOT}/data/openwhisk/hello.html`, this.app)
      .then(ReplExpect.okWithString(actionName14)) // actionName14 will be part of the URL that appears in the command line response
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName14, packageName3))
      .then(SidecarExpect.badge('web'))
      .then(() => this.app.client.waitForExist(Selectors.SIDECAR_WEB_ACTION_URL))) */

  xit('should create an anonymous function with -p and -a', () =>
    CLI.command(`let ${actionName22} = x=>x -a x 3 -p y 4`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName22)))
  xit('should switch to parameters mode', () =>
    CLI.command('wsk action parameters', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName22))
      .then(res => res.app.client.$(`${Selectors.SIDECAR_CONTENT(res.count)} .action-source`))
      .then(_ => _.getText())
      .then(Util.expectStruct({ y: 4 })))
  xit('should switch to annotations mode', () =>
    CLI.command('wsk action annotations', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName22))
      .then(res => res.app.client.$(`${Selectors.SIDECAR_CONTENT(res.count)} .action-source`))
      .then(_ => _.getText())
      .then(Util.expectSubset({ x: 3 })))

  /* xit('should create an HTML web action via let, with actions and parameters', () =>
    CLI.command(`let ${actionName8} = ${ROOT}/data/openwhisk/hello.html -a x 3 -p y 4`, this.app)
      .then(ReplExpect.okWithString(actionName8)) // actionName8 will be part of the URL in the command line response
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName8))
      .then(() => this.app.client.waitForExist(Selectors.SIDECAR_WEB_ACTION_URL))) */
  xit('should switch to parameters mode', () =>
    CLI.command('wsk action parameters', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName8))
      .then(res => res.app.client.$(`${Selectors.SIDECAR_CONTENT(res.count)} .action-source`))
      .then(_ => _.getText())
      .then(Util.expectStruct({ y: 4 })))
  xit('should switch to annotations mode', () =>
    CLI.command('wsk action annotations', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName8))
      .then(res => res.app.client.$(`${Selectors.SIDECAR_CONTENT(res.count)} .action-source`))
      .then(_ => _.getText())
      .then(
        Util.expectSubset({
          x: 3,
          'web-export': true,
          'content-type-extension': 'html'
        })
      ))

  xit('should create an SVG web action via let', async () => {
    const res = await CLI.command(`let icon = ${ROOT}/data/openwhisk/icon.svg`, this.app)
    await ReplExpect.okWithString('icon.svg')(res) // icon.svg will be part of the URL in the command line response
    await SidecarExpect.open(res)
      .then(SidecarExpect.showing('icon'))
      .then(SidecarExpect.badge('web'))
  })

  xit('should create a JSON web action via let', async () => {
    const res = await CLI.command(`let ${actionName15}.json = x=>x`, this.app)
    await ReplExpect.okWithString(actionName15)(res) // actionName15 will be part of teh URL in the command line response
    await SidecarExpect.open(res)
      .then(SidecarExpect.showing(actionName15))
      .then(SidecarExpect.badge('web'))
  })

  //
  // css action
  //
  xit('should create a css action via let', async () => {
    try {
      const res = await CLI.command(`let ${actionName19}.css = ${CSS_INPUT}`, this.app)

      await ReplExpect.okWithCustom<string>({ selector: '.entity-web-export-url' })(res)
        .then(selector => this.app.client.$(selector))
        .then(_ => _.getText())
        .then(href => rp({ url: href, rejectUnauthorized: false }))
        .then(content =>
          readFile(CSS_INPUT, (err, data) => {
            if (err) throw err
            else assert.strictEqual(content, data.toString())
          })
        )

      await SidecarExpect.open(res).then(SidecarExpect.showing(actionName19))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  //
  // inline action with quotes
  //
  const body = '<Response><Message>OK</Message></Response>'
  xit('should create an inline function with quotes in the body', async () => {
    try {
      const res = await CLI.command(`let ${actionName21}.html = x=>({ html: "${body}" })`, this.app)

      await ReplExpect.okWithCustom<string>({ selector: '.entity-web-export-url' })(res)
        .then(selector => this.app.client.$(selector))
        .then(_ => _.getText())
        .then(href => rp({ url: href, rejectUnauthorized: false }))
        .then(content => assert.strictEqual(content, body))

      await SidecarExpect.open(res)
        .then(SidecarExpect.showing(actionName21))
        .then(SidecarExpect.badge('web'))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  //
  // png action
  //
  /* if (false) { // openwhisk broken on 20170831
    it('should create a png action via let', () => CLI.command(`let ${actionName20} = ${PNG_INPUT}`, this.app)
      .then(ReplExpect.okWithCustom<string>({ selector: '.entity-web-export-url' }))
      .then(selector => this.app.client.getText(selector))
      .then(href => rp({ url: href, rejectUnauthorized: false }))
      .then(content => fs.readFile(PNG_INPUT, (err, data) => {
        if (err) throw err
        else assert.equal(content, data)
      }))
      .then(() => this.app)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName20))
      .then(SidecarExpect.badge('web')))
  } */

  it('should create an action via let', () =>
    CLI.command(`let ${actionName4} = x=>({y:x.y})`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName4)))

  // let from file with annotations and parameters
  xit('should create an action via let, with annotations and parameters', () =>
    CLI.command(`let ${actionName5} = ${ROOT}/data/openwhisk/foo.js -a x 3 -p y 4`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName5)))
  xit('should switch to parameters mode', () =>
    CLI.command('wsk action parameters', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName5))
      .then(res => res.app.client.$(`${Selectors.SIDECAR_CONTENT(res.count)} .action-source`))
      .then(_ => _.getText())
      .then(Util.expectStruct({ y: 4 })))
  xit('should switch to annotations mode', () =>
    CLI.command('wsk action annotations', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName5))
      .then(res => res.app.client.$(`${Selectors.SIDECAR_CONTENT(res.count)} .action-source`))
      .then(_ => _.getText())
      .then(Util.expectSubset({ x: 3 })))

  // let from file with multiple annotations and parameters
  xit('should create an action via let, with annotations and parameters', () =>
    CLI.command(`let ${actionName6} = ${ROOT}/data/openwhisk/foo.js -a x 3 -p y 4 -a xx 33 -p yy 44`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName6)))
  xit('should switch to parameters mode', () =>
    CLI.command('wsk action parameters', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName6))
      .then(res => res.app.client.$(`${Selectors.SIDECAR_CONTENT(res.count)} .action-source`))
      .then(_ => _.getText())
      .then(Util.expectStruct({ y: 4, yy: 44 })))
  xit('should switch to annotations mode', () =>
    CLI.command('wsk action annotations', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName6))
      .then(res => res.app.client.$(`${Selectors.SIDECAR_CONTENT(res.count)} .action-source`))
      .then(_ => _.getText())
      .then(Util.expectSubset({ x: 3, xx: 33 })))

  // anonymous let from with annotations and parameters
  xit('should create an anonymous action via let, with annotations and parameters', () =>
    CLI.command(`let ${actionName7} = x => x -a x 3 -p y 4`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName7)))
  xit('should switch to parameters mode', () =>
    CLI.command('wsk action parameters', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName7))
      .then(res => res.app.client.$(`${Selectors.SIDECAR_CONTENT(res.count)} .action-source`))
      .then(_ => _.getText())
      .then(Util.expectStruct({ y: 4 })))
  xit('should switch to annotations mode', () =>
    CLI.command('wsk action annotations', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName7))
      .then(res => res.app.client.$(`${Selectors.SIDECAR_CONTENT(res.count)} .action-source`))
      .then(_ => _.getText())
      .then(Util.expectSubset({ x: 3 })))

  it('should create an action via let with extension', () =>
    CLI.command(`let ${actionName}.js = x=>({y:x.y})`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName)))

  // invoke it
  it('should do an async of the action, using implicit context', () =>
    CLI.command(`wsk action async -p y 3`, this.app).then(ReplExpect.okWithString(actionName))) // e.g. "invoked `actionName` with id:"

  // call await
  xit('should await successful completion of the activation', () =>
    CLI.command(`wsk $ await`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(Util.getValueFromMonaco)
      .then(Util.expectYAML({ y: 3 })))
})
