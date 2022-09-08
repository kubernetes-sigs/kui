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

/**
 * This file tests "test string" command that expects a simple `hello world`
 * string response
 *
 * See the command implementation in: plugin-test/src/lib/cmds/say-hello.ts
 *
 */

import { CLI, Common, ReplExpect, SidecarExpect } from '@kui-shell/test'

Common.localDescribe('popup say hello', function (this: Common.ISuite) {
  before(Common.before(this, { popup: ['test', 'string'] }))
  after(Common.after(this))

  it('should show command output in REPL', async () => {
    await ReplExpect.okWithString('hello world')({ app: this.app, count: 0 })
  })

  it('should execute another command', async () => {
    return CLI.command('test string --grumble 314159', this.app)
      .then(ReplExpect.okWithString('hello world 314159'))
      .catch(Common.oops(this, true))
  })
})

Common.localDescribe('popup mmr', function (this: Common.ISuite) {
  before(Common.before(this, { popup: ['test', 'mmr', 'mode'] }))
  after(Common.after(this))

  it('should show title "this is the name part"', async () => {
    await SidecarExpect.popupTitle({ app: this.app, count: 0 }, 'this is the name part')
  })
})
