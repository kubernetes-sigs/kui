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

interface Options {
  readOnly?: boolean
  simple?: boolean
}

export default (options: Options) => ({
  automaticLayout: false, // respond to window layout changes?
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
  fontSize:
    parseInt(
      getComputedStyle(document.querySelector('.repl-inner'))
        .getPropertyValue('font-size')
        .replace(/px$/, ''),
      10
    ) * (document.body.classList.contains('subwindow') ? 1 : 0.875),

  // specifics for readOnly mode
  glyphMargin: !options.readOnly, // needed for error indicators

  // simplify the UI?
  lineNumbers: !options.simple,
  renderIndentGuides: !options.simple,
  renderLineHighlight: options.simple ? 'none' : 'all',

  // we will fill these two in later, in setText
  value: '',
  language: 'javascript'
})
