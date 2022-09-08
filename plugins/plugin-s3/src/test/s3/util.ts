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

import { v4 } from 'uuid'
import { unlinkSync } from 'fs'
import { strictEqual } from 'assert'
import { basename, isAbsolute, join } from 'path'
import { CLI, Common, ReplExpect } from '@kui-shell/test'

// some typing issues
const globby = require('globby')

// the provider name, e.g. ibm or minio
export const PROVIDER = process.env.MINIO_PROVIDER || 'minio'

export const README = 'README.md'
export const README2 = 'README2.md'
export const README3 = `README3-${v4()}.md`
const README_LOCAL_PATH = join(process.env.TEST_ROOT, `../../${README}`)

export const PJSON = 'package.json'
const PJSON_LOCAL_PATH = join(process.env.TEST_ROOT, `../../${PJSON}`)

export default function S3Utils(this: Common.ISuite) {
  return {
    init: () => {
      // see https://github.com/IBM/kui/issues/5972
      // no longer needed, see https://github.ibm.com/kui-shell/kiwi/issues/335
      // it('should sleep', () => new Promise(resolve => setTimeout(resolve, 5000)))
    },

    mkdir: (bucketName: string) => {
      const filepath = `/s3/${PROVIDER}/${bucketName}`
      it(`should mkdir ${filepath}`, () =>
        CLI.command(`mkdir ${filepath}`, this.app).then(ReplExpect.justOK).catch(Common.oops(this, true)))
    },

    ls: (expectedName: string, specifiedBucketName?: string, specifiedObjectName?: string) => {
      const filepath =
        `/s3/${PROVIDER}` +
        (specifiedBucketName ? `/${specifiedBucketName}` : '') +
        (specifiedObjectName ? `/${specifiedObjectName}` : '')
      it(`should ls -l ${filepath} and show ${expectedName} ${
        specifiedBucketName ? 'using specified bucket name ' + specifiedBucketName : ''
      }`, () =>
        CLI.command(`ls -l ${filepath}`, this.app).then(ReplExpect.okWith(expectedName)).catch(Common.oops(this, true)))
    },

    lsExpectingCount: (filepathWithinS3: string, expectedCount: number, extraFlags = '') => {
      const filepath = isAbsolute(filepathWithinS3) ? filepathWithinS3 : join('/s3', PROVIDER, filepathWithinS3)
      it(`should ls ${filepath} and see ${expectedCount} results`, () =>
        CLI.command(`ls ${extraFlags} ${filepath} | wc -l`, this.app)
          .then(ReplExpect.okWithString(expectedCount.toString()))
          .catch(Common.oops(this, true)))
    },

    lsCurrentDir: (expectedName: string) => {
      it(`should ls the current directory and show ${expectedName}`, () =>
        CLI.command('ls -l', this.app).then(ReplExpect.okWith(expectedName)).catch(Common.oops(this, true)))
    },

    copyToS3: (bucketName: string, specifiedDest?: string) => {
      const srcFilepath = README_LOCAL_PATH
      const dstFilepath = `/s3/${PROVIDER}/${bucketName}` + (specifiedDest ? `/${specifiedDest}` : '')
      it(`should copy into s3 via cp ${srcFilepath} ${dstFilepath}`, () =>
        CLI.command(`cp ${srcFilepath} ${dstFilepath}`, this.app)
          .then(ReplExpect.okWithString('Created object'))
          .catch(Common.oops(this, true)))
    },

    multiCopyToS3: (bucketName: string, specifiedDest?: string) => {
      it(`should copy a file1, file2 ->TO the bucket ${bucketName}`, () =>
        CLI.command(
          `cp ${README_LOCAL_PATH} ${PJSON_LOCAL_PATH} /s3/${PROVIDER}/${bucketName}` +
            (specifiedDest ? `/${specifiedDest}` : ''),
          this.app
        )
          .then(ReplExpect.okWithString('Created objects'))
          .catch(Common.oops(this, true)))
    },

    copyFromS3: (bucketName: string, srcFilename: string, destDir: string, destFilename?: string) => {
      it(`should copy a file FROM-> the bucket ${bucketName}`, async () => {
        try {
          const specifiedDest = destFilename ? join(destDir, destFilename) : destDir

          await CLI.command(`cp /s3/${PROVIDER}/${bucketName}/${srcFilename} ${specifiedDest}`, this.app).then(
            ReplExpect.okWithString(`Fetched`)
          )

          const expectedDest = destFilename ? specifiedDest : join(destDir, basename(srcFilename))
          const expected = await globby(expectedDest)
          strictEqual(expected.length, 1)

          await Promise.all(expected.map(_ => unlinkSync(_)))
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    },

    copyWithinS3: (srcBucketName: string, srcFilename: string, dstBucketName: string, destFilename?: string) => {
      const src = `/s3/${PROVIDER}/${srcBucketName}/${srcFilename}`
      const specifiedDest = join('/s3', PROVIDER, dstBucketName, destFilename || '')
      it(`should copy a file within s3 via cp ${src} ${specifiedDest}`, async () => {
        try {
          await CLI.command(`cp ${src} ${specifiedDest}`, this.app).then(ReplExpect.okWithString(`Copied`))
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    },

    rmdirExpectingError: (bucketName: string) => {
      it(`should remove the bucket ${bucketName} and expect error`, () =>
        CLI.command(`rmdir /s3/${PROVIDER}/${bucketName}`, this.app)
          .then(ReplExpect.error(500))
          .catch(Common.oops(this, true)))
    },

    rmdir: (bucketName: string) => {
      it(`should remove the bucket ${bucketName}`, () =>
        CLI.command(`rmdir /s3/${PROVIDER}/${bucketName}`, this.app)
          .then(ReplExpect.justOK)
          .catch(Common.oops(this, true)))
    },

    rm: (bucketName: string, file: string) => {
      it(`should remove the file ${file} in ${bucketName}`, () =>
        CLI.command(`rm /s3/${PROVIDER}/${bucketName}/${file}`, this.app)
          .then(ReplExpect.okWithString('Removed'))
          .catch(Common.oops(this, true)))
    },

    rimraf: (bucketName: string) => {
      it(`should recursively remove ${bucketName}`, () =>
        CLI.command(`rm -r /s3/${PROVIDER}/${bucketName}`, this.app)
          .then(ReplExpect.okWithString('Removed'))
          .catch(Common.oops(this, true)))
    },

    cd: (filepath: string, expectedFilepath = filepath) => {
      it(`should cd to ${filepath || ''}`, () =>
        CLI.command(`cd ${filepath || ''}`, this.app)
          .then(ReplExpect.okWithString(expectedFilepath))
          .catch(Common.oops(this, true)))
    },

    lsExpecting404: (bucketName: string, fileName?: string) => {
      it(`should list buckets and NOT show ${bucketName} ${fileName || ''}`, () =>
        CLI.command(`ls /s3/${PROVIDER}/${bucketName}` + (fileName ? `/${fileName}` : ''), this.app)
          .then(ReplExpect.error(404))
          .catch(Common.oops(this, true)))
    }
  }
}
