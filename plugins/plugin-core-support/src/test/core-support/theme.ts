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

import {
  ISuite,
  before as commonBefore,
  after as commonAfter,
  oops,
  localIt,
  refresh
} from '@kui-shell/core/tests/lib/common'
import { cli, selectors } from '@kui-shell/core/tests/lib/ui'

const resetTheme = (ctx: ISuite) => {
  it('should reset theme preference', () =>
    cli
      .do('theme reset', ctx.app)
      .then(cli.expectJustOK)
      .catch(oops(ctx)))

  it('should show that we are using the default (dark) theme', () =>
    cli
      .do('theme current', ctx.app)
      .then(cli.expectOKWithString('Dark'))
      .then(() => ctx.app.client.waitForExist('body[kui-theme="Dark"]')) // Dark being the default
      .catch(oops(ctx)))
}

interface Theme {
  name: string
  display: string
}

/**
 * Switch to the given theme and verify
 *
 */
const go = (theme: Theme) => (ctx: ISuite) => {
  it(`should switch to ${theme.name} theme via command`, () =>
    cli
      .do(`theme set "${theme.name}"`, ctx.app)
      .then(cli.expectJustOK)
      .then(() => ctx.app.client.waitForExist(`body[kui-theme="${theme.name}"]`))
      .catch(oops(ctx)))

  it(`should show that we are using the ${theme.name} theme`, () =>
    cli
      .do('theme current', ctx.app)
      .then(cli.expectOKWithString(theme.name))
      .catch(oops(ctx)))
}

/**
 * Restart the electron application and then expect the given theme to
 * be set
 *
 */
const restartAndThen = (theme: Theme) => (ctx: ISuite) => {
  // refresh electron's current page rather than restart the app to prevent clearing browser's local storage
  localIt(`should still be using ${theme.name} theme after a browser restart`, () =>
    refresh(ctx)
      .then(() => ctx.app.client.waitForExist(`body[kui-theme="${theme.name}"]`))
      .catch(oops(ctx))
  )
}

/**
 * Reload (versus restart) the electron application and then expect
 * the given theme to be set
 *
 */
const reloadAndThen = (theme: Theme) => (ctx: ISuite) => {
  localIt(`should still be using ${theme.name} theme after a reload`, () =>
    refresh(ctx)
      .then(() => ctx.app.client.waitForExist(`body[kui-theme="${theme.name}"]`))
      .catch(oops(ctx))
  )
}

/**
 * Click on the theme button and expect the theme list
 *
 */
const clickOnThemeButtonThenClickOnTheme = (clickOn: Theme) => (ctx: ISuite, nClicks = 1) => {
  it(`should click on help button, then theme link, then present theme list, then click on ${clickOn.name}`, async () => {
    try {
      await ctx.app.client.waitForVisible('#help-button')
      await ctx.app.client.click('#help-button')
      await ctx.app.client.waitForVisible(selectors.SIDECAR)
      await ctx.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON('configure'))
      console.error('1')
      await ctx.app.client.click(selectors.SIDECAR_MODE_BUTTON('configure'))
      console.error('2', selectors.SIDECAR_MODE_BUTTON('configure'))
      await ctx.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON_SELECTED('configure'))
      await new Promise(resolve => setTimeout(resolve, 300))

      const checkMarkCell = `${selectors.SIDECAR} .entity.theme[data-name="${clickOn.name}"] .entity-name.clickable`
      const nameCell = `${selectors.SIDECAR} .entity.theme[data-name="${clickOn.name}"] > tr > .clickable`

      console.error('A', checkMarkCell)
      await ctx.app.client.waitForVisible(checkMarkCell)
      console.error('2')
      await ctx.app.client.waitForVisible(nameCell)
      console.error('3')

      for (let idx = 0; idx < nClicks; idx++) {
        if (idx === 0) {
          await ctx.app.client.click(checkMarkCell)
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000))
          await ctx.app.client.click(nameCell)
        }

        await ctx.app.client.waitForExist(`body[kui-theme="${clickOn.name}"]`)

        if (idx > 2) {
          await reloadAndThen(clickOn)
        }
      }
    } catch (err) {
      await oops(ctx, true)(err)
    }
  })

  restartAndThen(clickOn)(ctx)
}

/** some helpers */
const Dark = { name: 'Dark', display: 'Default Dark' }
const Light = { name: 'Light', display: 'Default Light' }
const goLight = go(Light)
const goDark = go(Dark)
const restartAndThenLight = restartAndThen(Light)
const restartAndThenDark = restartAndThen(Dark)
const reloadAndThenLight = reloadAndThen(Light)
const reloadAndThenDark = reloadAndThen(Dark)
const clickOnThemeButtonThenClickOnLight = clickOnThemeButtonThenClickOnTheme(Light)
const clickOnThemeButtonThenClickOnDark = clickOnThemeButtonThenClickOnTheme(Dark)

describe('theme switching', function(this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  resetTheme(this)
  clickOnThemeButtonThenClickOnLight(this)
  clickOnThemeButtonThenClickOnDark(this)
  clickOnThemeButtonThenClickOnLight(this, 3) // click on Light 3 times in a row
  clickOnThemeButtonThenClickOnDark(this, 4) // click on Dark 4 times in a row

  it('should list built-in Light theme', () =>
    cli
      .do('theme list', this.app)
      .then(
        cli.expectOKWithCustom({
          selector: `.entity-name[data-value="${Light.name}"]`
        })
      )
      .catch(oops(this)))

  it('should list built-in Dark theme', () =>
    cli
      .do('theme list', this.app)
      .then(
        cli.expectOKWithCustom({
          selector: `.entity-name[data-value="${Dark.name}"]`
        })
      )
      .catch(oops(this)))

  resetTheme(this)
  reloadAndThenDark(this) // because Dark is default

  goLight(this)
  restartAndThenLight(this)

  resetTheme(this)
  reloadAndThenDark(this) // because Dark is default
  restartAndThenDark(this) // because Dark is default

  // switch back and forth without restart
  goLight(this)
  goDark(this)
  goLight(this)
  goDark(this)
  goLight(this)
  goDark(this)
  goLight(this)

  // after that switching around, we should be Light after that
  // switching back and forth
  reloadAndThenLight(this)

  // try clicking on the current theme a bunch of times, to make sure
  // we stick with it
  goLight(this)
  goLight(this)
  goLight(this)
  reloadAndThenLight(this)

  goDark(this)
  reloadAndThenDark(this)

  goLight(this)
  goLight(this)

  // finally we should be Light even after clicking on Light a bunch
  // of times in a row
  restartAndThenLight(this)
  reloadAndThenLight(this)
})
