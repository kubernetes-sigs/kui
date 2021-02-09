/*
 * Copyright 2021 IBM Corporation
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

import { CLI, Common, ReplExpect } from '@kui-shell/test'

/**
 * This test relies on a `/kuifake/...` set of mounts; see
 * plugin-client-test/src/preload for where we mount them.
 *
 */
describe('ls versus vfs', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should ls / and show kuifake', () =>
    CLI.command('ls -l /', this.app)
      .then(ReplExpect.okWith('kuifake'))
      .catch(Common.oops(this, true)))

  it('should ls the /kuifake vfs and show fake1', () =>
    CLI.command('ls -l /kuifake', this.app)
      .then(ReplExpect.okWith('fake1'))
      .catch(Common.oops(this, true)))
  it('should ls the /kuifake vfs and show fake2', () =>
    CLI.command('ls -l /kuifake', this.app)
      .then(ReplExpect.okWith('fake2'))
      .catch(Common.oops(this, true)))

  it('should ls the /kuifake/ vfs and show fake1', () =>
    CLI.command('ls -l /kuifake/', this.app)
      .then(ReplExpect.okWith('fake1'))
      .catch(Common.oops(this, true)))
  it('should ls the /kuifake/ vfs and show fake2', () =>
    CLI.command('ls -l /kuifake/', this.app)
      .then(ReplExpect.okWith('fake2'))
      .catch(Common.oops(this, true)))

  it('should ls the /kuifake/fake1 vfs and show E1', () =>
    CLI.command('ls -l /kuifake/fake1', this.app)
      .then(ReplExpect.okWith('E1'))
      .catch(Common.oops(this, true)))
  it('should ls the /kuifake/fake1 vfs and show E2', () =>
    CLI.command('ls -l /kuifake/fake1', this.app)
      .then(ReplExpect.okWith('E2'))
      .catch(Common.oops(this, true)))

  it('should ls the /kuifake/fake2/ vfs and show F1', () =>
    CLI.command('ls -l /kuifake/fake2/', this.app)
      .then(ReplExpect.okWith('F1'))
      .catch(Common.oops(this, true)))
  it('should ls the /kuifake/fake2/ vfs and show F2', () =>
    CLI.command('ls -l /kuifake/fake2/', this.app)
      .then(ReplExpect.okWith('F2'))
      .catch(Common.oops(this, true)))

  // now try cd / and make sure ls works against PWD
  it('should cd /', () =>
    CLI.command('cd /', this.app)
      .then(ReplExpect.okWithString('/'))
      .catch(Common.oops(this, true)))
  it('should ls and show kuifake', () =>
    CLI.command('ls -l', this.app)
      .then(ReplExpect.okWith('kuifake'))
      .catch(Common.oops(this, true)))

  // now try cd /tmpo and make sure ls works against PWD
  it('should cd /tmpo', () =>
    CLI.command('cd /tmpo', this.app)
      .then(ReplExpect.okWithString('/tmpo'))
      .catch(Common.oops(this, true)))
  it('should ls and show D1', () =>
    CLI.command('ls -l', this.app)
      .then(ReplExpect.okWith('D1'))
      .catch(Common.oops(this, true)))
  it('should ls and show D2', () =>
    CLI.command('ls -l', this.app)
      .then(ReplExpect.okWith('D2'))
      .catch(Common.oops(this, true)))
})
