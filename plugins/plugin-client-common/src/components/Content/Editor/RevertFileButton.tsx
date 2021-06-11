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
import { i18n, Button, REPL } from '@kui-shell/core'
import { File, FStat } from '@kui-shell/plugin-bash-like/fs'

import Icons from '../../spi/Icons'

const strings = i18n('plugin-client-common', 'editor')

/**
 * Offer a Revert button
 *
 */
export default function RevertFileButton(
  editor: Monaco.ICodeEditor,
  repl: REPL,
  response: File,
  onRevert: (success: boolean, data?: string) => void
): Button {
  return {
    mode: 'Revert',
    kind: 'view',
    label: strings('revert'),
    icon: <Icons icon="Revert" />,

    command: async () => {
      try {
        const stats = (
          await repl.rexec<FStat>(`vfs fstat ${repl.encodeComponent(response.spec.fullpath)} --with-data --enoent-ok`)
        ).content
        onRevert(true, stats.data)
      } catch (err) {
        onRevert(false)
      }
    }
  }
}
