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

import * as path from 'path'

import { inBrowser } from '@kui-shell/core/core/capabilities'

import languages from '../language-scan'
import defaultMonacoOptions from './defaults'

declare let AMDLoader: any // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * the monaco editor uses the AMD module loader, and smashes the global.require; we need to finagle it a bit
 *
 */
let amdRequire

/**
 * this is part of the finagling, to make sure we finagle only once
 *
 */
let initDone

/** from https://github.com/Microsoft/monaco-editor-samples/blob/master/sample-electron/index.html */
function uriFromPath(_path) {
  let pathName = path.resolve(_path).replace(/\\/g, '/')
  if (pathName.length > 0 && pathName.charAt(0) !== '/') {
    pathName = '/' + pathName
  }
  return encodeURI('file://' + pathName)
}

export default (editorWrapper: HTMLElement, options) => {
  // Monaco uses a custom amd loader that over-rides node's require.
  // Keep a reference to node's require so we can restore it after executing the amd loader file.
  const nodeRequire = global['require']

  //
  // wait till monaco's loader is ready, then resolve with an editor
  // widget
  //
  let editor
  const ready = () =>
    new Promise(resolve => {
      const iter = () => {
        if (typeof AMDLoader === 'undefined') {
          setTimeout(iter, 20)
        } else {
          if (!amdRequire) {
            // Save Monaco's amd require and restore Node's require
            amdRequire = global['require']
            global['require'] = nodeRequire

            if (!inBrowser()) {
              const monacoRoot = path.dirname(require.resolve('monaco-editor/package.json'))

              amdRequire.config({
                baseUrl: uriFromPath(path.join(monacoRoot, 'min'))
              })
            }

            // workaround monaco-css not understanding the environment
            self['module'] = undefined

            // workaround monaco-typescript not understanding the environment
            // self.process.browser = true
          }

          if (editor) {
            return resolve(editor)
          }

          //
          // use monaco's AMD module loader to load the monaco editor module
          //
          const initEditor = () => {
            if (!initDone) {
              // for now, try to disable the built-in Javascript-specific completion helper thingies
              global['monaco'].languages.typescript.javascriptDefaults.setCompilerOptions({
                noLib: true,
                allowNonTsExtensions: true
              })

              // install any custom languages we might have
              languages(global['monaco']).forEach(({ language, provider }) => {
                global['monaco'].languages.registerCompletionItemProvider(language, provider)
              })

              // e.g. js-beautify detects global.define and
              // tries to use it, but in a way that is
              // incompatible with whatever amd that monaco
              // incorporates
              global['define'] = undefined

              initDone = true
            }

            // here we instantiate an editor widget
            editor = global['monaco'].editor.create(
              editorWrapper,
              Object.assign(defaultMonacoOptions(options), options)
            )

            resolve(editor)
          } /* initEditor */

          amdRequire(['vs/editor/editor.main'], initEditor)
        }
      } /* end of iter() */

      iter()
    }) /* end of ready() */

  return ready()
}
