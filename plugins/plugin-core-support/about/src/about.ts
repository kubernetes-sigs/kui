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

import {
  Arguments,
  Capabilities,
  ParsedOptions,
  Registrar,
  i18n,
  MultiModalMode as Mode,
  NavResponse,
  isNavResponse,
  isLink,
  isPopup,
  Table,
  isStringWithOptionalContentType
} from '@kui-shell/core'

import usage from './usage'

const clientStrings = i18n('client', 'about')

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

// check if about's apiVersion and kind suffices NavResponse
const checkApiVersionAndKind = (apiVersion: string, kind: string) => {
  if (!isNavResponse({ apiVersion, kind })) {
    console.error('error in about.json:', apiVersion, kind)
    throw new Error('apiVersion or kind in about.json is not supported')
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

/**
 * Here, we consult the client/config.d/about.json model.
 *
 * @return a `NavResponse`
 *
 */
const getAbout = (): Promise<NavResponse> => {
  return import('@kui-shell/client/config.d/about.json').then(async _ => {
    const _apiVersion = _['apiVersion']
    const _kind = _['kind']

    // Check apiVersion and kind for users. It's ok if users don't specify them.
    if (_apiVersion !== undefined || _kind !== undefined) {
      checkApiVersionAndKind(_apiVersion, _kind)
    }

    const response: NavResponse = {
      apiVersion: _apiVersion || 'kui-shell/v1',
      kind: _kind || 'NavResponse',
      breadcrumbs: [{ label: await getName() }],
      menus: _.menus.slice(0),
      links: _['links'] || []
    }
    return response
  })
}

// translate the labels of modes
const translateModesLabel = (modesFromAbout: Mode[]) => {
  return modesFromAbout.map(
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
}

const aboutWindow = async (): Promise<NavResponse> => {
  const { apiVersion, breadcrumbs, kind, menus, links } = await getAbout()

  // translate the label of sidecar modes under each menu
  menus.forEach(menu => {
    menu.label = clientStrings(menu.label)
    menu.items = translateModesLabel(menu.items)
  })

  // translate the label of each navlink
  links.forEach(link => {
    if (isLink(link)) {
      link.label = clientStrings(link.label)
    } else {
      console.error('error in about.json', link)
      throw new Error('links in about.json is not supported')
    }
  })

  return {
    apiVersion,
    breadcrumbs,
    kind,
    menus,
    links
  }
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

  if (Capabilities.inElectron() && parsedOptions.full) {
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
    { usage: usage.version }
  )

  /**
   * Open a graphical window displaying more detail about the tool
   *
   */
  commandTree.listen(
    '/about',
    ({ REPL }) =>
      isPopup() ? REPL.qexec('replay --new-window /kui/welcome.md') : REPL.qexec('replay /kui/welcome.md'),
    {
      hidden: true // don't list about in the help menu
    }
  )

  // getting started shortcut
  commandTree.listen('/getting/started', ({ REPL }) => REPL.qexec('about'))
}
