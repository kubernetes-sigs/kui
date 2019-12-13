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

import Debug from 'debug'

import { injectCSS } from '@kui-shell/core'
import { languages, editor as Monaco, Range } from 'monaco-editor'

// import kuiLanguages from '../language-scan'
import defaultMonacoOptions from './defaults'

const debug = Debug('plugins/editor/init/esm')

/** this is part of the finagling, to make sure we finagle only once */
let initDone: boolean

export default (editorWrapper: HTMLElement, options) => {
  debug('init')

  //
  // wait till monaco's loader is ready, then resolve with an editor
  // widget
  //
  const ready = () =>
    new Promise(resolve => {
      injectCSS({
        css: require('monaco-editor/min/vs/editor/editor.main.css').toString(),
        key: 'editor.monaco.core'
      })

      /**
       *
       */
      const initEditor = async () => {
        if (!initDone) {
          // for now, try to disable the built-in Javascript-specific completion helper thingies
          languages.typescript.javascriptDefaults.setCompilerOptions({
            noLib: true,
            allowNonTsExtensions: true
          })

          // install any custom languages we might have
          /* kuiLanguages(languages).forEach(({ language, provider }) => {
            languages.registerCompletionItemProvider(language, provider)
          }) */

          initDone = true
        }

        // here we instantiate an editor widget
        const editor = Monaco.create(editorWrapper, Object.assign(defaultMonacoOptions(options), options))

        editor['clearDecorations'] = () => {
          // debug('clearing decorations', editor['__cloudshell_decorations'])
          const none = [{ range: new Range(1, 1, 1, 1), options: {} }]
          editor['__cloudshell_decorations'] = editor.deltaDecorations(editor['__cloudshell_decorations'] || [], none)
        }

        editorWrapper['editor'] = editor

        resolve(editor)
      } /* initEditor */

      initEditor()
    }) /* end of ready() */

  return ready()
}
