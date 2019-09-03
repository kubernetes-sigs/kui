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

import * as Debug from 'debug'

import * as repl from '@kui-shell/core/core/repl'
import { renderResult } from '@kui-shell/core/webapp/cli'
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import Presentation from '@kui-shell/core/webapp/views/presentation'
import { CommandRegistrar, EvaluatorArgs } from '@kui-shell/core/models/command'

import usage from './usage'
import * as i18n from '@kui-shell/core/util/i18n'
import { homepage, license, version } from '@kui-shell/settings/package.json'
import { theme as settings, config as extras } from '@kui-shell/core/core/settings'

const strings = i18n.default('plugin-core-support')

const debug = Debug('plugins/core-support/about')

/**
 * Produce a suitable markdown renderer that generates an HTML string
 *
 */
async function markdown(): Promise<(raw: string) => string> {
  const marked = await import('marked')
  const renderer = new marked.Renderer()

  renderer.link = (href: string, title: string, text: string) => {
    return `<a href="${href}" title="${title}" class="bx--link">${text}</a>`
  }

  return (raw: string) => marked(raw, { renderer })
}

async function renderAbout() {
  const { shell } = await import('electron')

  const flexContent = document.createElement('div')
  flexContent.classList.add('page-content')

  const topContent = document.createElement('div')
  topContent.classList.add('about-window-top-content')
  flexContent.appendChild(topContent)

  const badges = []

  const openHome = () => shell.openExternal(settings.ogUrl || homepage)

  if (license) {
    badges.push(license)
  }

  // const subtext = settings.byline || description
  /* subtext.appendChild(document.createTextNode('Distributed under an '))
  const licenseDom = document.createElement('strong')
  licenseDom.innerText = license
  subtext.appendChild(licenseDom)
  subtext.appendChild(document.createTextNode(' license')) */

  const logo = document.createElement('div')
  topContent.appendChild(logo)
  logo.classList.add('logo')

  const aboutImage = settings.wideIcon || settings.largeIcon
  if (aboutImage) {
    const iconP = document.createElement('div')
    const icon = document.createElement('img')
    icon.addEventListener('click', openHome)
    icon.classList.add('clickable')
    iconP.appendChild(icon)
    logo.appendChild(iconP)
    icon.src = aboutImage
    icon.alt = settings.productName
    if (settings.wideIcon) {
      icon.classList.add('kui--wide-icon')
    }
  }

  const description = settings.description || settings.ogDescription
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
      longDescription.innerHTML = marked(i18n.fromMap(description))
    }
  }

  return flexContent
}

function renderVersion(name: string) {
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
  versionModel['build'] = extras['build-info']

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

async function renderGettingStarted() {
  if (settings.gettingStarted && typeof settings.gettingStarted !== 'string') {
    const marked = await markdown()
    const wrapper = document.createElement('div')
    wrapper.classList.add('page-content')
    wrapper.innerHTML = marked(i18n.fromMap(settings.gettingStarted))
    return wrapper
  } else if (typeof settings.gettingStarted === 'string' && settings.gettingStarted !== 'getting started') {
    return repl.qexec(settings.gettingStarted)
  } else {
    console.error('no getting started content defined by client')
    const empty = document.createElement('div')
    return empty
  }
}

/**
 * The repl allows plugins to provide their own window, via the
 * `bringYourOwnWindow` attribute. Here, we define our
 * bringYourOwnWindow behavior, for the `about` command.
 *
 */
const aboutWindow = async ({ tab, execOptions, parsedOptions }: EvaluatorArgs) => {
  /* bringYourOwnWindow impl */
  debug('aboutWindow')

  try {
    injectCSS({
      css: require('@kui-shell/plugin-core-support/web/css/about.css'),
      key: 'about-window-css'
    })
  } catch (err) {
    const { dirname, join } = await import('path')
    const ourRootDir = dirname(require.resolve('@kui-shell/plugin-core-support/package.json'))
    injectCSS(join(ourRootDir, 'web/css/about.css'))
  }

  const name = settings.productName || (await import('electron')).app.getName()

  // this is the main container for the dom
  const content = document.createElement('div')
  content.classList.add('about-window')

  const defaultMode = parsedOptions.mode || 'about'
  debug('defaultMode', defaultMode)

  if (parsedOptions.content) {
    const response = await repl.qexec(parsedOptions.content)
    debug('rendering content', parsedOptions.content, response)

    const container = document.createElement('div')
    const innerContainer = document.createElement('div')
    container.classList.add('about-window-bottom-content')
    innerContainer.style.display = 'flex'
    innerContainer.style.flex = '1'
    container.appendChild(innerContainer)

    if (await renderResult(response, tab, execOptions, parsedOptions, innerContainer, false, true)) {
      content.appendChild(container)
    }
  } else if (defaultMode === 'gettingStarted') {
    content.appendChild(await renderGettingStarted())
  } else if (defaultMode === 'version') {
    content.appendChild(await renderVersion(name))
  } else if (defaultMode === 'about') {
    content.appendChild(await renderAbout())
  }

  const standardModes: SidecarMode[] = [
    { mode: 'about', label: strings('About'), direct: 'about' },
    {
      mode: 'gettingStarted',
      label: strings('Getting Started'),
      direct: 'about --mode gettingStarted'
    },
    { mode: 'configure', label: strings('Configure'), direct: 'about --mode configure --content themes' },
    { mode: 'version', label: strings('Version'), direct: 'about --mode version' }
  ]
  const modes: SidecarMode[] = standardModes.concat(settings.about || [])

  modes.find(_ => _.mode === defaultMode).defaultMode = true

  return {
    type: 'custom',
    isEntity: true,
    prettyType: 'about',
    presentation:
      (document.body.classList.contains('subwindow') && Presentation.SidecarFullscreen) || Presentation.SidecarThin,
    modes,
    name,
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
  if (extras['build-info']) {
    return `${version} (build ${extras['build-info']})`
  }
  return version
}

/**
 * Here we install the command handlers for /version and /about
 *
 */
export default (commandTree: CommandRegistrar) => {
  debug('init')

  // for menu
  if (!commandTree) {
    return aboutWindow({} as EvaluatorArgs)
  }

  // these commands don't require any auth
  const noAuthOk = true

  /**
   * Print out the current version of the tool, as text
   *
   */
  commandTree.listen(
    '/version', // the command path
    reportVersion, // the command handler
    { noAuthOk, usage: usage.version }
  )

  /**
   * Open a graphical window displaying more detail about the tool
   *
   */
  commandTree.listen('/about', aboutWindow, {
    hidden: true, // don't list about in the help menu
    needsUI: true, // about requires a window
    inBrowserOk: true,
    noAuthOk // about doesn't require openwhisk authentication
  })

  // getting started shortcut
  commandTree.listen('/getting/started', () => repl.qexec('about --mode gettingStarted'), {
    noAuthOk,
    needsUI: true,
    inBrowserOk: true
  })
}

export const preload = () => {
  // install click handlers
  ;(document.querySelector('#help-button') as HTMLElement).onclick = () => repl.pexec('about')
}
