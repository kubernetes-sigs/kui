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

/**
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import { ISuite } from '../../../../../../../../tests/lib/common'
import * as common from '../../../../../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

import * as openwhisk from '../../../../../../../../tests/lib/openwhisk'

const args = {
  action: './data/openwhisk/foo.js',
  trigger: '',
  rule: 'foo-trigger foo-action',
  package: ''
}

describe('Create with explicit entity type, then list', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  openwhisk.entities.forEach(entity => {
    const name = `foo-${entity}`

    // create, using the implicit entity type
    it(`should create ${entity}`, () => cli.do(`${entity} create ${name} ${args[entity]}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(name)))

    // list tests
    it(`should find the new ${entity} with "${entity} list"`, () => cli.do(`${entity} list`, this.app).then(cli.expectOKWithOnly(name)))
  })
})
