/*
 * Copyright 2020 IBM Corporation
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
import { i18n, Button, REPL } from '@kui-shell/core'
import { File } from '@kui-shell/plugin-bash-like/fs'

const strings = i18n('plugin-editor')

/**
 * Offer a Save button
 *
 */
export default function SaveFileButton(
  editor: Monaco.ICodeEditor,
  repl: REPL,
  response: File,
  onSave: (success: boolean) => void
): Button {
  return {
    mode: 'Save',
    kind: 'view',
    label: strings('saveLocalFile'),

    command: async () => {
      try {
        await repl.rexec(`fwrite ${repl.encodeComponent(response.spec.fullpath)}`, { data: editor.getValue() })
        onSave(true)
      } catch (err) {
        onSave(false)
      }
    }
  }
}
