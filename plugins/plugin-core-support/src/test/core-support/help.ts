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
 * read-only tests against the cli's help APIs
 *
 */

import { ISuite, before as commonBefore, after as commonAfter } from '@kui-shell/core/tests/lib/common'

import { doHelp, header } from '@kui-shell/plugin-core-support/tests/lib/core-support/help-util'

describe('Help command', function(this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  //
  // and now here come the tests...
  //

  doHelp.call(this, 'help', { expect: header('Getting Started') })
  doHelp.call(this, 'editor')
})
