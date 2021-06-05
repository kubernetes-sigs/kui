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
import { homedir } from 'os'
import { basename, dirname, join } from 'path'
import { Common } from '@kui-shell/test'

import S3Utils, { PROVIDER, README } from './util'

export default function cd(this: Common.ISuite) {
  // bind the helper routines
  const { cd, copyToS3, lsCurrentDir, lsExpecting404, mkdir, rimraf } = S3Utils.bind(this)()

  // here come the tests:
  const bucketName = `kuitest-${v4()}`

  mkdir(bucketName)
  copyToS3(bucketName, README)

  // cd to /s3/PROVIDER and see bucketName
  cd('/s3')
  cd(PROVIDER)
  lsCurrentDir(bucketName)

  // cd to /s3/PROVIDER/bucketName and see README
  cd(bucketName)
  lsCurrentDir(README)

  // cd .. (which should be /s3/PROVIDER) and see bucketName
  cd('..', `/s3/${PROVIDER}`)
  lsCurrentDir(bucketName)

  // cd .. (which should be /s3/(plus dirname of PROVIDER, in the case PROVIDER has slashes)) and see PROVIDER
  cd('..', join('/s3', dirname(PROVIDER)))
  lsCurrentDir(basename(PROVIDER))

  // cd to homedir and back to /s3 and see PROVIDER
  cd('', homedir())
  cd('/')
  cd('s3')
  lsCurrentDir(PROVIDER.slice(0, PROVIDER.indexOf('/')))

  rimraf(bucketName)
  lsExpecting404(bucketName)
}
