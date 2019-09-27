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
//
// tests to cover the introductory scenario laid out in the docs
//

import * as path from 'path'
import * as fs from 'fs'
import * as assert from 'assert'
import { Application } from 'spectron'

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const inputs = [
  {
    appName: 'hello', // name of our first composition
    expectedStructa: { msg: 'hello composer!' } // invoking appName1 with -p name composer
  },
  {
    appName: 'if',
    actions: ['welcome', 'authenticate', 'login'],
    expectedStructa: {
      html: '<html><body>please say the magic word.</body></html>'
    },
    expectedStructb: {
      html: '<html><body>welcome if-combinator!</body></html>'
    }
  },
  {
    appName: 'try',
    actions: ['validate'],
    expectedStructa: { ok: true },
    expectedStructb: { ok: false }
  },
  {
    appName: 'try-retain',
    expectedStructa: { text: 'hello try!' },
    expectedStructb: { ok: false }
  },
  { appName: 'let', expectedStructa: { ok: true } }
]

/** fetch source code for the app */
const root = path.dirname(require.resolve('@kui-shell/plugin-apache-composer/package.json'))
const src = (app: string) => fs.readFileSync(path.join(root, 'samples/@demos/', `${app}.js`)).toString()

// hardcode for now... we need to generate this every time
const ast = {
  hello: {
    type: 'function',
    function: {
      exec: {
        kind: 'nodejs:default',
        code: "function hello({ name = 'world' }) {\n  return { msg: `hello ${name}!` }\n}" // eslint-disable-line
      }
    }
  },
  if: {
    type: 'if',
    test: {
      type: 'action',
      name: '/_/authenticate'
    },
    consequent: {
      type: 'action',
      name: '/_/welcome'
    },
    alternate: {
      type: 'action',
      name: '/_/login'
    }
  },
  try: {
    type: 'try',
    body: {
      type: 'action',
      name: '/_/validate'
    },
    handler: {
      type: 'function',
      function: {
        exec: {
          kind: 'nodejs:default',
          code: '() => ({\n    ok: false\n  })'
        }
      }
    }
  },
  'try-retain': {
    type: 'try',
    body: {
      type: 'sequence',
      components: [
        {
          type: 'retain',
          components: [
            {
              type: 'action',
              name: '/_/validate'
            }
          ]
        },
        {
          type: 'function',
          function: {
            exec: {
              kind: 'nodejs:default',
              code: "args => ({\n  text: Buffer.from(args.params.str, 'base64').toString()\n})"
            }
          }
        }
      ]
    },
    handler: {
      type: 'function',
      function: {
        exec: {
          kind: 'nodejs:default',
          code: '() => ({ ok: false })'
        }
      }
    }
  },
  let: {
    type: 'sequence',
    components: [
      {
        type: 'let',
        declarations: {
          secret: 42
        },
        components: [
          {
            type: 'function',
            function: {
              exec: {
                kind: 'nodejs:default',
                code: '() => ({ ok: secret === 42 })'
              }
            }
          }
        ]
      },
      {
        type: 'function',
        function: {
          exec: {
            kind: 'nodejs:default',
            code: "() => ({\n  ok: typeof secret === 'undefined'\n})"
          }
        }
      }
    ]
  }
}

/**
 * Invariants over the wskflow graph
 *
 */
const EMPTY = Promise.resolve({ value: [] }) // mimic an empty return value from client.elements
const graph = {
  /**
   * Invariant: graph has a given number of task and total nodes
   *
   */
  hasNodes: ({
    tasks: expectedTasks = 0,
    total: expectedTotal = 0,
    deployed: expectedDeployed = 0,
    values: expectedValues = 0
  }) => async (app: Application) => {
    const { client } = app
    // here we intentionally use just expectedX, because undefined and 0 are treated the same
    await client.waitUntil(async () => {
      const [
        { value: actualTasks },
        { value: actualTotal },
        { value: actualValues },
        { value: actualDeployed }
      ] = await Promise.all([
        !expectedTasks ? EMPTY : client.elements('#wskflowSVG .node.Task'),
        !expectedTotal ? EMPTY : client.elements('#wskflowSVG .node.leaf'),
        !expectedValues ? EMPTY : client.elements('#wskflowSVG .node.let'),
        !expectedDeployed ? EMPTY : client.elements('#wskflowSVG .node.leaf[data-deployed="deployed"]')
      ])

      console.error('actualTasks', actualTasks.length, expectedTasks)
      console.error('actualTotal', actualTotal.length, expectedTotal)
      console.error('actualValues', actualValues.length, expectedValues)
      console.error('actualDeployed', actualDeployed.length, expectedDeployed)

      return (
        actualTasks.length === expectedTasks &&
        actualTotal.length === expectedTotal &&
        actualValues.length === expectedValues &&
        actualDeployed.length === expectedDeployed
      )
    })

    // allow for further composition
    return app
  }
}

