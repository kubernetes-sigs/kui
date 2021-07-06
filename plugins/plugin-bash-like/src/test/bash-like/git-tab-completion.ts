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

// TODO pty-main restore remove

import { join } from 'path'
import { exec } from 'child_process'
import { dir as createTemporaryDirectory } from 'tmp'

import { Common, CLI, ReplExpect } from '@kui-shell/test'
import { tabby, tabbyWithOptions } from '@kui-shell/plugin-core-support/tests/lib/core-support/tab-completion-util'

const testRepo = 'test-repo.git'
const testClone = 'test-clone'

const runTheTests = process.env.MOCHA_RUN_TARGET !== 'webpack' || process.env.KUI_USE_PROXY === 'true'
const pit = runTheTests ? it : xit

function gitInit(tmpdir: string) {
  return new Promise<void>((resolve, reject) => {
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

function gitClone(tmpdir: string) {
  return new Promise<void>((resolve, reject) => {
    exec(
      `git clone ${testRepo} ${testClone} && cd ${testClone} && touch foo && git add foo && git commit -m foo . && git push origin master`,
      { cwd: tmpdir },
      (error, stdout, stderr) => {
        if (error) {
          if (stderr) {
            console.error(stderr)
          }
          reject(error)
        } else {
          resolve()
        }
      }
    )
  })
}

function checkout(branchName: string, tmpdir: string, options = '') {
  return new Promise<void>((resolve, reject) => {
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

function makeBranch(branchName: string, tmpdir: string) {
  return checkout(branchName, tmpdir, '-b')
}

const suiteName = `Tab completion for git branches ${process.env.MOCHA_RUN_TARGET || ''}`
describe(suiteName, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // we will make two branches in a temporary directory, to test tab
  // completion of branch names
  const commonBranchNamePrefix = 'branch'
  const prefix = commonBranchNamePrefix.charAt(0)
  const branch1 = `${commonBranchNamePrefix}111`
  const branch2 = `${commonBranchNamePrefix}222` // should have a common prefix with branch1
  const branch3 = 'zzz' // should be fully distinct from branch1 and branch2

  const testTabCompletion = () => {
    pit(`should tab complete branch names with options`, () => {
      return tabbyWithOptions(
        this,
        `git checkout ${prefix}`, // e.g. git checkout b<tab>
        [branch1, branch2],
        `git checkout ${branch1}`,
        {
          click: 0,
          expectedPromptAfterTab: `git checkout ${commonBranchNamePrefix}` // e.g. git checkout b[ranch]
        }
      ).catch(Common.oops(this, true))
    })
  }

  let tmpdir: string
  pit(
    'should create temporary directory',
    () =>
      new Promise<void>((resolve, reject) => {
        createTemporaryDirectory((err, path) => {
          if (err) {
            reject(err)
          } else {
            tmpdir = path
            console.log(`tmpdir for ${suiteName}: ${tmpdir}`)
            resolve()
          }
        })
      })
  )

  pit('should git init in that temporary directory', () => gitInit(tmpdir))
  pit('should git clone in that temporary directory', () => gitClone(tmpdir))
  pit(`should make branch ${branch1} in that temporary directory`, () => makeBranch(branch1, tmpdir))
  pit(`should make branch ${branch2} in that temporary directory`, () => makeBranch(branch2, tmpdir))
  pit(`should make branch ${branch3} in that temporary directory`, () => makeBranch(branch3, tmpdir))
  pit('should checkout master', () => checkout('master', tmpdir))

  pit('should cd to the clone directory', () =>
    CLI.command(`cd ${join(tmpdir, testClone)}`, this.app)
      .then(ReplExpect.okWithString(tmpdir))
      .catch(Common.oops(this))
  )

  pit(`should tab complete ${branch3} without any options`, () => {
    // since branch3 is distinctly named
    return tabby(this, `git checkout ${branch3.charAt(0)}`, `git checkout ${branch3}`)
  })

  testTabCompletion()

  /** make sure we don't tab complete a file name with the common prefix */
  const tempFile = `${prefix}temporaryfile`
  pit(`should touch temporary file ${tempFile}`, () => {
    return CLI.command(`touch ${tempFile}`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  })
  testTabCompletion() // <-- we still had better complete only the branch names

  // pit('should clean up temporary directory', () => remove(tmpdir))
})
