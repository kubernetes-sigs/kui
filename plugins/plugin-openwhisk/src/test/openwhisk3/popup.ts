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

import * as common from '@kui-shell/core/tests/lib/common'
import { selectors, sidecar, waitTimeout } from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const { localDescribe } = common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

/** shorthands for commands */
const wsk = 'wsk'
const action = 'action'
const create = 'create'
const del = 'delete'
const invoke = 'invoke'
const createAction = (name: string, src: string) => [wsk, action, create, name, src]
const deleteAction = (name: string) => [wsk, action, del, name]
const invokeAction = (name: string) => [wsk, action, invoke, name]

/** resource attributes */
const foo = 'foo'
const foojs = join(ROOT, 'data/openwhisk/headless/foo.js')
const foojsSource = readFileSync(foojs).toString()

/** wait for the creation to finish, then navigate a bit */
interface CreateSpec {
  name: string
  kind: string
}
const waitForCreate = function(this: common.ISuite, spec: CreateSpec) {
  const { name, kind } = spec

  it(`should wait for creation of resource named ${name}`, async () => {
    const waitForIcon = () => {
      return this.app.client.waitUntil(async () => {
        const iconText = await this.app.client.getText(`${selectors.SIDECAR} .sidecar-header-icon`)
        return new RegExp(kind, 'i').test(iconText)
      }, waitTimeout)
    }

    try {
      await waitForIcon()

      await sidecar.expectOpen(this.app).then(sidecar.expectShowing(name))
    } catch (err) {
      return common.oops(this, true)(err)
    }
  })
}

/** wait for the deletion to finish */
interface DeleteSpec {
  name: string
}
const waitForDelete = function(this: common.ISuite, spec: DeleteSpec) {
  const { name } = spec

  it(`should wait for deletion of resource named ${name}`, () => {
    return this.app.client
      .waitUntil(async () => {
        const okText = await this.app.client.getText(`${selectors.SIDECAR} .ok-line`)
        return okText === `ok: deleted action ${name}`
      }, waitTimeout)
      .catch(common.oops(this, true))
  })
}

/** wait for the invocationion to finish */
interface InvokeSpec {
  name: string
  result: object
}
const waitForInvoke = function(this: common.ISuite, spec: InvokeSpec) {
  const { name } = spec

  it(`should wait for invocation of resource named ${name}`, () => {
    return this.app.client
      .waitUntil(async () => {
        return !!sidecar.expectResult(spec.result, false)
      }, waitTimeout)
      .catch(common.oops(this, true))
  })
}

/** expect an error with the given code */
interface ErrorSpec {
  code: number | string
}
const expectError = function(this: common.ISuite, spec: ErrorSpec) {
  it(`should present an error with code ${spec.code}`, () => {
    return this.app.client
      .waitUntil(async () => {
        const elt = await this.app.client.element(`.repl-result .oops[data-status-code="${spec.code}"]`)
        if (elt.state === 'failure') {
          // not yet showing the expected code
          return false
        } else {
          return true
        }
      }, waitTimeout)
      .catch(common.oops(this, true))
  })
}

//
// from here on are the tests...
//

localDescribe('popup openwhisk create action', function(this: common.ISuite) {
  before(openwhisk.before(this, { popup: createAction(foo, foojs) }))
  after(common.after(this))

  waitForCreate.bind(this)({ name: foo, kind: 'action' })
})

localDescribe('popup openwhisk create action expecting conflict', function(this: common.ISuite) {
  before(common.before(this, { popup: createAction(foo, foojs) }))
  after(common.after(this))

  expectError.bind(this)({ code: 409 })
})

localDescribe('popup openwhisk invoke non-existent action expecting error', function(this: common.ISuite) {
  before(common.before(this, { popup: invokeAction('nope') }))
  after(common.after(this))

  expectError.bind(this)({ code: 404 })
})

localDescribe('popup openwhisk invoke action no parameters', function(this: common.ISuite) {
  before(common.before(this, { popup: invokeAction(foo) }))
  after(common.after(this))

  waitForInvoke.bind(this)({ name: 'Step1 undefined' })
})

localDescribe('popup openwhisk invoke action with parameters', function(this: common.ISuite) {
  before(
    common.before(this, {
      popup: invokeAction(foo).concat(['-p', 'name', '314159'])
    })
  )
  after(common.after(this))

  waitForInvoke.bind(this)({ name: 'Step1 314159' })
})

localDescribe('popup openwhisk delete action', function(this: common.ISuite) {
  before(common.before(this, { popup: deleteAction(foo) }))
  after(common.after(this))

  waitForDelete.bind(this)({ name: foo })
})

localDescribe('popup openwhisk delete non-existent action', function(this: common.ISuite) {
  before(common.before(this, { popup: deleteAction(foo) }))
  after(common.after(this))

  expectError.bind(this)({ code: 404 })
})
