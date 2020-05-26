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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'

describe('TopNavSidecar back button', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should open TopNavSidecar with "test mmr mode" and not show back buttonm, then go to the second tab', () => {
    return CLI.command('test mmr mode', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showingTopNav('this is the name part'))
      .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON, CLI.waitTimeout, true)) // back button NOT visible (yet)
      .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('text2')))
      .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED('text2')))
      .catch(Common.oops(this, true))
  })

  it('should open TopNavSidecar with "test mmr mode-via-registration" and DO show back button', () => {
    return CLI.command('test mmr mode-via-registration', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showingTopNav('this is the name part'))
      .then(SidecarExpect.badge('badge1'))
      .then(SidecarExpect.button({ mode: 'button1', label: 'button1 label' }))
      .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON)) // back button IS visible
      .catch(Common.oops(this, true))
  })

  it('should click back button and show the first response with selected tab', async () => {
    await this.app.client.click(Selectors.SIDECAR_BACK_BUTTON)
    await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED('text2'))
    return SidecarExpect.badge('badge1', undefined, true) // absent badge!
  })

  it('should click forward button and show the second response', async () => {
    await this.app.client.click(Selectors.SIDECAR_FORWARD_BUTTON)
    return SidecarExpect.badge('badge1') // present badge!
  })

  it('should switch to LeftNav via about command', () => {
    return CLI.command('about', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showingLeftNav('Overview'))
      .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON, CLI.waitTimeout, true)) // back button NOT visible
      .catch(Common.oops(this, true))
  })

  it('should re-open TopNavSidecar and STILL SHOW back button', () => {
    return CLI.command('test mmr mode', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showingTopNav('this is the name part'))
      .then(SidecarExpect.badge('badge1', undefined, true)) // absent badge!
      .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON))
      .catch(Common.oops(this, true))
  })

  it('should click back button and show the first response', async () => {
    await this.app.client.click(Selectors.SIDECAR_BACK_BUTTON)
    return SidecarExpect.badge('badge1', undefined, true) // absent badge!
  })

  it('should click forward button and show the second response', async () => {
    await this.app.client.click(Selectors.SIDECAR_FORWARD_BUTTON)
    return SidecarExpect.badge('badge1') // present badge!
  })
})
