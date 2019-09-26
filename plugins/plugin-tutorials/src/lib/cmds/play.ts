/*
 * Copyright 2018-19 IBM Corporation
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
import { dirname, join } from 'path'

import { readProject, TutorialDefinition, TutorialTable } from './util'
import { wskflowCycle } from './wskflow'

import {
  clearSelection,
  isFullscreen as isSidecarFullscreen,
  hide as hideSidecar,
  show as showSidecar,
  toggleMaximization
} from '@kui-shell/core/webapp/views/sidecar'
import { Commands, REPL, UI, Util } from '@kui-shell/core'

const debug = Debug('plugins/tutorials/play')

/** highlight.js global */
declare const hljs

// markdown to html note how we override the link rendering to add our
// bx-link css class; it'd be nice if this were cleaner, but that's
// marked, as far as i can tell
import * as Marked from 'marked'
const renderer = new Marked.Renderer()
renderer.link = (href: string, title: string, text: string) => {
  return `<a class='bx--link' href='${href}'` + (title ? ' title="' + title + '"' : '') + `}>${text}</a>`
}
const marked = _ => Marked(_, { renderer })

// TODO eliminate this jquery dependence
let $
try {
  $ = require('jquery')
} catch (err) {
  debug('not loading jquery in headless mode ')
}

interface TutorialPane extends HTMLDivElement {
  cancellables: (() => void)[]
}

/**
 * Row filters for tables
 *
 */
const rowFilters = {
  auth: () => {
    return true
  },
  'no-auth': () => {
    return true
  }
}

/**
 * Inject our CSS
 *
 */
const injectOurCSS = () => {
  try {
    // webpack style
    UI.injectCSS({
      css: require('@kui-shell/plugin-tutorials/web/css/main.css').toString(),
      key: 'tutorial.main'
    })
    UI.injectCSS({
      css: require('@kui-shell/plugin-tutorials/web/css/tutorials.css'),
      key: 'tutorial.tutorials'
    })
  } catch {
    // local file style
    const ourRoot = dirname(require.resolve('@kui-shell/plugin-tutorials/package.json'))
    UI.injectCSS(join(ourRoot, 'web/css/main.css'))
    UI.injectCSS(join(ourRoot, 'web/css/tutorials.css'))
  }
}

/**
 * Inject our HTML content
 *
 */
const injectHTML = () => {
  let loader

  try {
    loader = Promise.resolve(require('@kui-shell/plugin-tutorials/web/html/index.html').default)
    debug('webpack html inject')
  } catch {
    const ourRoot = dirname(require.resolve('@kui-shell/plugin-tutorials/package.json'))
    loader = UI.loadHTML(join(ourRoot, 'web/html/index.html'))
    debug('local file html inject')
  }

  return loader.then(html => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    document.querySelector('body .page .main .tab-container').appendChild(wrapper.children[0])
  })
}

/**
 * Cancel any background tasks associated with the tutorial obj
 *
 */
const cancelAsyncs = obj => {
  if (obj.cancellables) {
    debug('processing cancellables', obj.cancellables)
    obj.cancellables.forEach(cancel => cancel())
  }
  obj.cancellables = []
}

/** Sidecar management. TODO extract this */
const sidecarManager = {
  enterFullscreen: (tab: UI.Tab) => {
    showSidecar(tab)
    toggleMaximization(tab)
  },

  exitFullscreen: (tab: UI.Tab) => {
    clearSelection(tab)
    toggleMaximization(tab)
  }
}

/**
 * Remove any existing highlights
 *
 */
const clearHighlights = () => {
  const elements = document.querySelectorAll('.lightbox')
  for (let idx = 0; idx < elements.length; idx++) {
    elements[idx].classList.remove('lightbox')
    elements[idx].classList.remove('lightbox-visible')
  }
}

/**
 * Close the current tutorial
 *
 */
