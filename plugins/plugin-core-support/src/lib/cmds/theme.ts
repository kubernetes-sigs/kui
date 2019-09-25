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

import { Capabilities, Commands, eventBus, i18n, Settings, Tables, UI } from '@kui-shell/core'
import { getPreference, setPreference, clearPreference } from '@kui-shell/core/core/userdata'

const strings = i18n('plugin-core-support')
const debug = Debug('plugins/core-support/theme')

interface Theme {
  name: string
  description?: string
  css: string | string[]
  attrs?: string[]
  style: string
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
const getPersistedThemeChoice = (): Promise<string> => {
  return getPreference(persistedThemePreferenceKey)
}

/**
 * The command usage model
 *
 */
const usage = {
  theme: {
    command: 'theme',
    strict: 'theme',
    docs: strings('theme.usageDocs')
  },
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
 * @return the Theme model associated with the given theme name
 *
 */
function findThemeByName(name: string): Theme {
  return (Settings.theme.themes || []).find(_ => _.name === name)
}

/**
 * @return the name of the default theme
 *
 */
const getDefaultTheme = (isDarkMode = false) => {
  let defaultTheme = Settings.theme.defaultTheme

  if (isDarkMode) {
    const darkTheme = findThemeByName('Dark')
    if (darkTheme) {
      defaultTheme = darkTheme.name
    }
  }

  if (!defaultTheme) {
    console.error('theme bug: the theme does not set a default theme')
    defaultTheme = Settings.theme.themes[0] && Settings.theme.themes[0].name
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
  const header: Tables.Row = {
    type: 'theme',
    name: '',
    outerCSS: 'not-a-name',
    attributes: [{ value: strings('Theme') }, { value: strings('Style') }]
  }

  // careful: the user's chosen theme might not be available in the
  // settings.themes model; e.g. they previously selected a theme that
  // has since been eliminated
  const chosenTheme = (await getPersistedThemeChoice()) || getDefaultTheme()
  const currentTheme = findThemeByName(chosenTheme) ? chosenTheme : getDefaultTheme()
  debug('currentTheme', currentTheme)
  debug('theme list', Settings.theme.themes)

  const body: Tables.Row[] = (Settings.theme.themes || []).map(
    (theme: Theme): Tables.Row => {
      const row = {
        type: 'theme',
        name: theme.name,
        fontawesome: 'fas fa-check',
        outerCSS: 'not-a-name',
        css: 'selected-entity',
        rowCSS: theme.name === currentTheme && 'selected-row',
        attributes: [
          {
            value: strings(theme.description) || strings(theme.name),
            css: 'not-too-wide',
            onclick: undefined
          },
          { value: strings(theme.style), css: 'pretty-narrow' }
        ],
        onclick: undefined,
        setSelected: undefined
      }

      const onclick = async () => {
        const {
          REPL: { encodeComponent, qexec }
        } = await import('@kui-shell/core')
        await qexec(`theme set ${encodeComponent(theme.name)}`)
        row.setSelected()
      }

      row.onclick = onclick // <-- clicks on the "check mark"
      row.attributes[0].onclick = onclick // <-- clicks on the theme name

      return row
    }
  )

  return new Tables.Table({
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
const switchTo = async (theme: string, webContents?: WebContents): Promise<void> => {
  const themeModel = findThemeByName(theme)
  if (!themeModel) {
    debug('could not find theme', theme, Settings.theme)
    const error = new Error(strings('theme.unknown'))
    error['code'] = 404
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
        await UI.uninjectCSS({ key: addonKey })
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
          return UI.injectCSS(css)
        }
      })
    )
  } catch (err) {
    debug('error loading theme')
    console.error(err)
    throw err
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
  const theme = await getPersistedThemeChoice()
  if (theme) {
    debug('switching to persisted theme choice')
    try {
      await switchTo(theme, webContents)
    } catch (err) {
      debug('error switching to persisted theme choice, using default')
      await switchTo(getDefaultTheme(isDarkMode), webContents)
    }
  } else {
    debug('no persisted theme choice')
    await switchTo(getDefaultTheme(), webContents)
  }
}

/**
 * REPL command to switch themes
 *
 */
const set = async ({ argvNoOptions }: Commands.Arguments) => {
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
export const plugin = (commandTree: Commands.Registrar) => {
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
  commandTree.listen('/theme', list, {
    usage: usage.theme,
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
  if (!Capabilities.isHeadless()) {
    if (Capabilities.inBrowser() || !document.body.hasAttribute('kui-theme')) {
      debug('loading theme')
      return switchToPersistedThemeChoice()
    }
  }
}
