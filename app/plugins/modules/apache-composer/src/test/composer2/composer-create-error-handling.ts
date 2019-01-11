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

import { ISuite } from '@test/lib/common'
import * as path from 'path'
const ROOT = process.env.TEST_ROOT
const common = require(path.join(ROOT, 'lib/common'))

const ui = require(path.join(ROOT, 'lib/ui'))
// sharedURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379',
const cli = ui.cli

/**
 * this test covers app create error handling, and app create --dry-run
 *
 */
describe('app create error handling', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  /* it('should initialize composer', () => cli.do(`app init --url ${sharedURL} --cleanse`, this.app) // cleanse important here for counting sessions in `sessions`
        .then(cli.expectOKWithCustom({expect: 'Successfully initialized and reset the required services. You may now create compositions.'}))
       .catch(common.oops(this))) */

  it('should 404 session get with all-numeric uuid', () => cli.do('session get 00000000000000000000000000000000', this.app)
    .then(cli.expectError(404))
    .catch(common.oops(this)))
  it('should 404 session get with another all-numeric uuid', () => cli.do('session get 00000000000000000000000000000001', this.app)
    .then(cli.expectError(404))
    .catch(common.oops(this)))

  it('should reject unknown option --mojo', () => cli.do('app create demos/if.js --mojo', this.app)
    .then(cli.expectError(499)) // 499 means unsupported optional parameter
    .catch(common.oops(this)))

  it('should reject unknown option --mojo', () => cli.do('app create zombie demos/if.js --mojo', this.app)
    .then(cli.expectError(499)) // 499 means unsupported optional parameter
    .catch(common.oops(this)))

  it('should reject unknown option -m', () => cli.do('app create demos/if.js -m', this.app)
    .then(cli.expectError(498)) // beginning of usage, because we didn't pass an app name
    .catch(common.oops(this)))

  it('should reject unknown option -m', () => cli.do('app create zombie demos/if.js -m', this.app)
    .then(cli.expectError(498))
    .catch(common.oops(this)))

  /* it('should fail to initialize composer, due to bogus option', () => cli.do(`app init --nope`, this.app)
        .then(cli.expectError(0, 'Unexpected option nope'))
       .catch(common.oops(this))) */

/* --dry-run options disabled */

 //  const dryRunOk = 'data/composer/composer-source/if.js'
 //  const badDir = 'data/composer/composer-source-expect-errors'
 //  const dryRunBad = [ { input: `${badDir}/error1.js`, err: `SLACK_TOKEN required in environment.` },
 //    { input: `${badDir}/nofsm.js`, err: `Error: Unable to compile your composition` },
 //    { input: `${badDir}/t2s.js`, err: `ReferenceError: slackConfig is not defined` },
 //    { input: `${badDir}/if-bad.js`, err: `if-bad.js:4
 //    /* cond */ 'authenticate',,  /* double comma, expect parse error */
 //                            ^
 //
 // SyntaxError: Unexpected token ,` }]

/* it(`should dry-run check ${dryRunOk} with -n`, () => cli.do(`app create ${dryRunOk} -n`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'Your code compiles without error' }))
    .catch(common.oops(this)))
  it(`should dry-run check ${dryRunOk} with --dry-run`, () => cli.do(`app create ${dryRunOk} --dry-run`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'Your code compiles without error' }))
    .catch(common.oops(this)))
  dryRunBad.forEach(({ input, err }) => {
    it(`should dry-run check with expected error ${input} --dry-run`, () => cli.do(`app create ${input} --dry-run`, this.app)
      .then(cli.expectError('ENOPARSE', err))
      .catch(common.oops(this)))
  })

   // check file not found error handling
  it(`should fail properly with ENOENT`, () => cli.do(`app create goober.js -n`, this.app)
    .then(cli.expectError('ENOENT'))
    .catch(common.oops(this)))
  it(`should fail properly with ENOENT`, () => cli.do(`app create goober.js --dry-run`, this.app)
  .then(cli.expectError('ENOENT'))
  .catch(common.oops(this))) */

  it(`should fail properly with ENOENT`, () => cli.do(`app create goober goober.js`, this.app)
    .then(cli.expectError('ENOENT'))
    .catch(common.oops(this)))
})
