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
import { tmpdir } from 'os'
import { unlinkSync } from 'fs'
import { strictEqual } from 'assert'
import { Common, CLI, ReplExpect } from '@kui-shell/test'

// some typing issues
const globby = require('globby')

const README = 'README.md'
const README2 = 'README2.md'
const README3 = `README3-${v4()}.md`
const README_LOCAL_PATH = join(process.env.TEST_ROOT, `../../${README}`)

const PJSON = 'package.json'
const PJSON_LOCAL_PATH = join(process.env.TEST_ROOT, `../../${PJSON}`)

// the provider name, e.g. ibm or minio
const PROVIDER = process.env.MINIO_PROVIDER || 'minio'

if (process.env.NEEDS_MINIO) {
  describe('s3 vfs', function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const mkdir = (bucketName: string) => {
      it(`should create a bucket ${bucketName}`, () =>
        CLI.command(`mkdir /s3/${PROVIDER}/${bucketName}`, this.app)
          .then(ReplExpect.justOK)
          .catch(Common.oops(this, true)))
    }
    const ls = (expectedName: string, specifiedBucketName?: string, specifiedObjectName?: string) => {
      it(`should list buckets and show ${expectedName} ${
        specifiedBucketName ? 'using specified bucket name' : ''
      }`, () =>
        CLI.command(
          `ls -l /s3/${PROVIDER}` +
            (specifiedBucketName ? `/${specifiedBucketName}` : '') +
            (specifiedObjectName ? `/${specifiedObjectName}` : ''),
          this.app
        )
          .then(ReplExpect.okWith(expectedName))
          .catch(Common.oops(this, true)))
    }
    const copyToS3 = (bucketName: string, specifiedDest?: string) => {
      it(`should copy a file ->TO the bucket ${bucketName}`, () =>
        CLI.command(
          `cp ${README_LOCAL_PATH} /s3/${PROVIDER}/${bucketName}` + (specifiedDest ? `/${specifiedDest}` : ''),
          this.app
        )
          .then(ReplExpect.okWithString('Created object'))
          .catch(Common.oops(this, true)))
    }
    const multiCopyToS3 = (bucketName: string, specifiedDest?: string) => {
      it(`should copy a file1, file2 ->TO the bucket ${bucketName}`, () =>
        CLI.command(
          `cp ${README_LOCAL_PATH} ${PJSON_LOCAL_PATH} /s3/${PROVIDER}/${bucketName}` +
            (specifiedDest ? `/${specifiedDest}` : ''),
          this.app
        )
          .then(ReplExpect.okWithString('Created objects'))
          .catch(Common.oops(this, true)))
    }
    const copyFromS3 = (bucketName: string, srcFilename: string, destDir: string, destFilename?: string) => {
      it(`should copy a file FROM-> the bucket ${bucketName}`, async () => {
        try {
          const specifiedDest = destFilename ? join(destDir, destFilename) : destDir

          await CLI.command(`cp /s3/${PROVIDER}/${bucketName}/${srcFilename} ${specifiedDest}`, this.app).then(
            ReplExpect.okWithString(`Fetched`)
          )

          const expectedDest = destFilename ? specifiedDest : join(destDir, srcFilename)
          const expected = await globby(expectedDest)
          strictEqual(expected.length, 1)

          await Promise.all(expected.map(_ => unlinkSync(_)))
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }
    const copyWithinS3 = (srcBucketName: string, srcFilename: string, dstBucketName: string, destFilename?: string) => {
      it(`should copy a file within s3 from the bucket ${srcBucketName}`, async () => {
        try {
          const specifiedDest = join('/s3', PROVIDER, dstBucketName, destFilename || '')

          await CLI.command(`cp /s3/${PROVIDER}/${srcBucketName}/${srcFilename} ${specifiedDest}`, this.app).then(
            ReplExpect.okWithString(`Copied`)
          )
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }
    const rmdirExpectingError = (bucketName: string) => {
      it(`should remove the bucket ${bucketName}`, () =>
        CLI.command(`rmdir /s3/${PROVIDER}/${bucketName}`, this.app)
          .then(ReplExpect.error(500))
          .catch(Common.oops(this, true)))
    }
    const rmdir = (bucketName: string) => {
      it(`should remove the bucket ${bucketName}`, () =>
        CLI.command(`rmdir /s3/${PROVIDER}/${bucketName}`, this.app)
          .then(ReplExpect.justOK)
          .catch(Common.oops(this, true)))
    }
    const rm = (bucketName: string, file: string) => {
      it(`should remove the file ${file} in ${bucketName}`, () =>
        CLI.command(`rm /s3/${PROVIDER}/${bucketName}/${file}`, this.app)
          .then(ReplExpect.justOK)
          .catch(Common.oops(this, true)))
    }
    const rimraf = (bucketName: string) => {
      it(`should recursively remove ${bucketName}`, () =>
        CLI.command(`rm -r /s3/${PROVIDER}/${bucketName}`, this.app)
          .then(ReplExpect.justOK)
          .catch(Common.oops(this, true)))
    }
    const lsExpecting404 = (bucketName: string) => {
      it(`should list buckets and NOT show ${bucketName}`, () =>
        CLI.command(`ls /s3/${PROVIDER}/${bucketName}`, this.app)
          .then(ReplExpect.error(404))
          .catch(Common.oops(this, true)))
    }

    // here come the tests:
    {
      const bucketName = `kuitest-${v4()}`

      // see https://github.com/IBM/kui/issues/5972
      it('should sleep', () => new Promise(resolve => setTimeout(resolve, 5000)))

      mkdir(bucketName)
      ls(bucketName) // ls /s3/${PROVIDER}, expect bucketName
      multiCopyToS3(bucketName)
      ls(PJSON, bucketName) // ls /s3/minio/bucketName, expect package.json
      ls(README, bucketName) // ls /s3/minio/bucketName, expect README
      ls(README, bucketName, '*') // ls /s3/minio/bucketName/*, expect README
      ls(README, bucketName, 'R*') // ls /s3/minio/bucketName/R*, expect README
      ls(README, bucketName, '*EADME.md') // ls /s3/minio/bucketName/*EADME.md, expect README
      ls(README, bucketName, 'README{,}.md') // ls /s3/minio/bucketName/README{,}.md, expect README <-- brace expansion
      ls(README, bucketName, 'README{,}.m*') // ls /s3/minio/bucketName/README{,}.m*, expect README <-- brace expansion
      copyToS3(bucketName, README2)
      ls(README2, bucketName) // ls /s3/minio/bucketName, expect README2
      copyFromS3(bucketName, README2.replace(/.md$/, '*'), tmpdir()) // wildcard in source
      copyFromS3(bucketName, README2, tmpdir(), README3)
      rmdirExpectingError(bucketName)
      rm(bucketName, PJSON)

      // wildcard remove should have the net effect of the two commented-out rm's
      rm(bucketName, README.charAt(0) + '*')
      // rm(bucketName, README)
      // rm(bucketName, README2)

      rmdir(bucketName)
      lsExpecting404(bucketName)
    }

    // wildcard rimraf
    {
      const bucketName1 = `kuitest-${v4()}`
      const bucketName2 = `kuitest-${v4()}`

      mkdir(bucketName1)
      mkdir(bucketName2)
      rimraf('kuitest*')
      lsExpecting404(bucketName1)
      lsExpecting404(bucketName2)
    }

    {
      // needs to be different; some s3 backends can't recreate a
      // bucketName immediately after deleting it
      const bucketName1 = `kuitest-${v4()}`
      const bucketName2 = `kuitest-${v4()}`

      mkdir(bucketName1)
      mkdir(bucketName2)
      copyToS3(bucketName1)
      copyWithinS3(bucketName1, '*.md', bucketName2)
      copyWithinS3(bucketName1, README, bucketName2, README3)
      copyFromS3(bucketName2, README3, tmpdir()) // copy out the intra-s3 copy
      rimraf(bucketName1)
      lsExpecting404(bucketName1)
      rimraf(bucketName2)
      lsExpecting404(bucketName2)
    }
  })
}
