/*
 * Copyright 2020 IBM Corporation
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
import { CLI } from '@kui-shell/core/tests/lib/headless'

const synonyms = ['kubectl', 'k']

const doHeadless = (ctx: Common.ISuite, impl: CLI) => {
  before(Common.before(ctx, { noApp: true }))

  synonyms.forEach(kubectl => {
    it(`should get default namespace via ibmcloud kui ${kubectl}`, () => {
      return impl
        .command(`${kubectl} get ns default`, ctx.app)
        .then(impl.expectOK('default'))
        .catch(Common.oops(ctx, true))
    })
  })
}

Common.localDescribe('ibmcloud kui', function(this: Common.ISuite) {
  const ibmcloudKui = new CLI('ibmcloud kui', undefined, true)
  doHeadless(this, ibmcloudKui)
})
