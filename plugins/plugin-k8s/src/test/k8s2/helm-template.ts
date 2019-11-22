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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'

const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))

Common.localDescribe(`edit helm template ${process.env.MOCHA_RUN_TARGET}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it(`open helm-template.yaml`, () => {
    return CLI.command(`open ${join(ROOT, 'data/k8s/helm-template.yaml')}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('helm-template.yaml'))
      .catch(Common.oops(this))
  })

  it('should close sidecar', async () => {
    await this.app.client.click(Selectors.SIDECAR_FULLY_CLOSE_BUTTON)
    await SidecarExpect.fullyClosed(this.app)
  })

  xit(`kedit helm-template.yaml`, () => {
    return CLI.command(`kedit ${join(ROOT, 'data/k8s/helm-template.yaml')}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('helm-template.yaml'))
      .catch(Common.oops(this))
  })
})
