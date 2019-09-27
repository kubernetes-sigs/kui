/*
 * Copyright 2018 IBM Corporation
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

import { Common } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { expectSuggestionsFor } from '@kui-shell/core/test/core/command-not-found-suggestions'

describe('Suggestions for command not found', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should present suggestions for "ws" -> wsk', () => {
    const opts = {
      click: 0, // click on it
      expectedBreadcrumb: 'OpenWhisk' // expect this breadcrumb
    }
    return expectSuggestionsFor.call(
      this,
      'ws', // type this
      ['wsk'], // expect these completions
      opts
    )
  })

  it('should present suggestions for "gri" -> grid', () => {
    const opts = {
      click: 0, // click on it
      sidecar: 'grid' // expected sidecar icon
    }
    return expectSuggestionsFor.call(
      this,
      'gri', // type this
      ['grid'], // expect these completions
      opts
    )
  })
})
