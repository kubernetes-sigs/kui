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

import * as assert from 'assert'
import { readFile } from 'fs'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname, join } from 'path'
const { cli, normalizeHTML, selectors, sidecar } = ui
const { rp, localDescribe } = common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const commandFile = `${ROOT}/data/openwhisk/commandFile.wsk`
const local = join(ROOT, 'data/openwhisk/openwhisk-shell-demo-html')

const API_HOST = process.env.API_HOST
const ns = ui.expectedNamespace()

/**
 * Make sure the given host is proper
 *
 */
const clean = host => {
  // eslint-disable-next-line node/no-deprecated-api
  const parsed = require('url').parse(host)
  if (!parsed.protocol) {
    return `https://${host}`
  } else {
    return host
  }
}

localDescribe('Execute a command file', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('execute commands from a file', () => cli.do(`run ${commandFile}`, this.app)
    .then(cli.expectOKWithCustom({ selector: '.entity:not(.header-row)' }))
    .then(selector => this.app.client.waitUntil(async () => {
      const rows = await this.app.client.elements(`${selector} badge.green-background`)
      return rows.value.length === 3
    }))
    .then(() => rp({ url: `${clean(API_HOST)}/api/v1/web/${ns}/public/hello.html`, rejectUnauthorized: false }))
    .then(content => readFile(local, (err, data) => {
      if (err) {
        throw err
      } else {
        assert.strictEqual(normalizeHTML(content),
          normalizeHTML(data).replace('nickm_wskng_test', `${ns}`))
      }
    }))
    .catch(common.oops(this)))
})
