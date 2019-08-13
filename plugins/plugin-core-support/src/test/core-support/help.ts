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

import { ISuite, before as commonBefore, after as commonAfter, oops } from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli } = ui

/** expect the given folder within the help tree */
// NOTE: Mengting Yan: webdriverio getText in linux chromium seems to return all texts of a heading element in a single line, fix me if it's not true
export const header = (folder: string) => folder

/** expect the given sub-folder */
export const header2 = (folder1: string, folder2: string) => `${header(folder1)}
${folder2}`

/** helper method, used in the tests below: ask for help */
export const doHelp = function(cmd, { code = 500, expect = undefined }: { code?: number; expect?: string } = {}) {
  return it(`should show help via ${cmd}`, () =>
    cli
      .do(cmd, this.app)
      .then(cli.expectError(code, expect))
      .catch(oops(this)))
}

describe('Help command', function(this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  //
  // and now here come the tests...
  //

  doHelp.call(this, 'help', { expect: header('Getting Started') })
  doHelp.call(this, 'editor')
})
