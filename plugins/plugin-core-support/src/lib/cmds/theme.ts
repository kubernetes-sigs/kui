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

import type { RadioTable, Arguments, Registrar, Theme } from '@kui-shell/core'

const debug = Debug('plugins/core-support/theme')

async function i18n() {
  const { i18n } = await import('@kui-shell/core/mdist/api/i18n')
  return i18n('plugin-core-support')
}

async function strings(key: string) {
  return (await i18n())(key)
}

/**
 * List themes
 *
 */
const list = async ({ REPL }: Arguments): Promise<RadioTable> => {
  const strings = await i18n()
  const { uiThemes } = await import('@kui-shell/core/mdist/api/Settings')
  const { CellShould } = await import('@kui-shell/core/mdist/api/Table')
  const { getPersistedThemeChoice, getDefaultTheme, findThemeByName } = await import('@kui-shell/core/mdist/api/Themes')

  const header = {
    cells: [
      await strings('Theme'),
      { value: await strings('Style'), hints: CellShould.HideWhenNarrow },
      { value: await strings('Provider'), hints: CellShould.BeHidden }
    ]
  }

  // careful: the user's chosen theme might not be available in the
  // settings.themes model; e.g. they previously selected a theme that
  // has since been eliminated
  const currentTheme = async () => {
    const chosenTheme = (await getPersistedThemeChoice()) || (await getDefaultTheme())
    return findThemeByName(chosenTheme) ? chosenTheme : getDefaultTheme()
  }
  debug('currentTheme', await currentTheme())
  // debug('theme list', uiThemes())

  const { flatten } = await import('@kui-shell/core/mdist/api/Util')
  const body = flatten(
    (await uiThemes()).map(({ plugin, themes }) =>
      themes.map((theme: Theme) => ({
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
    title: await strings('theme.Available Themes'),
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
  const { switchToTheme } = await import('@kui-shell/core/mdist/api/Themes')
  await switchToTheme(theme)
  return true
}

async function getPersistedThemeChoice() {
  const { getPersistedThemeChoice } = await import('@kui-shell/core/mdist/api/Themes')
  return getPersistedThemeChoice()
}

async function resetToDefaultTheme() {
  const { resetToDefaultTheme } = await import('@kui-shell/core/mdist/api/Themes')
  return resetToDefaultTheme()
}

/**
 * The command handlers
 *
 */
export const plugin = (commandTree: Registrar) => {
  debug('plugin')

  commandTree.listen('/theme/list', list)
  commandTree.listen('/themes', list)
  commandTree.listen('/theme', list)
  commandTree.listen('/theme/set', set)

  // returns the current persisted theme choice; helpful for debugging
  commandTree.listen(
    '/theme/current',
    async () => (await getPersistedThemeChoice()) || (await strings('theme.currentTheme')),
    {
      hidden: true
    }
  ) // for debugging

  commandTree.listen('/theme/reset', resetToDefaultTheme)
}
