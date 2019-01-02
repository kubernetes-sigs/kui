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

const assert = require('assert')
const { exec } = require('child_process')

const { join } = require('path')
const ROOT = process.env.TEST_ROOT
const kui = process.env.KUI || join(ROOT, '../kui.js')
const bindir = join(ROOT, '../app/bin') // should contain kubectl-kui
const { expectStruct, expectSubset } = require('./ui')

/**
 * Append to a PATH env; note this is not a filesystem path, but
 * rather the executable PATH environment variable.
 *
 */
const appendPATH = (path, extra) => {
  if (!extra) {
    return path
  } else {
    const sep = process.platform === 'win32' ? ';' : ':'
    return `${path}${sep}${extra}`
  }
}

/** default CLI impl */
class CLI {
  constructor (exe = kui, pathEnv) {
    this.exe = exe
    this.pathEnv = pathEnv
  }

  do (cmd, env = {}, { errOk = undefined } = {}) {
    return new Promise((resolve, reject) => {
      const command = `${this.exe} ${cmd} --no-color`
      debug('executing command', command)

      exec(command, {
        env: Object.assign(
          {},
          process.env,
          env,
          { PATH: appendPATH(env.PATH || process.env.PATH, this.pathEnv) }
        )
      }, (err, stdout, stderr) => {
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
    })
  }

  /**
   * Exit code code for the given http status code.
   * See ui.js for the analogous electron implementation.
   */
  exitCode (statusCode) {
    return statusCode - 256
  }

  expectOK (expectedOutput, { exact = false, skipLines = 0, squish = false } = {}) {
    return ({ code: actualCode, output: actualOutput }) => {
      assert.strictEqual(actualCode, 0)
      if (expectedOutput) {
        if (typeof expectedOutput === 'object') {
          // json check
          if (exact) {
            return expectStruct(expectedOutput)(actualOutput)
          } else {
            return expectSubset(expectedOutput)(actualOutput)
          }
        } else {
          // string check
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
      }

      return actualOutput
    }
  }

  expectError (expectedCode, expectedOutput) {
    return ({ code: actualCode, output: actualOutput }) => {
      assert.strictEqual(actualCode, expectedCode)
      if (expectedOutput) {
        const ok = typeof expectedOutput === 'string'
          ? actualOutput.indexOf(expectedOutput) >= 0
          : !!actualOutput.match(expectedOutput) // expectedOutput is a RegExp
        if (!ok) {
          console.error(`mismatch; actual='${actualOutput}'; expected='${expectedOutput}'`)
        }
        assert.ok(ok)
      }
      return actualOutput
    }
  }
}

/** kui.js impl */
exports.cli = new CLI()

/** kubectl kui impl */
exports.kubectl = new CLI('kubectl kui', bindir)
