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

import * as common from '@kui-shell/core/tests/lib/common'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { doHelp, header, header2 } from '@kui-shell/plugin-core-support/tests/lib/core-support/help-util'

/* the header for action help */
const actionHelpHeader = header2('OpenWhisk', 'Action Operations')

describe('Help command', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  //
  // and now here come the tests...
  //
  doHelp.call(this, 'wsk', { expect: header('OpenWhisk') })
  doHelp.call(this, 'wsk action', { expect: actionHelpHeader })
  doHelp.call(this, 'wsk action help', { expect: actionHelpHeader })
  doHelp.call(this, 'help wsk action', { expect: actionHelpHeader })
  doHelp.call(this, 'composer', { expect: header('Composer') })
  doHelp.call(this, 'wsk action create', { code: 497 }) // insufficient arguments
})
