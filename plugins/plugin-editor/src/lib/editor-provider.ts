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

import {
  Tab,
  EditorProvider,
  registerEditor,
  Presentation,
  ExecOptions,
  ResourceWithMetadataWithContent,
  ResourceByReferenceWithContent,
  isResourceByReference
} from '@kui-shell/core'

import EditorEntity from './entity'

class MonacoEditorProvider implements EditorProvider {
  public async tryOpen(
    tab: Tab,
    custom: ResourceWithMetadataWithContent | ResourceByReferenceWithContent,
    options: ExecOptions
  ) {
    const { edit } = await import(/* webpackMode: "lazy" */ './cmds/edit')

    const projection = custom.content

    const metadataBearer = isResourceByReference(custom) ? custom.resource : custom

    const entity: EditorEntity = {
      // EditorEntity
      type: custom.kind,
      name: metadataBearer.metadata.name,
      kind: metadataBearer.kind,
      metadata: metadataBearer.metadata,
      // noZoom: custom.noZoom,
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
      presentation: Presentation.FixedSize
    }
  }
}

export default function register() {
  registerEditor(new MonacoEditorProvider())
}
