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

import * as Debug from 'debug'
const debug = Debug('plugins/core-support/theme')

import { dirname, join } from 'path'
import { WebContents } from 'electron'

import repl = require('@kui-shell/core/core/repl')
import { injectCSS, uninjectCSS } from '@kui-shell/core/webapp/util/inject'
import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'
import { getPreference, setPreference, clearPreference } from '@kui-shell/core/core/userdata'
import { theme as settings, env } from '@kui-shell/core/core/settings'

/**
 * Key into userdata preference model that indicates that currently selected theme
 *
 */
const persistedThemePreferenceKey = 'kui.theme.current'

/**
 * Return the previously selected (and persisted) choice of theme
 *
 */
const getPersistedThemeChoice = (): string => {
  return getPreference(persistedThemePreferenceKey)
}

/**
 * The command usage model
 *
 */
const usage = {
  list: {
    command: 'list',
    strict: 'list',
    docs: 'List available themes'
  },
  reset: {
    command: 'reset',
    strict: 'reset',
    docs: 'Reset to default theme'
  },
  set: {
    command: 'set',
    strict: 'set',
    docs: 'Set the current theme',
    required: [
      { name: 'string', docs: 'The name of a theme to use' }
    ]
  }
}

/**
 * List themes
 *
 */
const list = () => {
  const header: Array<any> = [
    { type: 'theme', noSort: true, outerCSS: 'header-cell', name: 'THEME', attributes: [ { value: 'DESCRIPTION', outerCSS: 'header-cell' } ] }
  ]

  return header.concat((settings.themes || []).map(theme => ({
    type: 'theme',
    name: theme.name,
    attributes: [ { value: theme.description, css: 'not-too-wide' } ],
    onclick: () => repl.pexec(`theme set ${repl.encodeComponent(theme.name)}`)
  })))
}

/**
 * @return the name of the default theme
 *
 */
const getDefaultTheme = () => {
  let defaultTheme = settings.defaultTheme
  if (!defaultTheme) {
    console.error('theme bug: the theme does not set a default theme')
    defaultTheme = settings.themes[0] && settings.themes[0].name
    if (!defaultTheme) {
      throw new Error('SEVERE theme bug: no theme found')
    }
  }

  debug('using default theme %s', defaultTheme)
  return defaultTheme
}

/**
 * Switch to the last user choice, if the user so indicated
 *
 */
export const switchToPersistedThemeChoice = async (webContents?: WebContents): Promise<void> => {
  const theme = getPersistedThemeChoice()
  if (theme) {
    debug('switching to persisted theme choice')
    switchTo(theme, webContents)
  } else {
    debug('no persisted theme choice')
    switchTo(getDefaultTheme(), webContents)
  }
}

/**
 * @return the path to the given theme's css
 *
 */
const getCssFilepathForGivenTheme = (themeModel): string => {
  const prefix = inBrowser() ? '' : dirname(require.resolve('@kui-shell/settings/package.json'))
  return join(prefix, env.cssHome, themeModel.css)
}

/**
 * @return the path to the currently selected theme's css
 *
 */
export const getCssFilepathForCurrentTheme = (): string => {
  const theme = getPersistedThemeChoice() || getDefaultTheme()
  const themeModel = (settings.themes || []).find(_ => _.name === theme)
  return getCssFilepathForGivenTheme(themeModel)
}

/**
 * Internal logic to switch themes
 *
 */
const switchTo = async (theme: string, webContents?: WebContents): Promise<void> => {
  const themeModel = (settings.themes || []).find(_ => _.name === theme)
  if (!themeModel) {
    debug('could not find theme', theme, settings)
    const error = new Error('Unknown theme')
    error['code'] = 404
    throw error
  }

  debug('switching to theme %s', theme, env)

  try {
    if (webContents) {
      const { readFile } = await import('fs-extra')
      const css = (await readFile(getCssFilepathForGivenTheme(themeModel))).toString()
      debug('using electron to pre-inject CSS before the application loads, from the main process')
      webContents.insertCSS(css)
      webContents.executeJavaScript(`document.body.setAttribute('kui-theme', '${theme}')`)
    } else {
      debug('using kui to inject CSS after the application has loaded, from the renderer process')
      const key = 'kui-theme-css'
      const css = { key, path: getCssFilepathForGivenTheme(themeModel) }
      uninjectCSS(css)
      injectCSS(css)
      document.body.setAttribute('kui-theme', theme)
    }
  } catch (err) {
    debug('error loading theme')
    console.error(err)
    throw err
  }
}

/**
 * REPL command to switch themes
 *
 */
const set = async ({ argvNoOptions }) => {
  const theme = argvNoOptions[argvNoOptions.indexOf('set') + 1]
  await switchTo(theme)
  setPreference(persistedThemePreferenceKey, theme)
  return true
}

/**
 * Reset to the default theme
 *
 */
const resetToDefault = async () => {
  debug('reset')
  clearPreference(persistedThemePreferenceKey)
  await switchTo(getDefaultTheme())
  return true
}

/**
 * The command handlers
 *
 */
export const plugin = (commandTree, prequire) => {
  debug('plugin')

  commandTree.listen('/theme/list', list, { usage: usage.list, noAuthOk: true, inBrowserOk: true })
  commandTree.listen('/theme/set', set, { usage: usage.set, noAuthOk: true, inBrowserOk: true })

  // returns the current persisted theme choice; helpful for debugging
  commandTree.listen('/theme/current', () => getPersistedThemeChoice() || 'You are using the default theme', { noAuthOk: true, inBrowserOk: true, hidden: true }) // for debugging

  commandTree.listen('/theme/reset', resetToDefault, { usage: usage.reset, noAuthOk: true, inBrowserOk: true })
}

/**
 * The preload handlers
 *
 */
export const preload = () => {
  debug('preload')
  if (!isHeadless()) {
    document.getElementById('theme-button').onclick = () => repl.pexec('theme list')

    if (inBrowser()) {
      debug('loading theme for webpack client')
      switchToPersistedThemeChoice()
    }
  }
}
