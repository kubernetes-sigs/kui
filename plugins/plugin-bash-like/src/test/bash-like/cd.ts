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

import { dirSync } from 'tmp'
import { v4 as uuid } from 'uuid'
import { dirname, join, normalize } from 'path'

import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'
import { Util as Utils } from '@kui-shell/core'

const ROOT = dirname(require.resolve('@kui-shell/core/tests/package.json'))
const rootRelative = (dir: string) => join(ROOT, dir)

const runTheTests = process.env.MOCHA_RUN_TARGET !== 'webpack' || process.env.KUI_USE_PROXY === 'true'
const pit = runTheTests ? it : xit

describe(`bash-like cd ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  let initialDirectory: string
  pit('should echo current directory', () =>
    CLI.command('pwd', this.app)
      .then(ReplExpect.okWithAny)
      .then(async () => {
        initialDirectory = Utils.expandHomeDir(await this.app.client.$(Selectors.OUTPUT_LAST).then(_ => _.getText()))
      })
      .catch(Common.oops(this, true))
  )

  const previous = () => {
    it(`should execute 'cd -' to change to previous dir ${initialDirectory}`, () =>
      CLI.command(`cd -`, this.app)
        .then(ReplExpect.okWithString(normalize(initialDirectory)))
        .catch(Common.oops(this, true)))
  }

  const bar = `bar${uuid()}`
  pit('should mkdir with spaces', () =>
    CLI.command(`mkdir /tmp/"kui ${bar}"`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true))
  )

  pit(`should execute 'cd /tmp/"kui ${bar}"'`, () =>
    CLI.command(`cd /tmp/"kui ${bar}"`, this.app)
      .then(ReplExpect.okWithString('kui bar'))
      .catch(Common.oops(this, true))
  )

  previous()

  pit(`should execute 'cd "/tmp/kui ${bar}"'`, () =>
    CLI.command(`cd "/tmp/kui ${bar}"`, this.app)
      .then(ReplExpect.okWithString('kui bar'))
      .catch(Common.oops(this, true))
  )

  previous()

  pit(`should execute 'cd /tmp/kui ${bar}'`, () =>
    CLI.command(`cd /tmp/kui\\ ${bar}`, this.app)
      .then(ReplExpect.okWithString('kui bar'))
      .catch(Common.oops(this, true))
  )

  // ls with space and trailing slash; see https://github.com/IBM/kui/issues/1389
  pit(`should execute 'ls -l /tmp/kui ${bar}/'`, () =>
    CLI.command(`ls -l /tmp/kui\\ ${bar}/`, this.app)
      .then(ReplExpect.okWithAny)
      .catch(Common.oops(this, true))
  )

  // not supported right now
  xit(`should execute 'ls /tmp/"kui ${bar}"/'`, () =>
    CLI.command(`ls /tmp/"kui ${bar}"/`, this.app)
      .then(ReplExpect.okWithAny)
      .catch(Common.oops(this, true)))

  previous()

  pit(`should execute 'cd data'`, () =>
    CLI.command(`cd ${ROOT}/data`, this.app)
      .then(ReplExpect.okWithString(rootRelative('data')))
      .catch(Common.oops(this, true))
  )

  previous()

  pit(`should execute 'cd -' again to change to previous-previous dir`, () =>
    CLI.command(`cd -`, this.app)
      .then(ReplExpect.okWithString(rootRelative('data')))
      .catch(Common.oops(this, true))
  )

  previous()

  // now we should be able to change back to data
  pit(`should execute 'cd data'`, () =>
    CLI.command(`cd ${ROOT}/data`, this.app)
      .then(ReplExpect.okWithString(rootRelative('data')))
      .catch(Common.oops(this, true))
  )

  pit(`should handle cd error`, () =>
    CLI.command(`cd notexist`, this.app)
      .then(ReplExpect.error(500, 'cd: no such file or directory: notexist'))
      .catch(Common.oops(this, true))
  )

  pit(`should handle cd error`, () =>
    CLI.command(`cd ../notexist`, this.app)
      .then(ReplExpect.error(500, 'cd: no such file or directory: ../notexist'))
      .catch(Common.oops(this, true))
  )

  pit(`should handle cd error`, () =>
    CLI.command(`cd -/..`, this.app)
      .then(ReplExpect.error(499, 'Unsupported optional parameter /'))
      .catch(Common.oops(this, true))
  )

  pit(`should execute cd without arguments`, () =>
    CLI.command('cd', this.app)
      .then(ReplExpect.okWithString(Utils.expandHomeDir('~')))
      .catch(Common.oops(this, true))
  )

  pit(`should execute cd ${ROOT}`, () =>
    CLI.command(`cd ${ROOT}`, this.app)
      .then(ReplExpect.okWithString(ROOT))
      .catch(Common.oops(this, true))
  )
})

// see https://github.com/kubernetes-sigs/kui/issues/8160
describe(`remove current directory ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const { name: tmp } = dirSync()

  pit(`should cd to our tmp dir ${tmp}`, () =>
    CLI.command(`cd ${tmp}`, this.app)
      .then(ReplExpect.okWithString(tmp))
      .catch(Common.oops(this, true))
  )

  pit(`should remove our tmp dir ${tmp}`, () =>
    CLI.command(`rm -rf ${tmp}`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )

  pit(`should still show pwd as ${tmp}`, () =>
    CLI.command(`pwd`, this.app)
      .then(ReplExpect.okWithString(tmp))
      .catch(Common.oops(this, true))
  )

  // webpack-dev-server seems to crash if we don't do this; should be dev only :(
  pit(`should cd back home`, () =>
    CLI.command(`cd`, this.app)
      .then(ReplExpect.okWithString(Utils.expandHomeDir('~')))
      .catch(Common.oops(this, true))
  )
})

// see https://github.com/kubernetes-sigs/kui/issues/8173
describe(`remove current directory with tab switch ${process.env.MOCHA_RUN_TARGET ||
  ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const { name: tmp } = dirSync()

  pit(`should cd to our tmp dir ${tmp}`, () =>
    CLI.command(`cd ${tmp}`, this.app)
      .then(ReplExpect.okWithString(tmp))
      .catch(Common.oops(this, true))
  )

  pit('should create new tab', () => Util.clickNewTabButton(this, 2))
  pit('should switch to that tab', () => Util.switchToTopLevelTabViaClick(this, 2))

  pit(`should remove our tmp dir ${tmp}`, () =>
    CLI.command(`rmdir ${tmp}`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )

  pit('should switch back to the first tab', () => Util.switchToTopLevelTabViaClick(this, 1))

  pit(`should show parent of pwd as ${tmp}`, () =>
    CLI.command(`pwd`, this.app)
      .then(ReplExpect.okWithString(dirname(tmp)))
      .catch(Common.oops(this, true))
  )
})
