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
import { CLI, Common, ReplExpect } from '@kui-shell/test'

import S3Utils, { README, README2, README3, PJSON, PROVIDER } from './util'

export default function basics(this: Common.ISuite) {
  // bind the helper routines
  const {
    copyFromS3,
    copyToS3,
    ls,
    lsExpectingCount,
    lsExpecting404,
    mkdir,
    multiCopyToS3,
    rm,
    rmdir,
    rmdirExpectingError
  } = S3Utils.bind(this)()

  // here come the tests:
  const bucketName = `kuitest-${v4()}`

  it('should ls /s3/minio', () =>
    CLI.command('ls -l /s3/minio', this.app).then(ReplExpect.okWithAny).catch(Common.oops(this, true)))

  it('should sleep', () => new Promise(resolve => setTimeout(resolve, 2000)))

  mkdir(bucketName)

  // ls /s3/${PROVIDER}, expect bucketName
  ls(bucketName)

  // now copy in objects and try listing them
  multiCopyToS3(bucketName)
  ls(PJSON, bucketName) // ls /s3/minio/bucketName, expect package.json
  ls(README, bucketName) // ls /s3/minio/bucketName, expect README

  // ls -d and expect one match, with and without trailing slash, with and without wildcards
  // important: do these tests after having copied in some objects, to test that we don't list them
  lsExpectingCount(`/s3/${PROVIDER}/${bucketName}`, 1, '-d')
  lsExpectingCount(`/s3/${PROVIDER}/${bucketName}/`, 1, '-d')
  lsExpectingCount(`/s3/${PROVIDER}/*${bucketName.slice(1)}`, 1, '-d')
  lsExpectingCount(`/s3/${PROVIDER}/*${bucketName.slice(1)}/`, 1, '-d')

  copyToS3(bucketName, README + '.fakeending') // make sure ls works with specificity
  lsExpectingCount(`/s3/${PROVIDER}/${bucketName}/${README}`, 1)
  lsExpectingCount(`/s3/${PROVIDER}/${bucketName}/${README}.fakeending`, 1)
  lsExpectingCount(`/s3/${PROVIDER}/${bucketName}/${README}*`, 2)

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
