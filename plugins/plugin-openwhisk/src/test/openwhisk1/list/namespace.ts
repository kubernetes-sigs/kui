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

describe('Namespaces list', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  // implicit entity type
  ui.aliases.list.forEach(cmd => {
    it(`should list namespaces with "namespaces ${cmd}"`, () =>
      cli.do(`wsk namespaces ${cmd}`, this.app).then(cli.expectOKWithOnly(ui.expectedNamespace())))
  })
})
