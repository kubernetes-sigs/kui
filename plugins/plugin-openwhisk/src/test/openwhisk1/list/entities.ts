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
 * read-only tests against the CLI's list APIs
 *
 */

import { Common, CLI, ReplExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

describe('List entities with a clean slate', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // implicit entity type
  it(`should list actions with "list"`, () => CLI.command(`wsk action list`, this.app).then(ReplExpect.justOK))

  // explicit entity type
  openwhisk.entities.forEach(entity => {
    it(`should list ${entity} with "list"`, () => CLI.command(`wsk ${entity} list`, this.app).then(ReplExpect.justOK))
  })

  // activations
  it(`should list actions with "$ list"`, () => CLI.command(`wsk $ list`, this.app).then(ReplExpect.okWithAny))
  it(`should list actions with "activation list"`, () =>
    CLI.command(`wsk activation list`, this.app).then(ReplExpect.okWithAny))
})
