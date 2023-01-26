/*
 * Copyright 2017 The Kubernetes Authors
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

import type { Arguments, ParsedOptions, Registrar, Table } from '@kui-shell/core'

/** I would love to place this in a separate file. see https://github.com/microsoft/TypeScript/issues/25636 */
function defaultConfig() {
  return {
    productName: 'Kui Demo',
    version: '0.0.1',
    menus: [
      {
        Kui: {
          modes: [
            {
              mode: 'about',
              content: 'Welcome to Kui. This is a sample About configuration',
              contentType: 'text/markdown'
            },
            { mode: 'version', contentFrom: 'version --full' }
          ]
        }
      }
    ]
  }
}

/**
 * Here, we consult the client/config.d/name.json model.
 *
 * @return the product name
 *
 */
async function getName(): Promise<string> {
  return import('@kui-shell/client/config.d/name.json')
    .catch(() => {
      console.log('using default product name')
      return defaultConfig()
    })
    .then(_ => _.productName)
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
  const { version } = await import('@kui-shell/client/package.json').catch(() => {
    console.log('using default version')
    return defaultConfig()
  })

  const { inElectron } = await import('@kui-shell/core/mdist/api/Capabilities')
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
  /**
   * Print out the current version of the tool, as text
   *
   */
  commandTree.listen(
    '/version', // the command path
    reportVersion // the command handler
  )

  /**
   * Open a graphical window displaying more detail about the tool
   *
   */
  commandTree.listen(
    '/about',
    async ({ REPL }) => {
      const { isPopup } = await import('@kui-shell/core/mdist/api/Client')
      return isPopup() ? REPL.qexec('replay --new-window /kui/welcome.md') : REPL.qexec('replay /kui/welcome.md')
    },
    {
      hidden: true // don't list about in the help menu
    }
  )

  // getting started shortcut
  commandTree.listen('/getting/started', ({ REPL }) => REPL.qexec('about'))
}
