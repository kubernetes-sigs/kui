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

import { join } from 'path'
import * as fs from 'fs'
import * as assert from 'assert'

import { ISuite } from '@test/lib/common'
import * as common from '@test/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@test/lib/ui'
const { cli, selectors, sidecar } = ui

const actionName1 = 'foo1'
const actionName2 = 'foo2'
const actionName16 = 'foo16'
const actionName16b = 'foo16b'
const actionName16c = 'foo16c'
const actionName18 = 'foo18'

const rimraf = filepath => {
  if (fs.existsSync(filepath)) {
    fs.readdirSync(filepath).forEach((file, index) => {
      const curPath = join(filepath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        rimraf(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })

    fs.rmdirSync(filepath)
  }

  return Promise.resolve()
}

describe('Create zip actions', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  const makeActionFromZip = (cmd, name) => {
    it(cmd, () => cli.do(cmd, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(name))
      .then(sidecar.expectSource(`/**
 * Sends email.
 *
 * @param secret the secret for the sendmail service
 * @param from_email the from email address
 * @param from_name optional from name
 * @param to_email the to email address
 * @param to_name optionaal to name
 * @param subject optional subject for the email
 * @param content the body of the email
 **/
function main(args) {
    if (!args.from_email) {
        return {
            error: 'missing from email'
        }
    } else if (!args.to_email) {
        return {
            error: 'missing to email'
        }
    } else if (!args.secret) {
        return {
            error: 'missing secret'
        }
    }

    let mailer = require('sendgrid')(args.secret.split(':')[0], args.secret.split(':')[1])
    let email = new mailer.Email();
    email.addTo(args.to_email, args.to_name || '')
    email.setFrom(args.from_email, args.from_name || '')
    email.setSubject(args.subject || '')
    email.setText(args.content || '')

    return new Promise(function(resolve, reject) {
        mailer.send(email, (error, response) => {
            if (error) {
                console.log('error in sg', error.response.body)
                reject({
                    error: error.message
                })
            } else {
                console.log('email sent')
                resolve({
                    response: response
                })
            }
        })
    })
}

                                  exports.main = main`))
      .then(() => this.app.client.click(`${ui.selectors.SIDECAR_MODE_BUTTON('raw')}`))
      .then(() => this.app)
      .then(sidecar.expectSourceSubset({
        name,
        publish: false,
        annotations: [
          { key: 'file', value: actual => actual.endsWith('data/openwhisk/zip/sendmail.zip') },
          {
            key: 'wskng.combinators',
            value: [{
              type: 'action.kind',
              role: 'replacement',
              badge: 'zip'
            }]
          },
          {
            key: 'binary',
            value: true
          },
          {
            key: 'exec',
            value: 'nodejs:6'
          }
        ],
        version: '0.0.1',
        exec: {
          kind: 'nodejs:6',
          code: '…',
          binary: true
        },
        parameters: [],
        limits: {
          concurrency: 1,
          timeout: 60000,
          memory: 256,
          logs: 10
        },
        namespace: ui.expectedNamespace()
      }))
      .catch(common.oops(this)))
  }

  makeActionFromZip(`let ${actionName1} = data/openwhisk/zip/sendmail.zip`, actionName1)
  makeActionFromZip(`action update ${actionName2} data/openwhisk/zip/sendmail.zip --kind nodejs:6`, actionName2)

  //
  // zip action without npm install, with params and annotations
  //
  const src = file => fs.readFileSync(join(process.env.TEST_ROOT, 'data', file)).toString()
  it('should create a zip action via let with params and annotations', () => cli.do(`let ${actionName16b}.zip = ./data/openwhisk/zip -p yy 33 -a aa yoyo`, this.app)
    .then(cli.expectContext('/wsk/actions', actionName16b))
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName16b))
    .then(sidecar.expectBadge('zip'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(code => assert.strictEqual(code.replace(/\s+/g, ''), src('openwhisk/zip/index.js').replace(/\s+/g, ''))))
  it('should switch to annotations mode', () => cli.do('annotations', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName16b))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(ui.expectSubset({ 'aa': 'yoyo' })))
  // invoke it
  it('should do an invoke of the action, using implicit context', () => cli.do(`invoke`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName16b))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({ 'yy': 33, 'data': 'hello world\n' })))

  //
  // python zip action
  //
  it('should create a python zip ', () => cli.do(`let ${actionName16c}.zip = ./data/openwhisk/zip-python --kind python`, this.app)
    .then(cli.expectContext('/wsk/actions', actionName16c))
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName16c))
    .then(sidecar.expectBadge('zip'))
    .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
    .then(code => assert.strictEqual(code.replace(/\s+/g, ''), src('openwhisk/zip-python/index.py').replace(/\s+/g, '')))
    .catch(common.oops(this)))

  //
  // zip action without npm install
  //
  it('should create a zip action via let', () => cli.do(`let ${actionName16}.zip = ./data/openwhisk/zip`, this.app)
    .then(cli.expectContext('/wsk/actions', actionName16))
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName16))
    .then(sidecar.expectSource(fs.readFileSync(join(process.env.TEST_ROOT, './data/openwhisk/zip/index.js')).toString())) // sidecar should display the source to index.js
    .then(sidecar.expectBadge('zip')))
  // invoke it
  it('should do an async of the action, using implicit context', () => cli.do(`async -p y 3`, this.app)
    .then(cli.expectOKWithString(actionName16)) // e.g. "invoked `actionName16` with id:"
    .catch(common.oops(this)))
  // call await
  it('should await successful completion of the activation', () => cli.do(`$ await`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName16))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({ 'y': 3, 'data': 'hello world\n' })))
  // doSwitch('/wsk/actions', '/wsk/actions')

  //
  // zip action WITH npm install
  //     first we delete the node_modules subdirectory using the del npm
  //
  it('should create a zip action with npm install via let', () => rimraf([join(process.env.TEST_ROOT, 'data/openwhisk/zip-action/src/node_modules/**')])
    .then(() => assert.ok(!fs.existsSync(join(process.env.TEST_ROOT, 'data/openwhisk/zip-action/src/node_modules'))))
    .then(() => cli.do(`let ${actionName18}.zip = data/openwhisk/zip-action/src`, this.app))
    .then(cli.expectContext('/wsk/actions', actionName18))
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName18)))
  // invoke it
  it('should do an async of the action, using implicit context', () => cli.do(`async --param lines '["and now", "for something completely", "different" ]'`, this.app)
    .then(cli.expectOKWithString(actionName18)) // e.g. "invoked `actionName18` with id:"
    .catch(common.oops(this)))
  // call await
  it('should await successful completion of the activation', () => cli.do(`$ await`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName18))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({
      'padded': [
        '.......................and now',
        '......for something completely',
        '.....................different'
      ]
    })))
  // doSwitch('/wsk/actions', '/wsk/actions')
})
