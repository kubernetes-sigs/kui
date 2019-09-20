/*
 * Copyright 2017-19 IBM Corporation
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

const { cli } = require('@kui-shell/core/tests/lib/ui')
const { oops } = require('@kui-shell/core/tests/lib/common')

/** expect the given folder within the help tree */
// NOTE: Mengting Yan: webdriverio getText in linux chromium seems to return all texts of a heading element in a single line, fix me if it's not true
exports.header = folder => folder

/** expect the given sub-folder */
exports.header2 = (folder1, folder2) => `${exports.header(folder1)}
${folder2}`

/** helper method, used in the tests below: ask for help */
exports.doHelp = function(cmd, { code = 500, expect = undefined } = {}) {
  return it(`should show help via ${cmd}`, () =>
    cli
      .do(cmd, this.app)
      .then(cli.expectError(code, expect))
      .catch(oops(this)))
}
