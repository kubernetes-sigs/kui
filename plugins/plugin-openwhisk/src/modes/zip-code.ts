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

import { i18n } from '@kui-shell/core'
import { ActionWithCode, hasZipCode } from '../models/resource'

const strings = i18n('plugin-openwhisk')

function extractMain(b64: string): string {
  const code = Buffer.from(b64, 'base64')

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Zip = require('adm-zip')
  const zip = Zip(code)
  const indexEntryJavascript = zip.getEntry('index.js')
  const indexEntry =
    indexEntryJavascript || zip.getEntry('index.py') || zip.getEntry('__main__.py') || zip.getEntry('index.php')

  if (indexEntry) {
    const indexContent = zip.readAsText(indexEntry)
    return indexContent.toString()
  } else {
    return 'Unable to locate the index.js file in the zip file'
  }
}

/**
 * The Code mode applies to all Action resources.
 *
 */
export default {
  when: hasZipCode,
  mode: {
    mode: 'zip main',
    label: strings('Zip Main'),

    content: (_, resource: ActionWithCode) => ({
      content: extractMain(resource.exec.code),
      contentType: resource.exec.kind
    })
  }
}
