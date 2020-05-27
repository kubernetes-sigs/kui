/*
 * Copyright 2020 IBM Corporation
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
import { expectArray } from './util'
import { promiseEach, Breadcrumb } from '@kui-shell/core'
import { productName } from '@kui-shell/client/config.d/name.json'

interface Param {
  command: string
  showing: string
  modes: string[]
  commandLinks?: { label: string; expect: { type: 'NavResponse'; showing: string } }[]
  hrefLinks?: { label: string; href: string }[]
  breadcrumbs?: Breadcrumb[]
}

export class TestNavResponse {
  // eslint-disable-next-line no-useless-constructor
  public constructor(public readonly param: Param) {}

  public run() {
    const { command, showing, modes, commandLinks, hrefLinks, breadcrumbs } = this.param
    describe(`test NavResponse ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should open LeftNavSidecar for known outer command=${command} showing=${showing}`, () =>
        CLI.command(command, this.app)
          .then(ReplExpect.justOK)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(showing))
          .then(() => Promise.all(modes.map(_ => this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_V2(_)))))
          .catch(Common.oops(this, true)))

      if (breadcrumbs && breadcrumbs.length > 0) {
        it(`should open LeftNavSidecar with breadcrumbs for known outer command=${command} showing=${showing}`, () =>
          CLI.command(command, this.app)
            .then(ReplExpect.justOK)
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(showing))
            .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_BREADCRUMBS))
            .then(() => this.app.client.getText(Selectors.SIDECAR_BREADCRUMBS))
            .then(expectArray(breadcrumbs.map(_ => _.label)))
            .catch(Common.oops(this, true)))
      }

      if (hrefLinks && hrefLinks.length > 0) {
        it(`should open LeftNavSidecar with href links for known outer command=${command} showing=${showing}`, () =>
          CLI.command(command, this.app)
            .then(ReplExpect.justOK)
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(showing))
            .then(() =>
              Promise.all(modes.map(_ => this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_V2(_))))
            )
            .then(() =>
              Promise.all(
                hrefLinks.map(link => this.app.client.waitForVisible(Selectors.SIDECAR_NAV_HREF_LINKS(link.label)))
              )
            )
            .catch(Common.oops(this, true)))
      }

      if (commandLinks && commandLinks.length > 0) {
        it(`should open LeftNavSidecar with command links for known outer command=${command} showing=${showing}`, () =>
          CLI.command(command, this.app)
            .then(ReplExpect.justOK)
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(showing))
            .then(() =>
              Promise.all(modes.map(_ => this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_V2(_))))
            )
            .then(() =>
              promiseEach(commandLinks, async link => {
                const commandLink = Selectors.SIDECAR_NAV_COMMAND_LINKS(link.label)
                await this.app.client.waitForVisible(commandLink)
                await this.app.client.click(commandLink)
                if (link.expect.type === 'NavResponse') {
                  await SidecarExpect.open(this.app)
                  await SidecarExpect.showing(link.expect.showing)(this.app)
                }
              })
            )
            .catch(Common.oops(this, true)))
      }
    })
  }
}

export const testAbout = (self: Common.ISuite) => {
  const Overview = 'Overview'

  it('should open the about window via command execution', () =>
    CLI.command('about', self.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(Overview))
      .then(SidecarExpect.breadcrumbs([productName]))
      .then(() => self.app.client.waitForVisible(`${Selectors.SIDECAR_MODE_BUTTON_SELECTED_V2('about')}`))
      .then(async () => {
        if (process.env.MOCHA_RUN_TARGET === 'electron') {
          return self.app.client.execute(sidecarSelector => {
            const imageSrc = document
              .querySelector(sidecarSelector)
              .querySelector('.marked-content')
              .querySelector('img')
              .getAttribute('src')
            const fs = require('fs')
            return fs.statSync(`${__dirname}/${imageSrc}`)
          }, Selectors.SIDECAR)
        }

        if (process.env.MOCHA_RUN_TARGET === 'webpack') {
          return self.app.client.execute(sidecarSelector => {
            const imageSrc = document
              .querySelector(sidecarSelector)
              .querySelector('.marked-content')
              .querySelector('img')
              .getAttribute('src')
            const image = new Image()
            image.src = `${window.location.origin}/${imageSrc}`
            if (image.height === 0) throw new Error(`image not found: ${window.location.origin}/${imageSrc}`)
          }, Selectors.SIDECAR)
        }
      })
      .catch(Common.oops(self, true)))
}
