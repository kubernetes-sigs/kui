/*
 * Copyright 2018 IBM Corporation
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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'

import { exec } from 'child_process'
import { unlinkSync, rmdirSync } from 'fs'
const { cli, selectors } = ui
const { localDescribe } = common

/** expect the given folder within the help tree */
export const header = (folder: string) => folder

/**
 * Check to see if the given executable is available
 *
 */
const hasExe = (exe: string): Promise<boolean> =>
  new Promise(resolve => {
    exec(exe, err => resolve(!err))
  })

localDescribe('shell commands', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should give 404 for unknown outer command', () =>
    cli
      .do(`ibmcloudo target`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this)))

  // these two are useful as a pair; git usage responds with exit code
  // 1, whereas ibmcloud responds with exit code 0
  it('should give usage for git', () =>
    cli
      .do(`git`, this.app)
      .then(cli.expectError(1))
      .catch(common.oops(this)))

  // TODO: Disabled for now. See https://github.com/IBM/kui/issues/1977
  it.skip('should give usage for ibmcloud', () =>
    cli
      .do(`ibmcloud`, this.app)
      .then(cli.expectError(500, header('ibmcloud')))
      .catch(common.oops(this)))

  if (!process.env.LOCAL_OPENWHISK) {
    it('should give ok for known outer command: ibmcloud target', () =>
      cli
        .do(`ibmcloud target`, this.app)
        .then(cli.expectOK)
        .catch(common.oops(this)))
  }

  if (hasExe('ibmcloud')) {
    // TODO: Disabled for now. See https://github.com/IBM/kui/issues/1977
    it.skip('should give usage for ibmcloud config', () =>
      cli
        .do(`ibmcloud config`, this.app)
        .then(cli.expectError(2, undefined))
        .catch(common.oops(this)))

    // TODO: Disabled for now. See https://github.com/IBM/kui/issues/1977
    it.skip('should give usage for ibmcloud app', () =>
      cli
        .do(`ibmcloud app`, this.app)
        .then(cli.expectErrorWithPassthrough(500))
        .then(N =>
          Promise.all([
            this.app.client.waitForExist(`${selectors.OUTPUT_N(N)} h4.usage-error-title[data-title="commands"]`),
            this.app.client.waitForExist(
              `${selectors.OUTPUT_N(N)} .bx--breadcrumb-item .bx--no-link[data-label="app"]`
            ),
            this.app.client.waitForExist(
              `${selectors.OUTPUT_N(N)} .bx--breadcrumb-item .bx--link[data-label="ibmcloud"]`
            )
          ])
        )
        .catch(common.oops(this)))
  }

  it('should answer which ls with /bin/ls', () =>
    cli
      .do(`which -a ls`, this.app) // For some customized bash, `which ls` could show: ls: aliased to ls -G
      .then(cli.expectOKWithCustom({ expect: '/bin/ls', exact: false }))
      .catch(common.oops(this)))

  it('should echo hi', () =>
    cli
      .do(`echo hi`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'hi' }))
      .catch(common.oops(this)))

  it('should change working directory', () =>
    cli
      .do(`cd bin`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))

  it('should list core/', () =>
    cli
      .do(`ls`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'runTest.sh' }))
      .catch(common.oops(this)))

  // clean up possible previous test leftovers
  try {
    unlinkSync('data/foo bar/testTmp')
  } catch (err) {
    // ok, we're just cleaning up from previous runs
  }
  try {
    rmdirSync('data/foo bar/foo2 bar2')
  } catch (err) {
    // ok, we're just cleaning up from previous runs
  }
  try {
    rmdirSync('data/foo bar')
  } catch (err) {
    // ok, we're just cleaning up from previous runs
  }

  /* it('should list directory properly that contains prefix matches', () => cli.do(`ls @demos`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'try-retain.js' }))
    .catch(common.oops(this)))
  it('should list directory properly that contains prefix matches', () => cli.do(`ls @demos`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'retain.js' }))
    .catch(common.oops(this)))
  it('should list directory properly that contains prefix matches', () => cli.do(`ls @demos`, this.app)
    .then(cli.expectOKWithCustom({ expect: 'try.js' }))
    .catch(common.oops(this))) */

  it('should mkdir with spaces', () =>
    cli
      .do(`mkdir "foo bar"`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))
  it('should fail to mkdir again', () =>
    cli
      .do(`mkdir "foo bar"`, this.app)
      .then(cli.expectError(409))
      .catch(common.oops(this)))

  it('should echo ho to a file', () =>
    cli
      .do(`echo ho > "foo bar"/testTmp`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))
  it('should cat that file', () =>
    cli
      .do(`cat "foo bar"/testTmp`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'ho' }))
      .catch(common.oops(this)))
  it('should rm that file', () =>
    cli
      .do(`rm "foo bar"/testTmp`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))

  it('should mkdir a subdir with spaces', () =>
    cli
      .do(`mkdir "foo bar"/"foo2 bar2"`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))
  it('should list the new directory with spaces', () =>
    cli
      .do(`lls "foo bar"`, this.app) // test the lls synonym for ls
      .then(cli.expectOKWithCustom({ expect: 'foo2 bar2' }))
      .catch(common.oops(this)))
  it('should rmdir a subdir with spaces', () =>
    cli
      .do(`rmdir "foo bar"/"foo2 bar2"`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))
  it('should rmdir a dir with spaces', () =>
    cli
      .do(`rmdir "foo bar"`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))
})
