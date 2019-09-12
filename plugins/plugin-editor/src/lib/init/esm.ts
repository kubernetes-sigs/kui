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

import { theme as settings } from '@kui-shell/core/core/settings'
import { injectCSS } from '@kui-shell/core/webapp/util/inject'

import * as monaco from 'monaco-editor'

import languages from '../language-scan'
import defaultMonacoOptions from './defaults'

const debug = Debug('plugins/editor/init/esm')

/** this is part of the finagling, to make sure we finagle only once */
let initDone

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
self['MonacoEnvironment'] = {
  getWorkerUrl: function(moduleId, label) {
    const hash: string = window['_kuiWebpackHash']

    const root: string =
      settings.resourceRoot ||
      (window['_kuiWebpackResourceRoot'] !== '${resourceRoot}' ? window['_kuiWebpackResourceRoot'] : '.') // eslint-disable-line no-template-curly-in-string
    debug('monaco resource root', root)

    if (label === 'json') {
      return `${root}/json.worker.${hash}.bundle.js`
    }
    if (label === 'css') {
      return `${root}/css.worker.${hash}.bundle.js`
    }
    if (label === 'html') {
      return `${root}/html.worker.${hash}.bundle.js`
    }
    if (label === 'typescript' || label === 'javascript') {
      return `${root}/ts.worker.${hash}.bundle.js`
    }
    return `${root}/editor.worker.${hash}.bundle.js`
  }
}

export default (editorWrapper: HTMLElement, options) => {
  debug('init')

  //
  // wait till monaco's loader is ready, then resolve with an editor
  // widget
  //
  let editor
  const ready = () =>
    new Promise(resolve => {
      injectCSS({
        css: require('monaco-editor/min/vs/editor/editor.main.css').toString(),
        key: 'editor.monaco.core'
      })

      /**
       *
       */
      const initEditor = () => {
        if (!initDone) {
          // for now, try to disable the built-in Javascript-specific completion helper thingies
          monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            noLib: true,
            allowNonTsExtensions: true
          })

          // install any custom languages we might have
          languages(monaco).forEach(({ language, provider }) => {
            monaco.languages.registerCompletionItemProvider(language, provider)
          })

          initDone = true
        }

        // here we instantiate an editor widget
        editor = monaco.editor.create(editorWrapper, Object.assign(defaultMonacoOptions(options), options))

        editor.clearDecorations = () => {
          debug('clearing decorations', editor.__cloudshell_decorations)
          const none = [{ range: new monaco.Range(1, 1, 1, 1), options: {} }]
          editor.__cloudshell_decorations = editor.deltaDecorations(editor.__cloudshell_decorations || [], none)
        }

        editorWrapper['editor'] = editor

        resolve(editor)
      } /* initEditor */

      initEditor()
    }) /* end of ready() */

  return ready()
}
