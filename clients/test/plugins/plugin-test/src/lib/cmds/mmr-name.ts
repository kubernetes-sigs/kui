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

/**
 * This file introduces a "test mmr name" command that opens the sidecar with
 * a plain text mode associated with a name metadata.
 *
 */

import { MultiModalResponse, Registrar } from '@kui-shell/core'

import { metadataWithNameOnly } from './metadata'
import { plainTextMode } from './content/modes'

const doModes = (): (() => MultiModalResponse) => {
  return () =>
    Object.assign(metadataWithNameOnly, {
      modes: plainTextMode,
      nameHash: 'this is the namehash part',
      onclick: { name: 'test string', nameHash: 'test string --grumble 1' }
    })
}

export default (commandTree: Registrar) => {
  commandTree.listen('/test/mmr/name', doModes(), {
    inBrowserOk: true,
    usage: {
      docs: 'A showcase of MultiModalResponse metadata name'
    }
  })
}
