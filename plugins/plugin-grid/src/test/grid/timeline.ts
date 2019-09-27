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

describe('timeline visualization', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // disabled for now shell issue #794
  /* const icon = `${Selectors.SIDECAR} .sidecar-header-icon-wrapper .sidecar-header-icon`
    it('should open timeline', () => CLI.command('timeline', this.app)
       .then(() => this.app.client.waitForText(icon, 'timeline'))
       .catch(Common.oops(this))) */
})
