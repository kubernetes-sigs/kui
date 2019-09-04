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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli } = ui

describe('no .wskprops tests', function(this: common.ISuite) {
  if (!process.env.WSK_CONFIG_FILE) {
    before(openwhisk.before(this))
    after(common.after(this))

    it('shoule see empty action list', () =>
      cli
        .do('wsk action list', this.app)
        .then(cli.expectJustOK)
        .catch(common.oops(this)))

    it('should copy ~/.wskprops to ~/.tmp_wskprops', () =>
      cli
        .do(`cp ~/.wskprops ~/.tmp_wskprops`, this.app)
        .then(cli.expectJustOK)
        .catch(common.oops(this)))

    it('should remove ~/.wskprops', () =>
      cli
        .do(`rm ~/.wskprops`, this.app)
        .then(cli.expectJustOK)
        .catch(common.oops(this)))

    it('should restart', () => common.refresh(this)) // TODO: investigate

    it('shoule see error when action list', () =>
      cli
        .do('wsk action list', this.app)
        .then(cli.expectError(403, 'Command requires authentication'))
        .catch(common.oops(this)))

    // shoud add process.env.WSK_CONFIG_FILE
    it('should add process.env.WSK_CONFIG_FILE', () => {
      process.env.WSK_CONFIG_FILE = '~/.tmp_wskprops'
    })

    it('should restart', () => common.refresh(this))

    it('shoule see action list', () =>
      cli
        .do('wsk action list', this.app)
        .then(cli.expectJustOK)
        .catch(common.oops(this)))

    it('should restore  ~/.wskprops', () =>
      cli
        .do(`cp ~/.tmp_wskprops ~/.wskprops`, this.app)
        .then(cli.expectJustOK)
        .catch(common.oops(this)))

    it('should delete ~/.tmp_wskprops', () =>
      cli
        .do(`rm ~/.tmp_wskprops`, this.app)
        .then(cli.expectJustOK)
        .catch(common.oops(this)))

    it('should delete process.env.WSK_CONFIG_FILE', () => {
      delete process.env.WSK_CONFIG_FILE
    })
  }
})
