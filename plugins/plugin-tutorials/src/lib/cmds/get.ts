/*
 * Copyright 2018 IBM Corporation
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
import { join } from 'path'

import { Commands, REPL, UI } from '@kui-shell/core'

import { entities, usage } from '../usage'
import { modes } from './modes'
import { projectHome as projectHomeDir, readProject } from './util'

const debug = Debug('tutorial get')
debug('loading')

import * as marked from 'marked'

// Include start button for modules with accompanying tutorials
const startButton = args => {
  // Create button that says 'Try a guided tutorial'
  const start = document.createElement('button')
  start.setAttribute('id', 'start')
  start.setAttribute('type', 'button')
  // Same styling as configure button
  start.className = 'bx--btn bx--btn--primary'
  // var text = document.createTextNode("Try a guided tutorial");
  // start.appendChild(text);
  start.innerText = 'Try a guided tutorial'
  const projectName = args[args.indexOf('get') + 1]

  const projectHome = projectHomeDir(projectName)

  // Set button action
  start.onclick = () => REPL.pexec(`tutorial use '${projectHome}/package.json'`)

  return start
}

/**
 * Create the wrapper DOM for our content
 *
 */
const enclosingContainer = () => {
  const container = document.createElement('div')
  container.className = 'project-config-container'

  return container
}

const setup = (args: string[]) => {
  const projectName = args[args.indexOf('get') + 1]
  const projectHome = projectHomeDir(projectName)

  UI.injectCSS(join(__dirname, '../../../web/css/main.css'))

  //    return checkIfAlreadyImported(projectHome, { failIf: 'not-exists' })
  return readProject(projectHome)
}

interface Paragraph {
  title: string
  text?: string
  content?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Render a paragraph with a left-side float-like icon
 *
 */
const paragraphWithIcon = ({ title, text, content }: Paragraph) => {
  const paragraph = document.createElement('div')
  paragraph.className = 'project-config-paragraph project-config-items'

  const titleDom = document.createElement('div')
  titleDom.className = 'config-item-title'
  titleDom.innerText = title
  paragraph.appendChild(titleDom)

  const introParagraph = document.createElement('div')
  if (text) {
    introParagraph.innerHTML = marked(text)
  } else if (content) {
    introParagraph.appendChild(content)
  }
  introParagraph.className = 'project-config-paragraph-text smaller-text'
  paragraph.appendChild(introParagraph)

  return paragraph
}

/**
 * Render one service dependence
 *
 */
const createServiceRow = dep => {
  const dom = document.createElement('p')
  const row = document.createElement('div')
  const icon = document.createElement('i')
  const text = document.createElement('span')

  row.className = 'flex-layout'
  row.appendChild(icon)
  row.appendChild(text)
  dom.appendChild(row)

  icon.className = 'fas fa-cloud'

  text.className = 'left-pad nowrap'
  text.innerText = dep.metadata.prettyName || dep.name // dep.attributes.find(({key}) => key === 'service').value;

  return dom
}

/**
 * Render all service dependences or module imports
 *
 */
const renderDeps = deps => {
  return deps.map(createServiceRow).reduce((container, row) => {
    container.appendChild(row)
    return container
  }, document.createElement('div'))
}

/**
 * Fetch some important module data
 *
 */
const fetchProjectData = () => info => {
  // const projectName = info.config.projectName

  // return Promise.all([ REPL.qexec(`tutorial deps "${projectName}"`),
  //                   REPL.qexec(`tutorial imports "${projectName}"`) ])
  // .then(([deps, imports]) => ({ info, deps, imports }));
  return { info, deps: [], imports: [] }
}

/**
 * module get command
 *
 */
const doGet = async ({ argvNoOptions }: Commands.Arguments): Promise<Commands.Response> => {
  debug(`tutorial get impl`)

  const args: string[] = argvNoOptions
  return setup(args)
    .then(fetchProjectData())
    .then(
      ({
        info: {
          config: { projectName, name = projectName, api, choices, tutorial },
          projectHome
        },
        deps,
        imports
      }) => {
        //
        // @param name is an optional prettier name from the project
        // config projectName is its shortname, e.g. the name of
        // the github project, which may have lexical
        // restrictions, making it less pretty
        //

        // renderStatusBadge(projectName);

        const content = enclosingContainer()

        const intro = document.createElement('div')
        intro.className = 'project-description'
        content.appendChild(intro)

        const introLeft = document.createElement('div')
        const introRight = document.createElement('div')
        introLeft.className = 'project-description-left'
        introRight.className = 'project-description-right'
        intro.appendChild(introLeft)
        intro.appendChild(introRight)

        /* intro.appendChild(paragraphWithIcon({ iconClass: 'fas fa-info',
        text: kindStrings[kind]
        })); */

        // Old Description Box
        /* introLeft.appendChild(paragraphWithIcon({
        title: 'Description',
        text: description
        })); */

        // Description Box
        const descriptionDom = document.createElement('div')
        descriptionDom.className = 'project-config-paragraph project-config-items'
        const titleDom = document.createElement('div')
        titleDom.className = 'config-item-title'
        titleDom.innerText = 'Description'
        descriptionDom.appendChild(titleDom)
        const text = document.createElement('div')
        text.innerText = `${tutorial.profile} \n\n Level: ${tutorial.level} \n Time: ${tutorial.time} \n Skills: ${tutorial.skills}`
        // text.className = 'project-config-paragraph-text smaller-text';
        descriptionDom.appendChild(text)
        introLeft.appendChild(descriptionDom)
        // End of Description Box

        if (deps.length > 0) {
          introRight.appendChild(
            paragraphWithIcon({
              title: 'Cloud Services',
              content: renderDeps(deps)
            })
          )
        }

        if (imports.length > 0) {
          introRight.appendChild(
            paragraphWithIcon({
              title: 'Module Imports',
              content: renderDeps(imports)
            })
          )
        }

        // Add start button to display if module has a tutorial
        if (tutorial) {
          const buttons = document.createElement('div')
          // same styling as configure buttons
          buttons.className = 'project-config-buttons'
          content.appendChild(buttons)
          buttons.appendChild(startButton(args))
        }

        // render the wskflow of the composition
        const wskflowContainer = document.createElement('div')
        wskflowContainer.className = 'project-config-wskflow-container'
        content.appendChild(wskflowContainer)

        // asynchronously render wskflow
        REPL.qexec(`preview "${projectHome}/composition.js"`, undefined, undefined, { container: wskflowContainer })

        return {
          type: 'custom',
          prettyType: entities,
          isEntity: true,
          prettyName: name,
          name: projectName,
          api,
          subtext: 'Learn more about what this module offers, and how it is constructed',
          content,
          modes: modes('get', api, choices)
        }
      }
    )
}

export default async (commandTree: Commands.Registrar) => {
  commandTree.listen(`/tutorial/get`, doGet, { usage: usage.get })
}
