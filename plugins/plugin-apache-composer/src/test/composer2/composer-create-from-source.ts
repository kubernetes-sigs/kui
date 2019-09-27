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

import { readdirSync } from 'fs'
import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname, join } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

const srcDir = `${ROOT}/data/composer/composer-source` // inputs for create-from-source

describe('composer create from source', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create from source
  readdirSync(srcDir).forEach((file, idx) => {
    const name = `sourceTest-${idx}`

    // echo.js is used by require-relative.js, it isn't a composition on its own
    if (file.endsWith('.js') && file !== 'echo.js') {
      it(`should create a composer sequence from source ${file}`, () =>
        CLI.command(`wsk app create ${name} ${join(srcDir, file)}`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(name))
          // .then(sidecar.expectBadge(badges.composerLib))
          .catch(Common.oops(this)))
    }
  })
})
