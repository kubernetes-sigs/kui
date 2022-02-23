/*
 * Copyright 2020 The Kubernetes Authors
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
import { waitTillNone, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

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
        await this.app.client.$(Selectors.TABLE_SHOW_AS_SEQUENCE(res.count)).then(_ => _.waitForDisplayed())
        await this.app.client.$(Selectors.TABLE_SHOW_AS_LIST(res.count)).then(_ => _.waitForDisplayed())
        await this.app.client.$(Selectors.TABLE_SHOW_AS_LIST(res.count)).then(_ => _.click())
        await ReplExpect.tableWithNRows(2)(res)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    it('should list pods of job as dashboard', async () => {
      try {
        const res = await CLI.command(`${kubectl} db job ${inNamespace}`, this.app)
        await this.app.client.$(Selectors.TABLE_SHOW_AS_SEQUENCE(res.count)).then(_ => _.waitForDisplayed())
        await this.app.client.$(Selectors.TABLE_SHOW_AS_LIST(res.count)).then(_ => _.waitForDisplayed())
        await this.app.client.$(Selectors.TABLE_SHOW_AS_LIST(res.count)).then(_ => _.click())
        await ReplExpect.tableWithNRows(2)(res)
      } catch (err) {
        return Common.oops(this, true)
      }
    })

    it('should list jobs by name', async () => {
      try {
        const res = await CLI.command(`${kubectl} get job ${jobName} ${inNamespace}`, this.app)
        await ReplExpect.okWith(jobName)(res)
      } catch (err) {
        return Common.oops(this, true)
      }
    })

    it('should delete a job', async () => {
      try {
        await CLI.command(`${kubectl} delete job ${jobName} ${inNamespace}`, this.app)
        await waitTillNone('job', undefined, jobName, undefined, inNamespace)(this.app)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    deleteNS(this, ns)
  })
})
