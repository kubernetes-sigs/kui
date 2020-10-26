/*
 * Copyright 2017 IBM Corporation
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

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const actionName = 'foo'
const fourOhFour = 404
const fourOhFour2 = process.env.MOCHA_RUN_TARGET === 'webpack' ? 404 : 127

describe('Check error handling for invoking a non-existent action', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('invoke a non-existent action', () =>
    CLI.command(`wsk action invoke xxxxxx`, this.app)
      .then(ReplExpect.error(fourOhFour))
      .catch(Common.oops(this)))

  it('async a non-existent action', () =>
    CLI.command(`wsk action async xxxxxx`, this.app)
      .then(ReplExpect.error(fourOhFour))
      .catch(Common.oops(this)))

  it('create an action', () =>
    CLI.command(`let ${actionName} = x=>x`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  it('invoke with a non-existent package, but existing action name', () =>
    CLI.command(`wsk action invoke xxxxxx/${actionName}`, this.app)
      .then(ReplExpect.error(fourOhFour))
      .catch(Common.oops(this)))

  it('invoke with a non-existent package, but existing action name, via fdsfasdjfioajdsfioads action invoke', () =>
    CLI.command(`fdsfasdjfioajdsfioads action invoke xxxxxx/${actionName}`, this.app)
      .then(ReplExpect.error(fourOhFour2))
      .catch(Common.oops(this)))

  it('invoke with a non-existent package, but existing action name, via wsk action invoke', () =>
    CLI.command(`wsk action invoke xxxxxx/${actionName}`, this.app)
      .then(ReplExpect.error(fourOhFour))
      .catch(Common.oops(this)))

  it('async with a non-existent package, but existing action name', () =>
    CLI.command(`wsk action async xxxxxx/${actionName}`, this.app)
      .then(ReplExpect.error(fourOhFour))
      .catch(Common.oops(this)))
})
