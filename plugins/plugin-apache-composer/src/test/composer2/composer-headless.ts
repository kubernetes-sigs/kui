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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import Debug from 'debug'

import * as assert from 'assert'

import * as common from '@kui-shell/core/tests/lib/common'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import * as ui from '@kui-shell/core/tests/lib/ui'
import { cli } from '@kui-shell/core/tests/lib/headless'
const debug = Debug('plugins/apache-composer/tests/headless')

function odescribe(name: string, suite: (this: common.ISuite) => void) {
  if (process.env.NEEDS_OPENWHISK) {
    describe(name, suite)
  }
}

interface Response {
  code: number
  output: {}
  stderr?: string
}

const expect = {
  appList: ({ name, packageName }) => ({ code: actualCode, output: actualOutput }) => {
    assert.strictEqual(actualCode, 0)
    const lines = actualOutput.split('\n')
    assert.strictEqual(lines[0].replace(/\s+/g, ' ').trim(), 'name type')

    let foundMatch = false
    for (let num = 1; num < lines.length; num++) {
      const appRow = lines[num].replace(/\s+/g, ' ').trim()
      if (packageName !== '') {
        if (appRow === `${packageName}/${name} composition`) {
          foundMatch = true
        }
      } else {
        if (appRow === `${name} composition`) {
          foundMatch = true
        }
      }
    }

    assert.ok(foundMatch)
    return actualOutput
  },

  json: ({ expectedOutput, expectedKeys }) => ({ code: actualCode, output: actualOutput }) => {
    assert.strictEqual(actualCode, 0)
    actualOutput = JSON.parse(actualOutput)

    if (expectedKeys) {
      debug('expected', expectedKeys)
      debug('actual', actualOutput)
      debug('expected keys have all keys in acutal output')
      for (const key in expectedKeys) {
        debug(`checking if ${expectedKeys[key]} is in actualOutput`)
        assert(actualOutput[expectedKeys[key]] !== 'undefined')
      }
      debug('actual ouputs have all expected keys')
    }
    if (expectedOutput) assert.deepStrictEqual(actualOutput, expectedOutput)
    return actualOutput
  }
}

class Validation {
  ctx: common.ISuite

  constructor(ctx: common.ISuite) {
    this.ctx = ctx
  }

  appList({ name, packageName = '', namespace = '' }) {
    if (namespace !== '') {
      it(`validate app list /${namespace}`, () =>
        cli
          .do(`wsk app list /${namespace}`)
          .then(expect.appList({ name, packageName }))
          .catch(common.oops(this.ctx)))
    }

    if (packageName !== '') {
      it(`validate app list ${packageName}/`, () =>
        cli
          .do(`wsk app list ${packageName}/`)
          .then(expect.appList({ name, packageName }))
          .catch(common.oops(this.ctx)))
    }

    it(`validate app list`, () =>
      cli
        .do(`wsk app list`)
        .then(expect.appList({ name, packageName }))
        .catch(common.oops(this.ctx)))
  }

  // every app invoke commands are converted to blocking invocation and only displays the response result
  invoke({ name, params = '', output, packageName = '', namespace = '' }) {
    if (packageName !== '') name = `${packageName}/${name}`
    if (namespace !== '') name = `/${namespace}/${name}`

    const invokers = [
      `wsk app invoke ${name} ${params}`,
      `wsk app invoke ${name} -b ${params}`,
      `wsk app invoke ${name} -r ${params}`,
      `wsk app invoke ${name} -br ${params}`,
      `wsk app invoke ${name} --result ${params}`,
      `wsk app invoke ${name} --blocking --result ${params}`
    ]

    invokers.forEach(invoker => {
      it(`validate ${invoker}`, () =>
        cli
          .do(invoker)
          .then(expect.json({ expectedOutput: output, expectedKeys: undefined }))
          .catch(common.oops(this.ctx)))
    })
  }

