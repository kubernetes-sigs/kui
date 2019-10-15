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

import Debug from 'debug'
import { dirname, join } from 'path'
import { WebContents } from 'electron'

import Capabilities from '@kui-shell/core/api/capabilities'
import Settings from '@kui-shell/core/api/settings'
import Errors from '@kui-shell/core/api/errors'
import eventBus from '../../core/events'
import i18n from '../../util/i18n'
import { injectCSS, uninjectCSS } from '../util/inject'

import findThemeByName from './find'
import getDefaultTheme from './default'

const strings = i18n('core')

const debug = Debug('core/webapp/themes/persistence')

/**
 * Key into userdata preference model that indicates that currently selected theme
 *
 */
const persistedThemePreferenceKey = 'kui.theme.current'

/**
 * Return the previously selected (and persisted) choice of theme
 *
 */
export const getPersistedThemeChoice = (): Promise<string> => {
  return Settings.getPreference(persistedThemePreferenceKey)
}

/**
 * @return the path to the given theme's css
 *
 */
const getCssFilepathForGivenTheme = (addon: string): string => {
  const prefix = Capabilities.inBrowser()
    ? ''
    : join(dirname(require.resolve('@kui-shell/settings/package.json')), '../build')
  return join(prefix, Settings.env.cssHome, addon)
}

/**
 * An HTML-friendly id for the given theme name
 *
 */
function id(theme: string) {
  return `kui-theme-css-${theme.replace(/\s/g, '_')}`
}

/**
 * Internal logic to switch themes
 *
 */
export const switchTo = async (theme: string, webContents?: WebContents, saveNotNeeded = false): Promise<void> => {
  const themeModel = findThemeByName(theme)
  if (!themeModel) {
    debug('could not find theme', theme, Settings.theme)
    const error = new Error(strings('theme.unknown')) as Errors.CodedError
    error.code = 404
    throw error
  }

  debug('switching to theme', theme)

  // css addons defined by the theme
  const addons = typeof themeModel.css === 'string' ? [themeModel.css] : themeModel.css

  const themeKey = id(theme)

  if (!webContents) {
    const previousTheme = document.body.getAttribute('kui-theme')
    if (previousTheme) {
      //
      // Notes:
      //
      // This is only for dynamic injection; webContents means this
      // is happening in the main loading process; see the comments
      // below for more info.
      //
      const previousThemeModel = findThemeByName(previousTheme)
      const previousKey = id(previousTheme)
      const previousNumAddons = typeof previousThemeModel.css === 'string' ? 1 : previousThemeModel.css.length
      for (let idx = 0; idx < previousNumAddons; idx++) {
        const addonKey = `${previousKey}-${idx}`
        await uninjectCSS({ key: addonKey })
      }

      if (previousThemeModel.attrs) {
        previousThemeModel.attrs.forEach(attr => document.body.classList.remove(attr))
      }
    }
  }

  try {
    await Promise.all(
      addons.map(async (addon, idx) => {
        debug('injecting theme addon', addon)

        const addonKey = `${themeKey}-${idx}`

        if (webContents) {
          //
          // see packages/core/src/main/spawn-electron, where we use the
          // electron API to set inject the theme into the main webview
          // before the window opens
          //
          const { readFile } = await import('fs-extra')
          const css = (await readFile(getCssFilepathForGivenTheme(addon))).toString()
          debug('using electron to pre-inject CSS before the application loads, from the main process')
          return webContents.insertCSS(css)
        } else {
          const css = {
            key: addonKey,
            path: getCssFilepathForGivenTheme(addon)
          }

          // inject the new css
          debug('injecting CSS', css)
          return injectCSS(css)
        }
      })
    )
  } catch (err) {
    debug('error loading theme')
    console.error(err)
    throw err
  }

  if (!saveNotNeeded) {
    // e.g. if we are doing a switch to the persisted theme choice,
    // there is no need to re-persist this choice
    await Settings.setPreference(persistedThemePreferenceKey, theme)
  }

  // set the theme attributes on document.body
  if (webContents) {
    //
    // see packages/core/src/main/spawn-electron, where we use the
    // electron API to set inject the theme into the main webview
    // before the window opens
    //
    let script = `
document.body.setAttribute('kui-theme', '${theme}');
document.body.setAttribute('kui-theme-key', '${themeKey}');
document.body.setAttribute('kui-theme-style', '${themeModel.style}');`

    if (themeModel.attrs) {
      themeModel.attrs.forEach(attr => {
        script = `${script}document.body.classList.add('${attr}')`
      })
    }

    webContents.executeJavaScript(script)
  } else {
    document.body.setAttribute('kui-theme', theme)
    document.body.setAttribute('kui-theme-key', themeKey)
    document.body.setAttribute('kui-theme-style', themeModel.style) // dark versus light

    if (themeModel.attrs) {
      themeModel.attrs.forEach(attr => document.body.classList.add(attr))
    }

    // let others know that the theme has changed
    setTimeout(() => eventBus.emit('/theme/change', { theme }))
  }
}

/**
 * Switch to the last user choice, if the user so indicated
 *
 */
export const switchToPersistedThemeChoice = async (webContents?: WebContents, isDarkMode = false): Promise<void> => {
  // Notes: the "true" passed to switchTo means indicates that we know
  // that we don't need to re-save the theme choice (after all, we
  // just read it in)
  const theme = await getPersistedThemeChoice()
  if (theme) {
    debug('switching to persisted theme choice')
    try {
      await switchTo(theme, webContents, true)
    } catch (err) {
      debug('error switching to persisted theme choice, using default')
      await switchTo(getDefaultTheme(isDarkMode), webContents, true)
    }
  } else {
    debug('no persisted theme choice')
    await switchTo(getDefaultTheme(), webContents, true)
  }
}

/**
 * Reset to the default theme
 *
 */
export const resetToDefault = async () => {
  debug('reset')
  await Settings.clearPreference(persistedThemePreferenceKey)
  await switchTo(getDefaultTheme())
  return true
}
