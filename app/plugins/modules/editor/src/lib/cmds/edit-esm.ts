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

/* global self */

import * as Debug from 'debug'
const debug = Debug('plugins/editor/cmds/edit-esm')

import * as colors from 'colors/safe'
import * as path from 'path'
import * as events from 'events'

import languages from '../language-scan'
import * as usage from '../../usage'
import * as placeholders from '../placeholders'
import { lockIcon } from '../readonly'
import { applyOverrides } from '../overrides'
import strings from '../../i18n/strings'

import globalEventBus from '@kui/core/events'
import { isHeadless } from '@kui/core/capabilities'
import { findFile } from '@kui/core/find-file'
import * as repl from '@kui/core/repl'
import { removeAllDomChildren } from '@kui/webapp/util/dom'
import { injectCSS } from '@kui/webapp/util/inject'
import { currentSelection, getSidecar, addNameToSidecarHeader, addVersionBadge } from '@kui/webapp/views/sidecar'

import * as monaco from 'monaco-editor'
// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
self['MonacoEnvironment'] = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return './json.worker.bundle.js'
    }
    if (label === 'css') {
      return './css.worker.bundle.js'
    }
    if (label === 'html') {
      return './html.worker.bundle.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.bundle.js'
    }
    return './editor.worker.bundle.js'
  }
}

/** default settings */
const defaults = {
  kind: 'nodejs:default'
}

/**
 * Throw an error if we can't edit the given action
 *
 */
const checkForConformance = action => {
  debug('checkForConformance', action)

  if (action.exec.binary) {
    debug('abort: trying to edit a binary action')
    const err = new Error('Editing of binary actions not yet supported')
    err['code'] = 406 // 406: Not Acceptable http status code
    throw err
  } else if (action.fsm) {
    // try to find the source for this compositoin
    debug('trying to find source for composition')
    return persisters.compositions.getCode(action)
  } else if (action.exec.kind === 'sequence') {
    debug('abort: trying to edit a sequence')
    const err = new Error('Editing of sequence actions not yet supported')
    err['code'] = 406 // 406: Not Acceptable http status code
    throw err
  }

  debug('checkForConformance: ok')
  return action
}

/**
 * Logic for saving and reverting
 *
 */
