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

import { dirname, join } from 'path'

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'

const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))

common.localDescribe(`edit helm template ${process.env.MOCHA_RUN_TARGET}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it(`open helm-template.yaml`, () => {
    return cli
      .do(`open ${join(ROOT, 'data/k8s/helm-template.yaml')}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('helm-template.yaml'))
      .catch(common.oops(this))
  })

  it('should close sidecar', async () => {
    await this.app.client.click(selectors.SIDECAR_FULLY_CLOSE_BUTTON)
    await sidecar.expectFullyClosed(this.app)
  })

  it(`kedit helm-template.yaml`, () => {
    return cli
      .do(`kedit ${join(ROOT, 'data/k8s/helm-template.yaml')}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('helm-template.yaml'))
      .catch(common.oops(this))
  })
})
