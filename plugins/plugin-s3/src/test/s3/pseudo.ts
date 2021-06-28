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

import { tmpdir } from 'os'
import { Common } from '@kui-shell/test'

import S3Utils, { README, README3 } from './util'

export default function pseudo(this: Common.ISuite) {
  // bind the helper routines
  const { copyFromS3, copyToS3, copyWithinS3, lsExpecting404, rm } = S3Utils.bind(this)()

  // v4 to get unique names; some s3 backends can't recreate a
  // bucketName immediately after deleting it
  const bucketName1 = 'tmp'
  const bucketName2 = 'bin'

  copyToS3(bucketName1)
  copyWithinS3(bucketName1, '*.md', bucketName2)
  copyWithinS3(bucketName1, README, bucketName2, README3)
  copyFromS3(bucketName2, README3, tmpdir()) // copy out the intra-s3 copy
  rm(bucketName1, README)
  rm(bucketName2, README)
  lsExpecting404(bucketName1)
  lsExpecting404(bucketName2)
}