const close = (tab: UI.Tab, pane: TutorialPane, obj: TutorialDefinition, delay = 500) => () =>
  new Promise<boolean>(resolve => {
    debug('close')

    // cancel any background tasks
    cancelAsyncs(pane)

    // if we were resopnsible for having the sidecar fullscreen, remove that
    if (pane.hasAttribute('remember-to-remove-sidecar-fullscreen')) {
      pane.removeAttribute('remember-to-remove-sidecar-fullscreen')
      sidecarManager.exitFullscreen(tab)
    }

    // remove pane
    pane.classList.remove('visible')
    setTimeout(() => pane.parentNode.removeChild(pane), delay)
    document.querySelector('body').classList.remove('tutorial-in-progress')
    clearHighlights()
    // $(window).unbind("resize", resizeHandler);

    // allow for the close transition to do its magic
    if (delay === 0) {
      // $(pane).remove();
      resolve(true)
    } else {
      setTimeout(() => {
        // $(pane).remove();
        resolve(true)
      }, delay)
    }

    // make sure the repl has focus when we're done
    UI.getCurrentPrompt().focus()
  })

/**
 * If a tutorial step specifies to highlight a region, this method
 * will help in positioning the highlight overlay.
 *
 */
const setHighlightPosition = ({ selector }) => {
  const element = document.querySelector(selector)
  if (!element) {
    console.error('highlight element not found')
  } else {
    element.classList.add('lightbox')
    setTimeout(() => element.classList.add('lightbox-visible'), 0)
    document.addEventListener('click', clearHighlights, true) /* true means invoke at most once */
  }
}

/**
 * Execute a command, handling the fullscreen toggle
 *
 */
const commandFromFullscreen = (pane: TutorialPane, command: string, display = command, nested = false) => () => {
  const go = () => {
    REPL.pexec(command)

    if (command.startsWith('preview')) {
      // start a cycle of hover effects
      const cancellable = setTimeout(() => wskflowCycle(pane), 2000)
      pane.cancellables.push(() => clearTimeout(cancellable))
    }
  }

  if (nested) {
    go()
    return
  }

  if (pane.hasAttribute('tutorial-is-fullscreen')) {
    pane.setAttribute('tutorial-was-fullscreen', '1')
    pane.removeAttribute('tutorial-is-fullscreen')
    document.body.classList.remove('tutorial-is-fullscreen')
  } else if (pane.hasAttribute('tutorial-was-fullscreen')) {
    pane.setAttribute(
      'tutorial-was-fullscreen',
      (1 + parseInt(pane.getAttribute('tutorial-was-fullscreen'), 10)).toString()
    )
  }

  // switch to minimized mode, unless this is a tutorial play
  // command; in that case, there's no sense in switching to
  // minimize mode, as we'll just immediately switch back to the
  // primary view mode, and it'll look weird
  if (!(command.startsWith('play') || command.startsWith('tutorial play'))) {
    pane.classList.add('minimized')
    pane.querySelector(
      '.tutorial-minimized-message'
    ).innerHTML = `Tutorial paused while we execute the command <span class='monospace bx--link clickable clickable-blatant' onclick='repl.pexec("${command}"})'>${display}</span>.`
  } else if (pane.hasAttribute('tutorial-was-fullscreen')) {
    // if we are in fullscreen mode, and this isn't a tutorial
    // play command, then wait a bit, to give time for the
    // fullscreen-to-minimize transition to finish
    setTimeout(go, 1000)
    return
  }

  // otherwise, start right away
  go()
} /* commandFromFullscreen */

/**
 * Render a table as a structured list
 *
 * @param parent the parent DOM
 * @param pane the top-level tutorial pane
 * @param table the model
 *
 */
