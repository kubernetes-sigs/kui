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
import { basename } from 'path'

import { extension } from '@kui-shell/plugin-editor'

const debug = Debug('plugins/openwhisk-editor-extensions/model/composition-persister')

/**
 * If this is a Composer parse error, display the error as editor decorations
 *
 */
export const handleParseError = (err, filepath, editor) => {
  if (err.statusCode === 'ENOPARSE') {
    debug('composition did not parse', err)
    // try two patterns to spot stack trace information;
    // we need to pull out the line number from the stack trace,
    // so that we can identify the problem, with a gutter marker ("decoration"),
    // in the editor pane
    const base = basename(filepath)
    const pattern1 = new RegExp('\\n([^\n]+)\\n\\s+at\\s+' + base.replace(/\./, '\\.') + ':(\\d+):(\\d+)')
    const pattern2 = new RegExp(
      '([^\n]+)\\n\\s+at\\s+[^\\(]*\\s+\\([^\n\r]*' + base.replace(/\./, '\\.') + ':(\\d+):(\\d+)'
    )
    const pattern3 = new RegExp('^[^\n]+' + base.replace(/\./, '\\.') + ':(\\d+)\\n[^\n]+\\n[^\n]+\\n\\n([^\n]+)')
    const match3 = err.message.match(pattern3)
    const match = err.message.match(pattern1) || err.message.match(pattern2) || match3

    debug('pattern', pattern1, pattern2, pattern3)
    debug('message', err.message)
    if (match) {
      const problem = err.cause && err.cause.code ? err.cause.message : match3 ? match[2] : match[1]
      const line = match3 ? match[1] : match[2]
      const column = match[3]
      debug('got match', problem, line, column)

      const decorations = [
        {
          range: new global['monaco'].Range(line, 1, line, 1),
          options: {
            isWholeLine: true,
            glyphMarginClassName: 'editor parse-error-gutter-marker parse_error_decoration',
            glyphMarginHoverMessage: { value: problem }
            // linesDecorationsClassName: `editor__parse-error-gutter-marker editor__parse-error-decoration`
          }
        },
        {
          range: new global['monaco'].Range(line, column, line, column + 1),
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
}

// persisters for apps/compositions
export const persister = {
  getCode: action =>
    new Promise((resolve, reject) => {
      const codeAnno = action.annotations.find(({ key }) => key === 'code')
      if (codeAnno) {
        action.exec.code = codeAnno.value
        action.persister = persister
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
              action.persister = persister
              resolve(action)
            }
          })
        } else {
          // action.exec.code = JSON.stringify(action.ast, undefined, 4)
          const err = new Error('Your composition does not have an assocated source file')
          err['code'] = 406
          reject(err)
        }
      }
    }),
  save: (app, editor) =>
    new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const tmp = require('tmp')

      tmp.file({ prefix: 'shell-', postfix: extension(app.exec.kind) }, (err, filepath, fd, cleanup) => {
        if (err) {
          reject(err)
        } else {
          fs.write(fd, app.exec.code, async err => {
            if (err) {
              reject(err)
            } else {
              const { REPL } = await import('@kui-shell/core/api/repl')
              return REPL.pexec(
                `wsk app update ${REPL.encodeComponent(app.name)} ${REPL.encodeComponent(filepath)} --kind ${
                  app.exec.kind
                }`
              )
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
                  handleParseError(err, filepath, editor)
                })
            }
          })
        }
      })
    })
}

export default persister
