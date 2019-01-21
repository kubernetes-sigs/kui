/*
 * Copyright 2017-18 IBM Corporation
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
const debug = Debug('plugins/apache-composer/cmds/editor-extensions')

import { findFile } from '@kui/core/core/find-file'
import { isHeadless } from '@kui/core/core/capabilities'

import { addVariantSuffix, betterNotExist, defaults, optional, prepareEditorWithAction } from '@kui/plugin-openwhisk/src/lib/cmds/editor-extensions'
import { extension, language } from '@kui/plugin-editor/src/lib/file-types'
import { respondToRepl } from '@kui/plugin-editor/src/lib/util'
import { openEditor } from '@kui/plugin-editor/src/lib/open'
import { loadComposition } from '@kui/plugin-apache-composer/src/lib/utility/compile'

import { handleParseError, persister } from '../../model/editor/composition-persister'

export const composeUsage = {
  strict: 'compose',
  command: 'compose',
  title: 'New composition',
  header: 'For quick prototyping of compositions, this command opens an editor in the sidecar.',
  example: 'compose <appName>',
  required: [{ name: '<appName>', docs: 'The name of your new composition' }],
  optional: optional(['nodejs', 'python']).concat([
    { name: '--preview', docs: 'Open the visualization of your composition' }
  ]),
  parents: [{ command: 'editor' }]
  // related: allExcept('compose')
}

const placeholders = {
  javascript: `const composer = require('openwhisk-composer')

module.exports = composer.sequence('A', 'B')`,

  python: `# try typing "composer." to begin your composition
`
}

/**
 * Add the wskflow visualization component to the given content
 *
 */
const addWskflow = prequire => opts => {
  debug('addWskflow', opts)

  if (isHeadless()) return opts

  const { getEntity, editor, content, eventBus } = opts
  const wskflowContainer = document.createElement('div')
  const editorDom = content.querySelector('.monaco-editor-wrapper')

  content.appendChild(wskflowContainer)
  wskflowContainer.className = 'wskflow-container'

  /** update the view to show the latest FSM */
  let lock
  const updateView = async (_?, { event = 'init' } = {}) => {
    if (lock) return
    else lock = true

    try {
      const action = getEntity()
      const { fsm } = action

      debug('wskflow updateView', action)

      if (fsm) {
        const { visualize } = await prequire('plugin-wskflow')

        wskflowContainer.classList.add('visible')
        editorDom.classList.add('half-height')

        if (event === 'revert') {
          // don't bother redrawing on revert
          content.removeChild(wskflowContainer)
          content.appendChild(wskflowContainer)
        } else {
          await visualize(fsm)
            .then(({ view, controller }) => {
              const currentSVG = wskflowContainer.querySelector('svg')

              if (currentSVG) {
                const newSVG = view.querySelector('svg')
                const parent = currentSVG.parentNode

                parent.appendChild(newSVG)
                parent.removeChild(currentSVG)
              } else {
                wskflowContainer.appendChild(view)
              }
            })
        }
      }
    } finally {
      lock = false

      editor.relayout()
      setTimeout(editor.relayout, 800)
    }
  }

  eventBus.on('/editor/save', updateView)
  setTimeout(updateView, 300) // needs to be async'd in order for wskflow to work with `edit myApp`

  /** see if the current editor has a wskflow */
  let filepath
  const tryWskflow = async () => {
    // debug('wskflow editor change handler', lock)

    const mktemp = postfix => new Promise((resolve, reject) => {
      require('tmp').file({ prefix: 'shell-', postfix }, (err, filepath, fd, cleanup) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          resolve(filepath)
        }
      })
    })
    const write = source => new Promise((resolve, reject) => {
      require('fs').writeFile(filepath, source, async err => {
        if (err) {
          console.error(err)
        } else {
          resolve()
        }
      })
    })

    const action = getEntity()
    debug('addWskflow action', action)
    if (action.type !== 'compositions') {
      // no need to generate wskflows if this isn't a composition
      return
    }

    if (!filepath) {
      filepath = await mktemp(extension(action.exec.kind))
    }

    const source = editor.getValue()
    await write(source)

    const fsm = await generateFSM(source, filepath, action.exec.kind)
    if (fsm.statusCode || fsm.code) {
      // some error generating the fsm
      editor.clearDecorations()
      handleParseError(fsm, filepath, editor)
    } else {
      if (differentFSMs(action.fsm, fsm)) {
        action.fsm = fsm
        await updateView()
      }
    }
  }

  // when the editor content changes, see if the current contents can
  // render a wskflow
  eventBus.on('/editor/change', tryWskflow)

  // and try it once onload
  tryWskflow()

  return opts
}

/**
 * Are the two FSMs different?
 *
 */
