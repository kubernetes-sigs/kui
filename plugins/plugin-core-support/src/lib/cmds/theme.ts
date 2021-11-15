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

import { i18n, RadioTable, CellShould, Arguments, Registrar, Settings, Themes, Util } from '@kui-shell/core'

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
const list = async ({ REPL }: Arguments): Promise<RadioTable> => {
  const header = {
    cells: [
      strings('Theme'),
      { value: strings('Style'), hints: CellShould.HideWhenNarrow },
      { value: strings('Provider'), hints: CellShould.BeHidden }
    ]
  }

  // careful: the user's chosen theme might not be available in the
  // settings.themes model; e.g. they previously selected a theme that
  // has since been eliminated
  const currentTheme = async () => {
    const chosenTheme = (await Themes.getPersistedThemeChoice()) || (await Themes.getDefaultTheme())
    return Themes.findThemeByName(chosenTheme) ? chosenTheme : Themes.getDefaultTheme()
  }
  debug('currentTheme', await currentTheme())
  // debug('theme list', Settings.uiThemes())

  const body = Util.flatten(
    (await Settings.uiThemes()).map(({ plugin, themes }) =>
      themes.map((theme: Themes.Theme) => ({
        nameIdx: 0,
        cells: [
          { value: theme.name },
          { value: strings(theme.style), hints: CellShould.HideWhenNarrow },
          { value: plugin, hints: [CellShould.BeHidden] }
        ],

        onSelectExec: 'qexec' as const,
        onSelect: `theme set ${REPL.encodeComponent(theme.name)}`
      }))
    )
  ).sort((a, b) => (a.cells[2].value === 'plugin-core-themes' ? 1 : b.cells[2].value === 'plugin-core-themes' ? -1 : 0))

  const getSelectedIdx = async () => {
    const current = await currentTheme()
    return body.findIndex(_ => _.cells[0].value === current)
  }

  const defaultSelectedIdx = await getSelectedIdx()

  const table: RadioTable = {
    apiVersion: 'kui-shell/v1',
    kind: 'RadioTable',
    title: strings('theme.Available Themes'),
    header,
    body,
    defaultSelectedIdx
  }

  return table
}

/**
 * REPL command to switch themes
 *
 */
const set = async ({ argvNoOptions }: Arguments) => {
  const theme = argvNoOptions[argvNoOptions.indexOf('set') + 1]
  debug('set', theme)
  await Themes.switchToTheme(theme)
  return true
}

/**
 * The command handlers
 *
 */
export const plugin = (commandTree: Registrar) => {
  debug('plugin')

  commandTree.listen('/theme/list', list, {
    usage: usage.list
  })
  commandTree.listen('/themes', list, {
    usage: usage.themes
  })
  commandTree.listen('/theme', list, {
    usage: usage.theme
  })

  commandTree.listen('/theme/set', set, {
    usage: usage.set
  })

  // returns the current persisted theme choice; helpful for debugging
  commandTree.listen(
    '/theme/current',
    async () => (await Themes.getPersistedThemeChoice()) || strings('theme.currentTheme'),
    {
      hidden: true
    }
  ) // for debugging

  commandTree.listen('/theme/reset', Themes.resetToDefaultTheme, {
    usage: usage.reset
  })
}
