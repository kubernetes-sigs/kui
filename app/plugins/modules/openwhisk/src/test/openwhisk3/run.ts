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
import { dirname, join } from 'path'

import { ISuite } from '@test/lib/common'
import * as common from '@test/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@test/lib/ui'
const { cli, normalizeHTML, selectors, sidecar } = ui
const { rp } = common

const root = dirname(require.resolve('@test/package.json'))

const commandFile = 'data/openwhisk/commandFile.wsk'
const local = join(root, 'data/openwhisk/openwhisk-shell-demo-html')

const API_HOST = process.env.API_HOST || 'openwhisk.ng.bluemix.net'
const ns = ui.expectedNamespace()

/**
 * Make sure the given host is proper
 *
 */
const clean = host => {
  const parsed = require('url').parse(host)
  if (!parsed.protocol) {
    return `https://${host}`
  } else {
    return host
  }
}

describe('Execute a command file', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

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
