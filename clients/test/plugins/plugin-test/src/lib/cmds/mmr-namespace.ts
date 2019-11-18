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
 * This file introduces a "test mmr namespace" command that opens the sidecar with
 * a plain text mode associated with `name` and `namespace`.
 *
 */

import { Commands, UI } from '@kui-shell/core'

import { plainTextMode } from './content/modes'

const metadata = {
  metadata: {
    name: 'this is the name part',
    namespace: 'this is the namespace part'
  }
}

const doModes = (): (() => UI.MultiModalResponse) => {
  return () =>
    Object.assign(metadata, {
      modes: plainTextMode,
      nameHash: 'this is the namehash part',
      onclick: {
        name: 'test string --grumble 1',
        namespace: 'test string --grumble 2',
        nameHash: 'test string --grumble 3'
      }
    })
}

export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/test/mmr/namespace', doModes(), {
    usage: {
      docs: 'A showcase of MultiModalResponse metadata namespace'
    }
  })
}
