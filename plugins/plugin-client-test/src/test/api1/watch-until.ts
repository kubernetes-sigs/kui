/*
 * Copyright 2021 The Kubernetes Authors
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

/** sleep for N seconds */
function sleep(N: number) {
  return new Promise(resolve => setTimeout(resolve, N * 1000))
}

describe(`watch directory listing until ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const names = ['watchUntil1foo', 'watchUntil2foo']

  it(`should watch ls /tmp --until /tmp/${names[0]} exist`, () =>
    CLI.command(`watch ls /tmp --until 'kuiCheckFileExist /tmp/${names[0]}'`, this.app)
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

        // should stop watching
        await this.app.client.$(Selectors.WATCH_OFFLINE_BUTTON(res.count))
      })
      .catch(Common.oops(this)))

  it(`should watch ls -l /tmp --until /tmp/${names[1]} exist`, () =>
    CLI.command(`watch ls -l /tmp --until 'kuiCheckFileExist /tmp/${names[1]}'`, this.app)
      .then(async res => {
        await ReplExpect.okWith(names[0])(res)
        const fileName = names[1]
        await CLI.command(`touch /tmp/${fileName}`, this.app).then(ReplExpect.ok)

        let iter = 0
        await this.app.client.waitUntil(async () => {
          if (++iter > 5) {
            console.error(`still waiting for table to have expectedText=${fileName}`)
          }
          await this.app.client.$(Selectors.OUTPUT_N(res.count))
          return this.app.client.$(Selectors.LIST_RESULT_BY_N_FOR_NAME(res.count, fileName)).then(() => true)
        })

        // should stop watching
        await this.app.client.$(Selectors.WATCH_OFFLINE_BUTTON(res.count))
      })
      .catch(Common.oops(this)))

  names.forEach(fileName => {
    it(`should remove the created file ${fileName}`, () =>
      CLI.command(`rm /tmp/${fileName}`, this.app).then(ReplExpect.ok).catch(Common.oops(this)))
  })

  /* error handling */
  it(`should watch ls /tmp and until always return false`, () =>
    CLI.command(`watch ls /tmp --until 'kuiCheckFileExist neverexist'`, this.app)
      .then(ReplExpect.ok)
      .then(async res => {
        let iter = 0
        await this.app.client.waitUntil(async () => {
          await this.app.client.$(Selectors.WATCH_LIVE_BUTTON(res.count))
          await sleep(5)
          return ++iter > 3
        })
      })
      .catch(Common.oops(this)))

  it(`should watch ls /tmp and until always throw error`, () =>
    CLI.command(`watch ls /tmp --until 'kuiCheckFileExist error'`, this.app)
      .then(ReplExpect.ok)
      .then(async res => {
        let iter = 0
        await this.app.client.waitUntil(async () => {
          await this.app.client.$(Selectors.WATCH_LIVE_BUTTON(res.count))
          await sleep(5)
          return ++iter > 3
        })
      })
      .catch(Common.oops(this)))
})
