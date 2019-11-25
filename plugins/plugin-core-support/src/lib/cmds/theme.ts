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

import { Arguments, Registrar } from '@kui-shell/core/api/commands'
import { i18n } from '@kui-shell/core/api/i18n'
import { Row, Table } from '@kui-shell/core/api/table-models'
import UI from '@kui-shell/core/api/ui'

const strings = i18n('plugin-core-support')
const debug = Debug('plugins/core-support/theme')

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
 * List themes
 *
 */
const list = async () => {
  const header: Row = {
    type: 'theme',
    name: '',
    outerCSS: 'not-a-name',
    attributes: [{ value: strings('Theme') }, { value: strings('Style') }]
  }

  const Settings = (await import('@kui-shell/core/api/settings')).default

  // careful: the user's chosen theme might not be available in the
  // settings.themes model; e.g. they previously selected a theme that
  // has since been eliminated
  const chosenTheme = (await UI.Themes.Persistence.getPersistedThemeChoice()) || UI.Themes.getDefault()
  const currentTheme = UI.Themes.findByName(chosenTheme) ? chosenTheme : UI.Themes.getDefault()
  debug('currentTheme', currentTheme)
  debug('theme list', Settings.theme.themes)

  const body: Row[] = (Settings.theme.themes || []).map(
    (theme: UI.Themes.Theme): Row => {
      const row: Row = {
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

  return new Table({
    noSort: true,
    header,
    body
  })
}

/**
 * REPL command to switch themes
 *
 */
const set = async ({ argvNoOptions }: Arguments) => {
  const theme = argvNoOptions[argvNoOptions.indexOf('set') + 1]
  debug('set', theme)
  await UI.Themes.Persistence.switchTo(theme)
  return true
}

/**
 * The command handlers
 *
 */
export const plugin = (commandTree: Registrar) => {
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
  commandTree.listen(
    '/theme/current',
    async () => (await UI.Themes.Persistence.getPersistedThemeChoice()) || strings('theme.currentTheme'),
    {
      noAuthOk: true,
      inBrowserOk: true,
      hidden: true
    }
  ) // for debugging

  commandTree.listen('/theme/reset', UI.Themes.Persistence.resetToDefault, {
    usage: usage.reset,
    noAuthOk: true,
    inBrowserOk: true
  })
}