const persisters = {
  // persisters for regular actions
  actions: {
    getCode: action => action,
    save: (wsk, action, editor) => {
      const owOpts = wsk.owOpts({
        name: action.name,
        namespace: action.namespace,
        action
      })

      return wsk.ow.actions.update(owOpts)
    },
    revert: (wsk, action) => {
      // empty
    }
  },

  // persisters for apps/compositions
  compositions: {
    getCode: action => new Promise((resolve, reject) => {
      const codeAnno = action.annotations.find(({ key }) => key === 'code')
      if (codeAnno) {
        action.exec.code = codeAnno.value
        action.persister = persisters.compositions
        resolve(action)
      } else {
        // hmm, no code annotation; let's look for a 'file' annotation
        const localCodePath = action.annotations.find(({ key }) => key === 'file')
        if (localCodePath) {
          require('fs').readFile(localCodePath, (err, data) => {
            if (err) {
              reject(err)
            } else {
              action.exec.code = data.toString()
              action.persister = persisters.compositions
              resolve(action)
            }
          })
        } else {
          // action.exec.code = JSON.stringify(action.fsm, undefined, 4)
          const err = new Error('Your composition does not have an assocated source file')
          err['code'] = 406
          reject(err)
        }
      }
    }),
    save: (wsk, app, editor) => new Promise((resolve, reject) => {
      const fs = require('fs')
      const tmp = require('tmp')

      tmp.file({ prefix: 'shell-', postfix: extension(app.exec.kind) }, (err, filepath, fd, cleanup) => {
        if (err) {
          reject(err)
        } else {
          fs.write(fd, app.exec.code, err => {
            if (err) {
              reject(err)
            } else {
              // -r means try to deploy the actions, too
              return repl.qexec(`app update "${app.name}" "${filepath}" -r --kind ${app.exec.kind}`, undefined, undefined, { noHeader: true })
                .then(app => {
                  cleanup()
                  resolve(app)
                })
                .then(res => {
                  // successful compilation, so remove any parse error decorations
                  editor.clearDecorations()
                  return res
                })
                .catch(err => {
                  if (err.statusCode === 'ENOPARSE') {
                    debug('composition did not parse', err)
                    // try two patterns to spot stack trace information;
                    // we need to pull out the line number from the stack trace,
                    // so that we can identify the problem, with a gutter marker ("decoration"),
                    // in the editor pane
                    const basename = path.basename(filepath)
                    const pattern1 = new RegExp('\\n([^\n]+)\\n\\s+at\\s+' + basename.replace(/\./, '\\.') + ':(\\d+):(\\d+)')
                    const pattern2 = new RegExp('([^\n]+)\\n\\s+at\\s+[^\\(]*\\s+\\([^\n\r]*' + basename.replace(/\./, '\\.') + ':(\\d+):(\\d+)')
                    const pattern3 = new RegExp('^[^\n]+' + basename.replace(/\./, '\\.') + ':(\\d+)\\n[^\n]+\\n[^\n]+\\n\\n([^\n]+)')
                    const match3 = err.message.match(pattern3)
                    const match = err.message.match(pattern1) || err.message.match(pattern2) || match3

                    debug('pattern', pattern1, pattern2, pattern3)
                    debug('message', err.message)
                    if (match) {
                      const problem = match3 ? match[2] : match[1]
                      const line = match3 ? match[1] : match[2]
                      const column = match[3]
                      debug('got match', problem, line, column)

                      const decorations = [
                        { range: new monaco.Range(line, 1, line, 1),
                          options: { isWholeLine: true,
                            glyphMarginClassName: 'editor parse-error-gutter-marker parse_error_decoration',
                            glyphMarginHoverMessage: { value: problem }
                            // linesDecorationsClassName: `editor__parse-error-gutter-marker editor__parse-error-decoration`
                          }
                        },
                        { range: new monaco.Range(line, column, line, column + 1),
                          options: {
                            beforeContentClassName: `editor parse-error-before-marker parse-error-decoration`
                            // inlineClassName: 'editor__parse-error-inline-marker',
                            // hoverMessage: { value: problem }
                          }
                        }
                      ]
                      editor.__cloudshell_decorations = editor.deltaDecorations([], decorations)
                    }
                  }
                })
            }
          })
        }
      })
    })
  }
}

/**
 * Save the given action
 *
 */
const save = ({ wsk, getAction, editor, eventBus }) => ({
  mode: strings.save,
  actAsButton: true,
  // fontawesome: 'fas fa-cloud-upload-alt',
  direct: () => {
    const action = getAction()
    const persister = action.persister || persisters.actions
    const { save } = action.persister || persisters.actions

    // transfer the latest code from the editor into the entity
    action.exec.code = editor.getValue()

    // odd: if we don't delete this, the backend will not perform its default version tagging behavior
    // https://github.com/apache/incubator-openwhisk/issues/3237
    delete action.version

    return save(wsk, action, editor)
      .then(action => {
        action.persister = persister
        eventBus.emit('/editor/save', action, { event: 'save' })
        globalEventBus.emit('/editor/save', action, { event: 'save' })
      })
  }
})

/**
 * Revert to the currently deployed version
 *
 */
const revert = ({ wsk, getAction, editor, eventBus }) => ({
  mode: strings.revert,
  actAsButton: true,
  // fontawesome: 'fas fa-cloud-download-alt',
  // fontawesome: 'fas fa-sync-alt',
  direct: () => {
    const action = getAction()
    const persister = action.persister || persisters.actions
    const { getCode } = persister
    /* const owOpts = wsk.owOpts({
      name: action.name,
      namespace: action.namespace
    }) */

    return repl.qexec(`action get "/${action.namespace}/${action.name}"`)
      .then(getCode)
      .then(action => {
        action.persister = persister
        updateText(editor)(action)
        eventBus.emit('/editor/save', action, { event: 'revert' })
      })
      .then(() => true)
  }
})

