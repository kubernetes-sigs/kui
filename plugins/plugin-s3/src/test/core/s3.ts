/*
 * Copyright 2020 IBM Corporation
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

import { v4 } from 'uuid'
import { join } from 'path'
import { Common, CLI, ReplExpect } from '@kui-shell/test'

const README = 'README.md'
const README2 = 'README2.md'
const README_LOCAL_PATH = join(process.env.TEST_ROOT, `../../${README}`)

if (process.env.NEEDS_MINIO) {
  describe('s3 vfs', function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const mkdir = (bucketName: string) => {
      it(`should create a bucket ${bucketName}`, () =>
        CLI.command(`mkdir /s3/${bucketName}`, this.app)
          .then(ReplExpect.justOK)
          .catch(Common.oops(this, true)))
    }
    const ls = (expectedName: string, specifiedBucketName?: string) => {
      it(`should list buckets and show ${expectedName} ${
        specifiedBucketName ? 'using specified bucket name' : ''
      }`, () =>
        CLI.command('ls -l /s3' + (specifiedBucketName ? `/${specifiedBucketName}` : ''), this.app)
          .then(ReplExpect.okWith(expectedName))
          .catch(Common.oops(this, true)))
    }
    const cp = (bucketName: string, specifiedDest?: string) => {
      it(`should copy a file to the bucket ${bucketName}`, () =>
        CLI.command(`cp ${README_LOCAL_PATH} /s3/${bucketName}` + (specifiedDest ? `/${specifiedDest}` : ''), this.app)
          .then(ReplExpect.okWithString('Created object'))
          .catch(Common.oops(this, true)))
    }
    const rmdirExpectingError = (bucketName: string) => {
      it(`should remove the bucket ${bucketName}`, () =>
        CLI.command(`rmdir /s3/${bucketName}`, this.app)
          .then(ReplExpect.error(500))
          .catch(Common.oops(this, true)))
    }
    const rmdir = (bucketName: string) => {
      it(`should remove the bucket ${bucketName}`, () =>
        CLI.command(`rmdir /s3/${bucketName}`, this.app)
          .then(ReplExpect.justOK)
          .catch(Common.oops(this, true)))
    }
    const rm = (bucketName: string, file: string) => {
      it(`should remove the file ${file} in ${bucketName}`, () =>
        CLI.command(`rm /s3/${bucketName}/${file}`, this.app)
          .then(ReplExpect.justOK)
          .catch(Common.oops(this, true)))
    }
    const rimraf = (bucketName: string) => {
      it(`should recursively remove ${bucketName}`, () =>
        CLI.command(`rm -r /s3/${bucketName}`, this.app)
          .then(ReplExpect.justOK)
          .catch(Common.oops(this, true)))
    }
    const lsExpecting404 = (bucketName: string) => {
      it(`should list buckets and NOT show ${bucketName}`, () =>
        CLI.command(`ls /s3/${bucketName}`, this.app)
          .then(ReplExpect.error(404))
          .catch(Common.oops(this, true)))
    }

    // here come the tests:
    {
      const bucketName = `kuitest-${v4()}`

      mkdir(bucketName)
      ls(bucketName) // ls /s3, expect bucketName
      cp(bucketName)
      ls(README, bucketName) // ls /s3/bucketName, expect README
      cp(bucketName, README2)
      ls(README2, bucketName) // ls /s3/bucketName, expect README2
      rmdirExpectingError(bucketName)
      rm(bucketName, README)
      rm(bucketName, README2)
      rmdir(bucketName)
      lsExpecting404(bucketName)
    }

    {
      // needs to be different; some s3 backends can't recreate a
      // bucketName immediately after deleting it
      const bucketName = `kuitest-${v4()}`

      mkdir(bucketName)
      cp(bucketName)
      rimraf(bucketName)
      lsExpecting404(bucketName)
    }
  })
}
