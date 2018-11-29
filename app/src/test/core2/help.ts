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

import { ISuite } from '../../../../tests/lib/common'
import * as common from '../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

/** expect the given folder within the help tree */
export const header = folder => `Shell Docs
/
${folder}`

/** expect the given sub-folder */
const header2 = (folder1, folder2) => `${header(folder1)}
/
${folder2}`

/* the header for action help */
const actionHelpHeader = header2('OpenWhisk', 'Action Operations')

describe('Help command', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  /** helper method, used in the tests below: ask for help */
  const doHelp = (cmd, { code = 500, expect = undefined } = {}) => {
    return it(`should show help via ${cmd}`, () => cli.do(cmd, this.app)
      .then(cli.expectError(code, expect))
      .catch(common.oops(this)))
  }

  //
  // and now here come the tests...
  //
  it('should have an active repl', () => cli.waitForRepl(this.app))

  doHelp('help', { expect: header('Getting Started') })
  doHelp('wsk', { expect: header('OpenWhisk') })
  doHelp('wsk action', { expect: actionHelpHeader })
  doHelp('wsk action help', { expect: actionHelpHeader })
  doHelp('action help', { expect: actionHelpHeader })
  doHelp('help action', { expect: actionHelpHeader })
  doHelp('help wsk action', { expect: actionHelpHeader })
  doHelp('editor')
  doHelp('composer', { expect: header('Composer') })
  doHelp('wsk action create', { code: 497 }) // insufficient arguments
})