/**
 * Tidy up the source
 *
 */
/* const tidy = ({wsk, getAction, editor, eventBus}) => ({
  mode: strings.tidy,
  actAsButton: true,
  fontawesome: 'fas fa-align-left',
  balloon: strings.tidy,
  balloonLength: 'medium',
  direct: () => {
    const action = getAction()

    if (language(action.exec.kind) === 'javascript') {
      const beautify = require('js-beautify')

      const raw = editor.getValue()
      const nicer = beautify(raw, { wrap_line_length: 80 })

      setText(editor)({ kind: action.exec.kind,
        code: nicer
      })
    }

    return true
  }
}) */

/**
 * What is the monaco "language" for the given kind?
 *    only nodejs and compositions diverge from monaco's notation
 */
const language = kind => {
  const base = kind.substring(0, kind.indexOf(':')) || kind
  debug('language', kind, base)

  if (base === 'nodejs' ||
      base === 'app' ||
      base === 'composition' ||
      base === 'sequence') {
    return 'javascript'
  } else if (base === 'ts') {
    return 'typescript'
  } else {
    return base
  }
}

/**
 * What is the filename extension for the given kind?
 *
 */
const extension = kind => {
  const lang = language(kind)
  debug('extension', kind, lang)

  switch (lang) {
    case 'javascript': return '.js'
    case 'typescript': return '.js'
    case 'python': return '.py'
    default: return `.${lang}` // e.g. .swift, .php, .go
  }
}

/**
 * Update the code in the editor to use the given text
 *
 */
const setText = (editor, execOptions?) => ({ code, kind }) => {
  const lang = execOptions && execOptions.language || language(kind)
  debug('setText language', kind, lang)

  const oldModel = editor.getModel()
  const newModel = monaco.editor.createModel(code, lang)

  editor.setModel(newModel)

  if (!execOptions || !execOptions.cursorPosition || execOptions.cursorPosition === 'end') {
    editor.setPosition(editor.getModel().getPositionAt((code && code.length) || 0))
  }

  if (oldModel) {
    oldModel.dispose()
  }

  // see https://github.com/Microsoft/monaco-editor/issues/194
  setTimeout(() => editor.focus(), 500)

  return code
}
const updateText = editor => action => {
  // monaco let's us replace the full range of text, so we don't need
  // an explicit delete of the current text
  return setText(editor)(action.exec)
}

/**
 * Open a local text editor, the platform editor
 * @param action the action to edit
 * @param cwd store the file in the cwd (versus /tmp)?
 *
 */
const openTextEditor = (action, { cwd = true } = {}) => {
  debug('openTextEditor')

  const name = action.name
  const { kind, code } = action.exec
  const mktemp = cwd ? Promise.resolve(`${name}${extension(kind)}`)
    : new Promise((resolve, reject) => require('tmp').file({ prefix: name,
      postfix: extension(kind) }, (err, path) => {
      if (err) {
        reject(err)
      } else {
        resolve(path)
      }
    }))

  return mktemp.then(tmpFile => new Promise((resolve, reject) => {
    debug('tmpFile', tmpFile)

    require('fs').writeFile(tmpFile, code, err => {
      if (err) {
        debug('openTextEditor: nope', err)
        reject(err)
      } else {
        debug('opening platform text editor')
        require('opn')(tmpFile, { wait: false })
          .then(() => {
            // ugh, see https://github.com/sindresorhus/opn/issues/92
            setTimeout(() => resolve(tmpFile), 1000)
            // resolve(tmpFile)
          })
      }
    })
  }))
}

