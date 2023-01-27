/*
 * Copyright 2019 The Kubernetes Authors
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

import eventChannelUnsafe from '../../core/events'
import { webpackPath } from '../../plugins/path'
import { CodedError } from '../../models/errors'
import { clearPreference, getPreference, setPreference } from '../../core/userdata'

import findThemeByName from './find'
import getDefaultTheme from './default'

function debug(formatter: any, ...args: any[]) {
  const debug = Debug('core/themes/persistence')
  debug(formatter, ...args)
}

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
  return getPreference(persistedThemePreferenceKey)
}

/**
 * @return the path to the given theme's css
 *
 */
const getCss = async (addon: string, addonKey: string, plugin: string) => {
  return {
    key: addonKey,
    css: /.scss/.test(addon)
      ? await import('@kui-shell/plugin-' + webpackPath(plugin) + '/web/scss/' + addon.replace(/\.scss$/, '') + '.scss')
      : (await import('@kui-shell/plugin-' + webpackPath(plugin) + '/web/css/' + addon.replace(/\.css$/, '') + '.css'))
          .default
  }
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
export const switchTo = async (theme: string, saveNotNeeded = false): Promise<void> => {
  const themeWithPlugin = await findThemeByName(theme)
  if (!themeWithPlugin) {
    debug('could not find theme', theme)
    const { default: i18n } = await import('../../util/i18n')
    const strings = i18n('core')
    const error = new Error(strings('theme.unknown')) as CodedError
    error.code = 404
    throw error
  }

  const { theme: themeModel, plugin } = themeWithPlugin

  debug('switching to theme', theme)

  // css addons defined by the theme
  const addons = typeof themeModel.css === 'string' ? [themeModel.css] : themeModel.css

  const themeKey = id(theme)

  const previousTheme = document.body.getAttribute('kui-theme')
  if (previousTheme) {
    const previous = await findThemeByName(previousTheme)
    if (previous) {
      const { theme: previousThemeModel } = previous
      if (previousThemeModel.attrs) {
        previousThemeModel.attrs.forEach(attr => document.body.classList.remove(attr))
      }

      if (previousThemeModel.lightweight) {
        document.body.classList.remove('kui--lightweight-ui')
      }
    }
  }

  try {
    await Promise.all(
      addons.map(async (addon, idx) => {
        debug('injecting theme addon', addon)

        const addonKey = `${themeKey}-${idx}`

        // inject the new css
        debug('injecting CSS', addon, plugin)
        await getCss(addon, addonKey, plugin)
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
    await setPreference(persistedThemePreferenceKey, theme)
  }

  // set the theme attributes on document.body
  document.body.setAttribute('kui-theme', theme)
  document.body.setAttribute('kui-theme-key', themeKey)
  document.body.setAttribute('kui-theme-style', themeModel.style) // dark versus light

  document.body.classList.add(themeModel.style === 'dark' ? 'pf-t-dark' : 'pf-t-light')

  if (themeModel.attrs) {
    themeModel.attrs.forEach(attr => document.body.classList.add(attr))
  }

  if (themeModel.lightweight) {
    document.body.classList.add('kui--lightweight-ui')
  }

  // let others know that the theme has changed
  setTimeout(() => eventChannelUnsafe.emit('/theme/change', { theme, themeModel }))
}

/**
 * Switch to the last user choice, if the user so indicated
 *
 */
export const switchToPersistedThemeChoice = async (): Promise<void> => {
  // Notes: the "true" passed to switchTo means indicates that we know
  // that we don't need to re-save the theme choice (after all, we
  // just read it in)
  try {
    const theme = await getPersistedThemeChoice()
    if (theme) {
      debug('switching to persisted theme choice')
      try {
        await switchTo(theme, true)
        return
      } catch (err) {
        console.error('error switching to persisted theme choice', err)
        // intentional fall-through
      }
    } else {
      debug('no persisted theme choice')
      // intentional fall-through
    }
  } catch (err) {
    // intentional fall-through
    console.error('Error loading persisted theme choice', err)
  }

  // Here is the fall-through handler: switch to the default theme
  // choice
  try {
    await switchTo(await getDefaultTheme())
  } catch (err) {
    console.error('Critical error!!! Cannot find a theme.', err)
  }
}

/**
 * Reset to the default theme
 *
 */
export const resetToDefault = async () => {
  debug('reset')
  await clearPreference(persistedThemePreferenceKey)
  await switchTo(await getDefaultTheme())
  return true
}
