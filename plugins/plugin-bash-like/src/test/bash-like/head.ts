/*
 * Copyright 2017 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect, Util } from '@kui-shell/test'

const ROOT = dirname(require.resolve('@kui-shell/core/tests/package.json'))
const rootRelative = (dir: string) => join(ROOT, dir)
;['head', 'tail'].forEach(head => {
  describe(`bash-like ${head} ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    it(`should ${head} package.json and see 10 lines`, () =>
      CLI.command(`${head} ${rootRelative('package.json')}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(res => {
          let idx = 0
          return this.app.client.waitUntil(async () => {
            const linesNumbers = await this.app.client.$$(
              Selectors.SIDECAR_CUSTOM_CONTENT_LINE_NUMBERS(res.count, res.splitIndex)
            )
            if (++idx > 5) {
              console.error(`Still waiting for lineNumbers actual=${linesNumbers.length} expected=10`)
            }
            return linesNumbers.length === 10
          })
        })
        .catch(Common.oops(this)))

    it(`should ${head} -n 5 package.json and see 5 lines`, () =>
      CLI.command(`${head} -n 5 ${rootRelative('package.json')}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(res =>
          this.app.client.waitUntil(async () => {
            const linesNumbers = await this.app.client.$$(
              Selectors.SIDECAR_CUSTOM_CONTENT_LINE_NUMBERS(res.count, res.splitIndex)
            )
            return linesNumbers.length === 5
          })
        )
        .catch(Common.oops(this)))

    it(`should ${head} -c 1 package.json and see 1 bytes`, () =>
      CLI.command(`${head} -c 1 ${rootRelative('package.json')}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(res =>
          this.app.client.waitUntil(async () => {
            const value = await Util.getValueFromMonaco(res)
            const bufferSize = Buffer.from(value).length
            return bufferSize === 1
          })
        )
        .catch(Common.oops(this)))

    if (head === 'head') {
      it(`should ${head} /kui/welcome.md and see 10 lines`, () =>
        CLI.command(`${head} /kui/welcome.md`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(res =>
            this.app.client.waitUntil(async () => {
              const linesNumbers = await this.app.client.$$(
                Selectors.SIDECAR_CUSTOM_CONTENT_LINE_NUMBERS(res.count, res.splitIndex)
              )
              return linesNumbers.length === 10
            })
          )
          .catch(Common.oops(this)))

      it(`should ${head} -n 5 /kui/welcome.md and see 5 lines`, () =>
        CLI.command(`${head} -n 5 /kui/welcome.md`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(res =>
            this.app.client.waitUntil(async () => {
              const linesNumbers = await this.app.client.$$(
                Selectors.SIDECAR_CUSTOM_CONTENT_LINE_NUMBERS(res.count, res.splitIndex)
              )
              return linesNumbers.length === 5
            })
          )
          .catch(Common.oops(this)))
    }

    it(`should ${head} -c 1 /kui/welcome.md and see 1 bytes`, () =>
      CLI.command(`${head} -c 1 /kui/welcome.md`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(res =>
          this.app.client.waitUntil(async () => {
            const value = await Util.getValueFromMonaco(res)
            const bufferSize = Buffer.from(value).length
            return bufferSize === 1
          })
        )
        .catch(Common.oops(this)))
  })
})
