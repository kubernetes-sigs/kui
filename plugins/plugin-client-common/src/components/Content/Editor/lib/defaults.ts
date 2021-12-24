/*
 * Copyright 2018 The Kubernetes Authors
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

import { editor } from 'monaco-editor'
import getKuiFontSize from './fonts'

export interface Options extends editor.IEditorConstructionOptions {
  readOnly?: boolean
  simple?: boolean
  fontSize?: number
  language?: string
}

/** Once we scroll to the bottom or top, then start scrolling the enclosing scroll region */
const scrollbar = { alwaysConsumeMouseWheel: false }

export default (options: Options): editor.IEditorConstructionOptions => ({
  automaticLayout: true, // respond to window layout changes?
  minimap: {
    enabled: false
  },
  codeLens: false,
  quickSuggestions: false,
  contextmenu: false,
  scrollBeyondLastLine: false,
  scrollBeyondLastColumn: 2,
  cursorStyle: 'block',
  fontFamily: 'var(--font-monospace)',
  fontSize: options.fontSize || getKuiFontSize(),

  // don't show those little bits and borders in the scrollbar in "simple" mode
  overviewRulerBorder: options.simple,
  overviewRulerLanes: options.simple ? 0 : undefined,
  scrollbar: options.simple
    ? Object.assign(
        {
          vertical: 'hidden'
        },
        scrollbar
      )
    : scrollbar,

  // specifics for readOnly mode
  glyphMargin: !options.readOnly && !options.simple, // needed for error indicators

  // simplify the UI?
  links: !options.simple,
  folding: !options.simple || !/markdown|text|shell/i.test(options.language),
  lineNumbers: options.simple ? 'off' : 'on',
  wordWrap: options.wordWrap || (options.simple ? 'off' : 'on'),
  wrappingIndent: 'indent',
  renderLineHighlight: options.simple ? 'none' : undefined,
  renderFinalNewline: !options.simple,
  lineDecorationsWidth: options.simple ? 0 : undefined
})
