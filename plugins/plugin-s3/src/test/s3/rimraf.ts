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

import S3Utils, { README, README3 } from './util'

export default function rimraf(this: Common.ISuite) {
  // bind the helper routines
  const { copyFromS3, copyToS3, copyWithinS3, lsExpecting404, mkdir, rimraf } = S3Utils.bind(this)()

  // v4 to get unique names; some s3 backends can't recreate a
  // bucketName immediately after deleting it
  const bucketName1 = `kuitest-${v4()}`
  const bucketName2 = `kuitest-${v4()}`

  it('should ls /s3/minio', () =>
    CLI.command('ls -l /s3/minio', this.app)
      .then(ReplExpect.okWithAny)
      .catch(Common.oops(this, true)))

  it('should sleep', () => new Promise(resolve => setTimeout(resolve, 2000)))

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
