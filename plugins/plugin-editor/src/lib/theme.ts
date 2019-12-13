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

import { injectCSS } from '@kui-shell/core'

/** optimization: injectTheme asynchronously on preload */
let pre = false

export function setPreloadDone() {
  pre = true
}

/**
 * Inject the current theme into the editor
 *
 */
export const injectTheme = () => {
  if (pre) {
    // debug('skipping injectTheme', pre)
    return
  }
  // debug('injectTheme')

  const key = `kui.editor.theme`

  // dangit: in webpack we can require the CSS; but in plain nodejs,
  // we cannot, so have to use filesystem operations to acquire the
  // CSS content
  injectCSS({
    css: require('@kui-shell/plugin-editor/web/css/theme-alignment.css').toString(),
    key
  })
}

export default injectTheme
