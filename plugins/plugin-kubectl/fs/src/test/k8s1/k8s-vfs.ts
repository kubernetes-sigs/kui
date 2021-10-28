/*
 * Copyright 2019 The Kubernetes Authors
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
import { createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const currentContext = require('child_process')
  .execSync('kubectl config current-context')
  .toString()
  .trim()

if (process.env.KUI_SFS) {
  describe(`k8s vfs ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    allocateNS(this, ns)

    // hack for now
    it('should sleep for 5 seconds', () => new Promise(resolve => setTimeout(resolve, 5000)))

    it(`should ls our local context via "ls /k8s"`, () => {
      return CLI.command('ls -l /k8s', this.app)
        .then(ReplExpect.okWith('local'))
        .catch(Common.oops(this, true))
    })

    it(`should ls our currentContext via "ls /k8s/local"`, () => {
      return CLI.command('ls -l /k8s/local', this.app)
        .then(ReplExpect.okWith(currentContext + '/'))
        .catch(Common.oops(this, true))
    })

    it(`should ls our namespace via ${currentContext}`, () => {
      return CLI.command(`ls -l /k8s/local/${currentContext}`, this.app)
        .then(ReplExpect.okWith(ns))
        .catch(Common.oops(this, true))
    })

    deleteNS(this, ns)
  })
}