  async({ name, packageName = '', namespace = '' }) {
    if (packageName !== '') name = `${packageName}/${name}`
    if (namespace !== '') name = `/${namespace}/${name}`

    it(`validate async ${name}`, () =>
      cli
        .do(`wsk app async ${name}`)
        .then(cli.expectOK(`ok: invoked ${name} with id`, { exact: false }))
        .catch(common.oops(this.ctx)))

    it(`validate async ${name} ; session get ; session list`, () =>
      cli
        .do(`wsk app async ${name}`)
        .then(cli.expectOK(`ok: invoked ${name} with id`, { exact: false }))
        .then(line => {
          // session get
          const match = line.match(/with id (.*)[\s]*$/)
          assert.ok(match)
          assert.strictEqual(match.length, 2)
          const sessionId = match[1]

          return new Promise((resolve, reject) => {
            const fetch = retry =>
              cli
                .do(`wsk session get ${sessionId}`)
                .then(response => {
                  if (response.code === 404 - 256) {
                    // retry on 404, because the session might not yet be available
                    if (retry < 5) {
                      console.error(`${retry} retry session get ${name} when 404`)
                      setTimeout(function() {
                        fetch(retry + 1)
                      }, 2000)
                    } else {
                      throw new Error(response.stderr)
                    }
                  } else {
                    expect.json({
                      expectedOutput: undefined,
                      expectedKeys: [
                        'activationId',
                        'annotations',
                        'duration',
                        'end',
                        'logs',
                        'name',
                        'namespace',
                        'response',
                        'start',
                        'subject'
                      ]
                    })(response)
                    resolve(sessionId)
                  }
                })
                .catch(reject)

            fetch(0)
          })
        })
        .then(sessionId => {
          // session list
          return new Promise((resolve, reject) => {
            const fetchList = retry =>
              cli
                .do(`wsk session list`)
                .then(response => {
                  const lines = response.output.split(/\n/)
                  const names = name.split('/')
                  const nameWithoutPackage = names[names.length - 1]

                  cli.expectOK('activationId name', {
                    exact: true,
                    skipLines: 0,
                    squish: true
                  })({ code: response.code, output: lines[0] }) // check the title line

                  const containsExpectedLine = lines.some(line => {
                    try {
                      cli.expectOK(`${sessionId} ${nameWithoutPackage}`, {
                        exact: true,
                        skipLines: 0,
                        squish: true
                      })({ code: response.code, output: line })
                      return true
                    } catch (err) {
                      return false
                    }
                  })

                  if (!containsExpectedLine) {
                    if (retry < 10) {
                      console.error(`${retry} retry session list when not found ${sessionId} ${nameWithoutPackage}`)
                      debug('session list result', lines)
                      setTimeout(function() {
                        fetchList(retry + 1)
                      }, 2000)
                    } else {
                      throw Error(`session list could not find session id: ${sessionId}`)
                    }
                  } else {
                    resolve()
                  }
                })
                .catch(reject)

            fetchList(0)
          })
        })
        .catch(common.oops(this.ctx)))
  }

  appGet({ name, packageName = '', namespace = '' }) {
    if (packageName !== '') name = `${packageName}/${name}`
    if (namespace !== '') name = `/${namespace}/${name}`

    const expectedKeys = ['annotations', 'limits', 'name', 'namespace', 'parameters', 'kind']
    if (packageName !== '') expectedKeys.push('packageName')

    xit(`validate app get ${name}`, () =>
      cli
        .do(`wsk app get ${name}`)
        .then(expect.json({ expectedOutput: undefined, expectedKeys: expectedKeys }))
        .catch(common.oops(this.ctx)))
  }

  do({ name, packageName = '', namespace = '', output, params = '', outputWithParams = {} }) {
    this.appList({ name, packageName, namespace })
    this.invoke({ name, output, packageName, namespace })
    if (params)
      this.invoke({
        name,
        params,
        output: outputWithParams,
        packageName,
        namespace
      })
    this.async({ name, packageName, namespace })
    this.appGet({ name, packageName, namespace })
  }
}

