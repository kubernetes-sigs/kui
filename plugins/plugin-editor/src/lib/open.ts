/*
 * Copyright 2017-19 IBM Corporation
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
import { dirname, join } from 'path'
import { EventEmitter } from 'events'
import { editor as MonacoEditor } from 'monaco-editor'

import UI from '@kui-shell/core/api/ui'
import Models from '@kui-shell/core/api/models'
import Commands from '@kui-shell/core/api/commands'
import Capabilities from '@kui-shell/core/api/capabilities'

import { Entity as EditorEntity } from './fetchers'
import { Editor, EditorResponse } from './response'
import strings from './strings'
import { language } from './file-types'

const debug = Debug('plugins/editor/open')

/**
 * Update the code in the editor to use the given text
 *
 */
const setText = (editor: MonacoEditor.ICodeEditor, options, execOptions?) => ({
  code,
  kind
}: {
  code: string
  kind: string
}) => {
  // options is --language yaml command line
  // execOptions is side channel progmmatic information passed via repl.exec
  const lang: string = (options && options.language) || language(kind)
  debug('setText language', kind, lang)
  debug('setText code', code.substring(0, 20))

  const oldModel = editor.getModel()
  const newModel = global['monaco'].editor.createModel(code, lang)

  editor.setModel(newModel)

  if (!execOptions || !execOptions.cursorPosition || execOptions.cursorPosition === 'end') {
    editor.setPosition(editor.getModel().getPositionAt((code && code.length) || 0))
  }

  if (oldModel) {
    oldModel.dispose()
  }

  // see https://github.com/Microsoft/monaco-editor/issues/194 we need
  // to re-grab focus after a model update; but don't bother if we are
  // in readOnly mode
  //  if (!options.readOnly) {
  // setTimeout(() => editor.focus(), 500)
  //  }

  return code
}

/** optimization: injectTheme asynchronously on preload */
let pre = false

/** optimization: avoid calling injectTheme more than once for each
 * `edit` command execution */
let pre2 = false

/**
 * Inject the current theme into the editor
 *
 */
const injectTheme = () => {
  if (pre) {
    debug('skipping injectTheme', pre)
    return
  }
  debug('injectTheme')

  const key = `kui.editor.theme`

  // dangit: in webpack we can require the CSS; but in plain nodejs,
  // we cannot, so have to use filesystem operations to acquire the
  // CSS content
  try {
    // try webpack style
    UI.injectCSS({
      css: require('@kui-shell/plugin-editor/web/css/theme-alignment.css').toString(),
      key
    })
  } catch (err) {
    // oh well, try filesystem style
    const ourRoot = dirname(require.resolve('@kui-shell/plugin-editor/package.json'))
    UI.injectCSS({ key, path: join(ourRoot, 'web/css/theme-alignment.css') })
  }
}

/**
 * Attempt to mask any latencies of injectTheme by doing so
 * asynchronously on startup
 *
 */
export const preload = () => {
  setTimeout(() => {
    injectTheme()
    pre = true
  }, 0)
}

/**
 * Open the code editor
 *
 * @return a function that can be passed an entity to display in the
 * editor, and which returns { getEntity, editor, content }
 *     - getEntity(): returns the entity model
 *     - editor: an instance of the monaco editor class
 *     - content: a dom that contains the instance; this must be attached somewhere!
 *
 */
