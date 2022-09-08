/*
 * Copyright 2018 The Kubernetes Authors
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

import { Common, CLI, ReplExpect } from '@kui-shell/test'
import { doHelp } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

describe('kubectl logs usage', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const help = doHelp.bind(this)

  help('kubectl logs -h', ['kubectl', 'logs'], ['Introduction', 'logs nginx'])

  it('should error out when requesting logs without name', () => {
    return CLI.command(`kubectl logs`, this.app).then(ReplExpect.error(500)).catch(Common.oops(this, true))
  })
})
