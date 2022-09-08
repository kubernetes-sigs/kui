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

describe(`Command line parsing semicolons ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should echo with semicolon in quotes', () =>
    CLI.command(`echo "hi;" ho`, this.app).then(ReplExpect.okWithPtyOutput('hi; ho')).catch(Common.oops(this, true)))

  it('should echo with semicolon not in quotes and expect error', () =>
    CLI.command(`echo hi; ho`, this.app)
      .then(ReplExpect.okWithPtyOutput('ho: command not found'))
      .catch(Common.oops(this, true)))

  const echoThis = 'xxxxxxxxxx'
  it('should handle plain if statement', () =>
    CLI.command(`if true; then echo ${echoThis}; fi`, this.app)
      .then(ReplExpect.okWithPtyOutput(echoThis))
      .catch(Common.oops(this, true)))

  const echoThat = 'yyyyyyyyy'
  it('should handle two if statements A', () =>
    CLI.command(`if true; then echo ${echoThis}; fi ; if true; then echo ${echoThat}; fi`, this.app)
      .then(ReplExpect.okWithPtyOutput(echoThis))
      .catch(Common.oops(this, true)))
  it('should handle two if statements B', () =>
    CLI.command(`if true; then echo ${echoThis}; fi ; if true; then echo ${echoThat}; fi`, this.app)
      .then(ReplExpect.okWithPtyOutput(echoThat))
      .catch(Common.oops(this, true)))
  // note the different placement of the separating semicolon this time "fi; " versus "fi ;"
  it('should handle two if statements C', () =>
    CLI.command(`if true; then echo ${echoThis}; fi; if true; then echo ${echoThat}; fi`, this.app)
      .then(ReplExpect.okWithPtyOutput(echoThat))
      .catch(Common.oops(this, true)))
  // note the different placement of the separating semicolon this time "fi;" versus "fi ;" or "fi; "
  it('should handle two if statements D', () =>
    CLI.command(`if true; then echo ${echoThis}; fi;if true; then echo ${echoThat}; fi`, this.app)
      .then(ReplExpect.okWithPtyOutput(echoThat))
      .catch(Common.oops(this, true)))
})
