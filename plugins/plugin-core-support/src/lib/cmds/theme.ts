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

import { dirname, join } from 'path'
import { WebContents } from 'electron'
import { Row } from '@kui-shell/core/webapp/models/table'
import { CommandRegistrar, EvaluatorArgs } from '@kui-shell/core/models/command'
import eventBus from '@kui-shell/core/core/events'
import { injectCSS, uninjectCSS } from '@kui-shell/core/webapp/util/inject'
import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'
import { getPreference, setPreference, clearPreference } from '@kui-shell/core/core/userdata'
import { theme as settings, env } from '@kui-shell/core/core/settings'

import i18n from '@kui-shell/core/util/i18n'
const strings = i18n('plugin-core-support')

const debug = Debug('plugins/core-support/theme')

/**
 * Key into userdata preference model that indicates that currently selected theme
 *
 */
const persistedThemePreferenceKey = 'kui.theme.current'

/**
 * Return the previously selected (and persisted) choice of theme
 *
 */
const getPersistedThemeChoice = (): Promise<string> => {
  return getPreference(persistedThemePreferenceKey)
}

/**
 * The command usage model
 *
 */
const usage = {
  themes: {
    command: 'themes',
    strict: 'themes',
    docs: strings('theme.usageDocs')
  },
  list: {
    command: 'list',
    strict: 'list',
    docs: strings('theme.usageDocs')
  },
  reset: {
    command: 'reset',
    strict: 'reset',
    docs: strings('theme.resetUsageDocs')
  },
  set: {
    command: 'set',
    strict: 'set',
    docs: 'Set the current theme',
    required: [{ name: 'string', docs: strings('theme.setUsageRequiredDocs') }]
  }
}

/**
 * @return the name of the default theme
 *
 */
const getDefaultTheme = (isDarkMode = false) => {
  let defaultTheme = settings.defaultTheme

  if (isDarkMode) {
    const darkTheme = settings.themes.find(_ => _.name === 'Dark')
    if (darkTheme) {
      defaultTheme = darkTheme.name
    }
  }

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
 * List themes
 *
 */
const list = async () => {
  const { Table } = await import('@kui-shell/core/webapp/models/table')

  const header: Row = {
    type: 'theme',
    name: '',
    outerCSS: 'not-a-name',
    attributes: [{ value: 'THEME' }, { value: 'STYLE' }]
  }

  const currentTheme = (await getPersistedThemeChoice()) || getDefaultTheme()
  debug('currentTheme', currentTheme)
  debug('theme list', settings.themes)

  const body: Row[] = (settings.themes || []).map(
    (theme): Row => {
      const row = {
        type: 'theme',
        name: theme.name,
        fontawesome: 'fas fa-check',
        outerCSS: 'not-a-name',
        css: 'selected-entity',
        rowCSS: theme.name === currentTheme && 'selected-row',
        attributes: [
          {
            value: theme.description || theme.name,
            css: 'not-too-wide',
            onclick: undefined
          },
          { value: theme.style, css: 'pretty-narrow' }
        ],
        onclick: undefined,
        setSelected: undefined
      }

      const onclick = async () => {
        const { encodeComponent, qexec } = await import('@kui-shell/core/core/repl')
        await qexec(`theme set ${encodeComponent(theme.name)}`)
        row.setSelected()
      }

      row.onclick = onclick // <-- clicks on the "check mark"
      row.attributes[0].onclick = onclick // <-- clicks on the theme name

      return row
    }
  )

  return new Table({
    type: 'theme',
    noSort: true,
    header,
    body
  })
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
export const getCssFilepathForCurrentTheme = async (): Promise<string> => {
  const theme = (await getPersistedThemeChoice()) || getDefaultTheme()
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
    const error = new Error(strings('theme.unknown'))
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
      webContents.executeJavaScript(`document.body.setAttribute('kui-theme-style', '${themeModel.style}')`)
    } else {
      const previousKey = document.body.getAttribute('kui-theme-key')
      const newKey = `kui-theme-css-${theme}`

      if (previousKey !== newKey) {
        debug(
          'using kui to inject CSS after the application has loaded, from the renderer process',
          previousKey,
          newKey
        )
        const css = {
          key: newKey,
          path: getCssFilepathForGivenTheme(themeModel)
        }

        // set the theme attributes on document.body
        document.body.setAttribute('kui-theme-key', newKey)
        document.body.setAttribute('kui-theme', theme)
        document.body.setAttribute('kui-theme-style', themeModel.style) // dark versus light

        // inject the new css
        await injectCSS(css)

        // warning: don't blindly uninject! only if we are actually changing themes
        await uninjectCSS({ key: previousKey })

        // let others know that the theme has changed
        setTimeout(() => eventBus.emit('/theme/change', { theme }))
      }
    }
  } catch (err) {
    debug('error loading theme')
    console.error(err)
    throw err
  }
}

/**
 * Switch to the last user choice, if the user so indicated
 *
 */
export const switchToPersistedThemeChoice = async (webContents?: WebContents, isDarkMode = false): Promise<void> => {
  const theme = await getPersistedThemeChoice()
  if (theme) {
    debug('switching to persisted theme choice')
    try {
      await switchTo(theme, webContents)
    } catch (err) {
      debug('error switching to persisted theme choice, using default')
      switchTo(getDefaultTheme(isDarkMode), webContents)
    }
  } else {
    debug('no persisted theme choice')
    switchTo(getDefaultTheme(), webContents)
  }
}

/**
 * REPL command to switch themes
 *
 */
const set = async ({ argvNoOptions }: EvaluatorArgs) => {
  const theme = argvNoOptions[argvNoOptions.indexOf('set') + 1]
  debug('set', theme)
  await switchTo(theme)
  await setPreference(persistedThemePreferenceKey, theme)
  return true
}

/**
 * Reset to the default theme
 *
 */
const resetToDefault = async () => {
  debug('reset')
  await clearPreference(persistedThemePreferenceKey)
  await switchTo(getDefaultTheme())
  return true
}

/**
 * The command handlers
 *
 */
export const plugin = (commandTree: CommandRegistrar) => {
  debug('plugin')

  commandTree.listen('/theme/list', list, {
    usage: usage.list,
    noAuthOk: true,
    inBrowserOk: true
  })
  commandTree.listen('/themes', list, {
    usage: usage.themes,
    noAuthOk: true,
    inBrowserOk: true
  })

  commandTree.listen('/theme/set', set, {
    usage: usage.set,
    noAuthOk: true,
    inBrowserOk: true
  })

  // returns the current persisted theme choice; helpful for debugging
  commandTree.listen('/theme/current', async () => (await getPersistedThemeChoice()) || strings('theme.currentTheme'), {
    noAuthOk: true,
    inBrowserOk: true,
    hidden: true
  }) // for debugging

  commandTree.listen('/theme/reset', resetToDefault, {
    usage: usage.reset,
    noAuthOk: true,
    inBrowserOk: true
  })
}

/**
 * The preload handlers
 *
 */
export const preload = () => {
  if (!isHeadless()) {
    if (inBrowser() || !document.body.hasAttribute('kui-theme')) {
      debug('loading theme for webpack client')
      switchToPersistedThemeChoice()
    }
  }
}