/**
 * Common composer operations
 *
 */
const composer = {
  getSessions: (
    app: Application,
    nDone: number,
    { cmd = 'wsk session list', expect = [] }: { cmd?: string; expect: string[] }
  ) => {
    return CLI.command(cmd, app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async N => {
        if (nDone > 0) {
          await app.client.waitUntil(async () => {
            const done = await app.client
              .getText(`${Selectors.OUTPUT_N(N)} .entity.session .entity-name .clickable`)
              .then(done => (!Array.isArray(done) ? [done] : done)) // make sure we have an array

            // validate `expect`, which is a subset of the expected done list
            if (expect.length > 0) {
              // is each expected in the done list?
              const allAreThere = expect.every(expectThis => done.find(gotThis => gotThis === expectThis))
              if (!allAreThere) {
                // keep on going with the waitUntil
                return false
              }
            }

            // validate `nDone`, which is the expected minimum number of completed sessions
            if (done.length < nDone) {
              const activationIds = await app.client.getText(
                `${Selectors.OUTPUT_N(N)} .entity.session .activationId .clickable`
              )
              console.error(`still waiting for ${nDone}, here is what we have so far: ${activationIds.length}`)
              console.error(activationIds)

              return false
            }

            // waitUntil is done!
            return true
          })
        }

        // allow further composition using N, the command index
        return N
      })
  }
}

