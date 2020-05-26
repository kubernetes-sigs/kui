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

  const firstCmd = 'test mmr mode'
  const secondCmd = 'test mmr mode-via-registration'
  const thirdCmd = 'test mmr namespace'

  const backToFirst = () => {
    it('should click back button and show the first response with selected tab', async () => {
      try {
        await this.app.client.click(Selectors.SIDECAR_BACK_BUTTON)
        await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED('text2'))

        await this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON_DISABLED) // back button disabled since we reaches the end of the buffer
        await this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON) // forward button should appear since we just hit back

        return SidecarExpect.badge('badge1', undefined, true) // absent badge!
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const nextToSecond = () => {
    it('should click forward button and show the second response', async () => {
      try {
        await this.app.client.click(Selectors.SIDECAR_FORWARD_BUTTON)

        await this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON_DISABLED) // forward button disabled since we reaches the end of the buffer
        await this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON) // back button should appear since we just hit forward

        return SidecarExpect.badge('badge1') // present badge!
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const nextToThird = (nextToEnd = true) => {
    it('should click forward button and show the third response', async () => {
      try {
        await this.app.client.click(Selectors.SIDECAR_FORWARD_BUTTON)

        await this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON) // back button should appear since we just hit forward
        if (nextToEnd) {
          await this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON_DISABLED) // forward button should appear since we just hit forward
        } else {
          await this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON)
        }

        return SidecarExpect.namespace('this is the namespace part')
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const backToThird = () => {
    it('should click back button and show the third response with selected tab', async () => {
      try {
        await this.app.client.click(Selectors.SIDECAR_BACK_BUTTON)

        await this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON) // forward button should appear since we just hit back
        await this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON) // back button should appear since we haven't reached the end of buffer

        return SidecarExpect.namespace('this is the namespace part')
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const backToSecond = () => {
    it('should click back button and show the second response', async () => {
      try {
        await this.app.client.click(Selectors.SIDECAR_BACK_BUTTON)

        await this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON) // back button should appear since we haven't reach the end of the buffer
        await this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON) // forward button should appear since we just hit back

        return SidecarExpect.badge('badge1') // present badge!
      } catch (err) {
        return Common.oops(this)(err)
      }
    })
  }

  const nextToFirst = () => {
    it('should click forward button and show the second response', async () => {
      try {
        await this.app.client.click(Selectors.SIDECAR_FORWARD_BUTTON)
        return SidecarExpect.badge('badge1', undefined, true) // absent badge!
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const openWithFirstCmd = (startOfBuffer = true) => {
    it(`should open TopNavSidecar with ${firstCmd} and not show back/forward button, then go to the second tab`, () => {
      return CLI.command(firstCmd, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showingTopNav('this is the name part'))
        .then(
          () =>
            !startOfBuffer
              ? this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON)
              : this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON, CLI.waitTimeout, true) // back button NOT visible (yet)
        )
        .then(() =>
          !startOfBuffer
            ? this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON_DISABLED)
            : this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON, CLI.waitTimeout, true)
        ) // forward button NOT visible (yet)
        .then(() => this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('text2')))
        .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED('text2')))
        .catch(Common.oops(this))
    })
  }

  const openWithSecondCmd = () => {
    it(`should open TopNavSidecar with ${secondCmd} and DO show back button, but not forward button`, () => {
      return CLI.command(secondCmd, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showingTopNav('this is the name part'))
        .then(SidecarExpect.badge('badge1'))
        .then(SidecarExpect.button({ mode: 'button1', label: 'button1 label' }))
        .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON)) // back button IS visible
        .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON_DISABLED)) // forward button is disabled
        .catch(Common.oops(this, true))
    })
  }

  const openWithThirdCmd = () => {
    it(`should open TopNavSidecar with "${thirdCmd}" and DO show back button, but not forward button`, () => {
      return CLI.command(thirdCmd, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.namespace('this is the namespace part'))
        .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON)) // back button IS visible
        .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON_DISABLED)) // forward button disabled
        .catch(Common.oops(this, true))
    })
  }

  /* Here comes the tests */

  openWithFirstCmd()
  openWithSecondCmd()

  backToFirst()
  nextToSecond()
  backToFirst()

  openWithThirdCmd()

  backToFirst()
  nextToThird()

  openWithSecondCmd()

  backToThird()
  backToFirst()
  nextToThird(false)
  nextToSecond()

  it('should switch to LeftNav via about command', () => {
    return CLI.command('about', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showingLeftNav('Overview'))
      .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON, CLI.waitTimeout, true)) // back button NOT visible
      .then(() => this.app.client.waitForVisible(Selectors.SIDECAR_FORWARD_BUTTON, CLI.waitTimeout, true)) // forward button NOT visible
      .catch(Common.oops(this, true))
  })

  openWithFirstCmd(false)
  backToSecond()
  nextToFirst()
})
