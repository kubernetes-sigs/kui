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

/* const common = require('../../../lib/common')
const ui = require('../../../lib/ui')
const cli = ui.cli
const sidecar = ui.sidecar
const actionName = 'foo' */
/*
if (false) {
  describe('Debugger', function () {
    before(openwhisk.before(this))
    after(common.after(this))

    it('should create an action', () => cli.do(`wsk action update ${actionName} ./data/openwhisk/foo.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))) */

/* it('should create another action, via let', () => cli.do(`let ${actionName2} = ./data/openwhisk/foo2.js`, this.app)
  .then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(actionName2)))

    it('should create a rule via on, using a new trigger', () => cli.do(`on ${triggerName} do ${actionName}`, this.app)
    .then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(ruleName))) */

//
// this gets a little involved, because the debug command has a
// trailing `activation get` which may take a few
// seconds. cli.expectOK doesn't have a retry loop, and so may
// fail, because the current prompt still has text, from the
// activation get command that is waiting for completion of the
// debugged activation.
//
// thus, here we use waitUntil to retry. in each iter of the retry
// loop, we have to re-fetch the current data-input-count
// (i.e. the [N] of the prompt), so that cli.expectOK validate the
// the latest prompt text, not e.g. the prompt text of the
// activation get command
//
/*    const debug = (cmd, result) => {
      it(`should spawn the debugger expecting ${JSON.stringify(result)}`, () => cli.do(cmd, this.app)
      .then(appAndCount => this.app.client.waitUntil(() => {
          return this.app.client.getAttribute(ui.selectors.CURRENT_PROMPT_BLOCK, 'data-input-count')
          .then(countStr => parseInt(countStr) - 1)
          .then(count => {
              console.log(`Checking, with N=${appAndCount.count} -> N=${count}`)
              appAndCount.count = count
              return appAndCount
            })
            .then(cli.expectOK)
            .then(() => this.app) // this will succeed the waitUntil with this.app as the value
            .catch(() => false) // this will retry the waitUntil
          }))
   .then(sidecar.expectOpen)
   .then(sidecar.expectShowing(actionName, undefined, true, undefined, 'activations'))
   .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
   .then(ui.expectStruct(result)))
    }

    // here are the tests:
    debug(`wsk action debug ${actionName}`, {'name': 'Step1 undefined'})
    debug(`wsk action debug ${actionName} -p name whisker`, {'name': 'Step1 whisker'})
  })
} */
