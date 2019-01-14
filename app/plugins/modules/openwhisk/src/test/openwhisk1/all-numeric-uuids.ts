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

import { ISuite } from '@test/lib/common'
import * as common from '@test/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@test/lib/ui'
import * as openwhisk from '@test/lib/openwhisk/openwhisk'
const { cli, selectors, sidecar } = ui

// see https://github.com/ibm-functions/shell/issues/284
describe('Confirm proper handling of all-numeric uuids', function (this: ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should present 404-type error with activation get on all-numeric uuid', () => cli.do(`activation get 00000000000000000000000000000000`, this.app)
    .then(cli.expectError(404))
    .catch(common.oops(this)))

  it('should present 404-type error with activation get on a different all-numeric uuid', () => cli.do(`activation get 00000000000000000000000000000001`, this.app)
    .then(cli.expectError(404))
    .catch(common.oops(this)))
})