const differentFSMs = (fsm1, fsm2) => {
  if (!!fsm1 !== !!fsm2) { // tslint:disable-line
    // one or the other is null
    return true
  } else if (typeof fsm1 !== typeof fsm2) {
    return true
  } else if (fsm1 === fsm2) {
    return false
  } else if (typeof fsm1 === 'string') {
    // we just checked ===, so they are different if these are string keys
    return true
  } else if (fsm1.type !== fsm2.type) {
    return true
  } else if (Array.isArray(fsm1) && fsm1.length !== fsm2.length) {
    return true
  } else {
    for (let key in fsm1) {
      if (key.charAt(0) === '.') continue
      else if (differentFSMs(fsm1[key], fsm2[key])) {
        return true
      }
    }
    return false
  }
}

/**
 * Create the initial code for new actions/compositions
 *
 */
const defaultPlaceholderFn = ({ kind = 'nodejs:default', template }) => {
  if (!template) {
    // if the command didn't specify a template to start with, we
    // will use one of the built-in placeholders, based on the
    // kind of code being created
    return placeholders[language(kind)]
  } else {
    // otherwise, we will open the editor showing a template file
    return new Promise((resolve, reject) => {
      const readViaImport = () => {
        debug('readViaImport', template,
          findFile(template).replace(/^app\/plugins\/modules/, ''))
        resolve(require('@kui/plugin-' +
                        findFile(template).replace(/^app\/plugins\/modules/, '')))
      }

      const readViaFilesystem = () => {
        debug('standalone mode')
        require('fs').readFile(findFile(template), (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data.toString())
          }
        })
      }

      try {
        if (template.indexOf('@') >= 0) {
          readViaImport()
        } else {
          readViaFilesystem()
        }
      } catch (err) {
        console.error(err)
        readViaFilesystem()
      }
    })
  }
}

/**
 * Turn source into composer IR
 *
 */
const generateFSM = (source, localCodePath, kind) => {
  // const base = kind.substring(0, kind.indexOf(':')) || kind // maybe useful when we have python composer
  try {
    const result = loadComposition(localCodePath, source)
    return Promise.resolve(result)
  } catch (error) {
    return Promise.resolve(error)
  }
}

/**
 * Special options for compositions. Mostly, we need to specify the
 * initial "placeholder" code to display when creating a new file, and
 * the persister to use when deploying edits.
 *
 */
const compositionOptions = baseOptions => {
  return Object.assign({ type: 'compositions',
    _kind: 'composition',
    placeholderFn: defaultPlaceholderFn, // the placeholder impl
    persister // the persister impl
  }, baseOptions)
}
const addCompositionOptions = params => {
  const [action] = params

  const conductorAnnotation = action.annotations.find(({ key }) => key === 'conductor')
  const ast = action.ast || (conductorAnnotation && conductorAnnotation.value !== true)

  if (ast) {
    const sourceAnnotation = action.annotations.find(({ key }) => key === 'source')
    action.persister = persister

    // for now, we can't edit compositions without a source annotation
    if (!sourceAnnotation) {
      const error = new Error('Support for editing deployed compositions not yet implemented')
      error['statusCode'] = 406
      throw error
    }
  }

  return params
}

/**
 * Command handler to create a new action or app
 *
 */
export const newAction = ({ prequire, cmd = 'new', type = 'actions', _kind = defaults.kind, placeholder = undefined, placeholderFn = undefined }) => async ({ argvNoOptions, parsedOptions: options, execOptions }) => {
  const name = argvNoOptions[argvNoOptions.indexOf(cmd) + 1]
  const prettyKind = addVariantSuffix(options.kind || _kind)
  const kind = addVariantSuffix(options.kind || defaults.kind)

  debug('newAction', cmd, name, kind, prettyKind)

  // create the initial, placeholder, source code to place in the editor
  const makePlaceholderCode = placeholderFn || (() => placeholder || placeholders[language(kind)])

  const code = await makePlaceholderCode(Object.assign({ kind }, options))

  // generate FSM, if we were given a template
  const compile = () => type === 'compositions' && options.template
    ? generateFSM(code, options.template, options.kind || defaults.kind)
    : Promise.resolve()

  // our placeholder action
  const makeAction = () => compile()
    .then(ast => {
      debug('makeAction', ast)
      return {
        name,
        type,
        exec: { kind, prettyKind, code },
        isNew: true,
        ast,
        persister
      }
    })

  /* if (isHeadless()) {
    //
    // when running headless, attempt to use the user's chosen editor
    //
    return makeAction()
      .then(openTextEditor)
      .then(() => colors.green('ok') + ': opened a new scratch composition in your editor')
  } else */ {
    //
    // otherwise, open the in-Shell editor
    // then update the editor to show the placeholder action
    // then send a response back to the repl
    //
    return betterNotExist(name, options)
      .then(() => Promise.all([makeAction(), openEditor(name, options, execOptions)]))
      .then(prepareEditorWithAction)
      .then(addWskflow(prequire))
      .then(respondToRepl())
  }
}

export default async (commandTree, prequire) => {
  // command registration: create new app/composition
  commandTree.listen('/editor/compose', newAction(compositionOptions({ prequire, cmd: 'compose' })),
    { usage: composeUsage, noAuthOk: true })
}