describe.skip('Intro demo scenario', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // app init
  /* {
        const cmd = `wsk app init --url ${sharedURL}`
        it(cmd, () => CLI.command(cmd, this.app)
            .then(ReplExpect.okWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(Common.oops(this)))
    }

    // app init --cleanse
    const cleanseRedis = () => {
        const cmd = `wsk app init --cleanse --url ${sharedURL}`
        it(cmd, () => CLI.command(cmd, this.app)
            .then(ReplExpect.okWithCustom({expect: 'Successfully initialized and reset the required services. You may now create compositions.'}))
           .catch(Common.oops(this)))
    } */

  // session list, expect empty
  /* const expectNoSessions = () => {
        // expect 0 live and 0 done, since we just did an app init --cleanse
        const cmd = 'wsk session list',
              nLive = 0,
              nDone = 0
        it(`should list sessions via ${cmd} nLive=${nLive} nDone=${nDone}`, () => {
            return composer.getSessions(this.app, nLive, nDone, { cmd })
                .catch(Common.oops(this))
        })
    } */

  // cleanseRedis()
  // expectNoSessions()

  // app create
  {
    const { appName: appName1 } = inputs[0]
    const cmd = `wsk app create ${appName1} @demos/${appName1}.js -a turkey shoot`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName1))
        // .then(sidecar.expectBadge(badges.composerLib))
        .then(graph.hasNodes({ tasks: 1, total: 3 }))

        // switch to ast tab
        .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('ast')))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(Util.expectStruct(ast[appName1]))

        // switch to annotations tab
        .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('annotations')))
        .then(() => this.app.client.getText('#sidecar .sidecar-content .action-content code'))
        // .then(ui.expectSubset({"turkey": "shoot"}))

        // switch to parameters tab; in v2 this isn't relevant
        /* .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('parameters')))
           .then(() => this.app.client.getText('#sidecar .sidecar-content .action-content code'))
           .then(ui.expectSubset({"_actions": v => util.isArray(v) && v.length>0})) // expect some list value */

        .catch(Common.oops(this))
    )
  }

  // app create, 409 conflict
  const { appName: appName1 } = inputs[0]
  const cmd = `wsk app create ${appName1} @demos/${appName1}.js`
  it(`${cmd} expect conflict`, () =>
    CLI.command(cmd, this.app)
      .then(ReplExpect.error(409))
      .catch(Common.oops(this)))

  // app invoke hello -p name composer
  const invokeHello = (): Promise<string> => {
    const { appName: appName1, expectedStructa: expectedStruct1 } = inputs[0]
    const cmd = `wsk app invoke ${appName1} -p name composer`
    return CLI.command(cmd, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(appName1))
      .then(app =>
        app.client.waitUntil(async () => {
          const ok: boolean = await app.client
            .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
            .then(Util.expectStruct(expectedStruct1))
          return ok
        })
      )
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_ID)) // return the activationId
      .catch(Common.oops(this))
  }

  // cleanse redis after the invoke, and double-check we have no sessions
  // invokeHello()
  // cleanseRedis()
  // expectNoSessions()

  // invoke hello again, and expect the session list to show just it
  {
    const { appName: appName1 } = inputs[0]

    it('should invoke hello and show one more session than before', () =>
      invokeHello()
        .then(activationId => openwhisk.waitForSession(this.app, activationId, { name: appName1 }))
        .catch(Common.oops(this)))
  }

  // session result
  {
    const { appName: appName1, expectedStructa: expectedStruct1 } = inputs[0]

    it(`should display result in repl with session result`, () =>
      invokeHello()
        .then(activationId =>
          openwhisk
            .waitForSession(this.app, activationId, { name: appName1 })
            .then(() => CLI.command(`wsk session result ${activationId}`, this.app))
        )
        .then(ReplExpect.okWithCustom({ selector: 'code' }))
        .then(selector => this.app.client.getText(selector))
        .then(Util.expectStruct(expectedStruct1))
        .catch(Common.oops(this)))
  }

  // app preview hello.js
  {
    const { appName: appName1 } = inputs[0]
    const cmd = `wsk app preview @demos/${appName1}.js`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(`${appName1}.js`))
        // .then(sidecar.expectBadge(badges.composerLib))
        .then(graph.hasNodes({ tasks: 1, total: 3 }))

        // visit ast tab
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="ast"]'))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(Util.expectStruct(ast.hello))

        // visit code tab
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="source"]'))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(code => assert.strictEqual(code.replace(/\s+/g, ''), src(appName1).replace(/\s+/g, '')))

        .catch(Common.oops(this))
    )
  }

  // session get
  {
    const { appName: appName1, expectedStructa: expectedStruct1 } = inputs[0]

    it(`should display result in sidecar with session get`, () =>
      invokeHello()
        .then(activationId =>
          openwhisk
            .waitForSession(this.app, activationId, { name: appName1 })
            .then(() => CLI.command(`wsk session get ${activationId}`, this.app))
        )
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName1))
        .then(app =>
          app.client.waitUntil(async () => {
            const ok: boolean = await app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectStruct(expectedStruct1))
            return ok
          })
        )
        .catch(Common.oops(this)))
  }

  // app preview if.js
  {
    const { appName: appName2 } = inputs[1]
    const cmd = `wsk app preview @demos/${appName2}.js`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(`${appName2}.js`))
        // .then(sidecar.expectBadge(badges.composerLib))
        .then(graph.hasNodes({ tasks: 3, total: 6, deployed: 0 }))

        // visit ast tab
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="ast"]'))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(Util.expectStruct(ast[appName2]))

        // visit code tab
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="source"]'))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(code => assert.strictEqual(code.replace(/\s+/g, ''), src(appName2).replace(/\s+/g, '')))

        .catch(Common.oops(this))
    )
  }

  // create if's actions
  {
    const { actions: actionsFor2 } = inputs[1]
    actionsFor2.forEach(action => {
      const cmd = `let ${action} = @demos/${action}.js`
      it(cmd, () =>
        CLI.command(cmd, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(action))
          .catch(Common.oops(this))
      )
    })
  }

  // app create if.js, confirming deployed decoration shows up
  {
    const { appName: appName2 } = inputs[1]
    const cmd = `wsk app create ${appName2} @demos/${appName2}.js`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName2))
        // .then(sidecar.expectBadge(badges.composerLib))
        .then(graph.hasNodes({ tasks: 3, total: 6, deployed: 3 })) // <---- deployed had better be 3 now
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="ast"]'))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(Util.expectStruct(ast[appName2]))
        .catch(Common.oops(this))
    )
  }

  // app invoke if
  {
    const { appName: appName2, expectedStructa: expectedStruct2a } = inputs[1]
    const cmd = `wsk app invoke ${appName2}`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName2))
        .then(app =>
          app.client.waitUntil(async () => {
            const ok: boolean = await app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectStruct(expectedStruct2a))
            return ok
          })
        )
        .catch(Common.oops(this))
    )
  }

  //  app invoke if -p token secret -p name if-combinator
  {
    const { appName: appName2, expectedStructb: expectedStruct2b } = inputs[1]
    const cmd = `wsk app invoke ${appName2} -p token secret -p name if-combinator`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName2))
        .then(app =>
          app.client.waitUntil(async () => {
            const ok: boolean = await app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectStruct(expectedStruct2b))
            return ok
          })
        )
        .catch(Common.oops(this))
    )
  }

  {
    // expect 3 done sessions, and that the done list contain appName2
    const { appName: appName1 } = inputs[0]
    const { appName: appName2 } = inputs[1]
    const cmd = 'wsk session list --limit 200'
    const expected = [appName1, appName2] // appName1 and appName2 had both better be in the list
    const nDone = 3
    it(`should list sessions via ${cmd} nDone=${nDone}`, () => {
      return composer.getSessions(this.app, nDone, { cmd, expect: expected }).catch(Common.oops(this))
    })
  }

  // session list with name filter
  {
    // expect 1 done sessions, and that the done list contain appName1
    const { appName: appName1 } = inputs[0]
    const cmd = `wsk session list ${appName1}`
    const expected = [appName1] // appName1 had better be in the list
    const nDone = 1
    it(`should list sessions via ${cmd} nDone=${nDone}`, () => {
      return composer.getSessions(this.app, nDone, { cmd, expect: expected }).catch(Common.oops(this))
    })
  }

  // session list with name filter (variant)
  {
    // expect 1 done sessions, and that the done list contain appName1
    const { appName: appName2 } = inputs[1]
    const cmd = `wsk session list --name ${appName2}`
    const expected = [appName2] // appName2 had better be in the list
    const nDone = 2
    it(`should list sessions via ${cmd} nDone=${nDone}`, () => {
      return composer.getSessions(this.app, nDone, { cmd, expect: expected }).catch(Common.oops(this))
    })
  }

  // app preview try.js
  {
    const { appName: appName3 } = inputs[2]
    const cmd = `wsk app preview @demos/${appName3}.js`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(`${appName3}.js`))
        // .then(sidecar.expectBadge(badges.composerLib))
        .then(graph.hasNodes({ tasks: 2, total: 4, deployed: 0 }))

        // visit ast tab
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="ast"]'))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(Util.expectStruct(ast[appName3]))

        // visit code tab
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="source"]'))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(code => assert.strictEqual(code.replace(/\s+/g, ''), src(appName3).replace(/\s+/g, '')))

        .catch(Common.oops(this))
    )
  }

  // create try's actions
  {
    const { actions: actionsFor3 } = inputs[2]
    actionsFor3.forEach(action => {
      const cmd = `let ${action} = @demos/${action}.js`
      it(cmd, () =>
        CLI.command(cmd, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(action))
          .catch(Common.oops(this))
      )
    })
  }

  // app create try.js, confirming deployed decoration shows up
  {
    const { appName: appName3 } = inputs[2]
    const cmd = `wsk app create ${appName3} @demos/${appName3}.js`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName3))
        // .then(sidecar.expectBadge(badges.composerLib))
        .then(graph.hasNodes({ tasks: 2, total: 4, deployed: 1 })) // <---- deployed had better be 1 now
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="ast"]'))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(Util.expectStruct(ast[appName3]))
        .catch(Common.oops(this))
    )
  }

  //  app invoke try -p str aGVsbG8gdHJ5IQ==
  {
    const { appName: appName3, expectedStructa: expectedStruct3a } = inputs[2]
    const cmd = `wsk app invoke ${appName3} -p str aGVsbG8gdHJ5IQ==`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName3))
        .then(app =>
          app.client.waitUntil(async () => {
            const ok: boolean = await app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectStruct(expectedStruct3a))
            return ok
          })
        )
        .catch(Common.oops(this))
    )
  }

  //  app invoke try -p str bogus
  {
    const { appName: appName3, expectedStructb: expectedStruct3b } = inputs[2]
    const cmd = `wsk app invoke ${appName3} -p str bogus`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName3))
        .then(app =>
          app.client.waitUntil(async () => {
            const ok: boolean = await app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectStruct(expectedStruct3b))
            return ok
          })
        )
        .catch(Common.oops(this))
    )
  }

  // session get --last try
  {
    // expect 1 done sessions, and that the done list contain appName3
    const { appName: appName3, expectedStructb: expectedStruct3b } = inputs[2]
    const cmd = 'wsk session get --last try'
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName3))
        .then(app =>
          app.client.waitUntil(async () => {
            const ok: boolean = await app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectStruct(expectedStruct3b, false, true))
            return ok
          })
        )
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="visualization"]'))
        .then(() => this.app)
        .then(graph.hasNodes({ tasks: 2, total: 4 })) /*, deployed: 2 */
        .catch(Common.oops(this))
    )
  }

  // app create retain.js
  {
    const { appName: appName4 } = inputs[3]
    const cmd = `wsk app create ${appName4} @demos/${appName4}.js`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName4))
        // .then(sidecar.expectBadge(badges.composerLib))
        .then(graph.hasNodes({ tasks: 3, total: 7, deployed: 1 })) // <---- deployed had better be 1
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="ast"]'))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(Util.expectStruct(ast[appName4]))
        .catch(Common.oops(this))
    )
  }

  //  app invoke retain -p str aGVsbG8gdHJ5IQ==
  {
    const { appName: appName4, expectedStructa: expectedStruct4a } = inputs[3]
    const cmd = `wsk app invoke ${appName4} -p str aGVsbG8gdHJ5IQ==`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName4))
        .then(app =>
          app.client.waitUntil(async () => {
            const ok: boolean = await app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectStruct(expectedStruct4a))
            return ok
          })
        )
        .catch(Common.oops(this))
    )
  }

  //  app invoke retain -p str bogus
  {
    const { appName: appName4, expectedStructb: expectedStruct4b } = inputs[3]
    const cmd = `wsk app invoke ${appName4} -p str bogus`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName4))
        .then(app =>
          app.client.waitUntil(async () => {
            const ok: boolean = await app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectStruct(expectedStruct4b))
            return ok
          })
        )
        .catch(Common.oops(this))
    )
  }

  // app create let.js
  {
    const { appName: appName5 } = inputs[4]
    const cmd = `wsk app create ${appName5} @demos/${appName5}.js`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName5))
        // .then(sidecar.expectBadge(badges.composerLib))
        .then(graph.hasNodes({ tasks: 2, total: 5, deployed: 0, values: 1 }))
        .then(() => this.app.client.click('#sidecar .sidecar-bottom-stripe-button[data-mode="ast"]'))
        .then(() => Util.getValueFromMonaco(this.app))
        .then(Util.expectStruct(ast[appName5]))
        .catch(Common.oops(this))
    )
  }

  //  app invoke retain -p str bogus
  {
    const { appName: appName5, expectedStructa: expectedStruct5a } = inputs[4]
    const cmd = `wsk app invoke ${appName5}`
    it(cmd, () =>
      CLI.command(cmd, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName5))
        .then(app =>
          app.client.waitUntil(async () => {
            const ok: boolean = await app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectStruct(expectedStruct5a))
            return ok
          })
        )
        .catch(Common.oops(this))
    )
  }

  // open grid view to app `grid appName`
  /* {
        inputs.forEach( ({appName,actions=[]}) => {
            const cmd = `grid ${appName}`,
                  cmd2 = `grid ${appName} -a`,
                  gridForAction = action => `${Selectors.SIDECAR} .custom-content .grid[data-action-name="${action}"]`

            // if this app has actions/tasks, then `grid appName` should show them
            if (actions.length > 0) {
                it(cmd, () => CLI.command(cmd, this.app)
                  .then(ReplExpect.ok)
                   .then(SidecarExpect.open)
                   .then(SidecarExpect.showing(appName))
                   .then(() => Promise.all(actions.map(_ => this.app.client.waitForExist(gridForAction(_)))))
                   .catch(Common.oops(this)))
            }

            // grid -a should also include the app itself
            it(cmd2, () => CLI.command(cmd2, this.app)
              .then(ReplExpect.ok)
               .then(SidecarExpect.open)
               .then(SidecarExpect.showing(appName))
               .then(() => Promise.all(actions.map(_ => this.app.client.waitForExist(gridForAction(_)))))
               .then(() => this.app.client.waitForExist(gridForAction(appName)))
               .catch(Common.oops(this)))
        })
    } */
})
