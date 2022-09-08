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

import { Common } from '@kui-shell/test'

import { tabby, tabbyWithOptions } from '@kui-shell/plugin-core-support/tests/lib/core-support/tab-completion-util'

/**
 * This test relies on a `/tmpo` mount; see
 * plugin-client-test/src/preload for where we mount `tmpo`.
 * This mount is intentionally named to have a common prefix
 * with the local filesystem entry '/tmp`, so that we can test
 * that Kui correctly combines local and mount VFS.
 *
 */
describe('Tab completion root VFS', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should tab complete the the /tmpo/ vfs', () => tabby(this, `ls /tmpo`, `ls /tmpo/`))

  // make sure that tab completion correctly combines real fs
  // completions with vfs completions
  Common.localIt('should tab complete both a real fs entry and a vfs entry', () => {
    return tabbyWithOptions(this, `ls /tmp`, ['tmp/', 'tmpo/'], `ls /tmp/`, { click: 0 })
  })
})
