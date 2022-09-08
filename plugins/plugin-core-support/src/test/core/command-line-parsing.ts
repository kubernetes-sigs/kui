/*
 * Copyright 2020 The Kubernetes Authors
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
 * Test command line parsing
 *
 */
import { Common, CLI, ReplExpect } from '@kui-shell/test'

const input1 = 'hi ho\\\\.mo\\.zo \\ff'
const output1 = 'hi ho\\.mo.zo ff'

describe(`Command line parsing ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should properly handle backslash escapes with pty commands', () =>
    CLI.command(`echo ${input1}`, this.app).then(ReplExpect.okWithPtyOutput(output1)).catch(Common.oops(this, true)))

  it('should properly handle backslash escapes with kui commands', () =>
    CLI.command(`kuiecho ${input1}`, this.app).then(ReplExpect.okWithString(output1)).catch(Common.oops(this, true)))
})
