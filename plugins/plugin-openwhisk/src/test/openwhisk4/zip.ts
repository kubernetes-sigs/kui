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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName1 = 'foo1'
const actionName2 = 'foo2'

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
})
