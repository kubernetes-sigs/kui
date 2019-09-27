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
import * as assert from 'assert'
import { remove as rimraf } from 'fs-extra'

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname, join } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName1 = 'foo1'
const actionName2 = 'foo2'
const actionName16 = 'foo16'
const actionName16b = 'foo16b'
const actionName16c = 'foo16c'
const actionName18 = 'foo18'

describe('Create zip actions', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  const makeActionFromZip = (cmd: string, name: string) => {
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(name))
        .then(
          SidecarExpect.source(`/**
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

                                  exports.main = main`)
        )
        .then(() => this.app.client.click(`${Selectors.SIDECAR_MODE_BUTTON('raw')}`))
        .then(() => this.app)
        .then(
          SidecarExpect.sourceSubset({
            name,
            publish: false,
            annotations: [
              {
                key: 'file',
                value: actual => actual.endsWith('data/openwhisk/zip/sendmail.zip')
              },
              {
                key: 'wskng.combinators',
                value: [
                  {
                    type: 'action.kind',
                    role: 'replacement',
                    badge: 'zip'
                  }
                ]
              },
              {
                key: 'binary',
                value: true
              },
              {
                key: 'exec'
              }
            ],
            exec: {
              code: '…',
              binary: true
            },
            parameters: [],
            limits: {
              concurrency: 1,
              timeout: 60000,
              memory: 256,
              logs: 10
            }
          })
        )
        .catch(Common.oops(this, true))
    )
  }

  makeActionFromZip(`let ${actionName1} = ${ROOT}/data/openwhisk/zip/sendmail.zip`, actionName1)
  makeActionFromZip(
    `wsk action update ${actionName2} ${ROOT}/data/openwhisk/zip/sendmail.zip --kind nodejs:6`,
    actionName2
  )

  //
  // zip action without npm install, with params and annotations
  //
  const src = file => fs.readFileSync(join(ROOT, 'data', file)).toString()
  it('should create a zip action via let with params and annotations', () =>
    CLI.command(`let ${actionName16b}.zip = ${ROOT}/data/openwhisk/zip -p yy 33 -a aa yoyo`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName16b))
      .then(SidecarExpect.badge('zip'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(code => assert.strictEqual(code.replace(/\s+/g, ''), src('openwhisk/zip/index.js').replace(/\s+/g, '')))
      .catch(Common.oops(this, true)))
  it('should switch to annotations mode', () =>
    CLI.command('wsk action annotations', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName16b))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ aa: 'yoyo' }))
      .catch(Common.oops(this, true)))
  // invoke it
  it('should do an invoke of the action, using implicit context', () =>
    CLI.command(`wsk action invoke`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName16b))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ yy: 33, data: 'hello world\n' }))
      .catch(Common.oops(this, true)))

  //
  // python zip action
  //
  it('should create a python zip ', () =>
    CLI.command(`let ${actionName16c}.zip = ${ROOT}/data/openwhisk/zip-python --kind python`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName16c))
      .then(SidecarExpect.badge('zip'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(code =>
        assert.strictEqual(code.replace(/\s+/g, ''), src('openwhisk/zip-python/index.py').replace(/\s+/g, ''))
      )
      .catch(Common.oops(this, true)))

  //
  // zip action without npm install
  //
  it('should create a zip action via let', () =>
    CLI.command(`let ${actionName16}.zip = ${ROOT}/data/openwhisk/zip`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName16))
      .then(SidecarExpect.source(fs.readFileSync(join(ROOT, 'data/openwhisk/zip/index.js')).toString())) // sidecar should display the source to index.js
      .then(SidecarExpect.badge('zip'))
      .catch(Common.oops(this, true)))
  // invoke it
  it('should do an async of the action, using implicit context', () =>
    CLI.command(`wsk action async -p y 3`, this.app)
      .then(ReplExpect.okWithString(actionName16)) // e.g. "invoked `actionName16` with id:"
      .catch(Common.oops(this, true)))
  // call await
  it('should await successful completion of the activation', () =>
    CLI.command(`wsk $ await`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName16))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ y: 3, data: 'hello world\n' }))
      .catch(Common.oops(this, true)))
  // doSwitch('/wsk/actions', '/wsk/actions')

  //
  // zip action WITH npm install
  //     first we delete the node_modules subdirectory using the del npm
  //
  it('should create a zip action with npm install via let', () =>
    rimraf(`${ROOT}/data/openwhisk/zip-action/src/node_modules`)
      .then(() => assert.ok(!fs.existsSync(`${ROOT}/data/openwhisk/zip-action/src/node_modules`)))
      .then(() => CLI.command(`let ${actionName18}.zip = ${ROOT}/data/openwhisk/zip-action/src`, this.app))
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName18))
      .catch(Common.oops(this, true)))
  // invoke it
  it('should do an async of the action, using implicit context', () =>
    CLI.command(`wsk action async --param lines '["and now", "for something completely", "different" ]'`, this.app)
      .then(ReplExpect.okWithString(actionName18)) // e.g. "invoked `actionName18` with id:"
      .catch(Common.oops(this, true)))
  // call await
  it('should await successful completion of the activation', () =>
    CLI.command(`wsk $ await`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName18))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(
        Util.expectStruct({
          padded: ['.......................and now', '......for something completely', '.....................different']
        })
      )
      .catch(Common.oops(this, true)))
  // doSwitch('/wsk/actions', '/wsk/actions')
})
