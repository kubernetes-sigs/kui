/*
 * Copyright 2019 The Kubernetes Authors
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
 * This file introduces a "test mmr kind" command that opens the sidecar with
 * a plain text mode associated with `kind`.
 *
 */

import { MultiModalResponse, Registrar } from '@kui-shell/core'

import { plainTextMode } from './content/modes'
import { metadataWithNameOnly } from './metadata'

const doModes = (): (() => MultiModalResponse) => {
  return () => Object.assign(metadataWithNameOnly, { kind: 'this is the kind part', modes: plainTextMode })
}

export default (commandTree: Registrar) => {
  commandTree.listen('/test/mmr/kind', doModes(), {
    usage: {
      docs: 'A showcase of MultiModalResponse kind'
    }
  })
}