/**
 * Open the code editor
 *
 * @return a function that can be passed an action to display in the
 * editor, and which returns { action, editor, content }
 *     - action: the action that was displayed
 *     - editor: an instance of the monaco editor class
 *     - content: a dom that contains the instance; this must be attached somewhere!
 *
 */
let initDone // this is part of the finagling, to make sure we finagle only once
const openEditor = (wsk, name, options, execOptions) => {
  debug('openEditor')

  if (isHeadless()) {
    return fetchAction(name).then(action => {
      debug('openEditor: handing off to platform text editor')
      return openTextEditor(action, { cwd: false })
        .then(() => {
          return _ => Object.assign({}, _, { getAction: () => action })
        })
    })
  }

  const sidecar = getSidecar()

  /** returns the current action entity */
  const getAction = currentSelection

  try {
    injectCSS({ css: require('@kui-plugin-src/editor/lib/mono-blue.css').toString(), key: 'editor.mono-blue' })
    injectCSS({ css: require('@kui-plugin-src/editor/lib/editor.css').toString(), key: 'editor.editor' })
  } catch (err) {
    const ourRoot = path.dirname(require.resolve('@kui-plugin-src/editor/package.json'))
    injectCSS(path.join(ourRoot, 'lib/mono-blue.css'))
    injectCSS(path.join(ourRoot, 'lib/editor.css'))
  }

  const content = document.createElement('div')
  const editorWrapper = document.createElement('div')

  editorWrapper.className = 'monaco-editor-wrapper'
  content.appendChild(editorWrapper)
  editorWrapper.focus() // we want the editor to have focus, so the user can start coding

  // override the repl's capturing of the focus
  content.onclick = evt => {
    evt.stopPropagation()
  }

  //
  // wait till monaco's loader is ready, then resolve with an editor
  // widget
  //
  let editor
  const ready = () => new Promise((resolve, reject) => {
    /**
     *
     */
    const initEditor = () => {
      if (!initDone) {
        // for now, try to disable the built-in Javascript-specific completion helper thingies
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true })

        // install any custom languages we might have
        languages(monaco).forEach(({ language, provider }) => {
          monaco.languages.registerCompletionItemProvider(language, provider)
        })

        initDone = true
      }

      // here we instantiate an editor widget
      editorWrapper['baseFontSize'] = 14.4
      editor = monaco.editor.create(editorWrapper, Object.assign({
        automaticLayout: false, // respond to window layout changes
        minimap: {
          enabled: false
        },
        cursorWidth: 3,
        autoIndent: true,
        codeLens: false,
        quickSuggestions: false,
        contextmenu: false,
        scrollBeyondLastLine: false,
        scrollBeyondLastColumn: 2,
        // cursorStyle: 'block',
        fontFamily: 'var(--font-monospace)',
        fontSize: editorWrapper['baseFontSize'],

        // specifics for readOnly mode
        glyphMargin: !options.readOnly, // needed for error indicators

        // simplify the UI?
        lineNumbers: !options.simple,
        renderIndentGuides: !options.simple,
        renderLineHighlight: options.simple ? 'none' : 'all',

        // we will fill these two in later, in setText
        value: '',
        language: 'javascript'
      }, options))

      editor.clearDecorations = () => {
        debug('clearing decorations', editor.__cloudshell_decorations)
        const none = [{ range: new monaco.Range(1, 1, 1, 1), options: { } }]
        editor.__cloudshell_decorations = editor.deltaDecorations(editor.__cloudshell_decorations || [], none)
      }

      editorWrapper['editor'] = editor

      resolve(editor)
    } /* initEditor */

    initEditor()
  }) /* end of ready() */

  /**
   * Given an editor instance, return a function that can update
   * that instance to show a given action entity.
   *
   */
  const updater = editor => action => {
    debug('updater', action)
    const eventBus = new events.EventEmitter()

    const kind = sidecar.querySelector('.action-content .kind') as HTMLElement
    kind.innerText = ''

    // update the editor text
    setText(editor, execOptions)(action.exec)

    content.classList.add('code-highlighting')

    const iconDom = sidecar.querySelector('.sidecar-header-icon') as HTMLElement
    iconDom.innerText = (action.prettyType || action.type).replace(/s$/, '')

    // stash this so that the implicit entity model works
    sidecar.entity = action

    // isModified display
    const subtext = sidecar.querySelector('.sidecar-header-secondary-content .custom-header-content')
    const status = document.createElement('div')
    const isNew = document.createElement('div')
    const isNewReadOnly = document.createElement('div')
    const upToDate = document.createElement('div')
    const modified = document.createElement('div')

    removeAllDomChildren(subtext)
    subtext.appendChild(status)
    status.appendChild(isNew)
    status.appendChild(isNewReadOnly)
    status.appendChild(upToDate)
    status.appendChild(modified)
    isNew.innerHTML = strings.isNew
    isNewReadOnly.innerHTML = strings.isNewReadOnly
    upToDate.innerHTML = strings.isUpToDate
    modified.innerHTML = strings.isModified
    status.className = 'editor-status'

    if (options.readOnly) {
      status.classList.add('is-read-only')
    }
    if (action.isNew) {
      status.classList.add('is-new')
    } else {
      status.classList.add('is-up-to-date')
    }
    isNew.className = 'is-new'
    isNewReadOnly.className = 'is-new-read-only'
    upToDate.className = 'is-up-to-date'
    modified.className = 'is-modified'

    // even handlers for saved and content-changed
    const editsInProgress = () => {
      sidecar.classList.add('is-modified')
      editor.clearDecorations() // for now, don't trty to be clever; remove decorations on any edit
    }
    const editsCommitted = action => {
      const lockIcon = sidecar.querySelector('[data-mode="lock"]')

      sidecar.classList.remove('is-modified')
      status.classList.remove('is-new')
      if (lockIcon) lockIcon.classList.remove('is-new')
      sidecar.entity = action

      // update the version badge to reflect the update
      addVersionBadge(action, { clear: true })
    }
    eventBus.on('/editor/save', editsCommitted)
    editor.getModel().onDidChangeContent(editsInProgress)

    // make a wrapper around the action name to house the "is
    // modified" indicator
    const nameDiv = document.createElement('div')
    const namePart = document.createElement('span')
    const isModifiedPart = document.createElement('span')
    const isModifiedIcon = document.createElement('i')

    nameDiv.appendChild(namePart)
    nameDiv.appendChild(isModifiedPart)
    isModifiedPart.appendChild(isModifiedIcon)
    namePart.innerText = action.name
    nameDiv.className = 'is-modified-wrapper'
    isModifiedPart.className = 'is-modified-indicator'
    isModifiedIcon.className = 'fas fa-asterisk'
    isModifiedPart.setAttribute('data-balloon', strings.isModifiedIndicator)
    isModifiedPart.setAttribute('data-balloon-pos', 'left')

    addNameToSidecarHeader(sidecar, nameDiv, action.packageName)
    addVersionBadge(action, { clear: true })

    return Promise.resolve({ getAction, editor, content, eventBus })
  } /* end of updater */

  // once the editor is ready, return a function that can populate it
  return ready().then(updater)
} /* end of openEditor */

