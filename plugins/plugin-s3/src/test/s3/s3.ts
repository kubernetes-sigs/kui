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

import { Common, CLI, ReplExpect } from '@kui-shell/test'

import cd from './cd'
import S3Utils from './util'
import basics from './basics'
import rimraf from './rimraf'
import pseudo from './pseudo'
import folders from './folders'
import wildcardRimraf from './wildcard-rimraf'

if (process.env.NEEDS_MINIO) {
  describe('s3 vfs sanity check', function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const { init } = S3Utils.bind(this)()

    init()
    it('should show minio in /s3', () =>
      CLI.command('ls -l /s3', this.app)
        .then(ReplExpect.okWith('minio'))
        .catch(Common.oops(this, true)))
  })

  xdescribe('s3 vfs pseudo mounts', function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const { init } = S3Utils.bind(this)()

    init()
    pseudo.bind(this)()
  })

  describe('s3 vfs folders', function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const { init } = S3Utils.bind(this)()

    init()
    folders.bind(this)()
  })

  describe('s3 vfs basics', function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const { init } = S3Utils.bind(this)()

    init()
    basics.bind(this)()
  })

  describe('s3 vfs cd', function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const { init } = S3Utils.bind(this)()

    init()
    cd.bind(this)()
  })

  describe('s3 vfs rimraf', function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const { init } = S3Utils.bind(this)()

    init()
    rimraf.bind(this)()
  })

  describe('s3 vfs wildcard rimraf', function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const { init } = S3Utils.bind(this)()

    init()
    wildcardRimraf.bind(this)()
  })
}
