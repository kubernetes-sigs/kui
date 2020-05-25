/*
 * Copyright 2018 IBM Corporation
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
import { Common, CLI, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'
import { productName } from '@kui-shell/client/config.d/name.json'

const Overview = 'Overview'

describe(`about command ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should open the about window via command execution', () =>
    CLI.command('about', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(Overview))
      .then(SidecarExpect.breadcrumbs([productName]))
      .then(() => this.app.client.waitForVisible(`${Selectors.SIDECAR_MODE_BUTTON_SELECTED_V2('about')}`))
      .then(async () => {
        if (process.env.MOCHA_RUN_TARGET === 'electron') {
          return this.app.client.execute(sidecarSelector => {
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
          return this.app.client.execute(sidecarSelector => {
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
      .catch(Common.oops(this, true)))

  it('should open the about window via command execution with comment', () =>
    CLI.command('about #About Kui', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(Overview))
      .then(() => this.app.client.waitForVisible(`${Selectors.SIDECAR_MODE_BUTTON_SELECTED_V2('about')}`))
      .catch(Common.oops(this, true)))

  it('should open the about via button click', async () => {
    try {
      await Common.refresh(this)
      await this.app.client.waitForVisible('#help-button')

      await CLI.command('sleep 1', this.app).then(ReplExpect.blank)

      await this.app.client.click('#help-button')

      await this.app.client.waitForVisible(Selectors.SIDECAR)
      await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED_V2('about'))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  xit('should open the getting started via command execution', async () => {
    await Common.refresh(this)

    return (
      CLI.command('getting started', this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(Overview))
        // .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED_V2('tutorial')))
        .catch(Common.oops(this, true))
    )
  })
})
