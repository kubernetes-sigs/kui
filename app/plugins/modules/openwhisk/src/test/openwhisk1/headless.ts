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

const debug = require('debug')('test.headless')

import * as assert from 'assert'
import { exec } from 'child_process'

// for now, use require, to support headless from bx tests
import { HookFunction, Context, Suite } from 'mocha'
import { Application } from 'spectron'
interface ISuite extends Suite {
  app: Application
}
import { join } from 'path'
const ROOT = process.env.TEST_ROOT
const { ISuite } = require(join(ROOT, 'lib/common'))
const common = require(join(ROOT, 'lib/common'))
const ui = require(join(ROOT, 'lib/ui'))
const openwhisk = require(join(ROOT, 'lib/openwhisk'))

const kui = process.env.KUI || join(ROOT, '../kui.js')

interface IResponse {
  code: number
  output: string
  stderr?: string
}

const cli = {
  do: (cmd, env = {}, { errOk = undefined } = {}): Promise<IResponse> => new Promise((resolve, reject) => {
    const command = `${kui} ${cmd} --no-color`
    debug('executing command', command)

    exec(command, { env: Object.assign({}, process.env, env) }, (err, stdout, stderr) => {
      if (err) {
        const output = stdout.trim().concat(stderr)
        if (err['code'] !== errOk) {
          console.error('Error in command execution', err['code'], output)
        }
        resolve({ code: err['code'], output })
      } else {
        resolve({ code: 0, output: stdout, stderr })
      }
    })
  }),

  expectOK: (expectedOutput?, { exact = false, skipLines = 0, squish = false } = {}) => ({ code: actualCode, output: actualOutput }) => {
    assert.strictEqual(actualCode, 0)
    if (expectedOutput) {
      let checkAgainst = actualOutput

      // skip a number of initial lines?
      if (skipLines > 0) {
        checkAgainst = checkAgainst.split(/\n/).slice(1).join('\n')
      }

      // squish whitespace?
      if (squish) {
        checkAgainst = checkAgainst.split(/\n/).map(_ => _.replace(/\s+/g, ' ').trim()).join('\n').trim()
      }

      if (exact) {
        if (checkAgainst !== expectedOutput) {
          console.error(`mismatch; actual='${actualOutput}'; expected='${checkAgainst}'`)
        }
        assert.strictEqual(checkAgainst, expectedOutput)
      } else {
        const ok = actualOutput.indexOf(checkAgainst) >= 0
        if (!ok) {
          console.error(`mismatch; actual='${actualOutput}'; expected='${checkAgainst}'`)
        }
        assert.ok(ok)
      }
    }
    return actualOutput
  },
  expectError: (expectedCode, expectedOutput) => ({ code: actualCode, output: actualOutput }) => {
    assert.strictEqual(actualCode, expectedCode)
    if (expectedOutput) {
      const ok = actualOutput.indexOf(expectedOutput) >= 0
      if (!ok) {
        console.error(`mismatch; actual='${actualOutput}'; expected='${expectedOutput}'`)
      }
      assert.ok(ok)
    }
    return actualOutput
  }
}

