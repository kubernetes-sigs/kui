/*
 * Copyright 2019 The Kubernetes Authors
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

import { tabby } from '@kui-shell/plugin-core-support/tests/lib/core-support/tab-completion-util'

describe('Tab completion test client', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should tab complete the the /test/ vfs', () => tabby(this, `ls /tes`, `ls /test/`))
})
