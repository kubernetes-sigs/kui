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

import { join } from 'path'
import { remove } from 'fs-extra'
import { exec } from 'child_process'
import { dir as createTemporaryDirectory } from 'tmp'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import { tabby, tabbyWithOptions } from '@kui-shell/plugin-core-support/tests/lib/core-support/tab-completion-util'

const { cli } = ui

const testRepo = 'test-repo.git'
const testClone = 'test-clone'

function gitInit (tmpdir: string) {
  return new Promise((resolve, reject) => {
    exec(`git init --bare ${testRepo}`, { cwd: tmpdir }, (error, stdout, stderr) => {
      if (error) {
        if (stderr) {
          console.error(stderr)
        }
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

function gitClone (tmpdir: string) {
  return new Promise((resolve, reject) => {
    exec(`git clone ${testRepo} ${testClone} && cd ${testClone} && touch foo && git add foo && git commit -m foo . && git push origin master`, { cwd: tmpdir }, (error, stdout, stderr) => {
      if (error) {
        if (stderr) {
          console.error(stderr)
        }
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

function checkout (branchName: string, tmpdir: string, options = '') {
  return new Promise((resolve, reject) => {
    exec(`git checkout ${options} ${branchName}`, { cwd: join(tmpdir, testClone) }, (error, stdout, stderr) => {
      if (error) {
        if (stderr) {
          console.error(stderr)
        }
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

function makeBranch (branchName: string, tmpdir: string) {
  return checkout(branchName, tmpdir, '-b')
}

common.localDescribe('Tab completion for git branches', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  // we will make two branches in a temporary directory, to test tab
  // completion of branch names
  const commonBranchNamePrefix = 'branch'
  const branch1 = `${commonBranchNamePrefix}111`
  const branch2 = `${commonBranchNamePrefix}222` // should have a common prefix with branch1
  const branch3 = 'zzz' // should be fully distinct from branch1 and branch2

  let tmpdir: string
  it('should create temporary directory', () => new Promise((resolve, reject) => {
    createTemporaryDirectory((err, path) => {
      if (err) {
        reject(err)
      } else {
        tmpdir = path
        resolve()
      }
    })
  }))

  it('should git init in that temporary directory', () => gitInit(tmpdir))
  it('should git init in that temporary directory', () => gitClone(tmpdir))
  it(`should make branch ${branch1} in that temporary directory`, () => makeBranch(branch1, tmpdir))
  it(`should make branch ${branch2} in that temporary directory`, () => makeBranch(branch2, tmpdir))
  it(`should make branch ${branch3} in that temporary directory`, () => makeBranch(branch3, tmpdir))
  it('should checkout master', () => checkout('master', tmpdir))

  it('should cd to the clone directory', () => cli.do(`cd ${join(tmpdir, testClone)}`, this.app)
    .then(cli.expectOKWithString(tmpdir))
    .catch(common.oops(this)))

  it(`should tab complete ${branch3} without any options`, () => { // since branch3 is distinctly named
    return tabby(this.app,
      `git checkout ${branch3.charAt(0)}`,
      `git checkout ${branch3}`)
  })

  it(`should tab complete branch names with options`, () => {
    return tabbyWithOptions(this.app,
      `git checkout ${commonBranchNamePrefix.charAt(0)}`, // e.g. git checkout b<tab>
      [branch1, branch2],
      `git checkout ${branch1}`,
      {
        click: 0,
        expectedPromptAfterTab: `git checkout ${commonBranchNamePrefix}` // e.g. git checkout b[ranch]
      })
  })

  it('should clean up temporary directory', () => remove(tmpdir))
})