describe('Headless mode', function (this: ISuite) {
  before(common.before(this, { noApp: true }))

  it(`should show current version`, () => cli.do('version')
    .then(cli.expectOK(`${require(join(ROOT, '../package.json')).version}\n`, { exact: true }))
    .catch(common.oops(this)))

  it(`should show current namespace`, () => cli.do('namespace current')
    .then(cli.expectOK(ui.expectedNamespace(), { exact: true, squish: true }))
    .catch(common.oops(this)))

  it('should show top-level help with -v', () => cli.do('-v', {}, { errOk: 1 })
    .then(cli.expectError(500 - 256, 'Shell Docs / Getting Started'))
    .catch(common.oops(this)))

  it('should show top-level help with no arguments', () => cli.do('', {}, { errOk: 1 })
    .then(cli.expectError(500 - 256, 'Shell Docs / Getting Started'))
    .catch(common.oops(this)))

  it('should show top-level help with help', () => cli.do('help', {}, { errOk: 1 })
    .then(cli.expectError(500 - 256, 'Shell Docs / Getting Started'))
    .catch(common.oops(this)))

  it('should show wsk help with wsk', () => cli.do('wsk', {}, { errOk: 1 })
    .then(cli.expectError(500 - 256, 'Shell Docs / OpenWhisk'))
    .catch(common.oops(this)))

  it('should show wsk help with wsk help', () => cli.do('wsk help', {}, { errOk: 1 })
    .then(cli.expectError(500 - 256, 'Shell Docs / OpenWhisk'))
    .catch(common.oops(this)))

  it('should show wsk action get help with action get', () => cli.do('action get', {}, { errOk: 1 })
    .then(cli.expectError(497 - 256, 'Shell Docs / OpenWhisk / Action operations / Get'))
    .catch(common.oops(this)))

  /* bx plugin hard-codes that preview needs graphics
  it('should show preview help with preview', () => cli.do('preview', {}, { errOk: 1 })
    .then(cli.expectError(497 - 256, 'Shell Docs / Composer / CRUD Operations / Preview composition'))
    .catch(common.oops(this)))
  */

  const listers = ['action list', 'wsk action list']
  listers.forEach(ls => {
    it(`should show empty ${ls}`, () => cli.do(ls)
      .then(cli.expectOK('', { exact: true }))
      .catch(common.oops(this)))
  })

  it('should create an action', () => cli.do(`action create foo ${join(ROOT, 'data/openwhisk/foo.js')}`)
    .then(cli.expectOK('ok: updated action foo\n', { exact: true }))
    .catch(common.oops(this)))

  listers.forEach(ls => {
    it(`should show one-entry ${ls}`, () => cli.do(ls)
      .then(cli.expectOK('foo private nodejs:6 0.0.1', { exact: true, skipLines: 1, squish: true }))
      .catch(common.oops(this)))
  })

  it('should create an action with an env var parameter', () => cli.do(`action create envfun ${join(ROOT, 'data/openwhisk/echo.js')} -p fun $FUN`, { FUN: 3 })
    .then(cli.expectOK('ok: updated action envfun\n', { exact: true }))
    .catch(common.oops(this)))

  it('should create an action with params-with-spaces', () => cli.do(`action create spacey ${join(ROOT, 'data/openwhisk/echo.js')} -p fun "space cadet"`)
    .then(cli.expectOK('ok: updated action spacey\n', { exact: true }))
    .catch(common.oops(this)))

  it('should invoke spacey', () => cli.do('action invoke spacey')
    .then(cli.expectOK('fun: "space cadet"'))
    .catch(common.oops(this)))

  it('should async spacey', () => cli.do('action async spacey')
    .then(cli.expectOK('ok: invoked spacey with id'))
    .catch(common.oops(this)))

  it('should create a three-element sequence', () => cli.do(`let seq = 'x=>x' '->' 'x=>x' '->' 'x=>x'`)
    .then(cli.expectOK('ok: updated action seq\n', { exact: true }))
    .catch(common.oops(this)))
  it('should async seq', () => cli.do('async seq')
    .then(cli.expectOK('ok: invoked seq with id'))
    .then(line => {
      const match = line.match(/with id (.*)[\s]*$/)
      assert.ok(match)
      assert.strictEqual(match.length, 2)
      const activationId = match[1]

      return new Promise((resolve, reject) => {
        const fetch = () => cli.do(`activation logs ${activationId} --cli`)
          .then(response => {
            if (response.code === 404 - 256) {
              // retry on 404, because the activation might not yet be available
              console.error('Retrying on 404')
              setTimeout(fetch, 2000)
            } else {
              resolve(response)
            }
          }).catch(reject)
        fetch()
      })
    })
    .then(cli.expectOK())
    .then(output => {
      const lines = output.split(/\n/)
      assert.strictEqual(lines.length, 5) // 3 activationIds plus 'ok' plus trailing newline
    })
    .catch(common.oops(this)))

  it('should set host to us-south', () => cli.do('host set us-south')
    .then(cli.expectOK())
    .then(() => cli.do('host get'))
    .then(cli.expectOK('https://openwhisk.ng.bluemix.net'))
    .catch(common.oops(this)))

  const { apihostIsLocal } = openwhisk
  const apihost = apihostIsLocal ? 'local' : openwhisk.apihost
  it(`should restore host to original setting: ${apihost}`, () => cli.do(`host set ${apihost}`)
    .then(cli.expectOK())
    .then(() => cli.do('host get'))
    .then(cli.expectOK(openwhisk.apihost))
    .catch(common.oops(this)))
})
