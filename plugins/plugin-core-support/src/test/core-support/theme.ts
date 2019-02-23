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

import { ISuite } from '@kui-shell/core/tests/lib/common'
import * as common from '@kui-shell/core/tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, selectors, sidecar } = ui

const resetTheme = (ctx: ISuite) => {
  it('should reset theme preference', () => cli.do('theme reset', ctx.app)
     .then(cli.expectJustOK)
     .catch(common.oops(ctx)))

  it('should show that we are using the default theme', () => cli.do('theme current', ctx.app)
     .then(cli.expectOKWithString('default theme'))
     .then(() => ctx.app.client.waitForExist('body[kui-theme="Light"]')) // Light being the default
     .catch(common.oops(ctx)))
}

/**
 * Switch to the given theme and verify
 *
 */
const go = (theme: string) => (ctx: ISuite) => {
  it(`should switch to ${theme} theme via command`, () => cli.do(`theme set ${theme}`, ctx.app)
     .then(cli.expectJustOK)
     .then(() => ctx.app.client.waitForExist(`body[kui-theme="${theme}"]`))
     .catch(common.oops(ctx)))

  it(`should show that we are using the ${theme} theme`, () => cli.do('theme current', ctx.app)
     .then(cli.expectOKWithString(theme))
     .catch(common.oops(ctx)))
}

/**
 * Restart the electron application and then expect the given theme to
 * be set
 *
 */
const restartAndThen = (theme: string) => (ctx: ISuite) => {
  it(`should still be using ${theme} theme after a restart`, () => ctx.app.restart()
     .then(() => ctx.app.client.waitForExist(`body[kui-theme="${theme}"]`))
     .catch(common.oops(ctx)))
}

/**
 * Click on the theme button and expect the theme list
 *
 */
const clickOnThemeButtonThenClickOnTheme = (clickOn: string) => (ctx: ISuite) => {
  it('should click on theme button and present theme list', async () => {
    try {
      ctx.app.client.click('#theme-button')

      const light = `.entity.theme[data-name="${Light}"] .clickable`
      const dark = `.entity.theme[data-name="${Dark}"] .clickable`

      await ctx.app.client.waitForExist(light)
      await ctx.app.client.waitForExist(dark)

      if (clickOn === Light) {
        ctx.app.client.click(light)
      } else {
        ctx.app.client.click(dark)
      }
    } catch (err) {
      common.oops(ctx)(err)
    }
  })

  restartAndThen(clickOn)(ctx)
}

/** some helpers */
const Dark = 'Dark'
const Light = 'Light'
const goLight = go(Light)
const goDark = go(Dark)
const restartAndThenLight = restartAndThen(Light)
const restartAndThenDark = restartAndThen(Dark)
const clickOnThemeButtonThenClickOnLight = clickOnThemeButtonThenClickOnTheme(Light)
const clickOnThemeButtonThenClickOnDark = clickOnThemeButtonThenClickOnTheme(Dark)

describe('theme switching', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  clickOnThemeButtonThenClickOnLight(this)
  clickOnThemeButtonThenClickOnDark(this)

  it('should list built-in Light theme', () => cli.do('theme list', this.app)
     .then(cli.expectOKWith(Light))
     .catch(common.oops(this)))

  it('should list built-in Dark theme', () => cli.do('theme list', this.app)
     .then(cli.expectOKWith(Dark))
     .catch(common.oops(this)))

  resetTheme(this)

  goDark(this)
  restartAndThenDark(this)

  resetTheme(this)
  restartAndThenLight(this)

  // switch back and forth without restart
  goDark(this)
  goLight(this)
  goDark(this)
  goLight(this)
  goDark(this)
  goLight(this)

  // finally we should be Light after that switching back and forth
  restartAndThenLight(this)
})
