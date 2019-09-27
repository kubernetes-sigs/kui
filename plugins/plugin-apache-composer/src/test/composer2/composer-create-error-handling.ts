/*
 * Copyright 2017-19 IBM Corporation
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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

/**
 * this test covers app create error handling, and app create --dry-run
 *
 */
describe('app create error handling', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create a composition with undeloyed actions', () =>
    CLI.command('wsk app create if @demos/if.js', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('if'))
      .then(app =>
        app.client.waitUntil(async () => {
          const ok: boolean = await app.client
            .getText('.wskflow-undeployed-action-warning-text')
            .then(expectedText => /3 undeployed components/.test(expectedText))
          return ok
        }, 2000)
      )
      .catch(Common.oops(this)))

  it('should fail to invoke composition with undeployed actions', () =>
    CLI.command('wsk app invoke if', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('if'))
      .then(app =>
        app.client.waitUntil(async () => {
          const ok: boolean = await app.client
            .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
            .then(activationResult => activationResult.includes('Failed to resolve action'))
          return ok
        }, 2000)
      )
      .catch(Common.oops(this)))

  it('should deploy action authenticate', () =>
    CLI.command('wsk action create authenticate @demos/authenticate.js', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should deploy action welcome', () =>
    CLI.command('wsk action create welcome @demos/welcome.js', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should deploy action login', () =>
    CLI.command('wsk action create login @demos/login.js', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should successfully invoke compostiion with deployed actions', () =>
    CLI.command('wsk app invoke if', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('if'))
      .then(app =>
        app.client.waitUntil(async () => {
          const ok: boolean = await await app.client.getText(`${Selectors.SIDECAR_CONTENT} .activation-result`).then(
            Util.expectStruct({
              html: '<html><body>please say the magic word.</body></html>'
            })
          )
          return ok
        }, 2000)
      )
      .catch(Common.oops(this)))
  /* it('should initialize composer', () => CLI.command(`wsk app init --url ${sharedURL} --cleanse`, this.app) // cleanse important here for counting sessions in `sessions`
        .then(ReplExpect.okWithCustom({expect: 'Successfully initialized and reset the required services. You may now create compositions.'}))
       .catch(Common.oops(this))) */

  it('should 404 session get with all-numeric uuid', () =>
    CLI.command('wsk session get 00000000000000000000000000000000', this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))
  it('should 404 session get with another all-numeric uuid', () =>
    CLI.command('wsk session get 00000000000000000000000000000001', this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))

  it('should reject unknown option --mojo', () =>
    CLI.command('wsk app create demos/if.js --mojo', this.app)
      .then(ReplExpect.error(499)) // 499 means unsupported optional parameter
      .catch(Common.oops(this)))

  it('should reject unknown option --mojo', () =>
    CLI.command('wsk app create zombie demos/if.js --mojo', this.app)
      .then(ReplExpect.error(499)) // 499 means unsupported optional parameter
      .catch(Common.oops(this)))

  it('should reject unknown option -m', () =>
    CLI.command('wsk app create demos/if.js -m', this.app)
      .then(ReplExpect.error(498)) // beginning of usage, because we didn't pass an app name
      .catch(Common.oops(this)))

  it('should reject unknown option -m', () =>
    CLI.command('wsk app create zombie demos/if.js -m', this.app)
      .then(ReplExpect.error(498))
      .catch(Common.oops(this)))

  /* it('should fail to initialize composer, due to bogus option', () => CLI.command(`wsk app init --nope`, this.app)
        .then(ReplExpect.error(0, 'Unexpected option nope'))
       .catch(Common.oops(this))) */

  /* --dry-run options disabled */

  //  const dryRunOk = `${ROOT}/data/composer/composer-source/if.js`
  //  const badDir = `${ROOT}/data/composer/composer-source-expect-errors`
  //  const dryRunBad = [ { input: `${badDir}/error1.js`, err: `SLACK_TOKEN required in environment.` },
  //    { input: `${badDir}/nofsm.js`, err: `Error: Unable to compile your composition` },
  //    { input: `${badDir}/t2s.js`, err: `ReferenceError: slackConfig is not defined` },
  //    { input: `${badDir}/if-bad.js`, err: `if-bad.js:4
  //    /* cond */ 'authenticate',,  /* double comma, expect parse error */
  //                            ^
  //
  // SyntaxError: Unexpected token ,` }]

  /* it(`should dry-run check ${dryRunOk} with -n`, () => CLI.command(`wsk app create ${dryRunOk} -n`, this.app)
    .then(ReplExpect.okWithCustom({ expect: 'Your code compiles without error' }))
    .catch(Common.oops(this)))
  it(`should dry-run check ${dryRunOk} with --dry-run`, () => CLI.command(`wsk app create ${dryRunOk} --dry-run`, this.app)
    .then(ReplExpect.okWithCustom({ expect: 'Your code compiles without error' }))
    .catch(Common.oops(this)))
  dryRunBad.forEach(({ input, err }) => {
    it(`should dry-run check with expected error ${input} --dry-run`, () => CLI.command(`wsk app create ${input} --dry-run`, this.app)
      .then(ReplExpect.error('ENOPARSE', err))
      .catch(Common.oops(this)))
  })

   // check file not found error handling
  it(`should fail properly with ENOENT`, () => CLI.command(`wsk app create goober.js -n`, this.app)
    .then(ReplExpect.error('ENOENT'))
    .catch(Common.oops(this)))
  it(`should fail properly with ENOENT`, () => CLI.command(`wsk app create goober.js --dry-run`, this.app)
  .then(ReplExpect.error('ENOENT'))
  .catch(Common.oops(this))) */

  it(`should fail properly with ENOENT`, () =>
    CLI.command(`wsk app create goober goober.js`, this.app)
      .then(ReplExpect.error('ENOENT'))
      .catch(Common.oops(this)))
})
