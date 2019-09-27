/*
 * Copyright 2019 IBM Corporation
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

import { Commands, UI } from '@kui-shell/core'

import { EditorEntity } from './response'

class MonacoEditorProvider implements UI.Editor.Provider {
  public async tryOpen(tab: UI.Tab, custom: Commands.CustomResponse, options: Commands.ExecOptions) {
    const [{ Models }, { edit }] = await Promise.all([import('@kui-shell/core'), import('./cmds/edit')])

    const projection: string = custom.contentTypeProjection
      ? custom.content[custom.contentTypeProjection]
      : custom.content

    const metadataBearer = Models.isResourceByReference(custom) ? custom.resource : custom

    const entity: EditorEntity = {
      // EditorEntity
      type: custom.prettyType,
      name: custom.name,
      kind: metadataBearer.kind,
      metadata: metadataBearer.metadata,
      noZoom: custom.noZoom,
      //      persister: () => true,
      annotations: [],
      exec: {
        kind: custom.contentType,
        code: typeof projection !== 'string' ? JSON.stringify(projection, undefined, 2) : projection
      }
    }

    const { content } = await edit(tab, entity, { readOnly: true }, options)

    return {
      content,
      presentation: UI.Presentation.FixedSize
    }
  }
}

export default function register() {
  UI.Editor.registerProvider(new MonacoEditorProvider())
}
