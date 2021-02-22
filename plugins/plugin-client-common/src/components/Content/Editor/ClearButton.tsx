/*
 * Copyright 2020 The Kubernetes Authors
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

import { editor as Monaco } from 'monaco-editor'
import { i18n, Button } from '@kui-shell/core'

const strings = i18n('plugin-client-common', 'editor')

/**
 * Offer a Save button
 *
 */
export default function ClearButton(editor: Monaco.ICodeEditor, onClear?: () => void): Button {
  return {
    mode: 'Clear',
    kind: 'view',
    label: strings('Clear'),
    command: () => {
      editor.setValue('')
      if (onClear) {
        onClear()
      }
    }
  }
}
