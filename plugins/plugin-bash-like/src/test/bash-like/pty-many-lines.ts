/*
 * Copyright 2019 IBM Corporation
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

import { dirname, join } from 'path'
import { readFileSync } from 'fs'

import { Common, CLI, ReplExpect } from '@kui-shell/test'

const ROOT = dirname(require.resolve('@kui-shell/core/tests/package.json'))

const readmeLines = readFileSync(join(process.env.TEST_ROOT, '../../README.md'))
  .toString()
  .split(/\n/)

describe('pty output with many lines', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // only do this for proxy+webpack clients
  Common.proxyIt('should cd to the test dir', () =>
    CLI.command(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(ReplExpect.okWithString('packages/test'))
      .catch(Common.oops(this, true))
  )

  // do the rest for electron or webpack+proxy clients (but not for
  // webpack-only clients)
  Common.pit('should cat a long file and show the first line', () =>
    CLI.command('cat ../../README.md', this.app)
      .then(ReplExpect.okWithStringEventually(readmeLines[0]))
      .catch(Common.oops(this, true))
  )

  Common.pit('should cat a long file and show the last line', () =>
    CLI.command('cat ../../README.md', this.app)
      .then(ReplExpect.okWithStringEventually(readmeLines[readmeLines.length - 1]))
      .catch(Common.oops(this, true))
  )

  Common.pit('should execute a recursive grep that emits many lines', () =>
    CLI.command(`grep -r describe\\( "${ROOT}/../../../plugins"`, this.app)
      .then(ReplExpect.okWithStringEventually('describe'))
      .catch(Common.oops(this))
  )

  Common.pit('should still have a prompt that works', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithString('hi'))
      .catch(Common.oops(this))
  )
})
