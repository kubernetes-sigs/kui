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

import { Common, CLI, ReplExpect } from '@kui-shell/test'

const echoString = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

describe(`directory listing ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  Common.proxyIt('should cd to the test dir', () =>
    CLI.command(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(ReplExpect.okWithString('packages/test'))
      .catch(Common.oops(this, true))
  )

  it('should use ls ../../', () =>
    CLI.command(`ls ../../`, this.app)
      .then(ReplExpect.okWith('package.json'))
      .catch(Common.oops(this)))

  it('should ls with semicolons 1', () =>
    CLI.command(`ls ../../ ; echo ${echoString}`, this.app)
      .then(ReplExpect.okWith('package.json'))
      .catch(Common.oops(this)))

  it('should ls with semicolons 2', () =>
    CLI.command(`ls ../../ ; echo ${echoString}`, this.app)
      .then(ReplExpect.okWithString(echoString))
      .catch(Common.oops(this)))

  it('should ls with semicolons 3', () =>
    CLI.command(`ls ../../;; ;; ; ; ;;;;; ;echo ${echoString}`, this.app)
      .then(ReplExpect.okWith('package.json'))
      .catch(Common.oops(this)))

  it('should ls with semicolons 4', () =>
    CLI.command(`ls ../../;; ;; ; ; ;;;;; ;echo ${echoString}`, this.app)
      .then(ReplExpect.okWithString(echoString))
      .catch(Common.oops(this)))

  it('should use ls ../../README.md', () =>
    CLI.command(`ls ../../README.md`, this.app)
      .then(ReplExpect.okWith('README.md'))
      .catch(Common.oops(this)))

  const Cs = ['CONTRIBUTING.md']
  Cs.forEach(expect => {
    it(`should use ls ../../C* and expect ${expect}`, () =>
      CLI.command(`ls ../../C*`, this.app)
        .then(ReplExpect.okWith(expect))
        .catch(Common.oops(this)))
  })

  const CsandP = Cs.concat(['package.json'])
  CsandP.forEach(expect => {
    it('should use ls ../../C* ../package.json', () =>
      CLI.command(`ls ../../C* ../../package.json`, this.app)
        .then(ReplExpect.okWith(expect))
        .catch(Common.oops(this)))
  })

  const CsandT = Cs.concat(['tools'])
  CsandT.forEach(expect => {
    it('should use ls -d ../../C* ../tool*', () =>
      CLI.command(`ls -d ../../C* ../../tool*`, this.app)
        .then(ReplExpect.okWith(expect))
        .catch(Common.oops(this)))
  })
})
