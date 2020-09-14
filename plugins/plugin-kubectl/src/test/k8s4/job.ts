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

import { dirname, join } from 'path'
import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'
import { waitForRed, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const jobYaml = join(ROOT, 'data/k8s/job.yaml')
const jobName = 'pi'

const synonyms = ['kubectl']

synonyms.forEach(kubectl => {
  describe(`${kubectl} jobs ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    it('should create a job', async () => {
      try {
        const res = await CLI.command(`${kubectl} apply -f ${jobYaml} ${inNamespace}`, this.app)
        await this.app.client.waitForVisible(Selectors.TABLE_SHOW_AS_SEQUENCE(res.count))
        await this.app.client.waitForVisible(Selectors.TABLE_SHOW_AS_LIST(res.count))
        await this.app.client.click(Selectors.TABLE_SHOW_AS_LIST(res.count))
        await ReplExpect.okWith(jobName)(res)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    it('should list pods of job', async () => {
      try {
        const res = await CLI.command(`${kubectl} get job`, this.app)
        await this.app.client.waitForVisible(Selectors.TABLE_SHOW_AS_SEQUENCE(res.count))
        await this.app.client.waitForVisible(Selectors.TABLE_SHOW_AS_LIST(res.count))
        await this.app.client.click(Selectors.TABLE_SHOW_AS_LIST(res.count))
        await ReplExpect.okWith(jobName)(res)
      } catch (err) {
        return Common.oops(this, true)
      }
    })

    it('should list pods of job', async () => {
      try {
        const res = await CLI.command(`${kubectl} get job ${jobName}`, this.app)
        await this.app.client.waitForVisible(Selectors.TABLE_SHOW_AS_SEQUENCE(res.count))
        await this.app.client.waitForVisible(Selectors.TABLE_SHOW_AS_LIST(res.count))
        await this.app.client.click(Selectors.TABLE_SHOW_AS_LIST(res.count))
        await ReplExpect.okWith(jobName)(res)
      } catch (err) {
        return Common.oops(this, true)
      }
    })

    it('should delete a job', async () => {
      try {
        const selector: string = await CLI.command(`${kubectl} delete job ${jobName} ${inNamespace}`, this.app).then(
          ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(jobName) })
        )

        await waitForRed(this.app, selector)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    deleteNS(this, ns)
  })
})
