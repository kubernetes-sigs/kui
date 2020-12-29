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

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

describe('auth tests', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  const ns1 = openwhisk.expectedNamespace()
  const ns2 = openwhisk.expectedNamespace(process.env.TEST_SPACE2)
  const reload = () => this.app.client.execute('window.location.reload()')

  // create an action, using the implicit entity type
  it('should create an action foo', () =>
    CLI.command(`let foo = x=>x`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo')))

  // list should show only foo
  it(`should find the foo action with "list"`, () =>
    CLI.command('wsk action list', this.app).then(ReplExpect.okWithOnly('foo')))

  it(`should show ${ns1} for wsk namespace current`, () =>
    CLI.command('wsk namespace current', this.app).then(ReplExpect.okWithString(ns1)))

  // install namespace key
  it(`should install a namespace key for ${ns2}`, () =>
    CLI.command(`wsk auth add ${process.env.AUTH2}`, this.app).then(
      ReplExpect.okWithCustom({ selector: '', expect: `namespace ${ns2}` })
    ))

  it(`should show ${ns2} for wsk namespace current`, () =>
    CLI.command('wsk namespace current', this.app).then(ReplExpect.okWithString(ns2)))

  // list should show no actions
  it(`should NOT find the foo action with "list"`, () =>
    CLI.command('wsk action list', this.app).then(ReplExpect.justOK))

  // create the second action
  it('should create an action foo2', () =>
    CLI.command(`let foo2 = x=>x`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo2')))

  // list should show only foo2
  it(`should find the foo2 action with "list"`, () =>
    CLI.command('wsk action list', this.app).then(ReplExpect.okWithOnly('foo2')))

  // switch to first namespace
  it('should switch to the first namespace, using the CLI switch command', () =>
    CLI.command(`wsk auth switch ${ns1}`, this.app).then(
      ReplExpect.okWithCustom({ selector: '', expect: `namespace ${ns1}` })
    ))

  // list should show only foo
  it(`should find the foo action with "list"`, () =>
    CLI.command('wsk action list', this.app).then(ReplExpect.okWithOnly('foo')))

  // switch back to second namespace
  it('should switch to the second namespace, using the CLI switch command', () =>
    CLI.command(`wsk auth switch ${ns2}`, this.app).then(
      ReplExpect.okWithCustom({ selector: '', expect: `namespace ${ns2}` })
    ))

  // list should show only foo2
  it(`should find the foo2 action with "list"`, () =>
    CLI.command('wsk action list', this.app).then(ReplExpect.okWithOnly('foo2')))

  // wsk auth list should so both installed namespaces
  openwhisk.aliases.list.forEach(cmd => {
    const checkMarkCell = (ns: string) => `.entity.namespaces[data-name="${ns}"] .entity-name.clickable`
    const nameCell = (ns: string) =>
      `.entity.namespaces[data-name="${ns}"] > tr > td:not(.entity-name-group) > .clickable`

    const ok = (ns: string) => {
      it(`should list namespace ${ns} and find checkmark cell with "wsk auth ${cmd}"`, async () => {
        return CLI.command(`wsk auth ${cmd}`, this.app).then(ReplExpect.okWithCustom({ selector: checkMarkCell(ns) }))
      })
      it(`should list namespace ${ns} and find name cell with "wsk auth ${cmd}"`, async () => {
        return CLI.command(`wsk auth ${cmd}`, this.app).then(ReplExpect.okWithCustom({ selector: nameCell(ns) }))
      })
    }

    ok(ns1)
    ok(ns2)
  })

  // switch back to first namespace
  it('should switch to the first namespace, using the CLI wsk auth add command', () =>
    CLI.command(`wsk auth add ${process.env.AUTH}`, this.app).then(
      ReplExpect.okWithCustom({ selector: '', expect: `namespace ${ns1}` })
    ))

  // switch to the second namespace but don't save it
  it("should switch to the second namespace but don't save it locally, using the CLI wsk auth switch --no-save command", () =>
    CLI.command(`wsk auth switch ${ns2} --no-save`, this.app).then(
      ReplExpect.okWithCustom({ selector: '', expect: `namespace ${ns2}` })
    ))

  // reload the app to check if namespace changes
  it('should reload the app', reload)

  // check the current namespace is not changed by namespace switch --no-save
  it('should see the first namespace', () =>
    CLI.command('wsk namespace current', this.app).then(ReplExpect.okWithCustom({ selector: '', expect: `${ns1}` })))

  // switch to the second namespace and save it
  it('should switch to the second namespace and save it locally, using the CLI wsk auth switch --save command', () =>
    CLI.command(`wsk auth switch ${ns2} --save`, this.app).then(
      ReplExpect.okWithCustom({ selector: '', expect: `namespace ${ns2}` })
    ))

  // reload the app to check if namespace changes
  it('should reload the app', reload)

  // check the current namespace is changed by namespace switch --save
  it('should see the second namespace', () =>
    CLI.command('wsk namespace current', this.app).then(ReplExpect.okWithCustom({ selector: '', expect: `${ns2}` })))

  // switch to the first namespace and save it
  it('should switch to the first namespace and save it locally, using the CLI wsk auth switch command', () =>
    CLI.command(`wsk auth switch ${ns1}`, this.app).then(
      ReplExpect.okWithCustom({ selector: '', expect: `namespace ${ns1}` })
    ))

  // reload the app to check if namespace changes
  it('should reload the app', reload)

  // check the current namespace is changed by namespace switch
  it('should see the first namespace', () =>
    CLI.command('wsk namespace current', this.app).then(ReplExpect.okWithCustom({ selector: '', expect: `${ns1}` })))
})
