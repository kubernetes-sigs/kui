/*
 * Copyright 2017-2020 IBM Corporation
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
  Arguments,
  ParsedOptions,
  Registrar,
  i18n,
  inElectron,
  MultiModalMode as Mode,
  NavResponse,
  Presentation,
  Table,
  isStringWithOptionalContentType
} from '@kui-shell/core'

import usage from './usage'

const clientStrings = i18n('client', 'about')

/**
 * Here, we consult the client/config.d/name.json model.
 *
 * @return the product name
 *
 */
async function getName(): Promise<string> {
  return import('@kui-shell/client/config.d/name.json').then(_ => _.productName)
}

/**
 * @return a MultiModalResponse for `about`
 *
 */
const aboutWindow = async (): Promise<NavResponse> => {
  const [name, about] = await Promise.all([
    getName(),
    import('@kui-shell/client/config.d/about.json').then(_ => _.nav as NavResponse)
  ])

  const fullAbout = {}

  for (const [title, mmr] of Object.entries(about)) {
    const modesFromAbout = mmr.modes
    const modes = modesFromAbout.map(
      (modeFromAbout): Mode => {
        // translate the label
        const label = clientStrings(modeFromAbout.label || modeFromAbout.mode)

        if (isStringWithOptionalContentType(modeFromAbout)) {
          return Object.assign({}, modeFromAbout, {
            label,
            content: clientStrings(modeFromAbout.content) // translate content string
          })
        } else {
          return Object.assign({}, modeFromAbout, {
            label
          })
        }
      }
    )

    Object.assign(fullAbout, {
      [title]: {
        kind: 'about',
        modes,
        presentation:
          (document.body.classList.contains('subwindow') && Presentation.SidecarFullscreen) || Presentation.SidecarThin,
        metadata: { name }
      }
    })
  }

  return fullAbout
}

interface VersionOptions extends ParsedOptions {
  full: boolean
}

/**
 * @return a Table that enumerates the full version information
 *
 */
function renderFullVersion(name: string, version: string): Table {
  const versionModel = process.versions
  versionModel[name] = version

  return {
    noSort: true,
    noEntityColors: true,
    header: {
      name: 'COMPONENT',
      attributes: [{ value: 'VERSION' }]
    },
    body: [name, 'electron', 'chrome', 'node', 'v8'].map((component, idx) => ({
      name: component,
      outerCSS: idx === 0 ? 'semi-bold' : '',
      css: idx === 0 ? 'cyan-text' : 'lighter-text',
      attributes: [{ key: 'VERSION', value: versionModel[component] }]
    }))
  }
}

/**
 * Report the current version
 *
 */
const reportVersion = async ({ parsedOptions }: Arguments<VersionOptions>) => {
  const { version } = await import('@kui-shell/client/config.d/version.json')

  if (inElectron() && parsedOptions.full) {
    return renderFullVersion(await getName(), version)
  } else {
    return version
  }
}

/**
 * Here we install the command handlers for /version and /about
 *
 */
export default (commandTree: Registrar) => {
  // special case, a bit of a hack for the OS-level About MenuItem;
  // see menu.ts in the core
  if (!commandTree) {
    return aboutWindow()
  }

  /**
   * Print out the current version of the tool, as text
   *
   */
  commandTree.listen(
    '/version', // the command path
    reportVersion, // the command handler
    { usage: usage.version, inBrowserOk: true }
  )

  /**
   * Open a graphical window displaying more detail about the tool
   *
   */
  commandTree.listen('/about', aboutWindow, {
    hidden: true, // don't list about in the help menu
    needsUI: true, // about requires a window
    inBrowserOk: true
  })

  // getting started shortcut
  commandTree.listen('/getting/started', ({ REPL }) => REPL.qexec('about'), {
    needsUI: true,
    inBrowserOk: true
  })
}
