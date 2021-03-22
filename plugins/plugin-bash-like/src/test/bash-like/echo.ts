/*
 * Copyright 2018 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'

describe(`echo command ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  Common.pit('should echo nothing variant 1', () =>
    CLI.command('echo', this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this))
  )

  Common.pit('should echo nothing variant 2', () =>
    CLI.command('echo ', this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this))
  )

  Common.pit('should echo nothing variant 3', () =>
    CLI.command('echo                  ', this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this))
  )

  Common.pit('should echo hi', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithPtyOutput('hi'))
      .catch(Common.oops(this))
  )

  Common.pit('should echo hi with surrounding whitespace', () =>
    CLI.command('echo   hi               ', this.app)
      .then(ReplExpect.okWithPtyOutput('hi'))
      .catch(Common.oops(this))
  )

  Common.pit('should echo hi hi with surrounding whitespace', () =>
    CLI.command('echo   hi hi               ', this.app)
      .then(ReplExpect.okWithPtyOutput('hi hi'))
      .catch(Common.oops(this))
  )

  Common.pit('should echo hi hi with intra-whitespaces', () =>
    CLI.command('echo   hi  hi               ', this.app)
      .then(ReplExpect.okWithPtyOutput('hi hi'))
      .catch(Common.oops(this))
  )

  Common.pit('should echo "hi  hi"', () =>
    CLI.command('echo "hi  hi"', this.app)
      .then(ReplExpect.okWithPtyOutput('hi  hi'))
      .catch(Common.oops(this))
  )

  Common.pit('should echo "hi  hi" with surrounding whitespace', () =>
    CLI.command('echo   "hi  hi"               ', this.app)
      .then(ReplExpect.okWithPtyOutput('hi  hi'))
      .catch(Common.oops(this))
  )

  Common.pit('should echo multi', () =>
    CLI.command('echo   "hi  hi" hi        "hi   hi"               ', this.app)
      .then(ReplExpect.okWithPtyOutput('hi  hi hi hi   hi'))
      .catch(Common.oops(this))
  )

  const redirectFile1 = 'testKuiEchoRedirect1'
  const redirectFile2 = 'testKuiEchoRedirect2'

  Common.pit('should echo "hi hi" and redirect the output to local file', () =>
    CLI.command(`echo "hi hi" > ${redirectFile1}`, this.app)
      .then(ReplExpect.okWithPtyOutput('hi hi'))
      .catch(Common.oops(this))
  )

  Common.pit(`should open ${redirectFile1}`, () =>
    CLI.command(`open ${redirectFile1}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(res =>
        this.app.client.waitUntil(async () => {
          const value = await Util.getValueFromMonaco(res)
          return value === 'hi hi'
        })
      )
      .catch(Common.oops(this, true))
  )

  Common.pit(`should execute 'cd /tmp'`, () =>
    CLI.command('cd /tmp', this.app)
      .then(ReplExpect.okWithString('/tmp'))
      .catch(Common.oops(this, true))
  )

  Common.pit('should kuiecho "hi hi" and redirect the output to local file', () =>
    CLI.command(`kuiecho "hi hi" > ${redirectFile2}`, this.app)
      .then(ReplExpect.okWithPtyOutput('hi hi'))
      .catch(Common.oops(this))
  )

  Common.pit(`should open testKuiEchoRedirect`, () =>
    CLI.command(`open ${redirectFile2}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(res =>
        this.app.client.waitUntil(async () => {
          const value = await Util.getValueFromMonaco(res)
          return value === 'hi hi'
        })
      )
      .catch(Common.oops(this, true))
  )

  Common.pit('should remove test file1', () =>
    CLI.command(`rm -f ${redirectFile1}`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )

  Common.pit('should remove test file2', () =>
    CLI.command(`rm -f ${redirectFile2}`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this, true))
  )
})
