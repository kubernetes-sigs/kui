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
 * read-only tests against the cli's list APIs
 *
 */

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli } = ui

describe('List entities with a clean slate', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  // implicit entity type
  it(`should list actions with "list"`, () => cli.do(`wsk action list`, this.app).then(cli.expectJustOK))

  // explicit entity type
  openwhisk.entities.forEach(entity => {
    it(`should list ${entity} with "list"`, () => cli.do(`wsk ${entity} list`, this.app).then(cli.expectJustOK))
  })

  // activations
  it(`should list actions with "$ list"`, () => cli.do(`wsk $ list`, this.app).then(cli.expectOKWithAny))
  it(`should list actions with "activation list"`, () =>
    cli.do(`wsk activation list`, this.app).then(cli.expectOKWithAny))
})
