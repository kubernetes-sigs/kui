/*
 * Copyright 2019 IBM Corporation
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
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import { Common, CLI, ReplExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

describe('no .wskprops tests', function(this: Common.ISuite) {
  if (!process.env.WSK_CONFIG_FILE) {
    before(openwhisk.before(this))
    after(Common.after(this))

    it('shoule see empty action list', () =>
      CLI.command('wsk action list', this.app)
        .then(ReplExpect.justOK)
        .catch(Common.oops(this)))

    it('should copy ~/.wskprops to ~/.tmp_wskprops', () =>
      CLI.command(`cp ~/.wskprops ~/.tmp_wskprops`, this.app)
        .then(ReplExpect.justOK)
        .catch(Common.oops(this)))

    it('should remove ~/.wskprops', () =>
      CLI.command(`rm ~/.wskprops`, this.app)
        .then(ReplExpect.justOK)
        .catch(Common.oops(this)))

    it('should restart', () => Common.refresh(this)) // TODO: investigate

    it('shoule see error when action list', () =>
      CLI.command('wsk action list', this.app)
        .then(ReplExpect.error(403, 'Command requires authentication'))
        .catch(Common.oops(this)))

    // shoud add process.env.WSK_CONFIG_FILE
    it('should add process.env.WSK_CONFIG_FILE', () => {
      process.env.WSK_CONFIG_FILE = '~/.tmp_wskprops'
    })

    it('should restart', () => Common.refresh(this))

    it('shoule see action list', () =>
      CLI.command('wsk action list', this.app)
        .then(ReplExpect.justOK)
        .catch(Common.oops(this)))

    it('should restore  ~/.wskprops', () =>
      CLI.command(`cp ~/.tmp_wskprops ~/.wskprops`, this.app)
        .then(ReplExpect.justOK)
        .catch(Common.oops(this)))

    it('should delete ~/.tmp_wskprops', () =>
      CLI.command(`rm ~/.tmp_wskprops`, this.app)
        .then(ReplExpect.justOK)
        .catch(Common.oops(this)))

    it('should delete process.env.WSK_CONFIG_FILE', () => {
      delete process.env.WSK_CONFIG_FILE
    })
  }
})
