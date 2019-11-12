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
import * as Selectors from './selectors'
import { keys as Keys } from './keys'

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

export interface ModeParam {
  mode: string
  label?: string
}

export interface BadgeParam {
  title: string
}

interface TestNameOptions {
  name?: string
}

interface TestModeOptions extends TestNameOptions {
  windowButtons?: boolean
}

enum SidecarState {
  minimized = 'minimized',
  quited = 'quited',
  maximized = 'maximized'
}

type SidecarStateParam = 'minimized' | 'quited' | 'maximized'

export class TestMMR {
  // eslint-disable-next-line no-useless-constructor
  public constructor(public readonly param: Param) {}

  public name() {
    const { command, metadata } = this.param
    describe(`mmr name ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
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
    describe(`mmr namespace ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
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
    describe(`mmr kind ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
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

  public badges(options: { badges: BadgeParam[] } & TestNameOptions) {
    const command = this.param.command

    describe(`mmr badges ${options.name || ''} ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should show badges in sidecar`, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(app => Promise.all(options.badges.map(badge => SidecarExpect.badge(badge.title)(app)))))
    })
  }

  public modes(options?: TestModeOptions) {
    const { command, modes } = this.param

    describe(`mmr modes ${options.name || ''} ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      const showModes = () =>
        it(`should show modes in sidecar`, () =>
          CLI.command(command, this.app)
            .then(ReplExpect.ok)
            .then(SidecarExpect.open)
            .then(SidecarExpect.modes(modes))
            .catch(Common.oops(this, true)))

      const toggleSidecarWithESC = (expectOpen = false) =>
        it(`should hit ESCAPE key and expect sidecar ${expectOpen ? 'open' : 'closed'}`, async () => {
          try {
            await this.app.client.keys(Keys.ESCAPE)
            expectOpen ? await SidecarExpect.open(this.app) : await SidecarExpect.closed(this.app)
          } catch (err) {
            await Common.oops(this, true)
          }
        })

      const quit = () =>
        it('should fully close the sidecar', async () => {
          try {
            await this.app.client.waitForVisible(Selectors.SIDECAR_FULLY_CLOSE_BUTTON)
            await this.app.client.click(Selectors.SIDECAR_FULLY_CLOSE_BUTTON)
            await SidecarExpect.fullyClosed(this.app)
          } catch (err) {
            await Common.oops(this, true)
          }
        })

      const maximize = () =>
        it('should maximize the sidecar', async () => {
          try {
            await this.app.client.waitForVisible(Selectors.SIDECAR_MAXIMIZE_BUTTON)
            await this.app.client.click(Selectors.SIDECAR_MAXIMIZE_BUTTON)
            await SidecarExpect.fullscreen(this.app)
          } catch (err) {
            await Common.oops(this, true)
          }
        })

      const minimize = () => {
        it('should toggle the sidebar closed with close button click', async () => {
          try {
            await this.app.client.waitForVisible(Selectors.SIDECAR_CLOSE_BUTTON)
            await this.app.client.click(Selectors.SIDECAR_CLOSE_BUTTON)
            await SidecarExpect.closed(this.app)
          } catch (err) {
            await Common.oops(this, true)
          }
        })
      }

      const backToOpen = (prevState: SidecarStateParam) => {
        const button =
          prevState === SidecarState.minimized
            ? Selectors.SIDECAR_RESUME_FROM_CLOSE_BUTTON
            : Selectors.SIDECAR_MAXIMIZE_BUTTON

        if (prevState === SidecarState.minimized || prevState === SidecarState.maximized) {
          it(`should resume the sidecar from ${prevState} to open`, async () => {
            try {
              await this.app.client.waitForVisible(button)
              await this.app.client.click(button)
              await SidecarExpect.open(this.app)
            } catch (err) {
              await Common.oops(this, true)
            }
          })
        }
      }

      showModes()

      if (options && options.windowButtons === true) {
        toggleSidecarWithESC()
        toggleSidecarWithESC(true)

        toggleSidecarWithESC()
        showModes()

        minimize()
        backToOpen(SidecarState.minimized)

        minimize()
        showModes()

        maximize()
        backToOpen(SidecarState.maximized)
        showModes()

        quit()
        showModes()
      }
    })
  }
}