odescribe('Composer Headless Test', function(this: common.ISuite) {
  before(openwhisk.before(this, { noApp: true }))

  odescribe('should create simple composition from @demos', function(this: common.ISuite) {
    it('app create test1 @demos/hello.js', () =>
      cli
        .do('wsk app create test1 @demos/hello.js')
        .then(cli.expectOK('ok: updated composition /_/test1\n', { exact: true }))
        .catch(common.oops(this)))
    new Validation(this).do({
      name: 'test1',
      output: { msg: 'hello world!' },
      params: '-p name Users',
      outputWithParams: { msg: 'hello Users!' }
    })
  })

  odescribe('app list options', function(this: common.ISuite) {
    it('should get empty result by app list --limit 0', () =>
      cli
        .do('wsk app list --limit 0')
        .then(cli.expectOK('', { exact: true }))
        .catch(common.oops(this)))

    it('should get 1 by app list --count', () =>
      cli
        .do('wsk app list --count')
        .then(cli.expectOK('1\n', { exact: true }))
        .catch(common.oops(this)))

    it('should get test1 by app list --limit 1', () =>
      cli
        .do('wsk app list --limit 1')
        .then(expect.appList({ name: 'test1', packageName: '' }))
        .catch(common.oops(this)))

    it('should get empty result by app list --skip 1', () =>
      cli
        .do('wsk app list --skip 1')
        .then(cli.expectOK('', { exact: true }))
        .catch(common.oops(this)))
  })

  odescribe('should create composition with package', function(this: common.ISuite) {
    it('should fail with 404 when creating composition with non-existing package', () =>
      cli
        .do('wsk app create testing/subtest1 @demos/hello.js')
        .then(cli.expectError(cli.exitCode(404)))
        .catch(common.oops(this)))

    it('should create package first', () =>
      cli
        .do('wsk package create testing')
        .then(cli.expectOK('ok: updated package testing\n', { exact: true }))
        .catch(common.oops(this)))

    it('validate app create testing/subtest1 @demos/hello.js', () =>
      cli
        .do('wsk app create testing/subtest1 @demos/hello.js')
        .then(
          cli.expectOK('ok: updated composition /_/testing/subtest1\n', {
            exact: true
          })
        )
        .catch(common.oops(this)))

    new Validation(this).do({
      name: 'subtest1',
      packageName: 'testing',
      output: { msg: 'hello world!' },
      params: '-p name Users',
      outputWithParams: { msg: 'hello Users!' }
    })
  })

  if (ui.expectedNamespace()) {
    odescribe('should create composition with namespace', function(this: common.ISuite) {
      it('should create package first', () =>
        cli
          .do('wsk package update testing')
          .then(cli.expectOK('ok: updated package testing\n', { exact: true }))
          .catch(common.oops(this)))

      it('validate app create with namespace', () =>
        cli
          .do(`wsk app create /${ui.expectedNamespace()}/testing/subtest2 @demos/hello.js`)
          .then(cli.expectOK(`ok: updated composition /${ui.expectedNamespace()}/testing/subtest2\n`, { exact: true }))
          .catch(common.oops(this)))
      new Validation(this).do({
        name: 'subtest2',
        packageName: 'testing',
        namespace: ui.expectedNamespace(),
        output: { msg: 'hello world!' },
        params: '-p name Users',
        outputWithParams: { msg: 'hello Users!' }
      })
    })
  }

  odescribe('should fail when creating composition from non-exisiting file', function(this: common.ISuite) {
    it('fails app create error error.js', () =>
      cli
        .do('wsk app create error error.js')
        .then(cli.expectError(1))
        .catch(common.oops(this)))
  })

  odescribe('should create compostion and dependent actions with implicity entity', function(this: common.ISuite) {
    it('validate app create test2 @demos/if.js', () =>
      cli
        .do('wsk app create test2 @demos/if.js')
        .then(cli.expectOK('ok: updated composition /_/test2\n', { exact: true }))
        .catch(common.oops(this)))

    it('validate app invoke test2 fails', () =>
      cli
        .do('wsk app invoke test2')
        .then(res => res.output.indexOf('Failed to resolve action') !== -1)
        .catch(common.oops(this)))
  })

  odescribe('should update simple composition', function(this: common.ISuite) {
    it('validate app update test1 @demos/let.js', () =>
      cli
        .do('wsk app update test1 @demos/let.js')
        .then(cli.expectOK('ok: updated composition /_/test1\n', { exact: true }))
        .catch(common.oops(this)))
    new Validation(this).do({ name: 'test1', output: { ok: true } })
  })

  odescribe('should update simple composition with packageName', function(this: common.ISuite) {
    it('validate app update testing/subtest1 @demos/let.js', () =>
      cli
        .do('wsk app update testing/subtest1 @demos/let.js')
        .then(
          cli.expectOK('ok: updated composition /_/testing/subtest1\n', {
            exact: true
          })
        )
        .catch(common.oops(this)))
    new Validation(this).do({
      name: 'subtest1',
      packageName: 'testing',
      output: { ok: true }
    })
  })

  if (ui.expectedNamespace()) {
    odescribe('should update simple composition with namespace', function(this: common.ISuite) {
      it('should create package first', () =>
        cli
          .do('wsk package update testing')
          .then(cli.expectOK('ok: updated package testing\n', { exact: true }))
          .catch(common.oops(this)))

      it(`validate app update /${ui.expectedNamespace()}/testing/subtest2 @demos/let.js`, () =>
        cli
          .do(`wsk app update /${ui.expectedNamespace()}/testing/subtest2 @demos/let.js`)
          .then(cli.expectOK(`ok: updated composition /${ui.expectedNamespace()}/testing/subtest2\n`, { exact: true }))
          .catch(common.oops(this)))
      new Validation(this).do({
        name: 'subtest2',
        packageName: 'testing',
        namespace: ui.expectedNamespace(),
        output: { ok: true }
      })
    })
  }

  odescribe('should fail when updating with non-existing path', function(this: common.ISuite) {
    it('should fail when updating with non-existing path', () =>
      cli
        .do('wsk app update test2 @demos/dummy.js')
        .then(cli.expectError(1))
        .catch(common.oops(this)))
  })

  odescribe('should delete tests', function(this: common.ISuite) {
    it('validate app delete test1', () =>
      cli
        .do('wsk app delete test1')
        .then(cli.expectOK())
        .catch(common.oops(this)))

    it('validate app delete test2', () =>
      cli
        .do('wsk app delete test2')
        .then(cli.expectOK())
        .catch(common.oops(this)))

    it('validate app delete testing/subtest1', () =>
      cli
        .do('wsk app delete testing/subtest1')
        .then(cli.expectOK())
        .catch(common.oops(this)))

    if (ui.expectedNamespace()) {
      it(`validate app delete /${ui.expectedNamespace()}/testing/subtest2`, () =>
        cli
          .do(`wsk app delete /${ui.expectedNamespace()}/testing/subtest2`)
          .then(cli.expectOK())
          .catch(common.oops(this)))
    }
  })

  odescribe('error handling with non-exisiting composition', function(this: common.ISuite) {
    it('should 404 when invoking deleted composition', () =>
      cli
        .do('wsk app invoke test2')
        .then(cli.expectError(cli.exitCode(404)))
        .catch(common.oops(this)))

    it('should 404 when invoking non-existent composition', () =>
      cli
        .do('wsk app invoke dummy')
        .then(cli.expectError(cli.exitCode(404)))
        .catch(common.oops(this)))

    it('should 404 when deleting non-existent composition', () =>
      cli
        .do('wsk app delete dummy')
        .then(cli.expectError(cli.exitCode(404)))
        .catch(common.oops(this)))
  })
})
