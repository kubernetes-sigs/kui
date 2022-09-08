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

import { Common, CLI, ReplExpect } from '@kui-shell/test'

describe(`user settings ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  /** reload the app, and wait for a repl prompt */
  const reload = () => it('should reload the app', () => Common.refresh(this))

  it('should reset user settings', () =>
    CLI.command('kuiconfig reset', this.app).then(ReplExpect.justOK).catch(Common.oops(this, true)))

  it('should expect 404 from the prompt user setting', () =>
    CLI.command('kuiconfig get prompt', this.app).then(ReplExpect.error(404)).catch(Common.oops(this, true)))

  it('should set prompt to CWD', () =>
    CLI.command('kuiconfig set prompt CWD', this.app).then(ReplExpect.justOK).catch(Common.oops(this, true)))

  it('should expect CWD from the prompt user setting', () =>
    CLI.command('kuiconfig get prompt', this.app).then(ReplExpect.okWithString('CWD')).catch(Common.oops(this, true)))

  reload()

  it('should still expect, after reload, CWD from the prompt user setting', () =>
    CLI.command('kuiconfig get prompt', this.app).then(ReplExpect.okWithString('CWD')).catch(Common.oops(this, true)))

  it('should unset prompt user setting', () =>
    CLI.command('kuiconfig unset prompt', this.app).then(ReplExpect.justOK).catch(Common.oops(this, true)))

  it('should expect 404 from the prompt user setting', () =>
    CLI.command('kuiconfig get prompt', this.app).then(ReplExpect.error(404)).catch(Common.oops(this, true)))

  reload()

  it('should still expect, after reload, 404 from the prompt user setting', () =>
    CLI.command('kuiconfig get prompt', this.app).then(ReplExpect.error(404)).catch(Common.oops(this, true)))
})
