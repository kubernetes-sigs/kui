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

import React from 'react'
import { editor as Monaco } from 'monaco-editor'
import { i18n } from '@kui-shell/core/mdist/api/i18n'
import type { Button, REPL } from '@kui-shell/core'
import type { File } from '@kui-shell/plugin-bash-like/fs'

import Icons from '../../spi/Icons'

const strings = i18n('plugin-client-common', 'editor')

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
    icon: <Icons icon="Save" />,

    command: async () => {
      try {
        await repl.rexec(`vfs fwrite ${repl.encodeComponent(response.spec.fullpath)}`, { data: editor.getValue() })
        onSave(true)
      } catch (err) {
        onSave(false)
      }
    }
  }
}
