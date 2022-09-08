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
 * This file introduces a "test mmr name" command that opens the sidecar with
 * a plain text mode associated with a name metadata.
 *
 */

import { MultiModalResponse, Registrar, Arguments, ParsedOptions } from '@kui-shell/core'

import { metadataWithNameOnly } from './metadata'
import { plainTextMode } from './content/modes'

interface Options extends ParsedOptions {
  pretty?: boolean
}

const doModes = () =>
  function (args: Arguments<Options>): MultiModalResponse {
    if (args.parsedOptions.pretty) {
      return Object.assign(metadataWithNameOnly, {
        modes: plainTextMode,
        nameHash: 'this is the namehash part',
        prettyName: 'this is the prettyName part',
        onclick: { name: 'test string', nameHash: 'test string --grumble 1' }
      })
    } else {
      return Object.assign(metadataWithNameOnly, {
        modes: plainTextMode,
        nameHash: 'this is the namehash part',
        onclick: { name: 'test string', nameHash: 'test string --grumble 1' }
      })
    }
  }

export default (commandTree: Registrar) => {
  commandTree.listen('/test/mmr/name', doModes(), {
    usage: {
      command: 'string',
      strict: 'string',
      optional: [{ name: '--pretty', boolean: true }],
      docs: 'A show case of MultiModalResponse name'
    }
  })
}
