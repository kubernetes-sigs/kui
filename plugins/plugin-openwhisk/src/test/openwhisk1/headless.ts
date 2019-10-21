/*
 * Copyright 2018 IBM Corporation
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

import { Common } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import { cli } from '@kui-shell/core/tests/lib/headless'

import { dirname, join } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

function odescribe(name: string, suite: (this: Common.ISuite) => void) {
  if ((!process.env.TRAVIS_JOB_ID || process.env.NEEDS_OPENWHISK) && process.env.MOCHA_RUN_TARGET !== 'webpack') {
    describe(name, suite)
  }
}

export const {
  version: expectedVersion
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('@kui-shell/settings/package.json')

odescribe('openwhisk headless mode', function(this: Common.ISuite) {
  before(openwhisk.before(this, { noApp: true }))

  // intentional typo with "actiono"
  // sometimes the output has "command not found", and sometimes it has just "not found"
  //   (macOS versus linux, i think)
  it('should show command not found', () =>
    cli
      .command('wsk actiono list', {}, { errOk: 1 })
      .then(cli.expectError(127, /(actiono:\s+)?(command\s+)?not found/))
      .catch(Common.oops(this)))

  it(`should show current version`, () =>
    cli
      .command('version')
      .then(cli.expectOK(expectedVersion, { exact: true }))
      .catch(Common.oops(this)))

  it(`should show current namespace`, () =>
    cli
      .command('wsk namespace current')
      .then(cli.expectOK(openwhisk.expectedNamespace(), { exact: true, squish: true }))
      .catch(Common.oops(this)))

  it('should show top-level help with -v', () =>
    cli
      .command('-v', {}, { errOk: 1 })
      .then(cli.expectError(500 - 256, 'Getting Started'))
      .catch(Common.oops(this)))

  it('should show top-level help with no arguments', () =>
    cli
      .command('', {}, { errOk: 1 })
      .then(cli.expectError(500 - 256, 'Getting Started'))
      .catch(Common.oops(this)))

  it('should show top-level help with help', () =>
    cli
      .command('help', {}, { errOk: 1 })
      .then(cli.expectError(500 - 256, 'Getting Started'))
      .catch(Common.oops(this)))

  it('should show wsk help with wsk', () =>
    cli
      .command('wsk', {}, { errOk: 1 })
      .then(cli.expectError(500 - 256, 'OpenWhisk'))
      .catch(Common.oops(this)))

  it('should show wsk help with wsk help', () =>
    cli
      .command('wsk help', {}, { errOk: 1 })
      .then(cli.expectError(500 - 256, 'OpenWhisk'))
      .catch(Common.oops(this)))

  it('should show wsk action get help with action get', () =>
    cli
      .command('wsk action get', {}, { errOk: 1 })
      .then(cli.expectError(497 - 256, 'OpenWhisk / Action Operations / get'))
      .catch(Common.oops(this)))

  /* bx plugin hard-codes that preview needs graphics
  it('should show preview help with preview', () => cli.command('preview', {}, { errOk: 1 })
    .then(cli.expectError(497 - 256, 'composer / CRUD Operations / preview composition'))
    .catch(Common.oops(this)))
  */

  const listers = ['wsk action list']
  listers.forEach(ls => {
    it(`should show empty ${ls}`, () =>
      cli
        .command(ls)
        .then(cli.expectOK('', { exact: true }))
        .catch(Common.oops(this)))
  })

  it('should create an action', () =>
    cli
      .command(`wsk action create foo ${join(ROOT, 'data/openwhisk/headless/foo.js')}`)
      .then(cli.expectOK('ok: updated action foo\n', { exact: true }))
      .catch(Common.oops(this)))

  listers.forEach(ls => {
    it(`should show one-entry ${ls}`, () =>
      cli
        .command(ls)
        .then(
          cli.expectOK('foo private nodejs', {
            skipLines: 1,
            squish: true
          })
        )
        .catch(Common.oops(this)))
  })

  it('should create an action with an env var parameter', () =>
    cli
      .command(`wsk action create envfun ${join(ROOT, 'data/openwhisk/headless/echo.js')} -p fun $FUN`, { FUN: 3 })
      .then(cli.expectOK('ok: updated action envfun\n', { exact: true }))
      .catch(Common.oops(this)))

  it('should create an action with params-with-spaces', () =>
    cli
      .command(`wsk action create spacey ${join(ROOT, 'data/openwhisk/headless/echo.js')} -p fun "space cadet"`)
      .then(cli.expectOK('ok: updated action spacey\n', { exact: true }))
      .catch(Common.oops(this)))

  it('should invoke spacey', () =>
    cli
      .command('wsk action invoke spacey')
      .then(cli.expectOK('"fun": "space cadet"'))
      .catch(Common.oops(this)))

  it('should async spacey', () =>
    cli
      .command('wsk action async spacey')
      .then(cli.expectOK('ok: invoked spacey with id'))
      .catch(Common.oops(this)))

  it('should create a three-element sequence', () =>
    cli
      .command(`let seq = 'x=>x' '->' 'x=>x' '->' 'x=>x'`)
      .then(cli.expectOK('ok: updated action seq\n', { exact: true }))
      .catch(Common.oops(this)))
  it('should async seq', () =>
    cli
      .command('wsk action async seq')
      .then(cli.expectOK('ok: invoked seq with id'))
      .then(line => {
        const match = line.match(/with id (.*)[\s]*$/)
        assert.ok(match)
        assert.strictEqual(match.length, 2)
        const activationId = match[1]

        return new Promise((resolve, reject) => {
          const fetch = () =>
            cli
              .command(`wsk activation logs ${activationId} --cli`)
              .then(response => {
                if (response.code === 404 - 256) {
                  // retry on 404, because the activation might not yet be available
                  console.error('Retrying on 404')
                  setTimeout(fetch, 2000)
                } else {
                  resolve(response)
                }
              })
              .catch(reject)
          fetch()
        })
      })
      .then(cli.expectOK())
      .then(output => {
        const lines = output.split(/\n/)
        assert.strictEqual(lines.length, 5) // 3 activationIds plus 'ok' plus trailing newline
      })
      .catch(Common.oops(this)))

  if (!process.env.LOCAL_OPENWHISK) {
    it('should set host to us-south', () =>
      cli
        .command('wsk host set us-south')
        .then(cli.expectOK())
        .then(() => cli.command('wsk host get'))
        .then(cli.expectOK('https://us-south.functions.cloud.ibm.com'))
        .catch(Common.oops(this)))

    const { apihostIsLocal } = openwhisk
    const apihost = apihostIsLocal ? 'local' : openwhisk.apihost
    it(`should restore host to original setting: ${apihost}`, () =>
      cli
        .command(`wsk host set ${apihost}`)
        .then(cli.expectOK())
        .then(() => cli.command('wsk host get'))
        .then(cli.expectOK(openwhisk.apihost))
        .catch(Common.oops(this)))
  }
})