const renderOneTable = (parent: Element, pane: TutorialPane, nested = false) => table => {
  const template = document.querySelector('#tutorial-structured-list-template')
  const tableDom = template.cloneNode(true) as HTMLElement
  const tableBody = tableDom.querySelector('.bx--structured-list-tbody')
  parent.appendChild(tableDom)

  tableDom.classList.remove('tutorial-template')
  tableDom.removeAttribute('id')

  const titleDom = tableDom.querySelector('.tutorial-content-extras-title') as HTMLElement
  if (table.title) {
    titleDom.innerText = table.title
    titleDom.classList.remove('hidden')
  } else {
    titleDom.classList.add('hidden')
  }

  // FIXME not parent!
  parent.classList.add('visible')

  // column headers
  if (table.columns) {
    const headerRow = tableDom.querySelector('.bx--structured-list-row.bx--structured-list-row--header-row')
    // UI.empty(headerRow);
    table.columns.forEach(column => {
      const headerDom = document.createElement('th')
      headerDom.classList.add('bx--structured-list-th')
      headerDom.innerText = column
      headerRow.appendChild(headerDom)
    })
  }

  // rows
  if (table.rows) {
    table.rows
      .filter(row => !row[0].when || rowFilters[row[0].when]())
      .forEach(row => {
        const rowDom = document.createElement('tr')
        rowDom.className = 'bx--structured-list-row'
        tableBody.appendChild(rowDom)

        row.forEach((cell, idx) => {
          const value = typeof cell === 'string' ? cell : cell.value
          const onclick =
            cell.onclick || (cell.command && commandFromFullscreen(pane, cell.command, cell.display, nested))

          debug('cell', value)
          const cellDom = document.createElement('td')
          cellDom.classList.add('bx--structured-list-td')

          const cellDomClickable = document.createElement('div')
          cellDomClickable.innerHTML = idx === 1 ? marked(value) : value
          cellDom.appendChild(cellDomClickable)
          if (onclick) {
            cellDomClickable.className = 'tutorial-content-command clickable clickable-blatant bx--link'
            cellDomClickable.setAttribute('data-command', cell.value)
            cellDom.onclick = onclick
          }

          // TODO generalize this
          if (idx === 0) {
            cellDom.classList.add('bx--structured-list-content--nowrap')
            cellDomClickable.classList.add('monospace')
          }

          rowDom.appendChild(cellDom)
        })
      })
  }
} /* renderOneTable */

/**
 * Handle transitions between steps
 *
 */