/**
 * Prepare a response for the REPL. Consumes the output of
 * updateEditor
 *
 */
const respondToRepl = (wsk, extraModes = []) => ({ getAction, editor, content, eventBus }) => ({
  type: 'custom',
  content,
  controlHeaders: ['.header-right-bits'],
  displayOptions: [`entity-is-${getAction().type}`, 'edit-mode'],
  badges: [ language(getAction().exec.kind) ],
  modes: extraModes
    .map(_ => _({ wsk, getAction, editor, eventBus }))
    .concat([ save({ wsk, getAction, editor, eventBus }),
      revert({ wsk, getAction, editor, eventBus })
      // tidy({wsk, getAction, editor, eventBus})
      // readonly({wsk, getAction, editor, eventBus})
    ])
})

/**
 * Simple convenience routine to fetch an action and ensure that it is
 * compatible with the editor
 *
 */
const fetchAction = (name, check = checkForConformance) => {
  return repl.qexec(`wsk action get "${name}"`).then(check)
}

/**
 * Fail with 409 if the given action name exists, otherwise succeed
 *
 */
const failWith409 = _ => {
  if (_ !== false) {
    // action get returns false if we have no auth
    const error = new Error(strings.actionAlreadyExists)
    error['code'] = 409
    throw error
  }
}
const failIfNot404 = err => {
  if (err.statusCode !== 404 &&
        err.message.indexOf('socket hang up') < 0 &&
        err.statusCode !== 'ENOTFOUND') {
    console.error(err)
    throw err
  }
}
const betterNotExist = (name, options) => {
  if (options.readOnly) {
    return Promise.resolve(true)
  } else {
    return fetchAction(name, failWith409).catch(failIfNot404)
  }
}

