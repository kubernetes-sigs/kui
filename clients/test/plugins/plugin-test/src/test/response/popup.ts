/*
 * Copyright 2019 IBM Corporation
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

/**
 * This file tests "test string" command that expects a simple `hello world`
 * string response
 *
 * See the command implementation in: plugin-test/src/lib/cmds/say-hello.ts
 *
 */

import { Common, SidecarExpect } from '@kui-shell/test'

Common.localDescribe('popup say hello', function(this: Common.ISuite) {
  before(Common.before(this, { popup: ['test', 'string'] }))
  after(Common.after(this))

  it('should show command name', async () => {
    await SidecarExpect.popupTitle(this.app, 'test string')
    await SidecarExpect.textPlainContent('hello world')
  })
})

Common.localDescribe('popup table', function(this: Common.ISuite) {
  before(Common.before(this, { popup: ['test', 'table'] }))
  after(Common.after(this))

  it('should show command name', async () => {
    await SidecarExpect.popupTitle(this.app, 'test table')
    await SidecarExpect.tableContent(this.app, 5, 12)
  })
})