const transitionSteps = (tab: UI.Tab, stepNum: number, obj: TutorialDefinition, pane: TutorialPane, nested = false) => {
  debug('step', stepNum, obj)

  // cancel any background tasks
  cancelAsyncs(pane)

  // extract the fields of the step model
  const {
    heading,
    content,
    transition,
    input,
    extras,
    fontawesome,
    highlight,
    autocomplete,
    execute,
    preview,
    sidecar
  } = obj.steps[stepNum]

  // heading text
  const headingDom = pane.querySelector('.tutorial-heading') as HTMLElement
  if (headingDom) {
    headingDom.innerText = heading
  }

  // render the description
  const paragraphs = pane.querySelector('.tutorial-content .tutorial-paragraphs')
  if (paragraphs) {
    paragraphs.innerHTML = marked(content)
  }

  const fontGraphics = pane.querySelector('.tutorial-font-graphics')
  if (fontGraphics) {
    UI.empty(fontGraphics)
    if (fontawesome) {
      // add a font graphic
      debug('fontawesome', fontawesome)
      const graphics = document.createElement('i')
      graphics.className = fontawesome
      fontGraphics.appendChild(graphics)
      fontGraphics.classList.add('visible')
    } else {
      fontGraphics.classList.remove('visible')
    }
  }

  // rendering hints from the step
  pane.removeAttribute('data-rendering-hints')
  if (obj.steps[stepNum].renderingHints) {
    pane.setAttribute('data-rendering-hints', obj.steps[stepNum].renderingHints)
  }

  // full-width sidecar?
  if (sidecar === 'fullscreen') {
    if (!isSidecarFullscreen(tab)) {
      pane.setAttribute('remember-to-remove-sidecar-fullscreen', true.toString())
    }

    sidecarManager.enterFullscreen(tab)
  }

  // render the extras
  const extrasPart = pane.querySelector('.tutorial-content-extras')

  /* const previousExtras = extrasPart.querySelectorAll('.tutorial-content-extras-body');
    for (let idx = 0; idx < previousExtras.length; idx++) {
    UI.empty(previousExtras[idx]);
    } */

  // UI.empty(extrasPart);
  const learnMore = pane.querySelector('.tutorial-learn-more')
  if (learnMore) {
    learnMore.classList.remove('has-learn-more')
    if (!extras) {
      pane.classList.add('tutorial-no-extras')
    } else {
      debug('extras', extras)
      pane.classList.remove('tutorial-no-extras')

      //
      // learn more
      //
      if (extras.learnMore) {
        const titleDom = learnMore.querySelector('.tutorial-content-extras-title') as HTMLElement
        titleDom.innerText = extras.learnMore.title || 'Notes'
        learnMore.classList.add('has-learn-more')
        learnMore.querySelector('.tutorial-learn-more-content').innerHTML = marked(extras.learnMore.doc)
      }

      //
      // code
      //
      const codeContainer = pane.querySelector('.tutorial-code-snippet')
      if (codeContainer) {
        if (!extras.code) {
          codeContainer.classList.remove('has-code')
        } else {
          codeContainer.classList.add('has-code')
          const codePart = codeContainer.querySelector('code')
          codePart.className = `language-${extras.code.language}`
          codePart.innerText = extras.code.body
          // setTimeout(() => hljs.highlightBlock(codePart), 100)
          hljs.highlightBlock(codePart)
        }
      }

      let table = extras.table as TutorialTable
      const nextSteps = extras.nextSteps || extras.alternate
      if (nextSteps) {
        table = {
          title: extras.alternate ? 'Alternate Adventures' : 'Next Steps',
          columns: ['Command', 'Description'],
          rows: nextSteps
            .filter(_ => !_.hidden)
            .map(({ command, display = command, doc, when }) => [
              {
                value: display,
                when,
                onclick: commandFromFullscreen(pane, command, display, nested)
              },
              doc
            ])
        }
      }

      // remove any previous tables
      const tables = extrasPart.querySelectorAll('.tutorial-content-extras-as-structured-list:not(.tutorial-template)')
      for (let idx = 0; idx < tables.length; idx++) {
        tables[idx].parentNode.removeChild(tables[idx])
      }

      if (!table) {
        extrasPart.classList.remove('visible')
      } else {
        // ok, then the page model specifies one or more tables
        if (Array.isArray(table)) {
          table.forEach(renderOneTable(extrasPart, pane, nested))
        } else {
          renderOneTable(extrasPart, pane, nested)(table)
        }
      }

      if (extras.showcase) {
        const container = pane.querySelector('.tutorial-bottom')
        UI.empty(container)

        pane.setAttribute('tutorial-has-showcase', 'tutorial-has-showcase')

        extras.showcase.forEach(({ title, command, display = command, description, image, groupWith }) => {
          const element = document.createElement('div')
          element.className = 'tutorial-showcase-element'

          if (command) {
            element.onclick = commandFromFullscreen(pane, command, display, nested)
          }

          const imagePart = document.createElement('img')
          imagePart.className = 'clickable'
          imagePart.setAttribute('src', image)
          element.appendChild(imagePart)

          const overlayPart = document.createElement('div')
          const titlePart = document.createElement('h2')
          const descriptionPart = document.createElement('div')
          overlayPart.className = 'tutorial-showcase-element-overlay bx--tile'
          titlePart.className = 'tutorial-showcase-element-overlay-title'
          descriptionPart.className = 'tutorial-showcase-element-overlay-description smaller-text'
          overlayPart.appendChild(titlePart)
          overlayPart.appendChild(descriptionPart)
          titlePart.innerText = title
          descriptionPart.innerHTML = marked(description)
          element.appendChild(overlayPart)

          const newGroup = () => {
            const group = document.createElement('div')
            group.className = 'tutorial-showcase-group'
            group.appendChild(element)
            container.appendChild(group)
          }

          if (!groupWith) {
            newGroup()
          } else {
            try {
              // eslint-disable-next-line no-eval
              const fn = eval(groupWith)
              const group = fn(container.children)
              group.appendChild(element)
            } catch (err) {
              debug('error in groupWith', groupWith)
              console.error(err)
              newGroup()
            }
          }
        })
      }
    }
  }

  // just in case the highlight is visible from a previous step
  clearHighlights()

  // no back button for the first step
  if (stepNum === 0) {
    $(pane)
      .find('.tBack')
      .hide()
  } else {
    $(pane)
      .find('.tBack')
      .show()
  }

  // manage the step "blocks", shown in the upper right with yellow/gray squares
  const prevStepBlock = pane.querySelector(`.tutorial-header-right .tutorial-step-block.active`)
  if (prevStepBlock) {
    prevStepBlock.classList.remove('active')
  }
  const stepBlock = pane.querySelector(`.tutorial-header-right .tutorial-step-block[step="${stepNum}"]`)
  if (stepBlock) {
    stepBlock.classList.add('active')
  }

  const nextButton = pane.querySelector('.tNext')
  if (nextButton) {
    nextButton.setAttribute('disabled', 'disabled')
    if (transition === 'next' || transition === undefined) {
      //
      // Handle transition via a next button
      //
      if (stepNum !== obj.steps.length - 1) {
        nextButton.removeAttribute('disabled')
      }
    } else if (transition === 'input') {
      //
      // Handle transition via an input value
      //
      const { selector, value } = input

      const handler = function(event) {
        if (event.keyCode === 13) {
          // 13 is the keycode for Enter
          if (
            $(selector)
              .val()
              .trim() === value
          ) {
            // unbind, move to the next step;
            $(document).unbind('keydown', handler)
            $(pane).prop('step', stepNum + 1)
            transitionSteps(tab, stepNum + 1, obj, pane)
          }
        }
      }
      $(document).bind('keydown', handler)
    } else if (transition === 'enter') {
      //
      // Handle transition via the user hitting 'enter' on their keyboard
      //
      $(pane)
        .find('.tBack')
        .css('display', 'inline-block')
      const handler = function(event) {
        if (event.keyCode === 13) {
          $(document).unbind('keydown', handler)
          $(pane).prop('step', stepNum + 1)
          transitionSteps(tab, stepNum + 1, obj, pane)
        }
      }
      $(document).bind('keydown', handler)
    } else if (transition === 'click') {
      //
      // Handle transition via a click
      //
      const { selector } = input

      // Show back button
      $(pane)
        .find('.tBack')
        .css('display', 'inline-block')
      const handler = function() {
        $(this).unbind('click', handler)
        $(pane).prop('step', stepNum + 1)
        transitionSteps(tab, stepNum + 1, obj, pane)
      }
      $(selector).bind('click', handler)
    }
  }

  // Set highlight
  if (highlight) {
    setHighlightPosition(highlight)
  }

  // Autofill a command
  if (autocomplete) {
    const { selector, value } = autocomplete

    if (selector) {
      debug('selector', selector, value)
      $(selector).val(value)
    } else {
      debug('autocomplete', value)
      UI.LowLevel.partialInput(value)
    }
  }

  // Execute a command
  if (execute) {
    debug('execute', execute)
    REPL.pexec(execute)
  }

  // Preview a composition
  if (preview) {
    const { file } = preview

    if (file) {
      debug('preview', file)
      REPL.pexec(`preview ${file}`)
    }
  }
}

