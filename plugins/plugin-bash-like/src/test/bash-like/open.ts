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

import { dirname, join } from 'path'

import { Common, CLI, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'

const ROOT = dirname(require.resolve('@kui-shell/core/tests/package.json'))
const rootRelative = (dir: string) => join(ROOT, dir)

describe(`bash-like open ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const testOpen = (filename: string) => {
    it(`should open ${filename}`, () =>
      CLI.command(`open ${rootRelative(filename)}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(res =>
          this.app.client.waitUntil(async () => {
            const value = await Util.getValueFromMonaco(res)
            return Util.expectSubset({ name: 'tests' }, true)(value)
          })
        )
        .catch(Common.oops(this, true)))
  }

  testOpen('package.json') // small file
  testOpen('package.json.gz') // small gzip file

  // this is intended to be a big file, above the threshold that
  // triggers an fslice
  it(`should open /usr/share/dict/words`, () =>
    CLI.command('open /usr/share/dict/words', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(res =>
        this.app.client.waitUntil(async () => {
          const value = await Util.getValueFromMonaco(res)
          return value.charAt(0) === 'A'
        })
      )
      .catch(Common.oops(this, true)))
})
