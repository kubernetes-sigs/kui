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
 * This file introduces a "test mmr mode-via-registration" command
 * that opens the sidecar with the MyResource resource type. We expect
 * that the modes and badges come from the mode registrations in
 * preload.ts.
 *
 */

import { Commands, UI } from '@kui-shell/core'
import { metadataWithNameOnly as metadata } from './metadata'
import { modes1 as textModes } from './content/modes'

// exporting this for consumption in tests
export { metadata }

interface Options extends Commands.ParsedOptions {
  show?: string
  foo: boolean
  registrationOnly: boolean
}

/**
 * e.g.
 *
 * test mmr mode-via-registration
 * test mmr mode-via-registration --foo
 * test mmr mode-via-registration --registrationOnly
 * test mmr mode-via-registration --show <mode>
 *
 */
const doModes = (): ((args: Commands.Arguments<Options>) => UI.MultiModalResponse) => {
  return (args: Commands.Arguments<Options>) => {
    if (args.parsedOptions.registrationOnly) {
      return Object.assign(metadata, { foo: !!args.parsedOptions.foo, modes: [], defaultMode: args.parsedOptions.show })
    } else {
      return Object.assign(metadata, {
        foo: !!args.parsedOptions.foo,
        modes: textModes,
        defaultMode: args.parsedOptions.show
      })
    }
  }
}

export default (commandTree: Commands.Registrar) => {
  commandTree.listen(`/test/mmr/mode-via-registration`, doModes(), {
    usage: {
      docs: 'A test of MultiModalResponse mode'
    },
    flags: {
      boolean: ['foo', 'registrationOnly']
    }
  })
}
