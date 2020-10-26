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

import { readFile } from 'fs'
import * as assert from 'assert'

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const { rp } = openwhisk
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const REMOTE1 = {
  url: 'https://ibm.box.com/shared/static/8eraoo66gza7rbd7xxi2nal7v9jav8wf.html',
  local: `${ROOT}/data/openwhisk/hello.html`
}
const REMOTE2 = {
  url: 'https://ibm.box.com/shared/static/zsye0mwai0kce2p6wssltpsi5bfj9dy0.html',
  local: `${ROOT}/data/openwhisk/openwhisk-shell-demo-html`
}
const actionName = 'foo'
const actionName2 = 'foo2'
const actionName3 = 'foo3'
const actionName4 = 'foo4'
const actionName5 = 'foo5'
const actionName6 = 'foo6'
const packageName = 'ppp'
const packageName2 = 'ppp2'
const packageName3 = 'ppp3'

// disable, see https://github.com/IBM/kui/issues/2732
xdescribe('Create an action via let from a remote resource', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  const doCreate = remote => (actionName, extension = '', packageName?) => async () => {
    try {
      const res = await CLI.command(
        `let ${packageName ? packageName + '/' : ''}${actionName}${extension} = ${remote.url}`,
        this.app
      )

      await ReplExpect.okWithCustom({ selector: '.entity-web-export-url' })(res)
        .then(selector => this.app.client.getText(selector))
        .then(href => rp({ url: href, rejectUnauthorized: false }))
        .then(content =>
          readFile(remote.local, (err, data) => {
            if (err) {
              throw err
            } else {
              assert.strictEqual(
                openwhisk.normalizeHTML(content),
                openwhisk.normalizeHTML(data).replace('nickm_wskng_test', openwhisk.expectedNamespace())
              )
            }
          })
        )

      await SidecarExpect.open(res).then(SidecarExpect.showing(actionName, packageName))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  }

  const doCreate1 = doCreate(REMOTE1)
  const doCreate2 = doCreate(REMOTE2)

  it('should create an action from a remote resource', doCreate1(actionName))
  it('should create an action from a remote resource, with extension', doCreate1(actionName2, '.html'))
  it(
    'should create an action from a remote resource, with extension and package name',
    doCreate1(actionName3, '.html', packageName)
  )
  it(
    'should create an action from a remote resource, without extension, with package name',
    doCreate1(actionName4, '', packageName2)
  )

  it('should create an action from a remote resource that has no extension', doCreate2(actionName5, '.html'))
  it(
    'should create an action from a remote resource that has no extension, with package name',
    doCreate2(actionName6, '.html', packageName3)
  )
})
