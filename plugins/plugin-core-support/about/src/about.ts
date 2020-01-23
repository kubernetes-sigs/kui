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
  inBrowser,
  injectCSS,
  Mode,
  Presentation
} from '@kui-shell/core'
import { version } from '@kui-shell/client/config.d/version.json'
import { productName } from '@kui-shell/client/config.d/name.json'

import usage from './usage'

const clientStrings = i18n('client', 'about')
const debug = Debug('plugins/core-support/about')

/**
 * Produce a suitable markdown renderer that generates an HTML string
 *
 */
async function markdown(): Promise<(raw: string) => string> {
  const renderer = new marked.Renderer()

  renderer.link = (href: string, title: string, text: string) => {
    return `<a href="${href}" title="${title}" target="_blank" class="bx--link">${text}</a>`
  }

  return (raw: string) => marked(raw, { renderer })
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

async function renderTutorial(args: Arguments<Options>) {
  try {
    return args.REPL.qexec<HTMLElement>('tutorial play @tutorials/getting-started')
  } catch (err) {
    console.error(err)
    const empty = document.createElement('div')
    return empty
  }
}

interface Options extends ParsedOptions {
  mode: string
  contentFrom: string
  content: string
}

async function renderContentFromCommand(command: string, args: Arguments<Options>) {
  try {
    const response = await args.REPL.qexec<HTMLElement>(command, undefined, undefined, { render: true })
    debug('rendering content', command, response)

    const container = document.createElement('div')
    const innerContainer = document.createElement('div')
    container.classList.add('about-window-bottom-content')
    innerContainer.style.display = 'flex'
    innerContainer.style.flex = '1'
    response.style.flex = '1'
    container.appendChild(innerContainer)
    innerContainer.appendChild(response)
    return container
  } catch (err) {
    console.error(err)
    const empty = document.createElement('div')
    return empty
  }
}

async function renderMarkdownContent(content: string) {
  try {
    const marked = await markdown()
    const wrapper = document.createElement('div')
    wrapper.classList.add('page-content')
    wrapper.innerHTML = marked(content)
    return wrapper
  } catch (err) {
    console.error(err)
    const empty = document.createElement('div')
    return empty
  }
}

/**
 * find command to execute from the command option, or the given `Mode`
 *
 */
function findCommand(mode: Mode, args?: Arguments<Options>) {
  return (args && args.parsedOptions.contentFrom) || (mode as { contentFrom?: string }).contentFrom
}

/**
 * find content to render from the command option, or the given ` Mode`
 *
 */
function findContent(mode: Mode, args?: Arguments<Options>) {
  return (args && args.parsedOptions.content) || (mode as { content?: string }).content
}

/**
 * The repl allows plugins to provide their own window, via the
 * `bringYourOwnWindow` attribute. Here, we define our
 * bringYourOwnWindow behavior, for the `about` command.
 *
 */
const aboutWindow = async (args: Arguments<Options>): Promise<KResponse> => {
  debug('aboutWindow')

  injectCSS({
    css: require('@kui-shell/plugin-core-support/web/css/about.css'),
    key: 'about-window-css'
  })

  const name =
    productName ||
    (!inBrowser() &&
      (await import(/* webpackChunkName: "electron" */ /* webpackMode: "lazy" */ './electron-helpers')).getAppName())

  // this is the main container for the dom
  const contentDom = document.createElement('div')
  contentDom.classList.add('about-window')

  const modesFromAbout: Mode[] = await import('@kui-shell/client/config.d/about.json').then(_ => _.modes)

  const modeCurrent =
    modesFromAbout.find(_ => _.mode === args.parsedOptions.mode) ||
    modesFromAbout.find(_ => _.defaultMode) ||
    modesFromAbout[0]

  const command = findCommand(modeCurrent, args)
  const content = clientStrings(findContent(modeCurrent, args))

  if (command) {
    if (command === 'about --mode version') {
      contentDom.appendChild(renderVersion(name))
    } else if (command === 'about --mode tutorial') {
      contentDom.appendChild(await renderTutorial(args))
    } else {
      contentDom.appendChild(await renderContentFromCommand(command, args))
    }
  } else {
    contentDom.appendChild(await renderMarkdownContent(content))
  }

  const modes = modesFromAbout.map(
    (modeFromAbout): Mode => {
      const mode = modeFromAbout.mode
      const content = findContent(modeFromAbout)
      const contentFrom = findCommand(modeFromAbout)
      const label = clientStrings(modeFromAbout.label || modeFromAbout.mode)

      return {
        mode,
        label,
        contentFrom: contentFrom
          ? `about --mode ${mode} --contentFrom "${contentFrom}"`
          : `about --mode ${mode} --content "${content}"`
      }
    }
  )

  modes.find(_ => _.mode === modeCurrent.mode).defaultMode = true

  return {
    type: 'custom',
    prettyType: 'about',
    presentation:
      (document.body.classList.contains('subwindow') && Presentation.SidecarFullscreen) || Presentation.SidecarThin,
    modes,
    metadata: {
      name
    },
    content: contentDom
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
  commandTree.listen('/getting/started', ({ REPL }) => REPL.qexec('about --mode tutorial'), {
    needsUI: true,
    inBrowserOk: true
  })
}
