/*
 * Copyright 2017-2018 IBM Corporation
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
import * as marked from 'marked'

import {
  Arguments,
  KResponse,
  ParsedOptions,
  Registrar,
  i18n,
  i18nFromMap,
  theme,
  config,
  inBrowser,
  injectCSS,
  Mode,
  Presentation
} from '@kui-shell/core'
import { version } from '@kui-shell/settings/package.json'

import usage from './usage'

const strings = i18n('plugin-core-support')
const debug = Debug('plugins/core-support/about')

/**
 * Produce a suitable markdown renderer that generates an HTML string
 *
 */
async function markdown(): Promise<(raw: string) => string> {
  const renderer = new marked.Renderer()

  renderer.link = (href: string, title: string, text: string) => {
    return `<a href="${href}" title="${title}" class="bx--link">${text}</a>`
  }

  return (raw: string) => marked(raw, { renderer })
}

async function renderAbout() {
  const flexContent = document.createElement('div')
  flexContent.classList.add('page-content')

  const topContent = document.createElement('div')
  topContent.classList.add('about-window-top-content')
  flexContent.appendChild(topContent)

  const badges = []

  // intentionally require, to handle optionals
  const { homepage, license } = require('@kui-shell/settings/package.json')

  const home = theme.ogUrl || homepage
  const openHome = async () =>
    inBrowser()
      ? window.open(home)
      : (await import(/* webpackChunkName: "electron" */ /* webpackMode: "lazy" */ './electron-helpers')).openExternal(
          home
        )

  if (license) {
    badges.push(license)
  }

  // const subtext = theme.byline || description
  /* subtext.appendChild(document.createTextNode('Distributed under an '))
  const licenseDom = document.createElement('strong')
  licenseDom.innerText = license
  subtext.appendChild(licenseDom)
  subtext.appendChild(document.createTextNode(' license')) */

  const logo = document.createElement('div')
  topContent.appendChild(logo)
  logo.classList.add('logo')

  const aboutImage = theme.wideIcon || theme.largeIcon
  if (aboutImage) {
    const iconP = document.createElement('div')
    const icon = document.createElement('img')
    icon.addEventListener('click', openHome)
    icon.classList.add('clickable')
    iconP.appendChild(icon)
    logo.appendChild(iconP)
    icon.src = aboutImage
    icon.alt = theme.productName
    if (theme.wideIcon) {
      icon.classList.add('kui--wide-icon')
    }
  }

  const description = theme.description || theme.ogDescription
  if (description) {
    const marked = await markdown()
    const longDescription = document.createElement('div')
    longDescription.classList.add('about-window-long-description')
    logo.appendChild(longDescription)

    if (typeof description === 'string') {
      try {
        longDescription.innerHTML = marked(description)
      } catch (err) {
        console.error('error rendering markdown', err)
        longDescription.innerText = description
      }
    } else {
      longDescription.innerHTML = marked(i18nFromMap(description))
    }
  }

  return flexContent
}

function renderVersion(name: string) {
  // intentionally require, to handle optionals
  const { version } = require('@kui-shell/settings/package.json')

  const bottomContent = document.createElement('div')
  bottomContent.classList.add('about-window-bottom-content')

  const table = document.createElement('table')
  table.classList.add('bx--data-table')
  table.classList.add('result-table')
  table.classList.add('versions')
  table.setAttribute('kui-table-style', 'Medium')
  bottomContent.appendChild(table)

  const versionModel = process.versions
  versionModel[name] = version
  versionModel['build'] = config['build-info']

  const thead = document.createElement('thead')
  thead.classList.add('entity')
  table.appendChild(thead)
  const headerRow = document.createElement('tr')
  thead.appendChild(headerRow)
  headerRow.className = 'header-row entity-attributes'
  const column1 = document.createElement('th')
  const column1Text = document.createElement('span')
  column1Text.classList.add('cell-inner')
  column1Text.classList.add('bx--table-header-label')
  column1.appendChild(column1Text)
  headerRow.appendChild(column1)
  column1Text.innerText = 'component'
  column1.className = 'header-cell'
  const column2 = document.createElement('th')
  const column2Text = document.createElement('span')
  column2Text.classList.add('cell-inner')
  column2Text.classList.add('bx--table-header-label')
  column2.appendChild(column2Text)
  headerRow.appendChild(column2)
  column2Text.innerText = 'version'
  column2.className = 'header-cell'

  // table body
  const tbody = document.createElement('tbody')
  tbody.classList.add('entity')
  table.appendChild(tbody)
  for (const component of [name, 'build', 'electron', 'chrome', 'node', 'v8']) {
    const version = versionModel[component]

    if (version !== undefined) {
      const row = document.createElement('tr')
      row.classList.add('entity-attributes')
      tbody.appendChild(row)

      const nameCell = row.insertCell(-1)
      const nameCellText = document.createElement('span')
      nameCell.appendChild(nameCellText)
      nameCellText.classList.add('cell-inner')
      nameCellText.innerText = component

      const versionCell = row.insertCell(-1)
      const versionCellText = document.createElement('span')
      versionCell.appendChild(versionCellText)
      versionCellText.classList.add('cell-inner')
      versionCellText.innerText = versionModel[component]
      row.appendChild(versionCell)

      if (component === name) {
        nameCell.classList.add('semi-bold')
        nameCell.classList.add('cyan-text')
        versionCell.classList.add('semi-bold')
        versionCell.classList.add('cyan-text')
      } else {
        nameCell.classList.add('lighter-text')
      }
    }
  }

  return bottomContent
}

