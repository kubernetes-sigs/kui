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

'use strict'

// import { join } from 'path'
//
// import * as common from '@kui/core/tests/lib/common'
//
// import * as ui from '@kui/core/tests/lib/ui'
// const cli = ui.cli
// const sidecar = ui.sidecar
// const actionName1 = 'foo1'
// sharedURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
// const killFailure404 = 'Cannot find live session'

import { ISuite } from '@kui/core/tests/lib/common'
import * as openwhisk from '@kui/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
describe('killing and purging composer invocations', function (this: ISuite) {
  // no more kill and purge with composer v2
  // return

  // before(openwhisk.before(this))
  // after(common.after(this))
  //
  //
  //
  // it('should have an active repl', () => cli.waitForRepl(this.app))
  //
  // /** expected return value */
  // const expect = (key, value, extraExpect, expectIsIt) => {
  //   if (expectIsIt) {
  //     return extraExpect
  //   } else {
  //     const expect = {}
  //     expect[key] = value
  //     return Object.assign(expect, extraExpect)
  //   }
  // }
  //
  // /** invoke a composition */
  // const invoke = (name, key, value, extraExpect, expectIsIt = false) => {
  //   it(`should invoke the composition ${name} with ${key}=${value}`, () => cli.do(`app invoke ${name} -p ${key} ${value}`, this.app)
  //      .then(cli.expectOK)
  //     .then(sidecar.expectOpen)
  //     .then(sidecar.expectShowing(name))
  //     .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
  //     .then(ui.expectStruct(expect(key, value, extraExpect, expectIsIt)))
  //     .catch(common.oops(this)))
  // }
  //
  // const async = (name, key, value, extraExpect, expectIsIt = false) => {
  //   it(`should async the composition ${name} with ${key}=${value}`, () => cli.do(`async ${name} -p ${key} ${value}`, this.app)
  //     .then(cli.expectOKWithCustom(cli.makeCustom('.activationId', '')))
  //     .then(selector => this.app.client.getText(selector)
  //       .then(activationId => this.app.client.click(selector)
  //         .then(() => sidecar.expectOpen(this.app))
  //         .then(sidecar.expectShowing(name /* activationId */))
  //         .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
  //         .then(ui.expectStruct(expect(key, value, extraExpect, expectIsIt)))))
  //     .catch(common.oops(this)))
  // }
  //
  // /** this one is a bit complex:
  //    * 1) asynchronously invoke the given action `name`
  //    * 2) get the activationId from the REPL result
  //    * 3) issue `await --raw` on that activationId, which will give us the $session in the sidecar
  //    * 4) get the activation result from the sidecar, and extract the $session id
  //    * 5) issue `kill` on that $session, and expect the successful termination message
  //    * 6) issue `kill` again on that same $session, and expect a 410 "GONE" error
  //    *
  //    */
  // const asyncThenKill = ({cmd, successMessage, failureMessage}, name, key, value, extraExpect, expectIsIt = false) => {
  //   it(`should async, then ${cmd}, the app ${name} with ${key}=${value}`, () => cli.do(`async ${name} -p ${key} ${value}`, this.app) // step 1
  //     .then(cli.expectOKWithCustom(cli.makeCustom('.activationId', '')))
  //     .then(selector => this.app.client.getText(selector) // step 2
  //       .then(activationId => {
  //         console.log(`Issued async for ${cmd}, got activationId ${activationId}`)
  //         return cli.do(`await ${activationId} --raw`, this.app) // step 3
  //           .then(cli.expectOK)
  //           .then(sidecar.expectOpen)
  //           .then(sidecar.expectShowing(name, activationId))
  //           .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT)) // extract the activation record         // step 4
  //           .then(JSON.parse) // parse the activation record
  //           .then(result => result.$session) // extract the $session, i.e. sessionId, from the parsed activation record
  //           .then(sessionId => {
  //             console.log(`Now issuing ${cmd} ${sessionId}, expecting success`)
  //             return cli.do(`${cmd} ${sessionId}`, this.app) // step 5
  //               .then(cli.expectOKWithCustom({ expect: successMessage }))
  //               .then(() => {
  //                 // then, re-executing the command should fail with a 404 error
  //                 console.log(`Now issuing ${cmd} ${sessionId}, expecting error`)
  //                 return cli.do(`${cmd} ${sessionId}`, this.app) // step 6
  //                   .then(cli.expectError(0, failureMessage))
  //                   .catch(common.oops(this))
  //               }).catch(common.oops(this))
  //           }).catch(common.oops(this))
  //       })).catch(common.oops(this)))
  // }
  //
  // const asyncThenAppInitCleanse = (name, key, value, extraExpect, expectIsIt = false) => {
  //   const successMessage = 'Successfully initialized and reset the required services. You may now create compositions.'
  //
  //   it(`should async, then app init --url --cleanse, and expect failure in kill`, () => cli.do(`async ${name} -p ${key} ${value}`, this.app) // step 1
  //     .then(cli.expectOKWithCustom(cli.makeCustom('.activationId', '')))
  //     .then(selector => this.app.client.getText(selector) // step 2
  //       .then(activationId => {
  //         console.log(`Issued async for app init cleanse, got activationId ${activationId}`)
  //         return cli.do(`await ${activationId} --raw`, this.app) // step 3
  //           .then(cli.expectOK)
  //           .then(sidecar.expectOpen)
  //           .then(sidecar.expectShowing(name, activationId))
  //           .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT)) // extract the activation record         // step 4
  //           .then(JSON.parse) // parse the activation record
  //           .then(result => result.$session) // extract the $session, i.e. sessionId, from the parsed activation record
  //           .then(sessionId => {
  //             console.log(`Now issuing app init --auto --cleanse, expecting success; sessionId=${sessionId}`)
  //             return cli.do(`app init --url ${sharedURL} --cleanse`, this.app) // step 5
  //               .then(cli.expectOKWithCustom({ expect: successMessage }))
  //               .then(() => cli.do(`session kill ${sessionId}`, this.app))
  //               .then(cli.expectError(0, killFailure404))
  //               .catch(common.oops(this))
  //           }).catch(common.oops(this))
  //       }).catch(common.oops(this)))
  //     .catch(common.oops(this)))
  // }
  //
  // /** make a plain openwhisk action */
  // const makeAction = (name, key, value, body = 'x=>x') => {
  //   it('should create an action via let', () => cli.do(`let ${name} = ${body} -p ${key} ${value}`, this.app)
  //     .then(cli.expectOK)
  //     .then(sidecar.expectOpen)
  //     .then(sidecar.expectShowing(name))
  //     .catch(common.oops(this)))
  //
  //   it('should switch to parameters mode', () => cli.do('parameters', this.app)
  //     .then(cli.expectOK)
  //     .then(sidecar.expectOpen)
  //     .then(sidecar.expectShowing(name))
  //     .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
  //     .then(ui.expectStruct(expect(key, value)))
  //     .catch(common.oops(this)))
  // }
  //
  // makeAction(actionName1, 'aa', 11, 'x => new Promise(resolve => setTimeout(() => resolve(x), 5000))')

  /* it('should print usage with session kill 3', () => cli.do('session kill 3', this.app)
        .then(cli.expectError(0, 'Kill a live session')) // substring of usage
       .catch(common.oops(this)))

    {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => cli.do(cmd, this.app)
            .then(cli.expectOKWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(common.oops(this)))

    }

    it('should create a composer sequence', () => cli.do(`app update ${seqName1} @demos/hello.js`, this.app)
       .then(cli.expectOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(seqName1))
       .then(sidecar.expectBadge(badges.sequence))
       .catch(common.oops(this)))

    asyncThenAppInitCleanse(seqName1, 'x', 3, { aa: 11 })

    invoke(seqName1, 'x', 3, { aa: 11 })              // normal invoke of the sequence composition
    async(seqName1, 'x', 3, { aa: 11 })               // async invoke

    asyncThenKill({cmd: 'session kill',                       // async, then kill the activation
                   successMessage: 'Successfully terminated the given session',
                   failureMessage: killFailure404
                  }, seqName1, 'x', 3, { aa: 11 })

    asyncThenKill({cmd: 'session purge',                      // async, then purge the activation
                   successMessage: 'Successfully purged the given session',
                   failureMessage: purgeFailure404
                  }, seqName1, 'x', 3, { aa: 11 }) */
})