/**
 * Simple convenience routine that takes the result of an action
 * fetch and an editor open call, and passes the former to the latter
 *
 */
const prepareEditorWithAction = ([action, updateFn]) => {
  debug('prepareEditorWithAction')
  return updateFn(action)
}

/**
 * Command handler for `edit actionName`
 *
 */
const edit = (wsk, prequire) => ({ argvNoOptions, parsedOptions, execOptions }) => {
  debug('edit command execution started')

  const selection = currentSelection()
  const name = argvNoOptions[argvNoOptions.indexOf('edit') + 1] ||
    (selection && `/${selection.namespace}/${selection.name}`)

  //
  // fetch the action and open the editor in parallel
  // then update the editor to show the action
  // then send a response back to the repl
  //
  debug('begin')
  return Promise.all([fetchAction(name), openEditor(wsk, name, parsedOptions, execOptions)])
    .then(applyOverrides(parsedOptions))
    .then(addCompositionOptions)
    .then(prepareEditorWithAction)
    .then(addWskflow(prequire))
    .then(respondToRepl(wsk, [ lockIcon ]))
} /* end of edit command handler */

/**
 * If the user specified a kind of 'nodejs', then add ':default'
 *
 */
const addVariantSuffix = kind => {
  if (kind.indexOf(':') < 0) {
    return `${kind}:default`
  } else {
    return kind
  }
}

/**
 * Command handler to create a new action or app
 *
 */
const newAction = ({ wsk, prequire, cmd = 'new', type = 'actions', _kind = defaults.kind, placeholder = undefined, placeholderFn = undefined, persister = persisters.actions }) => async ({ argvNoOptions, parsedOptions: options, execOptions }) => {
  const name = argvNoOptions[argvNoOptions.indexOf(cmd) + 1]
  const prettyKind = addVariantSuffix(options.kind || _kind)
  const kind = addVariantSuffix(options.kind || defaults.kind)

  debug('newAction', cmd, name, kind, prettyKind)

  // create the initial, placeholder, source code to place in the editor
  const makePlaceholderCode = placeholderFn || (() => {
    if (placeholder) {
      debug('using caller-provided placeholder', placeholder)
      return placeholder
    } else {
      const lang = language(kind)
      debug('using built-in placeholder for lang', lang, placeholders[lang])
      return placeholders[lang]
    }
  })

  const code = await makePlaceholderCode(Object.assign({ kind }, options))

  const compile = () => type === 'compositions' && options.template
    ? repl.qexec(`app lang ${options.kind || defaults.kind} compose impl`,
      undefined, undefined, {
        parameters: {
          localCodePath: options.template,
          source: code
        }
      })
    : Promise.resolve({ source: code })

  // our placeholder action
  const makeAction = () => compile().then(({ ast: fsm, source }) => ({ name,
    type,
    exec: { kind, prettyKind, code: source },
    isNew: true,
    fsm,
    persister
  }))

  if (isHeadless()) {
    //
    // when running headless, attempt to use the user's chosen editor
    //
    return makeAction()
      .then(openTextEditor)
      .then(() => colors.green('ok') + ': opened a new scratch composition in your editor')
  } else {
    //
    // otherwise, open the in-Shell editor
    // then update the editor to show the placeholder action
    // then send a response back to the repl
    //
    return betterNotExist(name, options)
      .then(() => Promise.all([makeAction(), openEditor(wsk, name, options, execOptions)]))
      .then(prepareEditorWithAction)
      .then(addWskflow(prequire))
      .then(respondToRepl(wsk))
  }
}