export const openEditor = async (tab: UI.Tab, name: string, options, execOptions: Commands.ExecOptions) => {
  debug('openEditor')

  /** returns the current entity */
  const custom = execOptions.custom

  const getEntityFn = (custom && custom.getEntity) || Models.Selection.current
  let currentEntity = getEntityFn(tab)
  const getEntity = () => currentEntity

  // for certain content types, always show folding controls, rather
  // than on mouse over (which is the default behavior for monaco)
  const entityRightNow = currentEntity
  const kind = entityRightNow && ((entityRightNow.exec && entityRightNow.exec.kind) || entityRightNow.contentType)
  if (kind === 'yaml' || kind === 'json') {
    options.showFoldingControls = 'always'
  }

  if (!pre2) {
    if (!Capabilities.inBrowser()) {
      const monacoRoot = dirname(require.resolve('monaco-editor/package.json'))
      UI.injectScript(join(monacoRoot, 'min/vs/loader.js'))
    }

    try {
      UI.injectCSS({
        css: require('@kui-shell/plugin-editor/web/css/editor.css').toString(),
        key: 'editor.editor'
      })
    } catch (err) {
      const ourRoot = dirname(require.resolve('@kui-shell/plugin-editor/package.json'))
      UI.injectCSS(join(ourRoot, 'web/css/editor.css'))
    }
    pre2 = true
  }

  const content = document.createElement('div')
  const editorWrapper = document.createElement('div')

  editorWrapper.className = 'monaco-editor-wrapper'
  content.appendChild(editorWrapper)

  // we want the editor to have focus, so the user can start coding
  // (but don't bother if we are in readOnly mode)
  if (!options.readOnly) {
    editorWrapper.focus()
  }

  const theme = getComputedStyle(document.body)
  editorWrapper['baseFontSize'] = parseInt(theme.getPropertyValue('font-size').replace(/px$/, ''), 10) * 0.875

  // override the repl's capturing of the focus
  content.onclick = evt => {
    evt.stopPropagation()
  }

  // inject the kui-to-monaco theme alignment css
  injectTheme()

  /**
   * Given an editor instance, return a function that can update
   * that instance to show a given entity.
   *
   */
  const makeUpdater = (editor: Editor) => {
    editor.updateText = (entity: EditorEntity) => {
      // monaco let's us replace the full range of text, so we don't need
      // an explicit delete of the current text
      return setText(editor, options)(entity.exec)
    }

    editor['clearDecorations'] = () => {
      // debug('clearing decorations', editor.__cloudshell_decorations)
      const none = [{ range: new global['monaco'].Range(1, 1, 1, 1), options: {} }]
      editor['__cloudshell_decorations'] = editor.deltaDecorations(editor['__cloudshell_decorations'] || [], none)
    }

    editorWrapper['editor'] = editor

    // return a function that takes an entity and formulates a response
    return (entity: EditorEntity): Promise<EditorResponse> => {
      debug('updater', entity)
      const eventBus = new EventEmitter()

      // update the editor text
      setText(editor, options, execOptions)(entity['exec'])

      content.classList.add('code-highlighting')

      // stash this so that the implicit entity model works
      currentEntity = entity

      // isModified display
      const status = document.createElement('div')
      const isNew = document.createElement('div')
      const isNewReadOnly = document.createElement('div')
      const upToDate = document.createElement('div')
      const modified = document.createElement('div')

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
        debug('status:is-read-only')
        status.classList.add('is-read-only')
      }
      if (entity['isNew']) {
        debug('status:is-new')
        status.classList.add('is-new')
      } else {
        debug('status:is-up-to-date')
        status.classList.add('is-up-to-date')
      }
      isNew.className = 'is-new'
      isNewReadOnly.className = 'is-new-read-only'
      upToDate.className = 'is-up-to-date'
      modified.className = 'is-modified'

      const toolbarText = new UI.ToolbarText('info', status)

      /** update isdecar header */
      const updateHeader = (isModified: boolean) => {
        if (!execOptions.noSidecarHeader) {
          debug('updateHeader', isModified, currentEntity)

          toolbarText.type = isModified ? 'warning' : 'info'

          status.classList.remove('is-modified')
          status.classList.remove('is-up-to-date')
          status.classList.remove('is-new')

          if (currentEntity.isNew) {
            status.classList.add('is-new')
          } else if (isModified) {
            status.classList.add('is-modified')
          } else {
            status.classList.add('is-up-to-date')
          }

          toolbarText.refresh()
        }
      }

      /** even handlers for saved and content-changed */
      const editsInProgress = () => {
        debug('editsInProgress')
        editor['clearDecorations']() // for now, don't try to be clever; remove decorations on any edit
        eventBus.emit('/editor/change', {})

        // update view header, after the editor becomes "dirty"
        updateHeader(true)
      }
      const editsCommitted = (entity: EditorEntity, opts: { event: 'save' | 'revert' }) => {
        debug('editsCommited', opts, entity)
        status.classList.remove('is-new')
        entity.persister = currentEntity.persister
        currentEntity = entity
        debug('status:is-up-to-date')

        // update view header, after save or revert
        updateHeader(false)

        if (opts.event === 'revert') {
          editor.getModel().onDidChangeContent(editsInProgress)
        }
      }
      eventBus.on('/editor/save', editsCommitted)
      editor.getModel().onDidChangeContent(editsInProgress)

      // update view header, initial call
      updateHeader(false)

      return Promise.resolve({ getEntity, editor, content, eventBus, toolbarText })
    }
  } /* end of updater */

  const initEditor = Capabilities.inBrowser()
    ? (await import('./init/esm')).default
    : (await import('./init/amd')).default

  // once the editor is ready, return a function that can populate it
  return initEditor(editorWrapper, options).then(makeUpdater)
}

export default openEditor