/**
 * Find the biggest scrollable region and focus on it, so that the
 * user can use the arrow and pageup/pagedown keys to navigate around
 * the scroll region.
 *
 */
const focusOnBiggestScrollable = () => {
  const allScrollables: NodeListOf<HTMLElement> = document.querySelectorAll('#tutorialPane .scrollable')
  let biggest: { element: HTMLElement; rect: ClientRect }
  for (let idx = 0; idx < allScrollables.length; idx++) {
    const rect = allScrollables[idx].getBoundingClientRect()
    if (!biggest || rect.height > biggest.rect.height) {
      biggest = { element: allScrollables[idx], rect }
    }
  }
  if (biggest) {
    debug('focus', biggest.element)
    biggest.element.focus()
  }
}

/**
 * Launches the specified tutorial
 *
 */
const showTutorial = (tab: UI.Tab, tutorialName: string, obj: TutorialDefinition) => {
  debug('showTutorial', obj)

  // remove the sidecar, if it's open
  clearSelection(tab)

  const pane = document.querySelector('#tutorialPane') as TutorialPane
  pane.classList.remove('minimized')
  pane.removeAttribute('tutorial-has-showcase')

  // remember which tutorial we're currently playing
  pane.setAttribute('now-playing', tutorialName)

  // is this a fullscreen tutorial?
  if (obj.fullscreen) {
    pane.setAttribute('tutorial-is-fullscreen', 'tutorial-is-fullscreen')
    document.body.classList.add('tutorial-is-fullscreen')
  } else {
    pane.removeAttribute('tutorial-is-fullscreen')
    document.body.classList.remove('tutorial-is-fullscreen')
  }

  // tutorial name
  const tutorialNameDom = pane.querySelector('.tutorial-header-tutorial-name') as HTMLElement
  tutorialNameDom.classList.remove('zoom-in')
  setTimeout(() => tutorialNameDom.classList.add('zoom-in'), 0)
  tutorialNameDom.innerText = tutorialName.replace(/-/g, ' ')

  // next click handler
  ;(pane.querySelector('.tNext') as HTMLElement).onclick = () => {
    $(pane).prop('step', $(pane).prop('step') + 1)
    transitionSteps(tab, $(pane).prop('step'), obj, pane)
  }

  // back click handler
  ;(pane.querySelector('.tBack') as HTMLElement).onclick = () => {
    $(pane).prop('step', $(pane).prop('step') - 1)
    transitionSteps(tab, $(pane).prop('step'), obj, pane)
  }

  // close click handler
  ;(pane.querySelector('.tCloseButton') as HTMLElement).onclick = close(tab, pane, obj)

  // restore click handler
  ;(pane.querySelector('.tRestoreButton') as HTMLElement).onclick = () => {
    // cancel any background tasks
    cancelAsyncs(pane)

    // restore fullscreen mode, if that's where we came from
    if (pane.hasAttribute('tutorial-was-fullscreen')) {
      const stack = parseInt(pane.getAttribute('tutorial-was-fullscreen'), 10) - 1
      if (stack === 0) {
        pane.removeAttribute('tutorial-was-fullscreen')
        pane.setAttribute('tutorial-is-fullscreen', 'tutorial-is-fullscreen')
        document.body.classList.add('tutorial-is-fullscreen')
      } else {
        pane.setAttribute('tutorial-was-fullscreen', stack.toString())
      }
    }

    hideSidecar(tab)
    pane.classList.remove('minimized')
  }

  // in case we need some async setup logic in the future
  const ready = Promise.resolve(true)

  return ready.then(() => {
    // make the new one visible after some delay
    debug('ready')

    // make it visible; async this so we can get an animation effect
    setTimeout(() => pane.classList.add('visible'), 100)

    // set pane styling css. provide some default values, while the user can overwrite them using the style object in pane
    $(pane).prop('step', 0)

    // Open links in new tab or browser
    // From StackOverflow
    // https://stackoverflow.com/questions/31749625/make-a-link-from-electron-open-in-browser/34503175
    const shell = require('electron').shell
    $(document).on('click', 'a[href^="http"]', function(this: HTMLLinkElement, event: MouseEvent) {
      event.preventDefault()
      shell.openExternal(this.href)
    })

    // insert pane
    document.querySelector('body').classList.add('tutorial-in-progress')

    // height?
    if (obj.height) {
      pane.setAttribute('data-height', obj.height)
    }

    // skills badges
    const headerExtrasContainer = pane.querySelector('.tutorial-header-extras') as HTMLElement
    const skillsContainer = headerExtrasContainer.querySelector('.tutorial-skills')
    UI.empty(skillsContainer)
    if (obj.skills) {
      obj.skills.forEach(skill => {
        const skillBadge = document.createElement('badge')
        skillBadge.innerText = skill

        skillsContainer.appendChild(skillBadge)
      })
    }

    // blocks to represent steps
    const stepBlocksContainer = pane.querySelector('.tutorial-header-blocks') as HTMLElement
    UI.empty(stepBlocksContainer)

    // if we want a square aspect ratio:
    // const dim = closestSquare(obj.steps.length);
    // stepBlocksContainer.style.width = `calc(${dim} * 2em)`;

    // render the step "blocks", shown in the upper right with yellow/gray squares
    pane.setAttribute('num-steps', obj.steps.length.toString())
    if (obj.steps.length > 1) {
      for (let idx = 0; idx < obj.steps.length; idx++) {
        ;(function(idx) {
          const block = document.createElement('div')
          const blockInner = document.createElement('div')
          blockInner.classList.add('tutorial-step-block')
          blockInner.setAttribute('step', idx.toString())
          block.setAttribute('data-balloon', obj.steps[idx].heading)
          block.setAttribute('data-balloon-pos', idx > obj.steps.length / 2 ? 'down-right' : 'down') // square: idx % dim > Math.floor(dim/2) ? 'down-right' : 'down')
          block.setAttribute('data-balloon-length', 'small')
          block.onclick = () => {
            $(pane).prop('step', idx)
            transitionSteps(tab, idx, obj, pane)
          }

          block.appendChild(blockInner)
          stepBlocksContainer.appendChild(block)
        })(idx)
      }
    }

    // initiate the first step
    transitionSteps(tab, 0, obj, pane)

    // we'll be bumping up from the bottom; make sure the active repl prompt is visible
    UI.LowLevel.scrollIntoView({ when: 800 })

    // so that the user can immediately arrow and pageup/pagedown in the biggest scrollable
    setTimeout(focusOnBiggestScrollable, 800)

    // tell the repl we're OK
    return true
  })
} /* showTutorial */