/**
 * Add the wskflow visualization component to the given content
 *
 */
const addWskflow = prequire => opts => {
  debug('addWskflow')

  if (isHeadless()) return opts

  const { getAction, editor, content, eventBus } = opts
  const wskflowContainer = document.createElement('div')
  const editorDom = content.querySelector('.monaco-editor-wrapper')

  content.appendChild(wskflowContainer)
  wskflowContainer.className = 'wskflow-container'

  /** call editor.layout */
  const relayout = () => {
    editor.updateOptions({ automaticLayout: false })
    setTimeout(() => {
      const { width, height } = editorDom.getBoundingClientRect()
      editor.layout({ width: width - 10, height: height - 7 })
    }, 300)
  }

  /** update the view to show the latest FSM */
  const updateView = async (_, { event = 'init' } = {}) => {
    const action = getAction()
    const { fsm } = action

    debug('wskflow updateView', action)

    if (fsm) {
      const { visualize } = await prequire('wskflow')

      wskflowContainer.classList.add('visible')
      editorDom.classList.add('half-height')

      if (event === 'revert') {
        content.removeChild(wskflowContainer)
        content.appendChild(wskflowContainer)
      } else {
        // don't bother redrawing on revert
        removeAllDomChildren(wskflowContainer)

        visualize(fsm)
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

    globalEventBus.on('/sidecar/maximize', relayout)
    window.addEventListener('resize', relayout)
    relayout()
  }

  eventBus.on('/editor/save', updateView)
  setTimeout(updateView, 300) // needs to be async'd in order for wskflow to work with `edit myApp`

  return opts
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
    return placeholders.composition[language(kind)]
  } else {
    // otherwise, we will open the editor showing a template file
    return new Promise((resolve, reject) => {
      const readViaImport = () => {
        debug('readViaImport', template,
          findFile(template).replace(/^app\/plugins\/modules/, ''))
        resolve(require('@kui-plugin-src/' +
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
 * Special options for compositions. Mostly, we need to specify the
 * initial "placeholder" code to display when creating a new file, and
 * the persister to use when deploying edits.
 *
 */
const compositionOptions = baseOptions => {
  return Object.assign({ type: 'compositions',
    _kind: 'composition',
    placeholderFn: defaultPlaceholderFn, // the placeholder impl
    persister: persisters.compositions // the persister impl
  }, baseOptions)
}
const addCompositionOptions = params => {
  const [action] = params

  if (action.fsm) {
    action.persister = persisters.compositions
  }

  return params
}

export default async (commandTree, prequire) => {
  const wsk = await prequire('openwhisk')

  // command registration: edit existing action
  commandTree.listen('/editor/edit', edit(wsk, prequire), { usage: usage.editUsage, noAuthOk: true })

  // command registration: create new action
  commandTree.listen('/editor/new', newAction({ wsk, prequire }), { usage: usage.newUsage, noAuthOk: true })

  // command registration: create new app/composition
  commandTree.listen('/editor/compose', newAction(compositionOptions({ wsk, prequire, cmd: 'compose' })),
    { usage: usage.composeUsage, noAuthOk: true })
}
