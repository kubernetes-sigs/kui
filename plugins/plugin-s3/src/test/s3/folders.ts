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
import { tmpdir } from 'os'
import { unlinkSync } from 'fs'
import { basename, dirname, join } from 'path'
import { CLI, Common, ReplExpect } from '@kui-shell/test'

import S3Utils, { PROVIDER } from './util'

export default function folders(this: Common.ISuite) {
  // bind the helper routines
  const {
    copyFromS3,
    copyToS3,
    copyWithinS3,
    ls,
    lsExpecting404,
    lsExpectingCount,
    mkdir,
    rm,
    rimraf,
    rmdirExpectingError
  } = S3Utils.bind(this)()

  // v4 to get unique names; some s3 backends can't recreate a
  // bucketName immediately after deleting it
  const bucketName1 = `kuitest-${v4()}`
  const folderName1 = 'f1'
  const folderName2 = 'f2'
  const subfolderName1 = 'g1'
  const folderPath1 = join(bucketName1, folderName1)
  const folderPath2 = join(bucketName1, folderName2)
  const subfolderPath1 = join(bucketName1, folderName1, subfolderName1)

  const objectName1 = 'object1'
  const objectPathInFolder1 = join(folderName1, objectName1)
  const objectPathInSubFolder1 = join(folderName1, subfolderName1, objectName1)

  it('should ls /s3/minio', () =>
    CLI.command('ls -l /s3/minio', this.app).then(ReplExpect.okWithAny).catch(Common.oops(this, true)))

  it('should sleep', () => new Promise(resolve => setTimeout(resolve, 2000)))
  mkdir(bucketName1)

  copyToS3(bucketName1, objectName1)
  ls(objectName1, bucketName1)

  mkdir(folderPath1)
  mkdir(folderPath2)
  mkdir(subfolderPath1)

  copyToS3(bucketName1, objectPathInFolder1)
  copyToS3(bucketName1, objectPathInSubFolder1)
  ls(objectName1, folderPath1)
  rmdirExpectingError(folderPath1)
  rmdirExpectingError(subfolderPath1)

  // ls -d on folders and expect one match, with and without trailing slash, with and without wildcards
  // important: do these tests after having copied in some objects, to test that we don't list them
  lsExpectingCount(`/s3/${PROVIDER}/${folderPath1}`, 1, '-d')
  lsExpectingCount(`/s3/${PROVIDER}/${folderPath1}/`, 1, '-d')

  // copy out of a folder
  const tmpTarget = join(tmpdir(), basename(objectPathInSubFolder1))
  it(`should remove ${tmpTarget}`, () => {
    try {
      unlinkSync(tmpTarget)
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err
      }
    }
  })

  copyFromS3(bucketName1, objectPathInSubFolder1, dirname(tmpTarget))
  copyWithinS3(bucketName1, objectPathInSubFolder1, bucketName1, folderPath2) // cp /s3/minio/f1/g1/o1 /s3/minio/f2

  // ls /s3/PROVIDER/bucketName/folderName1 should return only the contents of the folder: object1 and subfolderName1
  lsExpectingCount(folderPath1, 2)

  // ls /s3/PROVIDER/bucketName/folderName1/subfolderName1 should return only the contents of the folder
  lsExpectingCount(subfolderPath1, 1)

  // ls /s3/PROVIDER/bucketName/folderName1/* should return only the contents of the folder
  lsExpectingCount(join(folderPath1, '*'), 2)

  // ls /s3/PROVIDER/bucketName/folderName1/o* should return only a single object in the folder
  lsExpectingCount(join(folderPath1, objectName1.charAt(0) + '*'), 1)

  // ls /s3/PROVIDER/bucketName/folderName1/subfolderName1/* should return only the contents of the folder
  lsExpectingCount(join(subfolderPath1, '*'), 1)

  // ls /s3/PROVIDER/bucketName/folderName1/subfolderName1/o* should return only a single object in the folder
  lsExpectingCount(join(subfolderPath1, objectName1.charAt(0) + '*'), 1)

  rm(bucketName1, objectPathInFolder1)
  lsExpecting404(bucketName1, objectPathInFolder1)

  rm(bucketName1, objectPathInSubFolder1)
  lsExpecting404(bucketName1, objectPathInSubFolder1)

  rimraf(bucketName1)
  lsExpecting404(bucketName1)
}