/**
 * Command handler for tutorial play
 *
 */
const use = (cmd: string) => async ({ argvNoOptions, tab, execOptions, parsedOptions }: Commands.Arguments) => {
  injectOurCSS()

  // inject the HTML if needed
  const ready: Promise<void | boolean> = document.querySelector('#tutorialPane') ? Promise.resolve() : injectHTML()

  const filepath = argvNoOptions[argvNoOptions.indexOf(cmd) + 1]

  const [{ config, tutorial }] = await Promise.all([readProject(Util.findFile(filepath)), ready])

  if (execOptions.type === Commands.ExecType.Nested && !parsedOptions['top-level']) {
    // initiate just the first step
    const pane = document.createElement('div') as TutorialPane
    pane.classList.add('tutorialPane')
    const body = document.createElement('div')
    body.classList.add('tutorial-body')
    pane.appendChild(body)
    const content = document.createElement('div')
    content.classList.add('tutorial-content')
    body.appendChild(content)
    const paragraphs = document.createElement('div')
    paragraphs.classList.add('tutorial-paragraphs')
    content.appendChild(paragraphs)
    const learnMore = document.createElement('div')
    learnMore.classList.add('tutorial-learn-more')
    content.appendChild(learnMore)
    const extras = document.createElement('div')
    extras.classList.add('tutorial-content-extras')
    content.appendChild(extras)
    const list = document.createElement('div')
    list.classList.add('tutorial-content-extras-as-structured-list')
    extras.appendChild(list)
    transitionSteps(tab, 0, tutorial || config.tutorial, pane, true)
    return pane
  } else {
    return showTutorial(tab, config.name, tutorial || config.tutorial)
  }
}

