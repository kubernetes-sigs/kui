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

import { Tab } from '@kui-shell/core/webapp/cli'
import Presentation from '@kui-shell/core/webapp/views/presentation'
import { ExecOptions } from '@kui-shell/core/models/execOptions'
import { CustomSpec } from '@kui-shell/core/webapp/views/sidecar'
import { EditorProvider, registerEditor } from '@kui-shell/core/webapp/views/registrar/editors'

class MonacoEditorProvider implements EditorProvider {
  public async tryOpen(tab: Tab, custom: CustomSpec, options: ExecOptions) {
    const [{ isMetadataBearingByReference }, { edit }] = await Promise.all([
      import('@kui-shell/core/webapp/views/sidecar'),
      import('./cmds/edit')
    ])

    const projection = custom.contentTypeProjection ? custom.content[custom.contentTypeProjection] : custom.content

    const metadataBearer = isMetadataBearingByReference(custom) ? custom.resource : custom

    const entity = {
      // EditorEntity
      type: custom.prettyType,
      name: custom.name,
      kind: metadataBearer.kind,
      metadata: metadataBearer.metadata,
      noZoom: custom.noZoom,
      persister: () => true,
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
