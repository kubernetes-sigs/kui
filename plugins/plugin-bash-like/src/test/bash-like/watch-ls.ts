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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

describe(`watch directory listing ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const names = ['ls1foo', 'ls2foo']

  it('should watch ls /tmp', () =>
    CLI.command(`watch ls /tmp`, this.app)
      .then(ReplExpect.ok)
      .then(async res => {
        const fileName = names[0]
        await CLI.command(`touch /tmp/${fileName}`, this.app).then(ReplExpect.ok)

        let iter = 0
        await this.app.client.waitUntil(async () => {
          const texts = await this.app.client.$(Selectors.OUTPUT_N(res.count)).then(_ => _.getText())

          if (++iter > 5) {
            console.error(`still waiting for actualText=${texts} expectedText=${fileName}`)
          }
          return texts.includes(fileName)
        })
      })
      .catch(Common.oops(this)))

  it('should watch ls -l /tmp', () =>
    CLI.command(`watch ls -l /tmp`, this.app)
      .then(async res => {
        await ReplExpect.okWith(names[0])(res)
        const fileName = names[1]
        await CLI.command(`touch /tmp/${fileName}`, this.app).then(ReplExpect.ok)

        let iter = 0
        await this.app.client.waitUntil(async () => {
          if (++iter > 5) {
            console.error(`still waiting for table to have expectedText=${fileName}`)
          }
          return this.app.client.$(`${Selectors.LIST_RESULT_BY_N_FOR_NAME(res.count, fileName)}`).then(() => true)
        })
      })
      .catch(Common.oops(this)))

  names.forEach(_ => {
    it('should remove the created file', () =>
      CLI.command(`rm ${_}`, this.app).then(ReplExpect.ok).catch(Common.oops(this)))
  })
})