async function renderGettingStarted({ REPL }: Arguments) {
  if (theme.gettingStarted && typeof theme.gettingStarted !== 'string') {
    const marked = await markdown()
    const wrapper = document.createElement('div')
    wrapper.classList.add('page-content')
    wrapper.innerHTML = marked(i18nFromMap(theme.gettingStarted))
    return wrapper
  } else if (typeof theme.gettingStarted === 'string' && theme.gettingStarted !== 'getting started') {
    return REPL.qexec<HTMLElement>(theme.gettingStarted)
  } else {
    console.error('no getting started content defined by client')
    const empty = document.createElement('div')
    return empty
  }
}

interface Options extends ParsedOptions {
  mode: string
  content: string
}

/**
 * The repl allows plugins to provide their own window, via the
 * `bringYourOwnWindow` attribute. Here, we define our
 * bringYourOwnWindow behavior, for the `about` command.
 *
 */
const aboutWindow = async (args: Arguments<Options>): Promise<KResponse> => {
  debug('aboutWindow')

  const { parsedOptions, REPL } = args

  injectCSS({
    css: require('@kui-shell/plugin-core-support/web/css/about.css'),
    key: 'about-window-css'
  })

  const name =
    theme.productName ||
    (!inBrowser() &&
      (await import(/* webpackChunkName: "electron" */ /* webpackMode: "lazy" */ './electron-helpers')).getAppName())

  // this is the main container for the dom
  const content = document.createElement('div')
  content.classList.add('about-window')

  const defaultMode = parsedOptions.mode || 'about'
  debug('defaultMode', defaultMode)

  if (parsedOptions.content) {
    const response = await REPL.qexec<HTMLElement>(parsedOptions.content, undefined, undefined, { render: true })
    debug('rendering content', parsedOptions.content, response)

    const container = document.createElement('div')
    const innerContainer = document.createElement('div')
    container.classList.add('about-window-bottom-content')
    innerContainer.style.display = 'flex'
    innerContainer.style.flex = '1'
    response.style.flex = '1'
    container.appendChild(innerContainer)
    innerContainer.appendChild(response)
    content.appendChild(container)
  } else if (defaultMode === 'gettingStarted') {
    content.appendChild(await renderGettingStarted(args))
  } else if (defaultMode === 'version') {
    content.appendChild(await renderVersion(name))
  } else if (defaultMode === 'about') {
    content.appendChild(await renderAbout())
  }

  const standardModes: Mode[] = [
    { mode: 'about', label: strings('About'), contentFrom: 'about' },
    {
      mode: 'gettingStarted',
      label: strings('Getting Started'),
      contentFrom: 'about --mode gettingStarted'
    },
    {
      mode: 'configure',
      label: strings('Configure'),
      contentFrom: 'about --mode configure --content themes'
    },
    { mode: 'version', label: strings('Version'), contentFrom: 'about --mode version' }
  ]
  const modes: Mode[] = standardModes.concat(theme.about || [])

  modes.find(_ => _.mode === defaultMode).defaultMode = true

  return {
    type: 'custom',
    prettyType: 'about',
    presentation:
      (document.body.classList.contains('subwindow') && Presentation.SidecarFullscreen) || Presentation.SidecarThin,
    modes,
    metadata: {
      name
    },
    // badges,
    // version,
    content
  }
}

/**
 * Return, textually, the current version of the tool
 *
 */
const getVersion = () => {
  debug('getVersion')
  return version
}

/**
 * Report the current version, and availability of updates
 *    For headless, return a textual concatenation of the two.
 */
const reportVersion = () => {
  debug('reportVersion')

  const version = getVersion()

  // we were asked only to report the installed version
  if (config['build-info']) {
    return `${version} (build ${config['build-info']})`
  }
  return version
}

/**
 * Here we install the command handlers for /version and /about
 *
 */
export default (commandTree: Registrar) => {
  debug('init')

  // for menu
  if (!commandTree) {
    return aboutWindow({} as Arguments<Options>)
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
  commandTree.listen('/about', aboutWindow, {
    hidden: true, // don't list about in the help menu
    needsUI: true, // about requires a window
    inBrowserOk: true
  })

  // getting started shortcut
  commandTree.listen('/getting/started', ({ REPL }) => REPL.qexec('about --mode gettingStarted'), {
    needsUI: true,
    inBrowserOk: true
  })
}
