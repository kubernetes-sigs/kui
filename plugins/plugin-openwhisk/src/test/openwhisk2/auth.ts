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

/**
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { cli, sidecar } = ui
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

describe('auth tests', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const ns1 = ui.expectedNamespace()
  const ns2 = ui.expectedNamespace(process.env.TEST_SPACE2)
  const reload = () => this.app.client.execute('window.location.reload()')

  // create an action, using the implicit entity type
  it('should create an action foo', () =>
    cli
      .do(`wsk action create foo ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo')))

  // list should show only foo
  it(`should find the foo action with "list"`, () =>
    cli.do('wsk action list', this.app).then(cli.expectOKWithOnly('foo')))

  it(`should show ${ns1} for wsk namespace current`, () =>
    cli.do('wsk namespace current', this.app).then(cli.expectOKWithString(ns1)))

  // install namespace key
  it(`should install a namespace key for ${ns2}`, () =>
    cli
      .do(`wsk auth add ${process.env.AUTH2}`, this.app)
      .then(cli.expectOKWithCustom({ selector: '', expect: `namespace ${ns2}` })))

  it(`should show ${ns2} for wsk namespace current`, () =>
    cli.do('wsk namespace current', this.app).then(cli.expectOKWithString(ns2)))

  // list should show no actions
  it(`should NOT find the foo action with "list"`, () => cli.do('wsk action list', this.app).then(cli.expectJustOK))

  // create the second action
  it('should create an action foo2', () =>
    cli
      .do(`wsk action create foo2 ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo2')))

  // list should show only foo2
  it(`should find the foo2 action with "list"`, () =>
    cli.do('wsk action list', this.app).then(cli.expectOKWithOnly('foo2')))

  // switch to first namespace
  it('should switch to the first namespace, using the CLI switch command', () =>
    cli
      .do(`wsk auth switch ${ns1}`, this.app)
      .then(cli.expectOKWithCustom({ selector: '', expect: `namespace ${ns1}` })))

  // list should show only foo
  it(`should find the foo action with "list"`, () =>
    cli.do('wsk action list', this.app).then(cli.expectOKWithOnly('foo')))

  // switch back to second namespace
  it('should switch to the second namespace, using the CLI switch command', () =>
    cli
      .do(`wsk auth switch ${ns2}`, this.app)
      .then(cli.expectOKWithCustom({ selector: '', expect: `namespace ${ns2}` })))

  // list should show only foo2
  it(`should find the foo2 action with "list"`, () =>
    cli.do('wsk action list', this.app).then(cli.expectOKWithOnly('foo2')))

  // wsk auth list should so both installed namespaces
  ui.aliases.list.forEach(cmd => {
    const checkMarkCell = (ns: string) => `.entity.namespaces[data-name="${ns}"] .entity-name.clickable`
    const nameCell = (ns: string) => `.entity.namespaces[data-name="${ns}"] > tr > .clickable`

    const ok = (ns: string) => {
      it(`should list namespace ${ns} and find checkmark cell with "wsk auth ${cmd}"`, async () => {
        return cli.do(`wsk auth ${cmd}`, this.app).then(cli.expectOKWithCustom({ selector: checkMarkCell(ns) }))
      })
      it(`should list namespace ${ns} and find name cell with "wsk auth ${cmd}"`, async () => {
        return cli.do(`wsk auth ${cmd}`, this.app).then(cli.expectOKWithCustom({ selector: nameCell(ns) }))
      })
    }

    ok(ns1)
    ok(ns2)
  })

  // switch back to first namespace
  it('should switch to the first namespace, using the CLI wsk auth add command', () =>
    cli
      .do(`wsk auth add ${process.env.AUTH}`, this.app)
      .then(cli.expectOKWithCustom({ selector: '', expect: `namespace ${ns1}` })))

  // switch to the second namespace but don't save it
  it("should switch to the second namespace but don't save it locally, using the CLI wsk auth switch --no-save command", () =>
    cli
      .do(`wsk auth switch ${ns2} --no-save`, this.app)
      .then(cli.expectOKWithCustom({ selector: '', expect: `namespace ${ns2}` })))

  // reload the app to check if namespace changes
  it('should reload the app', reload)

  // check the current namespace is not changed by namespace switch --no-save
  it('should see the first namespace', () =>
    cli.do('wsk namespace current', this.app).then(cli.expectOKWithCustom({ selector: '', expect: `${ns1}` })))

  // switch to the second namespace and save it
  it('should switch to the second namespace and save it locally, using the CLI wsk auth switch --save command', () =>
    cli
      .do(`wsk auth switch ${ns2} --save`, this.app)
      .then(cli.expectOKWithCustom({ selector: '', expect: `namespace ${ns2}` })))

  // reload the app to check if namespace changes
  it('should reload the app', reload)

  // check the current namespace is changed by namespace switch --save
  it('should see the second namespace', () =>
    cli.do('wsk namespace current', this.app).then(cli.expectOKWithCustom({ selector: '', expect: `${ns2}` })))

  // switch to the first namespace and save it
  it('should switch to the first namespace and save it locally, using the CLI wsk auth switch command', () =>
    cli
      .do(`wsk auth switch ${ns1}`, this.app)
      .then(cli.expectOKWithCustom({ selector: '', expect: `namespace ${ns1}` })))

  // reload the app to check if namespace changes
  it('should reload the app', reload)

  // check the current namespace is changed by namespace switch
  it('should see the first namespace', () =>
    cli.do('wsk namespace current', this.app).then(cli.expectOKWithCustom({ selector: '', expect: `${ns1}` })))
})
