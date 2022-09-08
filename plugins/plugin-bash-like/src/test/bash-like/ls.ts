/*
 * Copyright 2019 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect, Keys } from '@kui-shell/test'

const echoString = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

describe(`directory listing ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should cd to the test dir', () =>
    CLI.command(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(ReplExpect.okWithString('packages/test'))
      .catch(Common.oops(this, true)))

  it('should touch a test file in ~', () =>
    CLI.command(`touch ~/testls`, this.app).then(ReplExpect.ok).catch(Common.oops(this, true)))

  it('should ls -l ~ and see ~/testls', () =>
    CLI.command('ls -l ~', this.app).then(ReplExpect.okWith('testls')).catch(Common.oops(this, true)))

  it('should remove a test file in ~', () =>
    CLI.command(`rm -f ~/testls`, this.app).then(ReplExpect.ok).catch(Common.oops(this, true)))

  it('should fail with 404 to ls a non-existing file', () =>
    CLI.command('ls fjdsioafjdsaioffsdaiofjdsaiofjdsaiofjdsaiofjdsaifjdsaiofsa', this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this, true)))

  it('should use ls ../../', () =>
    CLI.command(`ls ../../`, this.app).then(ReplExpect.okWithString('package.json')).catch(Common.oops(this)))

  it('should use ls -l ../../', () =>
    CLI.command(`ls -l ../../`, this.app).then(ReplExpect.okWith('package.json')).catch(Common.oops(this)))

  // pipe to wc
  it('should use ls ../../package.json | wc -l', () =>
    CLI.command(`ls ../../package.json | wc -l`, this.app).then(ReplExpect.okWithString('1')).catch(Common.oops(this)))

  // pipe to grep to wc
  it('should use ls ../../ | grep package.json | wc -l', () =>
    CLI.command(`ls ../../ | grep package.json | wc -l`, this.app)
      .then(ReplExpect.okWithString('1'))
      .catch(Common.oops(this)))

  // pipe to grep
  it('should use ls ../../ | grep package.json', () =>
    CLI.command(`ls ../../ | grep package.json`, this.app)
      .then(ReplExpect.okWithString('package.json'))
      .catch(Common.oops(this)))
  it('should use ls ../../ | grep p*', () =>
    CLI.command(`ls ../../ | grep p*`, this.app).then(ReplExpect.okWithString('package.json')).catch(Common.oops(this)))
  it('should use ls -l ../../ | grep package.json', () =>
    CLI.command(`ls -l ../../ | grep package.json`, this.app)
      .then(ReplExpect.okWith('package.json'))
      .catch(Common.oops(this)))
  it('should use ls -l ../../ | grep p*son', () =>
    CLI.command(`ls -l ../../ | grep p*son`, this.app).then(ReplExpect.okWith('package.json')).catch(Common.oops(this)))

  const doListAndMetaClick = async () => {
    const holdDown = Keys.holdDownKey.bind(this)
    const release = Keys.releaseKey.bind(this)

    const res = await CLI.command(`ls -l ../../`, this.app)
    await ReplExpect.okWith('package.json')

    const selector = Selectors.LIST_RESULT_BY_N_FOR_NAME(res.count, 'package.json')
    await holdDown(Keys.META)
    await this.app.client.$(selector).then(_ => _.click())
    await release(Keys.META)

    return res
  }
  it('list and click with meta key, and drilldown should not be in a new split', async () => {
    try {
      await ReplExpect.splitCount(1)
      const res = await doListAndMetaClick()
      await ReplExpect.splitCount(1)
      await SidecarExpect.open(ReplExpect.blockAfter(res)).then(
        SidecarExpect.showing('package.json', undefined, undefined, undefined, undefined, undefined, undefined, false)
      )
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should ls with semicolons 1', () =>
    CLI.command(`ls -l ../../ ; echo ${echoString}`, this.app)
      .then(ReplExpect.okWith('package.json'))
      .catch(Common.oops(this)))

  it('should ls with semicolons 2', () =>
    CLI.command(`ls -l ../../ ; echo ${echoString}`, this.app)
      .then(ReplExpect.okWithPtyOutput(echoString))
      .catch(Common.oops(this)))

  it('should ls with semicolons 3', () =>
    CLI.command(`ls -l ../../;; ;; ; ; ;;;;; ;echo ${echoString}`, this.app)
      .then(ReplExpect.okWithPtyOutput('syntax error near unexpected token'))
      .catch(Common.oops(this)))

  it('should ls with semicolons 4', () =>
    CLI.command(`ls -l ../../;; ;; ; ; ;;;;; ;echo ${echoString}`, this.app)
      .then(ReplExpect.okWithPtyOutput('syntax error near unexpected token'))
      .catch(Common.oops(this)))

  it('should use ls -l ../../README.md', () =>
    CLI.command(`ls -l ../../README.md`, this.app).then(ReplExpect.okWith('README.md')).catch(Common.oops(this)))

  const Cs = ['CONTRIBUTING.md']
  Cs.forEach(expect => {
    it(`should use ls -l ../../C* and expect ${expect}`, () =>
      CLI.command(`ls -l ../../C*`, this.app).then(ReplExpect.okWith(expect)).catch(Common.oops(this)))
  })

  const CsandP = Cs.concat(['package.json'])
  CsandP.forEach(expect => {
    it('should use ls -l ../../C* ../package.json', () =>
      CLI.command(`ls -l ../../C* ../../package.json`, this.app)
        .then(ReplExpect.okWith(expect))
        .catch(Common.oops(this)))
  })

  const CsandT = Cs.concat(['tools'])
  CsandT.forEach(expect => {
    it('should use ls -d -l ../../C* ../tool*', () =>
      CLI.command(`ls -d -l ../../C* ../../tool*`, this.app).then(ReplExpect.okWith(expect)).catch(Common.oops(this)))
  })
})
