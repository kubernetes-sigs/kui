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
// import { remove } from 'fs-extra'
import { exec } from 'child_process'
import { dir as createTemporaryDirectory } from 'tmp'

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

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

const suiteName = `git branch as DropDown ${process.env.MOCHA_RUN_TARGET || ''}`
describe(suiteName, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // we will make two branches in a temporary directory, to test tab
  // completion of branch names
  const commonBranchNamePrefix = 'branch'
  const branch1 = `${commonBranchNamePrefix}111`
  const branch2 = `${commonBranchNamePrefix}222` // should have a common prefix with branch1

  // list branches and expect the given `branch` name to appear in the table
  const listAndExpect = (branch: string) => {
    pit(`should list branch ${branch} as a RadioTable`, () =>
      CLI.command('git branch', this.app)
        .then(ReplExpect.okWithDropDownList(branch))
        .catch(Common.oops(this, true))
    )
  }

  // list branches and click the given branch name row
  const listAndClick = (branch: string) => {
    pit(`should initiate git branch switch via command`, () => {
      return CLI.command(`git checkout ${branch}`, this.app)
        .then(ReplExpect.ok)
        .then(() =>
          this.app.client.waitUntil(
            async () => {
              const actualBranch = await this.app.client
                .$(Selectors.STATUS_STRIPE_WIDGET_LABEL('kui--plugin-git--current-git-branch'))
                .then(_ => _.getText())
              return actualBranch === branch
            },
            { timeout: CLI.waitTimeout }
          )
        )
        .catch(Common.oops(this, true))
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
  pit('should checkout master', () => checkout('master', tmpdir))

  pit('should cd to the clone directory', () =>
    CLI.command(`cd ${join(tmpdir, testClone)}`, this.app)
      .then(ReplExpect.okWithString(tmpdir))
      .catch(Common.oops(this))
  )

  listAndExpect(branch1)
  listAndExpect(branch2)

  listAndClick(branch2)
  listAndClick(branch1)

  // pit('should clean up temporary directory', () => remove(tmpdir))
})
