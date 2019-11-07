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
import * as Common from './common'
import * as CLI from './cli'
import * as ReplExpect from './repl-expect'
import * as SidecarExpect from './sidecar-expect'

type Param = Command & MMRParam

interface Command {
  command: string
}

interface MMRParam {
  kind?: string
  metadata: {
    name: string
    namespace?: string
  }
  modes?: ModeParam[]
}

interface ModeParam {
  mode: string
  label?: string
}

export class TestMMR {
  // eslint-disable-next-line no-useless-constructor
  public constructor(public readonly param: Param) {}

  public name() {
    const { command, metadata } = this.param
    describe(`multi model response ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should show name ${metadata.name} in sidecar`, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.name(metadata.name))
          .catch(Common.oops(this, true)))
    })
  }

  public namespace() {
    const { command, metadata } = this.param
    describe(`multi model response ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should show namespace ${metadata.namespace} in sidecar`, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.namespace(metadata.namespace))
          .catch(Common.oops(this, true)))
    })
  }

  public kind() {
    const { command, kind } = this.param
    describe(`multi model response ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should show kind ${kind} in sidecar`, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.kind(kind.toUpperCase()))
          .catch(Common.oops(this, true)))
    })
  }

  public modes() {
    const { command, modes } = this.param

    describe(`mmr modes ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      const showModes = () =>
        it(`should show modes in sidecar`, () =>
          CLI.command(command, this.app)
            .then(ReplExpect.ok)
            .then(SidecarExpect.open)
            .then(SidecarExpect.modes(modes))
            .catch(Common.oops(this, true)))

      const closeSidecar = () =>
        it('should minimize the sidecar', () => SidecarExpect.keyToClose(this.app).catch(Common.oops(this, true)))

      showModes()
      closeSidecar()
      showModes()
    })
  }
}
