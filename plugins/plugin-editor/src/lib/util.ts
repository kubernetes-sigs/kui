/*
 * Copyright 2018-19 IBM Corporation
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

import { Button, i18n } from '@kui-shell/core'

import { save, revert } from './persisters'
import { EditorResource, EditorResponse, EditorState, CommandResponse } from './response'

const strings = i18n('plugin-editor')

type ModeFunction = (state: EditorState) => Button<EditorResource>

/**
 * Prepare a response for the REPL. Consumes the output of
 * updateEditor
 *
 */
export const respondToRepl = (extraModes: ModeFunction[] = [] /*, displayOptions = [] */) => (
  response: EditorResponse
): CommandResponse => {
  const entity = response.getEntity()

  // const badges: UI.Badge[] = [{ title: language(entity.exec.kind), css: 'is-kind-like' }]

  const buttons: Button<EditorResource>[] = [save(response), revert(response)].concat(
    extraModes.map(modeFn => modeFn(response))
  )

  const resp: CommandResponse = {
    kind: entity.kind,
    version: entity.version,
    metadata: {
      name: (entity.metadata && entity.metadata.name) || entity.name,
      generation: entity.version || (entity.metadata && entity.metadata.generation),
      namespace: entity.namespace || (entity.metadata && entity.metadata.namespace)
    },
    content: response.content,
    toolbarText: response.toolbarText,
    // controlHeaders: ['.header-right-bits'],
    // displayOptions: [`entity-is-${entity.type}`, 'edit-mode'].concat(displayOptions),
    // noZoom: true,
    // badges,
    modes: [
      {
        mode: 'edit',
        label: strings('Edit'),
        content: response.content
      }
    ],
    buttons
  }

  return resp
}

export default respondToRepl