/** this is useful if we want to display the step "blocks" as a square */
/* const closestSquare = n => {
  const root = Math.sqrt(n),
  integralPart = ~~root,
  decimalPart = root - integralPart

  if (decimalPart === 0) {
  return integralPart
  } else {
  return integralPart + 1
  }
  } */

/**
 * tutorial play usage model
 *
 */
const usage = (cmd: string) => ({
  command: cmd,
  strict: cmd,
  title: 'Start tutorial',
  header: 'Start playing a tutorial',
  example: `tutorial ${cmd} @tutorials/<tutorialName>`,
  required: [{ name: 'tutorialPath', file: true, docs: 'Path or URI to a tutorial' }],
  optional: [{ name: '--top-level', docs: 'Render as a top-level tutorial' }]
})

/**
 * Here we register as a listener for commands
 *
 */
export default async (commandTree: Commands.Registrar) => {
  // synonyms for playing a tutorial
  const cmd = commandTree.listen('/tutorial/play', use('play'), {
    usage: usage('play'),
    needsUI: true,
    noAuthOk: true
  })
  commandTree.synonym('/tutorial/use', use('use'), cmd, {
    usage: usage('use'),
    needsUI: true,
    noAuthOk: true
  })
  commandTree.synonym('/tutorial/start', use('start'), cmd, {
    usage: usage('start'),
    needsUI: true,
    noAuthOk: true
  })
}
